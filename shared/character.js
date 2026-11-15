(function () {
  var KEY = "andromeda_character_v1";

  // ---- the peoples of the Utopian Galaxies ----
  var LINEAGES = [
    { key: "human", name: "Human", blurb: "The most common people across the galaxies, found on nearly every world.",
      skins: ["#3b2219", "#5a3825", "#7a4a2e", "#9a6440", "#b98a6a", "#d2a47e", "#e3bf9c", "#f1d6bd"],
      syl: [], ears: ["round"], horns: ["none"], tails: ["none"], marks: ["none"], glow: "#ffd9a8" },
    { key: "sylvan", name: "Sylvan", blurb: "Tree-kin with bark-lined skin and leaf-soft hair. They hear forests talk.",
      skins: ["#5b4632", "#6f5a3e", "#8c7a5a", "#a4977a", "#6d7a4e", "#93a36a"],
      syl: ["ash", "el", "wyn", "fern", "lo", "ria", "bel", "thal", "or", "sil", "mae", "ve"],
      ears: ["pointed", "long"], horns: ["none", "antlers"], tails: ["none"], marks: ["bark", "none"], glow: "#a6f06b" },
    { key: "tidal", name: "Tidal", blurb: "Water-born people with fins and pearly skin. They breathe easy in deep water.",
      skins: ["#2a6f8a", "#3d8fa0", "#6ab7c2", "#a3dde0", "#4f7fb0", "#7ea8d8"],
      syl: ["mar", "ula", "nai", "sel", "coa", "rin", "ta", "nu", "oce", "ly", "kel", "pha"],
      ears: ["fins"], horns: ["none"], tails: ["fin", "none"], marks: ["pearl", "none"], glow: "#4dd2ff" },
    { key: "ember", name: "Emberborn", blurb: "Fire-touched folk with warm skin, small horns, and coal-bright eyes.",
      skins: ["#5e2418", "#7c3420", "#a24b2a", "#c46a3a", "#8a3d3d", "#d08a5a"],
      syl: ["kai", "ra", "zor", "ith", "pyr", "an", "dro", "ves", "ka", "ul", "mor", "en"],
      ears: ["pointed", "round"], horns: ["nubs", "spiral"], tails: ["slim", "none"], marks: ["embers", "none"], glow: "#ff7a3d" },
    { key: "gale", name: "Gale-kin", blurb: "Light-boned sky people with feathered crests. Restless and curious.",
      skins: ["#d9d2c4", "#c4b8a8", "#e8dfd2", "#b5a99a", "#9fb0c2", "#d4c2e0"],
      syl: ["aer", "ri", "ses", "ki", "wen", "fio", "lae", "zep", "yr", "ho", "qui", "ae"],
      ears: ["pointed", "round"], horns: ["none"], tails: ["plume", "none"], marks: ["none", "stars"], glow: "#c08cff" },
    { key: "root", name: "Rootfolk", blurb: "Patient, sturdy people who carry moss and stone in their skin.",
      skins: ["#4a3b2e", "#5c5040", "#6e6650", "#3f4a36", "#7a6a55", "#56604a"],
      syl: ["grum", "bo", "tor", "ok", "mund", "ga", "bram", "dur", "hol", "ek", "stan", "ru"],
      ears: ["round", "pointed"], horns: ["nubs", "none"], tails: ["none"], marks: ["moss", "bark"], glow: "#a6f06b" },
    { key: "lumen", name: "Lumen", blurb: "Translucent people who glow softly from within. Light follows their moods.",
      skins: ["#e6f0ff", "#d4e8f5", "#f0e4ff", "#e0fff4", "#fff4d6", "#f5dcef"],
      syl: ["lu", "mi", "sa", "ael", "ion", "vi", "ra", "lys", "eo", "phe", "ni", "ys"],
      ears: ["long", "pointed"], horns: ["none"], tails: ["none", "plume"], marks: ["glow", "stars"], glow: "#fff27a" },
    { key: "mudborn", name: "Mudborn", blurb: "Burrow-dwellers marked with glistening blue mud. Masters of building.",
      skins: ["#3c3a52", "#4c4a66", "#2f3e5c", "#5a5878", "#46566e", "#6a6a86"],
      syl: ["bu", "ro", "gli", "sten", "mo", "da", "pel", "un", "tu", "lo", "wa", "ze"],
      ears: ["round", "pointed"], horns: ["none", "nubs"], tails: ["slim", "none"], marks: ["mud", "mud"], glow: "#47b6ff" },
    { key: "stone", name: "Stoneborn", blurb: "Heavy, slow-aging people with mineral skin that catches the light.",
      skins: ["#5a5a62", "#6e6a72", "#7a7468", "#4c4e58", "#8a8580", "#3a3c46"],
      syl: ["kor", "gran", "ith", "bas", "al", "obs", "ter", "um", "sla", "ag", "khar", "on"],
      ears: ["round"], horns: ["nubs", "spiral", "none"], tails: ["none"], marks: ["veins", "none"], glow: "#e6d3a1" },
    { key: "star", name: "Starborn", blurb: "Night-skinned people freckled with starlight, said to remember other skies.",
      skins: ["#141632", "#1e2048", "#2a1e46", "#10283a", "#2a2a5a", "#1a1a2a"],
      syl: ["ast", "ri", "nov", "cel", "es", "tia", "vor", "nyx", "ori", "on", "zel", "qua"],
      ears: ["pointed", "long"], horns: ["none", "spiral"], tails: ["none", "slim"], marks: ["stars", "stars"], glow: "#9fe3c4" },
    { key: "petal", name: "Petal-kin", blurb: "Flower-born people who wake from petal sacs and wear blossom crowns.",
      skins: ["#f2c4d6", "#e8a3cf", "#f5d6a8", "#d6a8e8", "#ffd1c1", "#c9e68f"],
      syl: ["flo", "ri", "lia", "pet", "ros", "an", "zin", "dah", "ly", "bel", "mi", "ora"],
      ears: ["round", "pointed"], horns: ["none"], tails: ["none", "plume"], marks: ["petals", "none"], glow: "#ff7ad9" },
    { key: "nocturne", name: "Nocturne", blurb: "Night-dwellers with wide glowing eyes who see clearly in the dark.",
      skins: ["#2e2a3e", "#3a3450", "#24303a", "#463a52", "#30303a", "#3e4a5a"],
      syl: ["nox", "um", "bra", "sha", "vel", "or", "mi", "dra", "lun", "es", "ka", "voi"],
      ears: ["long", "pointed"], horns: ["none", "nubs"], tails: ["slim", "none"], marks: ["none", "stars"], glow: "#c08cff" }
  ];

  var RACES_PER_LINEAGE = 110;
  function rng(seed) { var s = seed % 2147483647; if (s <= 0) { s += 2147483646; } return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  var RACES = [];
  (function makeRaces() {
    var used = {};
    LINEAGES.forEach(function (L, li) {
      if (L.key === "human") {
        RACES.push({ id: 0, name: "Human", lineage: "human", ears: "round", horns: "none", tail: "none", marks: "none", skins: L.skins, glow: L.glow });
        return;
      }
      var r = rng(9001 + li * 7919), made = 0, tries = 0;
      while (made < RACES_PER_LINEAGE && tries < 5000) {
        tries++;
        var n = 2 + Math.floor(r() * 2), name = "";
        for (var k = 0; k < n; k++) { name += pick(r, L.syl); }
        name = cap(name);
        if (name.length < 5 || name.length > 11 || used[name]) { continue; }
        used[name] = true;
        var shift = Math.floor(r() * L.skins.length);
        RACES.push({
          id: RACES.length, name: name, lineage: L.key,
          ears: pick(r, L.ears), horns: pick(r, L.horns), tail: pick(r, L.tails), marks: pick(r, L.marks),
          skins: L.skins.slice(shift).concat(L.skins.slice(0, shift)).slice(0, 4), glow: L.glow
        });
        made++;
      }
    });
  })();

  var OPTIONS = {
    gender: ["Woman", "Man", "Trans woman", "Trans man", "Nonbinary", "Genderfluid", "Agender", "Prefer not to say", "Custom"],
    sex: ["Female", "Male", "Intersex", "Hermaphroditic", "Prefer not to say"],
    orientation: ["Straight", "Gay", "Lesbian", "Bisexual", "Pansexual", "Asexual", "Queer", "Questioning", "Prefer not to say"],
    hair: ["Shaved", "Short crop", "Curls", "Long flow", "Braids", "Crest", "Bun", "Locs"],
    hairColor: ["#141018", "#3a2418", "#6b3e22", "#a8743c", "#e6c27a", "#f2efe8", "#b03a3a", "#46c2b4", "#8f7fd1", "#e8a3cf", "#47b6ff", "#a6f06b"],
    eyes: ["#2b1a10", "#4a6b3a", "#3a6fb0", "#8a6a3a", "#9fe3c4", "#ff7a3d", "#c08cff", "#fff27a"],
    cloth: ["#232a44", "#3a2448", "#1f3b33", "#4a2c1e", "#2c3e50", "#5a1f2e", "#efeae0", "#1d7a74"],
    scents: [
      { name: "Rain on ash wood", color: "#a9c3b4" }, { name: "Glistening blue mud", color: "#47b6ff" },
      { name: "Night jasmine", color: "#f4f1ff" }, { name: "Smoke and copper", color: "#ff9a57" },
      { name: "Salt and cenote water", color: "#86ecff" }, { name: "Cacao bloom", color: "#d9a87e" },
      { name: "Moonmilk", color: "#e6e0ff" }, { name: "Crushed mint", color: "#a6f06b" },
      { name: "Amber resin", color: "#ffd685" }, { name: "Petrichor", color: "#8fb3a0" },
      { name: "Cold starlight", color: "#9fe3c4" }, { name: "Wild orange peel", color: "#ffb347" }
    ]
  };

  function lineageOf(key) { for (var i = 0; i < LINEAGES.length; i++) { if (LINEAGES[i].key === key) { return LINEAGES[i]; } } return LINEAGES[0]; }
  function race(id) { return RACES[id] || RACES[0]; }

  function random(r) {
    r = r || Math.random;
    var rc = RACES[Math.floor(r() * RACES.length)];
    return {
      name: "", gender: "Prefer not to say", genderCustom: "", sex: "Prefer not to say", orientation: "Prefer not to say",
      race: rc.id, skin: rc.skins[Math.floor(r() * rc.skins.length)],
      hair: OPTIONS.hair[Math.floor(r() * OPTIONS.hair.length)],
      hairColor: OPTIONS.hairColor[Math.floor(r() * OPTIONS.hairColor.length)],
      eyes: OPTIONS.eyes[Math.floor(r() * OPTIONS.eyes.length)],
      cloth: OPTIONS.cloth[Math.floor(r() * OPTIONS.cloth.length)],
      height: Math.round((0.88 + r() * 0.24) * 100) / 100,
      build: Math.round((0.85 + r() * 0.35) * 100) / 100,
      scent: Math.floor(r() * OPTIONS.scents.length)
    };
  }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  function save(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  window.Character = { LINEAGES: LINEAGES, RACES: RACES, OPTIONS: OPTIONS, lineageOf: lineageOf, race: race, random: random, load: load, save: save, clear: clear };
})();
