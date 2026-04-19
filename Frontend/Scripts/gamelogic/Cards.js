/* 
RARITY_VALUES:
rarity: value of this rarity

CARDS (merchandise):
id: CARDS key value identifier
type: for deck allocation
name: text name display
set: SETS key value identifier
rarity: rarity tier
description: text body for display

SETS:
name: text name display
cards: list of CARDS key value identifiers
sellBonus: sell value multiplier
*/ 

export const RARITY_VALUES = {
    common: 15,
    uncommon: 25,
    rare: 40,
    epic: 60,
    legendary: 90,
    mythic: 250
}

export const CARDS = {

    // ===========
    // JEWELRY
    // ===========

    // --- River Folk Jewelry (2-set, common) ---
    river_beads: {
        id: "river_beads",
        type: "merchandise",
        category: "jewelry",
        name: "River Beads",
        set: "river_folk_jewelry",
        rarity: "common",
        description: "Polished river stones strung on a cord. Simple but charming."
    },
    clay_brooch: {
        id: "clay_brooch",
        type: "merchandise",
        category: "jewelry",
        name: "Clay Brooch",
        set: "river_folk_jewelry",
        rarity: "common",
        description: "Hand-fired clay pin. A staple of riverside villages."
    },

    // --- Merchant Guild Jewelry (3-set, uncommon/rare) ---
    brass_ring: {
        id: "brass_ring",
        type: "merchandise",
        category: "jewelry",
        name: "Brass Ring",
        set: "merchant_guild_jewelry",
        rarity: "common",
        description: "A stamped brass ring. Standard issue for guild members."
    },
    silver_chain: {
        id: "silver_chain",
        type: "merchandise",
        category: "jewelry",
        name: "Silver Chain",
        set: "merchant_guild_jewelry",
        rarity: "uncommon",
        description: "A fine silver chain worn as a mark of trade rank."
    },
    guild_pendant: {
        id: "guild_pendant",
        type: "merchandise",
        category: "jewelry",
        name: "Guild Pendant",
        set: "merchant_guild_jewelry",
        rarity: "rare",
        description: "Engraved with the merchant seal. A symbol of status."
    },

    // --- Noble Court Jewelry (3-set, rare/epic) ---
    sapphire_earrings: {
        id: "sapphire_earrings",
        type: "merchandise",
        category: "jewelry",
        name: "Sapphire Earrings",
        set: "noble_court_jewelry",
        rarity: "rare",
        description: "Deep blue stones set in gold. Favoured by court ladies."
    },
    ivory_bracelet: {
        id: "ivory_bracelet",
        type: "merchandise",
        category: "jewelry",
        name: "Ivory Bracelet",
        set: "noble_court_jewelry",
        rarity: "rare",
        description: "Carved ivory cuff. A noble's accessory."
    },
    ruby_brooch: {
        id: "ruby_brooch",
        type: "merchandise",
        category: "jewelry",
        name: "Ruby Brooch",
        set: "noble_court_jewelry",
        rarity: "epic",
        description: "Blood-red ruby in a silver clasp. Fit for royalty."
    },

    // --- Setless Jewelry ---
    bone_pendant: {
        id: "bone_pendant",
        type: "merchandise",
        category: "jewelry",
        name: "Bone Pendant",
        set: null,
        rarity: "common",
        description: "Carved from animal bone. Worn for luck on long roads."
    },
    diamond_ring: {
        id: "diamond_ring",
        type: "merchandise",
        category: "jewelry",
        name: "Diamond Ring",
        set: null,
        rarity: "legendary",
        description: "A flawless stone in a plain band. Worth more than it looks."
    },

    // ===========
    // SPICE
    // ===========

    // --- Common Roadside Spices (2-set, common) ---
    dried_herbs: {
        id: "dried_herbs",
        type: "merchandise",
        category: "spice",
        name: "Dried Herbs",
        set: "roadside_spices",
        rarity: "common",
        description: "Bundled roadside herbs. Every cook wants them."
    },
    coarse_pepper: {
        id: "coarse_pepper",
        type: "merchandise",
        category: "spice",
        name: "Coarse Pepper",
        set: "roadside_spices",
        rarity: "common",
        description: "Ground coarsely from dried peppercorns. A kitchen staple."
    },

    // --- Southern Spice Route (3-set, uncommon/rare) ---
    cinnamon_bark: {
        id: "cinnamon_bark",
        type: "merchandise",
        category: "spice",
        name: "Cinnamon Bark",
        set: "southern_spice_route",
        rarity: "uncommon",
        description: "Curled bark from far southern trees. Sweet and warm."
    },
    saffron_pouch: {
        id: "saffron_pouch",
        type: "merchandise",
        category: "spice",
        name: "Saffron Pouch",
        set: "southern_spice_route",
        rarity: "rare",
        description: "Threads of pure saffron. Worth its weight in silver."
    },
    clove_bundle: {
        id: "clove_bundle",
        type: "merchandise",
        category: "spice",
        name: "Clove Bundle",
        set: "southern_spice_route",
        rarity: "uncommon",
        description: "Dried cloves bound in cloth. A prized cooking spice."
    },

    // --- Alchemist's Spices (4-set, rare/epic) ---
    ghostroot: {
        id: "ghostroot",
        type: "merchandise",
        category: "spice",
        name: "Ghostroot",
        set: "alchemist_spices",
        rarity: "rare",
        description: "A pale root with faint luminescence. Used in rare potions."
    },
    ember_dust: {
        id: "ember_dust",
        type: "merchandise",
        category: "spice",
        name: "Ember Dust",
        set: "alchemist_spices",
        rarity: "rare",
        description: "Ground from volcanic stone. Smells faintly of smoke."
    },
    nightbloom_petal: {
        id: "nightbloom_petal",
        type: "merchandise",
        category: "spice",
        name: "Nightbloom Petal",
        set: "alchemist_spices",
        rarity: "epic",
        description: "Petals that only open at midnight. Highly sought by alchemists."
    },
    void_salt: {
        id: "void_salt",
        type: "merchandise",
        category: "spice",
        name: "Void Salt",
        set: "alchemist_spices",
        rarity: "epic",
        description: "Black salt with no known origin. Alchemists pay handsomely."
    },

    // --- Setless Spice ---
    star_anise: {
        id: "star_anise",
        type: "merchandise",
        category: "spice",
        name: "Star Anise",
        set: null,
        rarity: "common",
        description: "Star-shaped pods with a liquorice scent. Common but always wanted."
    },
    dragons_tongue: {
        id: "dragons_tongue",
        type: "merchandise",
        category: "spice",
        name: "Dragon's Tongue",
        set: null,
        rarity: "legendary",
        description: "A spice so rare its origin is debated. Burns like fire on the tongue."
    },

    // ===========
    // ART
    // ===========

    // --- Street Art (2-set, common) ---
    chalk_sketch: {
        id: "chalk_sketch",
        type: "merchandise",
        category: "art",
        name: "Chalk Sketch",
        set: "street_art",
        rarity: "common",
        description: "A quick roadside portrait. Charming in its simplicity."
    },
    woodblock_print: {
        id: "woodblock_print",
        type: "merchandise",
        category: "art",
        name: "Woodblock Print",
        set: "street_art",
        rarity: "common",
        description: "A repeating print carved from old oak. Popular with travellers."
    },

    // --- Guild Paintings (3-set, uncommon/rare) ---
    landscape_study: {
        id: "landscape_study",
        type: "merchandise",
        category: "art",
        name: "Landscape Study",
        set: "guild_paintings",
        rarity: "uncommon",
        description: "An apprentice's careful study of a hillside view."
    },
    market_scene: {
        id: "market_scene",
        type: "merchandise",
        category: "art",
        name: "Market Scene",
        set: "guild_paintings",
        rarity: "uncommon",
        description: "A bustling town market captured in oils. Lively and detailed."
    },
    portrait_of_a_merchant: {
        id: "portrait_of_a_merchant",
        type: "merchandise",
        category: "art",
        name: "Portrait of a Merchant",
        set: "guild_paintings",
        rarity: "rare",
        description: "A commissioned oil portrait. The subject looks prosperous."
    },

    // --- Lost Masters (4-set, rare/epic) ---
    faded_fresco: {
        id: "faded_fresco",
        type: "merchandise",
        category: "art",
        name: "Faded Fresco",
        set: "lost_masters",
        rarity: "rare",
        description: "A fragment of ancient wall painting. The colours still hold."
    },
    bronze_relief: {
        id: "bronze_relief",
        type: "merchandise",
        category: "art",
        name: "Bronze Relief",
        set: "lost_masters",
        rarity: "rare",
        description: "A cast bronze panel depicting a forgotten battle."
    },
    gilded_icon: {
        id: "gilded_icon",
        type: "merchandise",
        category: "art",
        name: "Gilded Icon",
        set: "lost_masters",
        rarity: "epic",
        description: "Gold leaf over carved wood. A religious relic of unclear origin."
    },
    obsidian_mask: {
        id: "obsidian_mask",
        type: "merchandise",
        category: "art",
        name: "Obsidian Mask",
        set: "lost_masters",
        rarity: "epic",
        description: "Polished volcanic glass shaped into a ceremonial mask."
    },

    // --- Setless Art ---
    charcoal_portrait: {
        id: "charcoal_portrait",
        type: "merchandise",
        category: "art",
        name: "Charcoal Portrait",
        set: null,
        rarity: "common",
        description: "A quick likeness done in charcoal. The eyes are surprisingly alive."
    },
    the_wandering_eye: {
        id: "the_wandering_eye",
        type: "merchandise",
        category: "art",
        name: "The Wandering Eye",
        set: null,
        rarity: "legendary",
        description: "A painting rumoured to follow you. Collectors pay absurd sums."
    },

    // ===========
    // LITERATURE
    // ===========

    // --- Traveller's Writings (2-set, common) ---
    road_journal: {
        id: "road_journal",
        type: "merchandise",
        category: "literature",
        name: "Road Journal",
        set: "traveller_writings",
        rarity: "common",
        description: "A merchant's personal journal. Full of routes and gossip."
    },
    folk_songs: {
        id: "folk_songs",
        type: "merchandise",
        category: "literature",
        name: "Folk Songs",
        set: "traveller_writings",
        rarity: "common",
        description: "A hand-copied collection of regional ballads. Popular at inns."
    },

    // --- Scholar's Collection (3-set, uncommon/rare) ---
    herbal_compendium: {
        id: "herbal_compendium",
        type: "merchandise",
        category: "literature",
        name: "Herbal Compendium",
        set: "scholar_collection",
        rarity: "uncommon",
        description: "A detailed guide to medicinal plants. Every apothecary wants one."
    },
    star_charts: {
        id: "star_charts",
        type: "merchandise",
        category: "literature",
        name: "Star Charts",
        set: "scholar_collection",
        rarity: "rare",
        description: "Handdrawn maps of the night sky. Invaluable to navigators."
    },
    legal_codex: {
        id: "legal_codex",
        type: "merchandise",
        category: "literature",
        name: "Legal Codex",
        set: "scholar_collection",
        rarity: "uncommon",
        description: "A transcribed volume of regional trade law. Dry but essential."
    },

    // --- Forbidden Texts (4-set, rare/epic) ---
    banned_manifesto: {
        id: "banned_manifesto",
        type: "merchandise",
        category: "literature",
        name: "Banned Manifesto",
        set: "forbidden_texts",
        rarity: "rare",
        description: "Outlawed in three cities. Collectors pay well for the danger."
    },
    cipher_scroll: {
        id: "cipher_scroll",
        type: "merchandise",
        category: "literature",
        name: "Cipher Scroll",
        set: "forbidden_texts",
        rarity: "rare",
        description: "Written in an unknown code. No one has cracked it yet."
    },
    heretic_gospel: {
        id: "heretic_gospel",
        type: "merchandise",
        category: "literature",
        name: "Heretic Gospel",
        set: "forbidden_texts",
        rarity: "epic",
        description: "A religious text declared dangerous by the church. Very illegal."
    },
    true_name_tome: {
        id: "true_name_tome",
        type: "merchandise",
        category: "literature",
        name: "True Name Tome",
        set: "forbidden_texts",
        rarity: "epic",
        description: "Said to contain the true names of ancient powers. Unsettling to hold."
    },

    // --- Setless Literature ---
    recipe_book: {
        id: "recipe_book",
        type: "merchandise",
        category: "literature",
        name: "Recipe Book",
        set: null,
        rarity: "common",
        description: "A well-worn cookbook from a renowned inn. Stained with use."
    },
    the_first_map: {
        id: "the_first_map",
        type: "merchandise",
        category: "literature",
        name: "The First Map",
        set: null,
        rarity: "legendary",
        description: "The oldest known map of the known world. Scholars would pay anything."
    },

    // --- Arcane Goods set (3 cards, legendary-tier, hardest to complete) ---
    moonwater: {
        id: "moonwater",
        type: "merchandise",
        name: "Moon Water",
        category: "spice",
        set: "arcane_goods",
        rarity: "uncommon",
        description: "Water collected under the full moon. Part of the Arcane Goods set."
    },
    starshard: {
        id: "starshard",
        type: "merchandise",
        category: "jewelry",
        name: "Star Shard",
        set: "arcane_goods",
        rarity: "epic",
        description: "A fragment of fallen sky. Part of the Arcane Goods set."
    },
    dragonsbreath: {
        id: "dragonsbreath",
        type: "merchandise",
        category: "spice",
        name: "Dragon's Breath",
        set: "arcane_goods",
        rarity: "legendary",
        description: "Bottled fire. Whisper of wyrms. Part of the Arcane Goods set."
    },

    // --- Individual merchandise (no set) ---
    travel_map: {
        id: "travel_map",
        type: "merchandise",
        name: "Travel Map",
        category: "literature",
        set: null,
        rarity: "uncommon",
        description: "A hand-drawn map of distant routes. Valuable to the right buyer."
    },
    jeweled_dagger: {
        id: "jeweled_dagger",
        type: "merchandise",
        name: "Jeweled Dagger",
        category: "jewelry",
        set: null,
        rarity: "rare",
        description: "Ceremonial blade. Decorative, not practical."
    },
    masterwork_saddle: {
        id: "masterwork_saddle",
        type: "merchandise",
        name: "Masterwork Saddle",
        category: "jewelry",
        set: null,
        rarity: "epic",
        description: "Finest leatherwork. Coveted by nobility."
    },

    // ===========
    // SETLESS SPECIALS
    // ===========
    lost_crown: {
        id: "lost_crown",
        type: "merchandise",
        category: null,
        name: "Lost Crown",
        set: null,
        rarity: "mythic",
        description: "A forgotten royal relic. Worth its true value only at journey's end."
    }
}

export const SETS = {

    // --- Jewelry Sets ---
    river_folk_jewelry: {
        name: "River Folk Jewelry",
        cards: ["river_beads", "clay_brooch"],
        sellBonus: 1.6
    },
    merchant_guild_jewelry: {
        name: "Merchant Guild Jewelry",
        cards: ["brass_ring", "silver_chain", "guild_pendant"],
        sellBonus: 1.5
    },
    noble_court_jewelry: {
        name: "Noble Court Jewelry",
        cards: ["sapphire_earrings", "ivory_bracelet", "ruby_brooch"],
        sellBonus: 1.5
    },

    // --- Spice Sets ---
    roadside_spices: {
        name: "Roadside Spices",
        cards: ["dried_herbs", "coarse_pepper"],
        sellBonus: 1.6
    },
    southern_spice_route: {
        name: "Southern Spice Route",
        cards: ["cinnamon_bark", "saffron_pouch", "clove_bundle"],
        sellBonus: 1.5
    },
    alchemist_spices: {
        name: "Alchemist's Spices",
        cards: ["ghostroot", "ember_dust", "nightbloom_petal", "void_salt"],
        sellBonus: 1.4
    },

    // --- Art Sets ---
    street_art: {
        name: "Street Art",
        cards: ["chalk_sketch", "woodblock_print"],
        sellBonus: 1.6
    },
    guild_paintings: {
        name: "Guild Paintings",
        cards: ["landscape_study", "market_scene", "portrait_of_a_merchant"],
        sellBonus: 1.5
    },
    lost_masters: {
        name: "Lost Masters",
        cards: ["faded_fresco", "bronze_relief", "gilded_icon", "obsidian_mask"],
        sellBonus: 1.4
    },

    // --- Literature Sets ---
    traveller_writings: {
        name: "Traveller's Writings",
        cards: ["road_journal", "folk_songs"],
        sellBonus: 1.6
    },
    scholar_collection: {
        name: "Scholar's Collection",
        cards: ["herbal_compendium", "star_charts", "legal_codex"],
        sellBonus: 1.5
    },
    forbidden_texts: {
        name: "Forbidden Texts",
        cards: ["banned_manifesto", "cipher_scroll", "heretic_gospel", "true_name_tome"],
        sellBonus: 1.4
    },
    arcane_goods: {
        name: "Arcane Goods",
        cards: ["moonwater", "starshard", "dragonsbreath"],
        sellBonus: 1.4
    }
}