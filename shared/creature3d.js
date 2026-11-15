(function () {
  var SRC = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
  var loading = null;

  function three() {
    if (!loading) { loading = import(SRC); }
    return loading;
  }
  function webgl() {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch (e) { return false; }
  }

  function mayaShapes(n) {
    var out = [];
    function lh(v) { return v === 0 ? 2.6 : (v % 5 ? 1.5 : 0) + Math.floor(v / 5) * 1.6; }
    function lvl(v, y) {
      if (v === 0) { out.push({ t: "shell", x: 0, y: y + 1.3 }); return; }
      var d = v % 5, b = Math.floor(v / 5);
      if (d) {
        var st = -(d - 1) * 0.75;
        for (var i = 0; i < d; i++) { out.push({ t: "dot", x: st + i * 1.5, y: y + 0.7 }); }
        y += 1.5;
      }
      for (var j = 0; j < b; j++) { out.push({ t: "bar", x: 0, y: y + j * 1.6 + 0.55 }); }
    }
    var hi = Math.floor(n / 20), lo = n % 20, gap = 1.2;
    var h = lh(lo) + (hi ? lh(hi) + gap : 0), y = -h / 2;
    if (hi) { lvl(hi, y); y += lh(hi) + gap; }
    lvl(lo, y);
    return out;
  }

  function build(THREE, el, pet, size) {
    var C = window.Creature;
    var type = C.TYPES[pet.type] ? pet.type : "ember";
    var palKey = C.PALETTES[pet.palette] ? pet.palette : "abalone";
    var pal = C.PALETTES[palKey].c;
    var skin = C.SKINS[pet.skin] ? pet.skin : C.skinFor(pet.second || type);
    var stage = pet.stage || 0;
    var prog = C.progress({ type: type, stage: stage, growth: pet.growth || 0 });
    var neon = new THREE.Color(C.TYPES[type].glow);
    var UP = new THREE.Vector3(0, 1, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.35, 7);
    camera.lookAt(0, 0, 0);

    var pmrem = new THREE.PMREMGenerator(renderer);
    var envScene = new THREE.Scene();
    var envGeo = new THREE.SphereGeometry(10, 48, 24);
    var ep = envGeo.attributes.position, cols = [], tc = new THREE.Color();
    for (var i = 0; i < ep.count; i++) {
      var ex = ep.getX(i), ey = ep.getY(i), ez = ep.getZ(i);
      var hue = Math.atan2(ez, ex) / (2 * Math.PI) + 0.5 + ey * 0.03;
      hue = ((hue % 1) + 1) % 1;
      tc.setHSL(hue, 0.6, 0.5 + 0.2 * Math.sin(ey * 0.7 + ex * 0.4));
      cols.push(tc.r, tc.g, tc.b);
    }
    envGeo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    envScene.add(new THREE.Mesh(envGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
    var envTex = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = envTex;

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    var keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    var rim = new THREE.PointLight(neon, 3, 0, 0);
    rim.position.set(-2.5, 1.2, 2);
    scene.add(rim);

    var pearly = palKey === "abalone" || skin === "pearl";
    var shell = new THREE.MeshPhysicalMaterial({
      color: pearly ? pal[2] : pal[1], metalness: pearly ? 0.55 : 0.3, roughness: 0.22,
      clearcoat: 1, clearcoatRoughness: 0.12,
      iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [120, 820]
    });
    if (skin === "glass") {
      shell.transmission = 0.92;
      shell.thickness = 0.9;
      shell.roughness = 0.06;
      shell.metalness = 0;
      shell.ior = 1.45;
      shell.color = new THREE.Color(pal[2]);
    }
    var abalone = new THREE.MeshPhysicalMaterial({
      color: 0xdfeee9, metalness: 0.85, roughness: 0.16,
      iridescence: 1, iridescenceIOR: 1.7, iridescenceThicknessRange: [200, 950]
    });
    var accentMat = new THREE.MeshPhysicalMaterial({
      color: pal[3], metalness: 0.25, roughness: 0.3, iridescence: 0.8, iridescenceIOR: 1.4,
      emissive: pal[3], emissiveIntensity: 0.12
    });
    var tech = new THREE.MeshStandardMaterial({ color: pal[0], metalness: 0.9, roughness: 0.32 });
    var glowMat = new THREE.MeshBasicMaterial({ color: neon });
    var eyeMat = new THREE.MeshPhysicalMaterial({ color: 0x07070c, roughness: 0.05, clearcoat: 1 });
    var wireMat = new THREE.LineBasicMaterial({ color: pal[3], transparent: true, opacity: 0.55 });

    var amp = stage === 0 ? 0.03 : 0.05 + stage * 0.03;
    var hf = (skin === "scales" || skin === "serpent") ? 0.035 : skin === "pearl" ? 0 : 0.012;
    function warp(v, extra) {
      var th = Math.atan2(v.z, v.x), y = v.y;
      var d = 1 + amp * Math.sin(5 * th + 3 * y) * Math.cos(4 * y) + (extra || 0);
      v.multiplyScalar(d);
      if (stage === 0) { v.y *= 1.32; var k = 1 - 0.17 * v.y; v.x *= k; v.z *= k; } else { v.y *= 0.92; }
      return v;
    }
    function shape(g, grow, bumps) {
      var pa = g.attributes.position, v = new THREE.Vector3();
      for (var i = 0; i < pa.count; i++) {
        v.fromBufferAttribute(pa, i).normalize();
        var th = Math.atan2(v.z, v.x);
        var b = bumps ? hf * Math.sin(26 * th) * Math.sin(20 * v.y) : 0;
        warp(v, b);
        v.multiplyScalar(grow);
        pa.setXYZ(i, v.x, v.y, v.z);
      }
      g.computeVertexNormals();
      return g;
    }
    function surf(dir, extra) { return warp(dir.clone().normalize(), extra); }

    var group = new THREE.Group();
    group.scale.setScalar([1, 0.95, 0.9, 0.85][stage]);
    scene.add(group);
    group.add(new THREE.Mesh(shape(new THREE.SphereGeometry(1, 160, 120), 1, true), shell));
    var wire = new THREE.LineSegments(new THREE.WireframeGeometry(shape(new THREE.IcosahedronGeometry(1, 3), 1.05, false)), wireMat);
    group.add(wire);

    function tube(points, rad, mat) {
      var curve = new THREE.CatmullRomCurve3(points), seg = 48, rs = 8;
      var tg = new THREE.TubeGeometry(curve, seg, rad, rs, false);
      var pa = tg.attributes.position, c0 = new THREE.Vector3(), q = new THREE.Vector3();
      for (var i = 0; i <= seg; i++) {
        curve.getPointAt(i / seg, c0);
        var f = 1 - 0.8 * (i / seg);
        for (var j = 0; j <= rs; j++) {
          var idx = i * (rs + 1) + j;
          q.fromBufferAttribute(pa, idx).sub(c0).multiplyScalar(f).add(c0);
          pa.setXYZ(idx, q.x, q.y, q.z);
        }
      }
      tg.computeVertexNormals();
      return { mesh: new THREE.Mesh(tg, mat), curve: curve };
    }
    function fib(n, y0, y1) {
      var out = [];
      for (var i = 0; i < n; i++) {
        var y = y0 + (y1 - y0) * (i + 0.5) / n, r = Math.sqrt(1 - y * y), a = i * 2.39996 + 0.7;
        out.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
      }
      return out;
    }
    function facing(obj, at) { obj.position.copy(at); obj.lookAt(at.clone().multiplyScalar(2)); }

    function numeral(n, at, scale) {
      var g = new THREE.Group();
      mayaShapes(n).forEach(function (s) {
        var m;
        if (s.t === "dot") { m = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12), abalone); }
        else if (s.t === "bar") { m = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.1, 0.7), abalone); }
        else { m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), abalone); m.scale.set(2.6, 1.2, 0.5); }
        m.position.set(s.x, -s.y, 0.4);
        g.add(m);
      });
      var box = new THREE.Box3().setFromObject(g), sz = new THREE.Vector3(), ctr = new THREE.Vector3();
      box.getSize(sz);
      box.getCenter(ctr);
      var plate = new THREE.Mesh(new THREE.BoxGeometry(sz.x + 2.4, sz.y + 2.4, 0.4), tech);
      plate.position.set(ctr.x, ctr.y, 0);
      g.add(plate);
      g.scale.setScalar(scale);
      facing(g, at);
      group.add(g);
    }
    function letter(ch, at) {
      var cv = document.createElement("canvas");
      cv.width = cv.height = 128;
      var x = cv.getContext("2d");
      var gr = x.createLinearGradient(0, 0, 128, 128);
      ["#46c2b4", "#8f7fd1", "#e8a3cf", "#9fe3c4", "#3a8fc1"].forEach(function (c, i) { gr.addColorStop(i / 4, c); });
      x.font = "bold 100px Georgia, serif";
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.lineWidth = 6;
      x.strokeStyle = "rgba(0,0,0,.6)";
      x.strokeText(ch, 64, 70);
      x.fillStyle = gr;
      x.fillText(ch, 64, 70);
      var tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      var m = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.45), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
      facing(m, at);
      group.add(m);
    }

    var sway = [];
    function tendril(dir, len, rad, seed, plumes) {
      var n = dir.clone().normalize();
      var side = new THREE.Vector3().crossVectors(n, UP);
      if (side.lengthSq() < 0.01) { side.set(1, 0, 0); }
      side.normalize();
      var pts = [];
      for (var k = 0; k <= 5; k++) {
        var f = k / 5;
        pts.push(n.clone().multiplyScalar(len * f)
          .add(side.clone().multiplyScalar(Math.sin(f * 3 + seed) * 0.18 * f))
          .add(new THREE.Vector3(0, len * 0.35 * f * f, 0)));
      }
      var t = tube(pts, rad, accentMat), g = new THREE.Group();
      g.position.copy(surf(dir, -0.04));
      g.add(t.mesh);
      var tip = new THREE.Mesh(new THREE.SphereGeometry(rad * 1.6, 12, 10), glowMat);
      tip.position.copy(t.curve.getPointAt(1));
      g.add(tip);
      if (plumes) {
        [0.55, 0.85].forEach(function (u) {
          var pl = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), abalone);
          pl.scale.set(0.06, 0.24, 0.015);
          pl.position.copy(t.curve.getPointAt(u));
          pl.quaternion.setFromUnitVectors(UP, t.curve.getTangentAt(u));
          g.add(pl);
        });
      }
      group.add(g);
      sway.push(g);
    }
    function spikes(n, h) {
      fib(n, 0.05, 0.95).forEach(function (d) {
        if (d.z > 0.7) { return; }
        var nrm = d.clone().normalize();
        var cone = new THREE.Mesh(new THREE.ConeGeometry(0.065, h, 14), accentMat);
        cone.position.copy(surf(d, 0).add(nrm.clone().multiplyScalar(h / 2 - 0.03)));
        cone.quaternion.setFromUnitVectors(UP, nrm);
        group.add(cone);
      });
    }
    function tail() {
      var pts = [[0.2, -0.7, -0.75], [0.9, -0.95, -0.5], [1.35, -0.6, 0.05], [1.25, -0.05, 0.4], [1.45, 0.35, 0.15]]
        .map(function (a) { return new THREE.Vector3(a[0], a[1], a[2]); });
      var t = tube(pts, 0.14, accentMat);
      group.add(t.mesh);
      var tip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), glowMat);
      tip.position.copy(t.curve.getPointAt(1));
      group.add(tip);
    }

    var orbit = new THREE.Group();
    orbit.rotation.x = 0.35;
    group.add(orbit);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.008, 6, 160), abalone);
    ring.rotation.x = Math.PI / 2;
    orbit.add(ring);
    var pieces = 3 + stage * 3;
    for (var p = 0; p < pieces; p++) {
      var a = (p / pieces) * Math.PI * 2, piece;
      if (p % 3 === 0) { piece = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.11), tech); }
      else if (p % 3 === 1) { piece = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), abalone); }
      else { piece = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), glowMat); }
      piece.position.set(Math.cos(a) * 1.6, 0, Math.sin(a) * 1.6);
      piece.rotation.set(a, a * 2, 0);
      orbit.add(piece);
    }
    var orbit2 = null;
    if (stage >= 3) {
      orbit2 = new THREE.Group();
      orbit2.rotation.z = 0.6;
      var ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.006, 6, 160), abalone);
      ring2.rotation.x = Math.PI / 2;
      orbit2.add(ring2);
      group.add(orbit2);
    }

    if (skin === "glass") {
      group.add(new THREE.Mesh(new THREE.SphereGeometry(stage === 0 ? 0.35 : 0.42, 24, 18), glowMat));
    }

    if (stage === 0) {
      numeral(C.eggNumber({ type: type, palette: palKey }), surf(new THREE.Vector3(0, 0.05, 1), 0.03), 0.055);
      if (prog > 0.6) {
        var seam = surf(new THREE.Vector3(1, 0.27, 0), 0);
        var crack = new THREE.Mesh(new THREE.TorusGeometry(seam.x + 0.01, 0.015, 8, 120), glowMat);
        crack.rotation.x = Math.PI / 2;
        crack.position.y = seam.y;
        group.add(crack);
      }
    } else {
      [-1, 1].forEach(function (s) {
        var d = new THREE.Vector3(s * 0.33, 0.25, 0.9).normalize();
        var at = surf(d, 0);
        var eye = new THREE.Mesh(new THREE.SphereGeometry(0.13 + stage * 0.01, 20, 16), eyeMat);
        eye.position.copy(at);
        group.add(eye);
        var iris = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 12), glowMat);
        iris.position.copy(at.clone().add(d.clone().multiplyScalar(0.1)));
        group.add(iris);
      });
      var count = [0, 4, 6, 9][stage], len = 0.45 + stage * 0.18;
      if (skin === "feathers" || skin === "serpent") {
        fib(skin === "serpent" ? count - 1 : count, 0.35, 0.95).forEach(function (d, i) { tendril(d, len, 0.045, i, true); });
      }
      if (skin === "glass") {
        fib(count - 1, 0.4, 0.95).forEach(function (d, i) { tendril(d, len * 1.1, 0.022, i, false); });
      }
      if (skin === "scales" || skin === "serpent") { spikes(skin === "scales" ? 6 + stage * 4 : 4 + stage * 2, 0.22 + stage * 0.06); }
      if ((skin === "scales" || skin === "serpent") && stage >= 2) { tail(); }
      if (skin === "pearl") {
        for (var b = 0; b < 32; b++) {
          var ang = (b / 32) * Math.PI * 2, hgt = b % 2 ? 0.16 : 0.08;
          var step = new THREE.Mesh(new THREE.BoxGeometry(0.1, hgt, 0.06), abalone);
          step.position.set(Math.cos(ang) * 1.08, 0, Math.sin(ang) * 1.08);
          step.rotation.y = -ang;
          group.add(step);
        }
        if (stage >= 2) {
          [-1, 1].forEach(function (s) {
            var flare = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.05, 12, 32), abalone);
            flare.position.set(s * 1.03, 0.18, 0);
            flare.rotation.y = Math.PI / 2;
            group.add(flare);
          });
        }
      }
      var chest = surf(new THREE.Vector3(0, -0.3, 0.95), 0.04);
      if (stage === 2) { numeral(C.eggNumber({ type: type, palette: palKey }), chest, 0.045); }
      if (stage >= 3) {
        letter((String(pet.name || "?").trim().charAt(0) || "?").toUpperCase(), chest);
        var halo = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.035, 12, 80), abalone);
        halo.rotation.x = Math.PI / 2;
        halo.position.y = 1.45;
        group.add(halo);
      }
    }

    var cv = renderer.domElement, dragging = false, lastX = 0, spin = 0, raf = 0;
    cv.style.touchAction = "pan-y";
    cv.style.cursor = "grab";
    cv.style.display = "block";
    cv.addEventListener("pointerdown", function (e) {
      dragging = true;
      lastX = e.clientX;
      try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    });
    cv.addEventListener("pointermove", function (e) {
      if (dragging) { spin += (e.clientX - lastX) * 0.01; lastX = e.clientX; }
    });
    cv.addEventListener("pointerup", function () { dragging = false; });
    cv.addEventListener("pointercancel", function () { dragging = false; });

    var clock = new THREE.Clock();
    function frame() {
      raf = requestAnimationFrame(frame);
      var t = clock.getElapsedTime();
      group.rotation.y = spin + t * 0.35;
      group.position.y = Math.sin(t * 1.4) * 0.05;
      orbit.rotation.y = t * 0.6;
      if (orbit2) { orbit2.rotation.y = -t * 0.4; }
      wireMat.color.setHSL((t * 0.05) % 1, 0.7, 0.62);
      sway.forEach(function (g, i) {
        g.rotation.z = Math.sin(t * 1.3 + i) * 0.08;
        g.rotation.x = Math.cos(t * 1.1 + i * 0.7) * 0.06;
      });
      renderer.render(scene, camera);
    }
    frame();
    el.innerHTML = "";
    el.appendChild(cv);

    return function () {
      cancelAnimationFrame(raf);
      [scene, envScene].forEach(function (sc) {
        sc.traverse(function (o) {
          if (o.geometry) { o.geometry.dispose(); }
          if (o.material) {
            (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) {
              if (m.map) { m.map.dispose(); }
              m.dispose();
            });
          }
        });
      });
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (cv.parentNode) { cv.parentNode.removeChild(cv); }
    };
  }

  function mount(el, pet, size) {
    var state = { dead: false, kill: null };
    state.dispose = function () {
      state.dead = true;
      if (state.kill) { state.kill(); state.kill = null; }
    };
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.innerHTML = window.Creature.svg(pet, size);
    if (!webgl()) { return state; }
    three().then(function (THREE) {
      if (state.dead || !el.isConnected) { return; }
      try { state.kill = build(THREE, el, pet, size); }
      catch (e) { if (window.console) { console.warn("3D view failed, showing 2D art", e); } }
    }).catch(function () {});
    return state;
  }

  window.Creature3D = { mount: mount };
})();
