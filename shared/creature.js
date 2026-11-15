(function () {
  var KEY = "andromeda_creature_v1";
  var STAGES = ["Egg", "Hatchling", "Juvenile", "Adult"];
  var LINES = ["ember", "tide", "gale", "root", "lumen"];
  var TYPES = {
    ember: { name: "Ember", trait: "Drive", power: "Spark", glow: "#ff7a3d",
      powerText: "Boosts your points: +10% as a Hatchling, +25% as a Juvenile, +50% as an Adult.",
      grow: "Ember feeds on bold answers. Correct answers on 300 and 400 point questions give double growth.",
      need: [90, 300, 700] },
    tide: { name: "Tide", trait: "Heart", power: "Shell", glow: "#4dd2ff",
      powerText: "Starts every game with shields against steals: 1 as a Hatchling, 2 as a Juvenile, 3 as an Adult.",
      grow: "Tide feeds on steady play. Every third correct answer in a single game gives bonus growth.",
      need: [110, 340, 760] },
    gale: { name: "Gale", trait: "Curiosity", power: "Oracle", glow: "#c08cff",
      powerText: "Clears wrong answers from your questions: a few uses per game as a Hatchling, more as it grows, and two at a time from Juvenile on.",
      grow: "Gale feeds on curiosity. The first correct answer in each new era you explore gives a big growth bonus.",
      need: [100, 320, 720] },
    root: { name: "Root", trait: "Patience", power: "Bulwark", glow: "#a6f06b",
      powerText: "A little of everything: a steal-shield each game (two as an Adult) and +5% to +15% points as it grows.",
      grow: "Root feeds on patience. Correct answers on 100 and 200 point questions give double growth.",
      need: [100, 330, 740] },
    lumen: { name: "Lumen", trait: "Imagination", power: "Glow", glow: "#fff27a",
      powerText: "Clears one wrong answer at a time: 1 use per game as a Hatchling, 2 as a Juvenile, 3 as an Adult.",
      grow: "Lumen drinks light from every answer. Each correct answer gives +1 bonus growth, but it needs more to evolve.",
      need: [120, 360, 800] }
  };
  var PALETTES = {
    abalone: { name: "Abalone", c: ["#123f4a", "#2a8c8c", "#bff3ea", "#ff7ad9"] },
    jade: { name: "Jade", c: ["#0f4a2e", "#2d8a5f", "#a6e8c0", "#ffd76a"] },
    obsidian: { name: "Obsidian", c: ["#0d0d14", "#2a2a3c", "#6e6e96", "#4df2ff"] },
    copper: { name: "Copper", c: ["#5c260d", "#b8642b", "#f5be8a", "#3ee6b5"] },
    cacao: { name: "Cacao", c: ["#2e1a10", "#734428", "#d9a87e", "#ffc94d"] },
    turquoise: { name: "Turquoise", c: ["#08434f", "#1fa3a3", "#a3f5ec", "#ff8fa8"] },
    moonmilk: { name: "Moonmilk", c: ["#3e3b5c", "#a29ecb", "#f4f1ff", "#7cf2cf"] },
    ceiba: { name: "Ceiba", c: ["#17331d", "#4e7d3a", "#c9e68f", "#ff9a57"] },
    amber: { name: "Amber", c: ["#5e3200", "#d4870f", "#ffd685", "#58d3ff"] },
    cenote: { name: "Cenote", c: ["#052b40", "#127a9e", "#86ecff", "#d6ff70"] }
  };
  var PAL_ORDER = ["abalone", "jade", "obsidian", "copper", "cacao", "turquoise", "moonmilk", "ceiba", "amber", "cenote"];
  var SKINS = {
    scales: { name: "Scaled", text: "armored, shimmering scales" },
    pearl: { name: "Pearl", text: "smooth nacre skin etched with step-fret patterns" },
    feathers: { name: "Feathered", text: "soft plumes, a feather crest, and wing fans" },
    serpent: { name: "Feathered-scaled", text: "scales below and plumes above, like a sky serpent" },
    glass: { name: "Glass", text: "see-through glowing abalone skin with a light at its heart" }
  };
  var SKIN_BY_TRAIT = { ember: "scales", tide: "pearl", gale: "feathers", root: "serpent", lumen: "glass" };
  var ABALONE = ["#1d7a74", "#46c2b4", "#8f7fd1", "#e8a3cf", "#9fe3c4", "#3a8fc1", "#1d7a74"];
  var EGG = "M60 14C84 14 98 52 97 78C96 102 80 116 60 116C40 116 24 102 23 78C22 52 36 14 60 14Z";
  var run = { correct: 0, charges: 0, note: "" };
  var uid = 0, badgeEl = null;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }
  function r2(n) { return Math.round(n * 100) / 100; }
  function skinFor(trait) { return SKIN_BY_TRAIT[trait] || "pearl"; }
  function norm(p) {
    if (!p || !TYPES[p.type]) { return null; }
    if (!PALETTES[p.palette]) { p.palette = "abalone"; }
    if (!TYPES[p.second]) { p.second = p.type; }
    if (!SKINS[p.skin]) { p.skin = skinFor(p.second); }
    p.growth = p.growth || 0;
    p.stage = p.stage || 0;
    p.eras = p.eras || [];
    return p;
  }
  function copy(p) { var q = {}; for (var k in p) { q[k] = p[k]; } return norm(q); }
  function load() {
    try { return norm(JSON.parse(localStorage.getItem(KEY) || "null")); } catch (e) { return null; }
  }
  function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function eggNumber(p) {
    var q = copy(p);
    return LINES.indexOf(q.type) * 10 + PAL_ORDER.indexOf(q.palette) + 1;
  }
  function eggTitle(p) {
    var q = copy(p);
    return PALETTES[q.palette].name + " " + TYPES[q.type].name + " Egg";
  }
  function stageFor(p) {
    var need = TYPES[p.type].need, s = 0;
    for (var i = 0; i < need.length; i++) { if (p.growth >= need[i]) { s = i + 1; } }
    return s;
  }
  function progress(p) {
    var need = TYPES[p.type].need, s = p.stage || 0;
    if (s >= 3) { return 1; }
    var lo = s === 0 ? 0 : need[s - 1], hi = need[s];
    return Math.max(0, Math.min(1, ((p.growth || 0) - lo) / (hi - lo)));
  }

  function levelH(v, u) {
    if (v === 0) { return u * 2.6; }
    return (v % 5 ? u * 1.5 : 0) + Math.floor(v / 5) * u * 1.6;
  }
  function level(v, cx, y, u, fill) {
    var o = "";
    if (v === 0) {
      return '<ellipse cx="' + cx + '" cy="' + r2(y + u * 1.3) + '" rx="' + r2(u * 2.6) + '" ry="' + r2(u * 1.2) +
             '" fill="' + fill + '" stroke="#000" stroke-opacity=".6" stroke-width=".4"/>';
    }
    var d = v % 5, b = Math.floor(v / 5);
    if (d) {
      var start = cx - (d - 1) * u * 0.75;
      for (var i = 0; i < d; i++) {
        o += '<circle cx="' + r2(start + i * u * 1.5) + '" cy="' + r2(y + u * 0.7) + '" r="' + r2(u * 0.6) +
             '" fill="' + fill + '" stroke="#000" stroke-opacity=".6" stroke-width=".4"/>';
      }
      y += u * 1.5;
    }
    for (var j = 0; j < b; j++) {
      o += '<rect x="' + r2(cx - u * 2.9) + '" y="' + r2(y + j * u * 1.6) + '" width="' + r2(u * 5.8) + '" height="' + r2(u * 1.1) +
           '" rx="' + r2(u * 0.4) + '" fill="' + fill + '" stroke="#000" stroke-opacity=".6" stroke-width=".4"/>';
    }
    return o;
  }
  function maya(n, cx, cy, u, fill) {
    var hi = Math.floor(n / 20), lo = n % 20, gap = u * 1.2;
    var h = levelH(lo, u) + (hi ? levelH(hi, u) + gap : 0);
    var y = cy - h / 2, o = "";
    if (hi) { o += level(hi, cx, y, u, fill); y += levelH(hi, u) + gap; }
    return o + level(lo, cx, y, u, fill);
  }

  function svg(p, size) {
    var q = copy(p) || norm({ type: "ember" });
    var lite = size < 70, s = q.stage, u = "c" + (uid++);
    var c = PALETTES[q.palette].c, skin = q.skin, neon = TYPES[q.type].glow;
    var isAb = q.palette === "abalone";
    var ab = 'url(#a' + u + ')';
    var flt = lite ? "" : ' filter="url(#g' + u + ')"';
    var r = 22 + s * 6, ry = r - 4, top = 76 - ry;
    var o = '<svg viewBox="0 0 120 120" width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg"><defs>';
    o += '<radialGradient id="s' + u + '" cx="38%" cy="32%" r="80%"><stop offset="0" stop-color="' + c[2] +
         '"/><stop offset=".5" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[0] + '"/></radialGradient>';
    o += '<linearGradient id="a' + u + '" x1="0" y1="0" x2="1" y2="1">';
    ABALONE.forEach(function (col, i) {
      o += '<stop offset="' + r2(i / (ABALONE.length - 1)) + '" stop-color="' + col + '"/>';
    });
    if (!lite) {
      o += '<animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5" dur="14s" repeatCount="indefinite"/>';
    }
    o += '</linearGradient>';
    if (!lite) {
      o += '<filter id="g' + u + '" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6" result="b"/>' +
           '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    }
    o += '<pattern id="f' + u + '" width="14" height="10" patternUnits="userSpaceOnUse"><path d="M1 9V1H12V7H5V4H9" fill="none" stroke="' +
         c[3] + '" stroke-width="1.3" stroke-opacity=".8"/></pattern>';
    o += '<pattern id="k' + u + '" width="10" height="8" patternUnits="userSpaceOnUse"><path d="M0 8Q5 0 10 8M-5 4Q0 -4 5 4M5 4Q10 -4 15 4" fill="none" stroke="' +
         c[2] + '" stroke-width=".9" stroke-opacity=".7"/></pattern>';
    o += '<clipPath id="e' + u + '"><path d="' + EGG + '"/></clipPath>';
    o += '<clipPath id="b' + u + '"><ellipse cx="60" cy="76" rx="' + r + '" ry="' + ry + '"/></clipPath>';
    o += '</defs>';

    if (s === 0) {
      o += '<path d="' + EGG + '" fill="url(#s' + u + ')" fill-opacity="' + (skin === "glass" ? ".72" : "1") + '"/>';
      if (skin === "glass") { o += '<circle cx="60" cy="74" r="15" fill="' + neon + '" fill-opacity=".55"' + flt + '/>'; }
      o += '<path d="' + EGG + '" fill="' + ab + '" opacity="' + (isAb ? ".85" : (skin === "pearl" || skin === "glass") ? ".45" : ".22") + '"/>';
      if (skin === "scales" || skin === "serpent") { o += '<path d="' + EGG + '" fill="url(#k' + u + ')" opacity=".55"/>'; }
      o += '<g clip-path="url(#e' + u + ')"><rect x="0" y="88" width="120" height="10" fill="url(#f' + u + ')"/>' +
           '<rect x="0" y="86.5" width="120" height="1.2" fill="' + c[3] + '" fill-opacity=".8"/>' +
           '<rect x="0" y="98.5" width="120" height="1.2" fill="' + c[3] + '" fill-opacity=".8"/></g>';
      if (skin === "feathers" || skin === "serpent") {
        [[-1, 52], [0, 60], [1, 68]].forEach(function (f) {
          o += '<ellipse cx="' + f[1] + '" cy="12" rx="2.6" ry="7" fill="' + (f[0] === 0 ? c[3] : c[2]) +
               '" transform="rotate(' + (f[0] * 25) + ' ' + f[1] + ' 18)"/>';
        });
      }
      o += '<g fill="none" stroke="' + neon + '" stroke-width="1.4"' + flt + '><path d="M30 66H40V58H45"/><path d="M90 72H80V64H75"/></g>';
      o += '<g fill="' + neon + '"' + flt + '><circle cx="45" cy="58" r="2"/><circle cx="75" cy="64" r="2"/><circle cx="30" cy="66" r="1.5"/><circle cx="90" cy="72" r="1.5"/></g>';
      o += '<rect x="45" y="47" width="30" height="30" rx="8" fill="' + c[0] + '" fill-opacity=".6" stroke="' + ab + '" stroke-width="2"/>';
      o += maya(eggNumber(q), 60, 62, 2.3, ab);
      if (progress(q) > 0.6) { o += '<path d="M52 30l7 9-6 7 9 8" fill="none" stroke="#fff" stroke-width="2"/>'; }
    } else {
      var ex = r * 0.34, ey = 76 - ry * 0.18;
      if (s >= 3) {
        o += '<ellipse cx="60" cy="' + (top - 8) + '" rx="22" ry="6" fill="none" stroke="' + ab + '" stroke-width="3"' + flt + '/>';
      }
      if (s >= 2) {
        if (skin === "feathers" || skin === "serpent") {
          for (var i = 0; i < 4; i++) {
            [-1, 1].forEach(function (d) {
              var wx = 60 + d * (r + 4), wy = 70 - i * 6, ang = d * (25 + i * 14);
              o += '<ellipse cx="' + wx + '" cy="' + wy + '" rx="10" ry="3.6" fill="' + (i % 2 ? c[3] : c[2]) +
                   '" fill-opacity=".9" transform="rotate(' + ang + ' ' + wx + ' ' + wy + ')"/>';
            });
          }
        }
        if (skin === "scales" || skin === "serpent") {
          var tx = 60 + r - 4;
          o += '<path d="M' + tx + ' 96Q' + (tx + 20) + ' 104 ' + (tx + 14) + ' 84Q' + (tx + 10) + ' 76 ' + (tx + 18) +
               ' 70" fill="none" stroke="' + c[1] + '" stroke-width="6" stroke-linecap="round"/>';
          o += '<circle cx="' + (tx + 18) + '" cy="70" r="3" fill="' + neon + '"' + flt + '/>';
        }
        if (skin === "glass") {
          [-1, 1].forEach(function (d) {
            o += '<path d="M' + (60 + d * (r - 6)) + ' 70q' + (d * 22) + ' -18 ' + (d * 20) + ' 12q' + (d * -8) + ' 2 ' + (d * -16) +
                 ' 4z" fill="' + ab + '" fill-opacity=".55"/>';
          });
        }
        if (skin === "pearl") {
          [-1, 1].forEach(function (d) {
            var ox = 60 + d * (r - 1);
            o += '<circle cx="' + ox + '" cy="66" r="6.5" fill="' + ab + '"/><circle cx="' + ox + '" cy="66" r="2.6" fill="' + c[0] + '"/>';
          });
        }
      }
      o += '<ellipse cx="60" cy="76" rx="' + r + '" ry="' + ry + '" fill="url(#s' + u + ')" fill-opacity="' + (skin === "glass" ? ".5" : "1") + '"/>';
      if (skin === "glass") { o += '<circle cx="60" cy="80" r="' + r2(r * 0.35) + '" fill="' + neon + '" fill-opacity=".7"' + flt + '/>'; }
      o += '<ellipse cx="60" cy="76" rx="' + r + '" ry="' + ry + '" fill="' + ab + '" opacity="' +
           (skin === "glass" ? ".5" : (skin === "pearl" || isAb) ? ".55" : ".18") + '"/>';
      if (skin === "scales" || skin === "serpent") {
        o += '<ellipse cx="60" cy="76" rx="' + r + '" ry="' + ry + '" fill="url(#k' + u + ')" opacity=".6"/>';
      }
      o += '<g clip-path="url(#b' + u + ')"><rect x="0" y="' + r2(76 + ry * 0.62) + '" width="120" height="10" fill="url(#f' + u + ')"/></g>';
      var cx0 = 60 + r * 0.42, cy0 = 76 + ry * 0.15;
      o += '<path d="M' + r2(cx0) + ' ' + r2(cy0) + 'h' + r2(r * 0.3) + 'v-6" fill="none" stroke="' + neon + '" stroke-width="1.3"' + flt + '/>';
      o += '<circle cx="' + r2(cx0 + r * 0.3) + '" cy="' + r2(cy0 - 6) + '" r="1.8" fill="' + neon + '"' + flt + '/>';
      [-1, 1].forEach(function (d) {
        var x = r2(60 + d * ex);
        o += '<ellipse cx="' + x + '" cy="' + r2(ey) + '" rx="' + (4 + s) + '" ry="' + r2(3 + s * 0.6) + '" fill="#0a0a12"/>';
        o += '<circle cx="' + x + '" cy="' + r2(ey) + '" r="' + r2(1.8 + s * 0.4) + '" fill="' + neon + '"' + flt + '/>';
        o += '<circle cx="' + r2(x - 1) + '" cy="' + r2(ey - 1.2) + '" r=".9" fill="#fff"/>';
      });
      if (skin === "feathers" || skin === "serpent") {
        var n = 2 + s, len = 8 + s * 3;
        for (var k = 0; k < n; k++) {
          var fa = -40 + (80 / (n - 1)) * k;
          o += '<g transform="rotate(' + r2(fa) + ' 60 ' + (top + 3) + ')"><ellipse cx="60" cy="' + (top + 3 - len) + '" rx="3" ry="' + len +
               '" fill="' + (k % 2 ? c[3] : c[2]) + '"/><circle cx="60" cy="' + (top + 5 - len * 2) + '" r="1.6" fill="' + neon + '"' + flt + '/></g>';
        }
      } else if (skin === "scales") {
        for (var m = -1; m <= 1; m++) {
          var sx = 60 + m * 9, sh = 7 + s * 2 - Math.abs(m) * 2;
          o += '<path d="M' + (sx - 4) + ' ' + (top + 4) + 'L' + sx + ' ' + (top - sh) + 'L' + (sx + 4) + ' ' + (top + 4) +
               'Z" fill="' + c[1] + '" stroke="' + c[3] + '" stroke-width="1"/>';
        }
      } else if (skin === "glass") {
        [-1, 1].forEach(function (d) {
          var bx = 60 + d * 8, tx2 = 60 + d * 14;
          o += '<path d="M' + bx + ' ' + (top + 2) + 'L' + tx2 + ' ' + (top - 12) + '" stroke="' + c[2] + '" stroke-width="2" fill="none"/>';
          o += '<circle cx="' + tx2 + '" cy="' + (top - 12) + '" r="3.5" fill="' + neon + '"' + flt + '/>';
        });
      } else {
        o += '<path d="M48 ' + (top + 3) + 'V' + (top - 3) + 'H53V' + (top - 8) + 'H67V' + (top - 3) + 'H72V' + (top + 3) +
             'Z" fill="' + ab + '" stroke="' + c[0] + '" stroke-width=".8"/>';
        o += '<circle cx="60" cy="' + (top - 3) + '" r="2" fill="' + neon + '"' + flt + '/>';
      }
      if (s >= 2 && !lite) {
        var ccy = 76 + ry * 0.28;
        o += '<rect x="51" y="' + r2(ccy - 9) + '" width="18" height="18" rx="5" fill="' + c[0] + '" fill-opacity=".7" stroke="' + ab + '" stroke-width="1.5"/>';
        if (s >= 3) {
          var initial = String(q.name || "?").trim().charAt(0).toUpperCase() || "?";
          o += '<text x="60" y="' + r2(ccy + 5.5) + '" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="15" fill="' +
               ab + '" stroke="#000" stroke-opacity=".5" stroke-width=".5">' + esc(initial) + '</text>';
        } else {
          o += maya(eggNumber(q), 60, ccy, 1.4, ab);
        }
      }
    }
    return o + '</svg>';
  }

  function badgeHTML() {
    var p = load();
    if (!p) { return '<a href="../egg-finder/" style="color:inherit;text-decoration:none">&#129370; Get your egg</a>'; }
    var pct = Math.round(progress(p) * 100);
    return svg(p, 44) + '<div style="margin-left:8px;text-align:left"><b>' + esc(p.name) + '</b><br>' +
      '<span style="font-size:11px">' + STAGES[p.stage] + (p.stage < 3 ? ' ' + pct + '%' : ' (max)') + '</span>' +
      '<div style="width:70px;height:5px;background:#333;border-radius:3px;margin-top:2px">' +
      '<div style="width:' + pct + '%;height:5px;background:' + TYPES[p.type].glow + ';border-radius:3px"></div></div></div>';
  }
  function refreshBadge() { if (badgeEl) { badgeEl.innerHTML = badgeHTML(); } }
  function mount() {
    if (badgeEl || !document.body) { return; }
    badgeEl = document.createElement("div");
    badgeEl.id = "creature-badge";
    badgeEl.style.cssText = "position:fixed;top:8px;right:8px;display:flex;align-items:center;padding:6px 10px;background:rgba(0,0,0,.75);color:#fff;font:13px sans-serif;border-radius:12px;z-index:99998";
    document.body.appendChild(badgeEl);
    refreshBadge();
  }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", mount); } else { mount(); }

  function newEgg(type, second, palette, name) {
    var p = norm({ type: type, second: second, palette: palette, skin: skinFor(second), name: name, growth: 0, stage: 0, eras: [] });
    save(p);
    refreshBadge();
    return p;
  }
  function feed(tier, era) {
    var p = load();
    if (!p) { return ""; }
    var gain = tier, extra = "";
    run.correct++;
    if (p.type === "ember" && tier >= 3) { gain = tier * 2; }
    if (p.type === "root" && tier <= 2) { gain = tier * 2; }
    if (p.type === "tide" && run.correct % 3 === 0) { gain += 2; }
    if (p.type === "lumen") { gain += 1; }
    if (p.type === "gale" && era && p.eras.indexOf(era) < 0) {
      p.eras.push(era);
      gain += 6;
      extra = " New era explored!";
    }
    var before = p.stage;
    p.growth += gain;
    p.stage = stageFor(p);
    save(p);
    var msg = esc(p.name) + " grew +" + gain + "." + extra;
    if (p.stage > before) {
      msg += before === 0 ? " &#127881; Your egg hatched!" : " &#10024; " + esc(p.name) + " evolved into a " + STAGES[p.stage] + "!";
    }
    refreshBadge();
    return msg;
  }
  function startRun() {
    var p = load();
    run.correct = 0;
    run.note = "";
    run.charges = 0;
    if (p && p.type === "gale") { run.charges = [0, 2, 4, 6][p.stage]; }
    if (p && p.type === "lumen") { run.charges = [0, 1, 2, 3][p.stage]; }
  }
  function scoreBoost() {
    var p = load();
    if (p && p.type === "ember") { return [1, 1.1, 1.25, 1.5][p.stage]; }
    if (p && p.type === "root") { return [1, 1.05, 1.1, 1.15][p.stage]; }
    return 1;
  }
  function startShields() {
    var p = load();
    if (p && p.type === "tide") { return [0, 1, 2, 3][p.stage]; }
    if (p && p.type === "root") { return [0, 1, 1, 2][p.stage]; }
    return 0;
  }
  function trim(opts, correct) {
    run.note = "";
    var p = load();
    if (!p || (p.type !== "gale" && p.type !== "lumen") || p.stage < 1 || run.charges <= 0 || opts.length < 3) { return opts; }
    var wrong = shuffle(opts.filter(function (o) { return o !== correct; }));
    var cut = Math.min(p.type === "gale" && p.stage >= 2 ? 2 : 1, opts.length - 2);
    var drop = wrong.slice(0, cut);
    run.charges--;
    run.note = '<p class="small">' + esc(p.name) + " used " + TYPES[p.type].power + ": " + cut + " wrong answer" +
               (cut > 1 ? "s" : "") + " cleared (" + run.charges + " uses left this game).</p>";
    return opts.filter(function (o) { return drop.indexOf(o) < 0; });
  }
  function note() { return run.note; }

  window.Creature = {
    TYPES: TYPES, STAGES: STAGES, LINES: LINES, PALETTES: PALETTES, PAL_ORDER: PAL_ORDER, SKINS: SKINS,
    skinFor: skinFor, eggNumber: eggNumber, eggTitle: eggTitle, get: load, newEgg: newEgg, feed: feed,
    startRun: startRun, scoreBoost: scoreBoost, startShields: startShields, trim: trim, note: note,
    svg: svg, progress: progress, esc: esc, refreshBadge: refreshBadge
  };
})();
