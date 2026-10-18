(function () {
  if (!new URLSearchParams(location.search).has("edit")) return;

  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "css/edit.css?v=2";
  document.head.appendChild(style);

  const hero = document.querySelector(".hero-photo");
  const about = document.querySelector(".grad-band img");

  const state = {
    hero: { x: 50, y: 40, s: 100, z: 100 },
    about: { x: 70, y: 30, s: 100, z: 100 }
  };

  function apply(el, v) {
    if (!el) return;
    el.style.setProperty("object-position", v.x + "% " + v.y + "%", "important");
    el.style.setProperty("transform", "scale(" + (v.z / 100) + ")", "important");
    el.style.setProperty("transform-origin", v.x + "% " + v.y + "%", "important");
    el.style.setProperty("scale", "1", "important");
    // keep the frame filled; s is unused for now but kept for compatibility
    el.style.setProperty("width", "100%", "important");
    el.style.setProperty("height", "100%", "important");
    el.style.setProperty("left", "0", "important");
    el.style.setProperty("right", "0", "important");
    el.style.setProperty("top", "0", "important");
  }

  function vals(name, v) {
    return name + ":\nobject-position: " + v.x + "% " + v.y + "%;\ntransform: scale(" + (v.z / 100).toFixed(2) + ");\ntransform-origin: " + v.x + "% " + v.y + "%;";
  }

  const panel = document.createElement("div");
  panel.className = "edit-panel";
  panel.innerHTML = `
    <div class="section">
      <h4>Hero</h4>
      <label>X (left ↔ right) <span id="hx">50</span></label>
      <input type="range" id="hx-s" min="0" max="100" value="50" />
      <label>Y (up ↕ down) <span id="hy">40</span></label>
      <input type="range" id="hy-s" min="0" max="100" value="40" />
      <label>Zoom (frame stays) <span id="hz">100</span>%</label>
      <input type="range" id="hz-s" min="70" max="160" value="100" />
      <div class="values" id="hero-vals"></div>
    </div>
    <div class="section">
      <h4>More about me</h4>
      <label>X (left ↔ right) <span id="ax">70</span></label>
      <input type="range" id="ax-s" min="0" max="100" value="70" />
      <label>Y (up ↕ down) <span id="ay">30</span></label>
      <input type="range" id="ay-s" min="0" max="100" value="30" />
      <label>Zoom (frame stays) <span id="az">100</span>%</label>
      <input type="range" id="az-s" min="70" max="160" value="100" />
      <div class="values" id="about-vals"></div>
    </div>
    <div class="row">
      <button type="button" id="copy-all">Copy both</button>
      <button type="button" class="ghost" id="reset">Reset</button>
    </div>
  `;
  document.body.appendChild(panel);

  function refresh() {
    apply(hero, state.hero);
    apply(about, state.about);
    document.getElementById("hx").textContent = state.hero.x;
    document.getElementById("hy").textContent = state.hero.y;
    document.getElementById("hz").textContent = state.hero.z;
    document.getElementById("ax").textContent = state.about.x;
    document.getElementById("ay").textContent = state.about.y;
    document.getElementById("az").textContent = state.about.z;
    document.getElementById("hero-vals").textContent = vals("HERO", state.hero);
    document.getElementById("about-vals").textContent = vals("ABOUT", state.about);
  }

  function bind(id, key, prop) {
    document.getElementById(id).addEventListener("input", (e) => {
      state[key][prop] = +e.target.value;
      refresh();
    });
  }
  bind("hx-s", "hero", "x");
  bind("hy-s", "hero", "y");
  bind("hz-s", "hero", "z");
  bind("ax-s", "about", "x");
  bind("ay-s", "about", "y");
  bind("az-s", "about", "z");

  document.getElementById("copy-all").addEventListener("click", () => {
    const text = vals("HERO", state.hero) + "\n\n" + vals("ABOUT", state.about);
    navigator.clipboard.writeText(text).then(() => {
      document.getElementById("copy-all").textContent = "Copied";
      setTimeout(() => (document.getElementById("copy-all").textContent = "Copy both"), 1200);
    });
  });

  document.getElementById("reset").addEventListener("click", () => {
    state.hero = { x: 50, y: 40, s: 100, z: 100 };
    state.about = { x: 70, y: 30, s: 100, z: 100 };
    document.getElementById("hx-s").value = 50;
    document.getElementById("hy-s").value = 40;
    document.getElementById("hz-s").value = 100;
    document.getElementById("ax-s").value = 70;
    document.getElementById("ay-s").value = 30;
    document.getElementById("az-s").value = 100;
    refresh();
  });

  refresh();
})();
