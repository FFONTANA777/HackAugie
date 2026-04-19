# Travelling Merchant Problem 🪙
 
> A risk-reward merchant roguelite where every road has a price. Pick your path, survive bandits and hazards, and let your cargo speak for itself. Will you make it out rich?
 
---
 
## 📖 About
 
Most roguelites live and die by their loot system — but randomized rewards often feel completely disconnected from how you actually play. **Travelling Merchant Problem** fixes that.
 
You play as a travelling merchant navigating dangerous roads between checkpoints. At every fork you choose your path — short and safe, or long and lucrative. Along the way, bandits demand your gold, rivers flood your supplies, and every choice chips away at your resources.
 
Under the hood, our **Behavioral Variance System (BVS)** powered by Google Gemini silently profiles your decisions and subtly shifts encounter rewards to be more favorable toward your playstyle. The randomness is still there — but it's no longer completely blind.
 
---
 
## ✨ Features
 
- 🛤 **Fork in the road** — choose between short, medium, and long routes with scaling risk and reward
- ⚔️ **Random encounters** — bandits, river crossings, and more with meaningful A/B/C choices
- 🏪 **Checkpoint towns** — buy food, consumables, wagon upgrades, and sell your merchandise
- 📦 **Card-based inventory** — merchandise, consumables, and relics each with their own deck limits
- 🧠 **Behavioral Variance System** — AI-powered encounter shaping that adapts to your playstyle
- 🎵 **Medieval soundtrack** — atmospheric music throughout
---
 
## 🧠 How the Behavioral Variance System Works
 
The BVS is built around a `Conductor` class that:
 
1. **Registers inputs** — player state (gold, food, decision history, merchandise)
2. **Registers archetypes** — e.g. `risk_taker`, `negotiator`, `hoarder` each with weighted signals
3. **Infers your tendency** — from your decision history without asking you anything
4. **Scores candidates** — sends player state + encounter candidates to Gemini, which scores each one by how well surfacing it executes the designer's intent
5. **Returns ranked candidates** — highest intent-alignment first, so the game surfaces encounters that make sense for *you*
```python
conductor = Conductor(scorer=LLMScorer(api_key=GEMINI_KEY))
conductor.set_intent("Reward players who take risks with high-value merchandise encounters")
conductor.register_input("gold", float)
conductor.register_input("decision_history", list)
conductor.register_archetype("risk_taker", "...", {"long_route": 0.8, "outrun_bandit": 0.7})
 
results = conductor.execute(inputs=player_state, candidates=encounter_pool)
```
 
---
 
## 🛠 Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Backend | Python, FastAPI |
| AI / BVS | Google Gemini 2.0 Flash |
| HTTP Client | httpx |
| State Management | Custom pub/sub (`GameLogic.js`) |
| Assets | Static files via Live Server |
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- Python 3.10+
- A Google Gemini API key
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code extension (for frontend)
### 1. Clone the repo
 
```bash
git clone https://github.com/your-username/worth-its-weight.git
cd worth-its-weight
```
 
### 2. Set up the backend
 
```bash
cd Backend
python -m venv venv
 
# Windows
venv\Scripts\activate
 
# Mac/Linux
source venv/bin/activate
 
pip install -r requirements.txt
```
 
### 3. Add your Gemini API key
 
Create a `.env` file in the `Backend/` folder:
 
```env
GEMINI_API_KEY=your_api_key_here
```
 
### 4. Start the backend
 
```bash
uvicorn main:app --reload
```
 
Backend runs at `http://localhost:8000`
 
### 5. Start the frontend
 
Open `index.html` with Live Server in VS Code.
 
Right click `index.html` → **Open with Live Server**
 
Frontend runs at `http://127.0.0.1:5500`
 
---
 
## 📁 Project Structure
 
```
worth-its-weight/
├── Frontend/
│   ├── Pages/
│   │   ├── gameBoard.html
│   │   ├── encounter.html
│   │   └── checkpoint.html
│   ├── Scripts/
│   │   ├── gamelogic/
│   │   │   ├── GameLogic.js
│   │   │   └── Cards.js
│   │   └── components/
│   │       └── HUD.js
│   ├── Styles/
│   │   └── main.css
│   └── public/
│       ├── backgrounds/
│       ├── sounds/
│       └── fonts/
├── Backend/
│   ├── conductor.py       # BVS core — Conductor, LLMScorer, MLScorer
│   ├── main.py            # FastAPI entry point
│   ├── requirements.txt
│   └── .env               # GEMINI_API_KEY (not committed)
├── index.html             # Main menu
└── README.md
```
 
---
 
## 🎮 How to Play
 
1. **Start** — pick one starter item and one relic from randomized selections
2. **Travel** — face random encounters on the road with meaningful choices
3. **Checkpoint** — rest, buy supplies, upgrade your wagon, sell merchandise
4. **Choose your path** — short (safe, fewer rewards) or long (risky, more loot)
5. **Survive** — make it to the end with as much gold as possible
---
 
## ⚠️ Known Limitations
 
- BVS Gemini integration is partially stubbed — `_call_llm()` in `conductor.py` needs the live API call wired in
- Encounter pool is currently frontend-only; full backend routing coming post-hackathon
- No persistent save state between sessions yet
---
 
## 🔮 What's Next
 
- [ ] Full Gemini API integration in the BVS
- [ ] Persistent player profiles across runs
- [ ] Expanded encounter roster (traders, shrines, mystery events)
- [ ] Merchandise set bonuses
- [ ] Procedurally generated encounter dialogue via Gemini
- [ ] Leaderboard and end-screen score breakdown