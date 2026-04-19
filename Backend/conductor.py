import json
import httpx
from typing import Any


# ===========
# Scorer Base
# ===========

class BaseScorer:
    def score(self, normalized_inputs: dict, candidates: list, intent: str, output_schema: dict) -> list:
        raise NotImplementedError("Scorer must implement score()")


# ==========
# LLM Scorer
# ==========

class LLMScorer(BaseScorer):
    def __init__(self, api_key: str, model: str = "gemini-2.0-flash"):
        self.api_key = api_key
        self.model = model

    def score(self, normalized_inputs: dict, candidates: list, intent: str, output_schema: dict) -> list:
        prompt = self._build_prompt(normalized_inputs, candidates, intent, output_schema)
        response = self._call_llm(prompt)
        return self._parse_scores(response, candidates)

    def _build_prompt(self, normalized_inputs: dict, candidates: list, intent: str, output_schema: dict) -> str:
        return f"""
You are a game design intent execution engine.

Your job is to score each candidate based on how well surfacing it to this specific player executes the designer's intent.

Designer intent:
{intent}

Player state (normalized):
{json.dumps(normalized_inputs, indent=2)}

Output schema:
{json.dumps(output_schema, indent=2)}

Candidates to score:
{json.dumps(candidates, indent=2)}

Score each candidate from 0.0 to 1.0.
A score of 1.0 means surfacing this candidate perfectly executes the designer's intent for this player.
A score of 0.0 means it is completely misaligned.

Return ONLY a JSON array with no preamble or explanation:
[{{"id": "<candidate_id>", "score": <float>}}, ...]
"""

    def _call_llm(self, prompt: str) -> str:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"
        headers = {"Content-Type": "application/json"}
        body = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json" # Forces strict JSON output
            }
        }

        try:
            # Using httpx for the synchronous REST call
            response = httpx.post(
                url, 
                headers=headers, 
                params={"key": self.api_key}, 
                json=body,
                timeout=30.0 # Recommended to prevent hanging on larger prompts
            )
            
            # Catch bad HTTP status codes (e.g., 401 Unauthorized, 429 Rate Limit)
            response.raise_for_status()
            
            # Extract the text payload from the Gemini response structure
            return response.json()["candidates"][0]["content"]["parts"][0]["text"]
            
        except httpx.HTTPStatusError as e:
            raise RuntimeError(f"Gemini API HTTP Error: {e.response.status_code} - {e.response.text}")
        except (KeyError, IndexError) as e:
            raise ValueError(f"Failed to parse Gemini API response structure. Raw response: {response.text}") from e
        except Exception as e:
            raise RuntimeError(f"An unexpected error occurred calling the Gemini API: {e}")

    def _parse_scores(self, response: str, candidates: list) -> list:
        try:
            clean = response.strip().replace("```json", "").replace("```", "").strip()
            scores = json.loads(clean)
            scored = []
            for s in scores:
                match = next((c for c in candidates if str(c["id"]) == str(s["id"])), None)
                if match:
                    scored.append({"candidate": match, "score": float(s["score"])})
            return scored
        except Exception as e:
            raise ValueError(f"Failed to parse LLM scorer response: {e}\nRaw response: {response}")


# =================
# ML Scorer (Stub)
# =================

class MLScorer(BaseScorer):
    # Production implementation — drop-in replacement for LLMScorer
    # Same interface, powered by a trained local model instead of an LLM
    def __init__(self, model_path: str):
        self.model_path = model_path
        # TODO: load model from model_path

    def score(self, normalized_inputs: dict, candidates: list, intent: str, output_schema: dict) -> list:
        # TODO: run inference against trained model
        # Returns same format as LLMScorer: [{"candidate": {...}, "score": float}]
        raise NotImplementedError("MLScorer not yet implemented")


# =========
# Conductor
# =========

class Conductor:
    def __init__(self, scorer: BaseScorer = None):
        self._inputs = {}
        self._outputs = {}
        self._intent = None
        self._scorer = scorer  # inject LLMScorer or MLScorer at init
        self._archetypes = {}
        self._archetype_confidence_threshold = 0.3

    # ============
    # Registration
    # ============

    def register_archetype(self, name: str, description: str, signals: dict):
        self._archetypes[name] = {
            "description": description,
            "signals": signals
        }

    def register_input(self, name: str, type: type, description: str = ""):
        self._inputs[name] = {
            "type": type,
            "description": description
        }

    def register_output(self, name: str, type: type, description: str = ""):
        self._outputs[name] = {
            "type": type,
            "description": description
        }

    def set_intent(self, intent: str):
        self._intent = intent

    # =======
    # Execute
    # =======

    def execute(self, inputs: dict, candidates: list) -> list:
        if not self._intent:
            raise ValueError("No intent set. Call set_intent() before execute().")
        if not self._scorer:
            raise ValueError("No scorer set. Pass a scorer to Conductor() at init.")

        self._validate_inputs(inputs)
        normalized = self._normalize(inputs)
        scored = self._scorer.score(normalized, candidates, self._intent, self._outputs)
        return self._filter(scored)

    # ==========
    # Validation
    # ==========

    def _validate_inputs(self, inputs: dict):
        for name, schema in self._inputs.items():
            if name not in inputs:
                raise ValueError(f"Missing registered input: '{name}'")
            if not isinstance(inputs[name], schema["type"]):
                raise TypeError(
                    f"Input '{name}' expected {schema['type'].__name__}, "
                    f"got {type(inputs[name]).__name__}"
                )

    # =============
    # Normalization
    # =============

    def _normalize(self, inputs: dict) -> dict:
        normalized = {}

        for name, schema in self._inputs.items():
            value = inputs[name]

            if schema["type"] == list:
                normalized[name] = {
                    "value": value,
                    "count": len(value),
                    "empty": len(value) == 0
                }
            elif schema["type"] == float:
                normalized[name] = {
                    "value": value,
                    "bracket": self._bracket(value)
                }
            elif schema["type"] == int:
                normalized[name] = {
                    "value": value
                }
            else:
                normalized[name] = {
                    "value": value
                }

        # Archetype inference — Conductor computes this, not the LLM
        # Runs if decision_history was registered and provided
        if "decision_history" in inputs:
            normalized["inferred_archetype"] = self._infer_archetype(inputs["decision_history"])

        return normalized

    def _infer_archetype(self, history: list) -> dict:
        if not history or not self._archetypes:
            return {"tendency": "unknown", "confidence": 0.0}

        scores = {}
        for name, archetype in self._archetypes.items():
            score = 0.0
            for decision in history:
                score += archetype["signals"].get(decision, 0.0)
            # normalize by history length
            scores[name] = score / len(history)

        best = max(scores, key=scores.get)
        best_score = scores[best]

        # confidence threshold — if no archetype scores well,
        # flag as emergent rather than forcing a bad fit
        if best_score < self._archetype_confidence_threshold:
            return {
                "tendency": "emergent",
                "confidence": round(best_score, 2),
                "scores": scores,
                "raw_history": history  # LLM gets raw history to reason from scratch
            }

        return {
            "tendency": best,
            "confidence": round(min(best_score, 1.0), 2),
            "scores": scores
        }

    def _bracket(self, value: float) -> str:
        # Converts a 0-1 float into a semantic label the scorer can reason against
        if value < 0.25: return "low"
        if value < 0.5:  return "medium-low"
        if value < 0.75: return "medium-high"
        return "high"

    # =========
    # Filtering
    # =========

    def _filter(self, scored: list) -> list:
        # Sort by score descending — highest intent alignment first
        scored.sort(key=lambda x: x["score"], reverse=True)
        return [item["candidate"] for item in scored]

    # =======
    # Utility
    # =======

    def describe(self) -> dict:
        # Returns a summary of this Conductor instance's current configuration
        # Useful for debugging and the demo UI
        return {
            "intent": self._intent,
            "inputs": {k: {"type": v["type"].__name__, "description": v["description"]} for k, v in self._inputs.items()},
            "outputs": {k: {"type": v["type"].__name__, "description": v["description"]} for k, v in self._outputs.items()},
            "scorer": type(self._scorer).__name__ if self._scorer else None
        }
    
# conductor = Conductor(scorer=scorer)
# scorer = LLMScorer(api_key=api_key, model="gemini-2.0-flash")