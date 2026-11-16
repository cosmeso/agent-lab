// Abimael's Andromeda: the shared world.
// Accounts, cloud saves, live players, chat, parties, world ranks and reports, built on Supabase.
// If anything here can't connect, the game keeps working on this device alone.
(function () {
  var cfg = window.ANDROMEDA_NET || {};
  var KEYS = { ch: "andromeda_character_v1", cr: "andromeda_creature_v1", pr: "andromeda_progress_v1" };
  var LOCAL_T = "andromeda_local_t", PUSHED = "andromeda_pushed_blob", MUTES = "andromeda_mutes", PARTY = "andromeda_party", AGE = "andromeda_age_ok";
  var client = null, user = null, status = "offline", cancelled = false, syncing = false;
  var world = null, regionCh = null, partyCh = null, me = null, region = null, party = null;
  var players = {}, partyMembers = [], listeners = {};

  function on(ev, f) { (listeners[ev] = listeners[ev] || []).push(f); }
  function emit(ev, d) { (listeners[ev] || []).forEach(function (f) { try { f(d); } catch (e) { console.error(e); } }); }
  function ls(k, v) {
    try {
      if (v === undefined) { return localStorage.getItem(k); }
      if (v === null) { localStorage.removeItem(k); } else { localStorage.setItem(k, v); }
    } catch (e) {}
    return null;
  }
  function parse(s) { try { return JSON.parse(s); } catch (e) { return null; } }
  function localBlob() { return JSON.stringify([ls(KEYS.ch), ls(KEYS.cr), ls(KEYS.pr)]); }
  function timeout(p, ms) { return Promise.race([p, new Promise(function (_, rej) { setTimeout(function () { rej(new Error("timeout")); }, ms); })]); }
  function setStatus(s) { status = s; emit("status", s); }

  // ---------- words that never reach other players ----------
  // ANY: blocked anywhere in a word. START: blocked when a word begins with it. EXACT: blocked only as the whole word.
  var ANY = ["fuck", "shit", "bitch", "nigger", "nigga", "faggot", "whore", "slut", "porn", "molest", "pedophile", "killyourself", "kike", "chink", "wetback", "tranny", "asshole", "arsehole", "motherf"];
  var START = ["cunt", "rape", "rapist", "retard", "bastard", "pussy", "nazi", "hitler", "nude"];
  var EXACT = ["fag", "fags", "kys", "spic", "spics", "dick", "dicks", "cock", "cocks", "fuk", "cum"];
  function norm(w) {
    return w.toLowerCase().replace(/0/g, "o").replace(/[1!|]/g, "i").replace(/3/g, "e").replace(/[4@]/g, "a").replace(/[5$]/g, "s").replace(/7/g, "t")
      .replace(/[^a-z]/g, "").replace(/(.)\1{2,}/g, "$1$1");
  }
  function badWord(n) {
    if (EXACT.indexOf(n) >= 0) { return true; }
    for (var i = 0; i < ANY.length; i++) { if (n.indexOf(ANY[i]) >= 0) { return true; } }
    for (var j = 0; j < START.length; j++) { if (n.indexOf(START[j]) === 0) { return true; } }
    return false;
  }
  function clean(text) {
    var t = String(text || "").replace(/[\u0000-\u001f]/g, " ").slice(0, 160);
    t = t.replace(/[^\s@]+@[^\s@]+\.[a-z]{2,}/gi, "[email]");
    t = t.replace(/https?:\/\/\S+|www\.\S+|\S+\.(com|net|org|gg|io|xyz|ly|me|tv)\b\S*/gi, "[link]");
    t = t.replace(/(\+?\d[\d\s().-]{7,}\d)/g, "[number]");
    var squashed = norm(t);
    if (squashed.indexOf("killyourself") >= 0 || /(^|[^a-z])kys/.test(t.toLowerCase())) { return "****"; }
    return t.split(/(\s+)/).map(function (w) { var n = norm(w); return n && badWord(n) ? w.replace(/\S/g, "*") : w; }).join("");
  }

  // ---------- starting up: who are you, and where is your save? ----------
  function start() {
    if (!cfg.url || !cfg.key || !window.supabase || !window.supabase.createClient) { setStatus("offline"); return Promise.resolve(false); }
    var run = (async function () {
      client = window.supabase.createClient(cfg.url, cfg.key, { auth: { persistSession: true, autoRefreshToken: true } });
      var s = await timeout(client.auth.getSession(), 6000);
      user = s && s.data && s.data.session ? s.data.session.user : null;
      if (!user) {
        var a = await timeout(client.auth.signInAnonymously(), 7000);
        if (a.error) { console.warn("Anonymous sign-in is off:", a.error.message); } else { user = a.data.user; }
      }
      if (user) { await timeout(pullSave(false), 7000); }
      setStatus("connected");
      startSync();
      return true;
    })();
    return timeout(run, 10000).catch(function (e) {
      console.warn("Andromeda is playing offline:", e && e.message);
      cancelled = true; setStatus("offline"); return false;
    });
  }
  function isOnline() { return !!client && status !== "offline"; }
  function isAccount() { return !!user && !user.is_anonymous; }
  function email() { return user && user.email ? user.email : ""; }

  // ---------- cloud saves ----------
  async function pullSave(preferCloud) {
    if (!client || !user) { return; }
    var r = await client.from("saves").select("character,creature,progress,updated_at").eq("user_id", user.id).maybeSingle();
    if (r.error) { console.warn("Could not read your save:", r.error.message); return; }
    if (cancelled) { return; }
    var row = r.data, localT = Number(ls(LOCAL_T) || 0), hasLocal = !!ls(KEYS.ch);
    var cloudT = row ? Date.parse(row.updated_at) : 0;
    if (row && row.character && (preferCloud || !hasLocal || cloudT > localT)) { writeLocal(row); emit("loaded", row); }
    else if (hasLocal) { await pushSave(true); }
  }
  function writeLocal(row) {
    [["ch", "character"], ["cr", "creature"], ["pr", "progress"]].forEach(function (p) {
      if (row[p[1]]) { ls(KEYS[p[0]], JSON.stringify(row[p[1]])); } else { ls(KEYS[p[0]], null); }
    });
    ls(PUSHED, localBlob()); ls(LOCAL_T, String(Date.parse(row.updated_at) || Date.now()));
  }
  async function pushSave(force) {
    if (!client || !user || syncing) { return; }
    var b = localBlob(); if (!force && b === ls(PUSHED)) { return; }
    var arr = JSON.parse(b); if (!arr[0]) { return; }
    syncing = true;
    try {
      var now = new Date().toISOString();
      var r = await client.from("saves").upsert({ user_id: user.id, character: parse(arr[0]), creature: parse(arr[1]), progress: parse(arr[2]), updated_at: now });
      if (r.error) { console.warn("Could not save to the cloud:", r.error.message); }
      else { ls(PUSHED, b); ls(LOCAL_T, String(Date.parse(now))); emit("saved"); }
    } finally { syncing = false; }
  }
  var syncStarted = false;
  function startSync() {
    if (syncStarted) { return; } syncStarted = true;
    setInterval(function () { if (localBlob() !== ls(PUSHED)) { ls(LOCAL_T, String(Date.now())); } }, 3000);
    setInterval(function () { pushSave(false); }, 20000);
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") { pushSave(false); } });
    window.addEventListener("pagehide", function () { pushSave(false); });
  }

  // ---------- accounts ----------
  async function signUp(mail, pw) {
    if (!client) { return "The world is offline right now."; }
    var r = await client.auth.signUp({ email: mail, password: pw });
    if (r.error) { return r.error.message; }
    if (!r.data.session) { return "Check your email to confirm your account, then sign in."; }
    user = r.data.user; await pushSave(true); leaveAll(); return null;
  }
  async function signIn(mail, pw) {
    if (!client) { return "The world is offline right now."; }
    var r = await client.auth.signInWithPassword({ email: mail, password: pw });
    if (r.error) { return r.error.message; }
    user = r.data.user; await pullSave(true); leaveAll(); return null;
  }
  async function signOut() {
    if (!client) { return; }
    await pushSave(true);
    await client.auth.signOut();
    [KEYS.ch, KEYS.cr, KEYS.pr, LOCAL_T, PUSHED, PARTY].forEach(function (k) { ls(k, null); });
  }

  // ---------- being in the world together ----------
  function myId() {
    if (user) { return user.id; }
    var g = ls("andromeda_guest_id"); if (!g) { g = "g-" + Math.random().toString(36).slice(2, 12); ls("andromeda_guest_id", g); }
    return g;
  }
  function enter(meta) {
    if (!client || world) { if (world && meta) { updateMe(meta); } return; }
    me = Object.assign({ id: myId() }, meta);
    world = client.channel("andromeda-world", { config: { broadcast: { self: false }, presence: { key: me.id } } });
    world.on("presence", { event: "sync" }, syncPresence)
      .on("broadcast", { event: "chat" }, function (m) { var p = m.payload || {}; if (!p.text || isMuted(p.id)) { return; } p.text = clean(p.text); p.name = String(p.name || "?").slice(0, 24); emit("chat", p); })
      .subscribe(function (st) {
        if (st === "SUBSCRIBED") { world.track(me); setStatus("online"); }
        else if (st === "CHANNEL_ERROR" || st === "TIMED_OUT") { setStatus("reconnecting"); }
      });
    var r = me.region; region = null; setRegion(r);
    var saved = ls(PARTY); if (saved) { joinParty(saved); }
  }
  function syncPresence() {
    if (!world) { return; }
    var st = world.presenceState(), next = {};
    Object.keys(st).forEach(function (k) { var m = st[k] && st[k][0]; if (m && k !== me.id) { next[k] = m; } });
    players = next; emit("players", players);
  }
  function updateMe(patch) { if (!me) { return; } Object.assign(me, patch); if (world) { world.track(me); } }
  function setRegion(r) {
    if (!client || !me || r === region) { return; }
    region = r;
    if (regionCh) { client.removeChannel(regionCh); }
    regionCh = client.channel("andromeda-region-" + r, { config: { broadcast: { self: false } } });
    regionCh.on("broadcast", { event: "pos" }, function (m) { emit("pos", m.payload); })
      .on("broadcast", { event: "act" }, function (m) { emit("act", m.payload); })
      .subscribe();
    updateMe({ region: r });
  }
  function sendPos(p) { if (regionCh && me) { p.id = me.id; regionCh.send({ type: "broadcast", event: "pos", payload: p }); } }
  function sendAct(a) { if (regionCh && me) { a.id = me.id; regionCh.send({ type: "broadcast", event: "act", payload: a }); } }
  function leaveAll() {
    if (!client) { return; }
    [world, regionCh, partyCh].forEach(function (c) { if (c) { client.removeChannel(c); } });
    world = regionCh = partyCh = null; region = null; party = null; players = {};
  }

  // ---------- chat ----------
  var lastChat = 0;
  function ageOk() { return ls(AGE); }
  function setAge(v) { ls(AGE, v); }
  function sendChat(text) {
    if (!world || !me || ageOk() !== "yes") { return null; }
    var t = clean(String(text || "").slice(0, 140)).trim(); if (!t) { return null; }
    if (Date.now() - lastChat < 1500) { return "slow"; }
    lastChat = Date.now();
    var msg = { id: me.id, name: me.name, text: t, region: region, t: Date.now() };
    world.send({ type: "broadcast", event: "chat", payload: msg });
    return msg;
  }
  function mutes() { return parse(ls(MUTES)) || {}; }
  function isMuted(id) { return !!mutes()[id]; }
  function setMuted(id, v) { var m = mutes(); if (v) { m[id] = 1; } else { delete m[id]; } ls(MUTES, JSON.stringify(m)); }

  // ---------- parties: play the story together ----------
  function newPartyCode() { var c = "ABCDEFGHJKMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 5; i++) { s += c[Math.floor(Math.random() * c.length)]; } return s; }
  function joinParty(code) {
    code = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    if (code.length < 4 || !client || !me) { return null; }
    leaveParty(true);
    party = code; ls(PARTY, code);
    partyCh = client.channel("andromeda-party-" + code, { config: { broadcast: { self: false }, presence: { key: me.id } } });
    partyCh.on("presence", { event: "sync" }, function () {
      var st = partyCh.presenceState(); partyMembers = Object.keys(st).map(function (k) { return st[k][0]; }).filter(Boolean); emit("party", partyMembers);
    }).on("broadcast", { event: "share" }, function (m) { emit("share", m.payload); })
      .subscribe(function (st) { if (st === "SUBSCRIBED") { partyCh.track({ id: me.id, name: me.name }); } });
    updateMe({ party: code });
    return code;
  }
  function leaveParty(silent) {
    if (partyCh && client) { client.removeChannel(partyCh); }
    partyCh = null; party = null; partyMembers = [];
    if (!silent) { ls(PARTY, null); updateMe({ party: null }); emit("party", []); }
  }
  function share(ev) { if (partyCh && me) { ev.id = me.id; ev.name = me.name; partyCh.send({ type: "broadcast", event: "share", payload: ev }); } }

  // ---------- world ranks and reports ----------
  var lastRank = "";
  async function pushRank(r) {
    if (!client || !user || !r.name) { return; }
    var s = JSON.stringify(r); if (s === lastRank) { return; } lastRank = s;
    var x = await client.from("ranks").upsert({ user_id: user.id, name: String(r.name).slice(0, 24), foxes: r.foxes | 0, bonds: r.bonds | 0, stones: r.stones | 0, title: r.title || null, updated_at: new Date().toISOString() });
    if (x.error) { console.warn("Could not post your rank:", x.error.message); lastRank = ""; }
  }
  async function topRanks() {
    if (!client) { return null; }
    var r = await client.from("ranks").select("user_id,name,foxes,bonds,stones,title").order("foxes", { ascending: false }).order("bonds", { ascending: false }).limit(10);
    if (r.error) { console.warn(r.error.message); return null; }
    return r.data || [];
  }
  async function report(target, reason, msgs) {
    if (!client || !user) { return false; }
    var r = await client.from("reports").insert({ reported_id: String(target.id), reported_name: String(target.name || "").slice(0, 24), reason: reason, messages: msgs || [] });
    if (r.error) { console.warn(r.error.message); }
    return !r.error;
  }

  window.Net = {
    start: start, on: on, clean: clean, isOnline: isOnline, isAccount: isAccount, email: email, status: function () { return status; },
    signUp: signUp, signIn: signIn, signOut: signOut, pushSave: pushSave,
    enter: enter, updateMe: updateMe, setRegion: setRegion, sendPos: sendPos, sendAct: sendAct, myId: function () { return me ? me.id : myId(); },
    players: function () { return players; }, sendChat: sendChat, ageOk: ageOk, setAge: setAge, isMuted: isMuted, setMuted: setMuted,
    newPartyCode: newPartyCode, joinParty: joinParty, leaveParty: function () { leaveParty(false); }, party: function () { return party; }, partyMembers: function () { return partyMembers; }, share: share,
    pushRank: pushRank, topRanks: topRanks, report: report
  };
})();
