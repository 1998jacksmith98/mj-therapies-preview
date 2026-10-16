(function () {
  if (!new URLSearchParams(location.search).has("edit")) return;

  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "css/edit.css?v=1";
  document.head.appendChild(style);

  const hero = document.querySelector(".hero-photo");
  const about = document.querySelector(".grad-band img");

  const state = {
    hero: { x: 50, y: 40, s: 100 },
    about: { x: 70, y: 30, s: 100 }
  };

  function apply(el, v) {
    if (!el) return;
    el.style.objectPosition = v.x + "% " + v.y + "%";
    el.style.transform = "scale(" + (v.s / 100) + ")";
    el.style.transformOrigin = "center center";
  }

  function vals(name, v) {
    return name + ":\nobject-position: " + v.x + "% " + v.y + "%;\ntransform: scale(" + (v.s / 100).toFixed(2) + ");";
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
      <label>Zoom <span id="hs">100</span>%</label>
      <input type="range" id="hs-s" min="60" max="140" value="100" />
      <div class="values" id="hero-vals"></div>
    </div>
    <div class="section">
      <h4>More about me</h4>
      <label>X (left ↔ right) <span id="ax">70</span></label>
      <input type="range" id="ax-s" min="0" max="100" value="70" />
      <label>Y (up ↕ down) <span id="ay">30</span></label>
      <input type="range" id="ay-s" min="0" max="100" value="30" />
      <label>Zoom <span id="as">100</span>%</label>
      <input type="range" id="as-s" min="60" max="140" value="100" />
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
    document.getElementById("hs").textContent = state.hero.s;
    document.getElementById("ax").textContent = state.about.x;
    document.getElementById("ay").textContent = state.about.y;
    document.getElementById("as").textContent = state.about.s;
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
  bind("hs-s", "hero", "s");
  bind("ax-s", "about", "x");
  bind("ay-s", "about", "y");
  bind("as-s", "about", "s");

  document.getElementById("copy-all").addEventListener("click", () => {
    const text = vals("HERO", state.hero) + "\n\n" + vals("ABOUT", state.about);
    navigator.clipboard.writeText(text).then(() => {
      document.getElementById("copy-all").textContent = "Copied";
      setTimeout(() => (document.getElementById("copy-all").textContent = "Copy both"), 1200);
    });
  });

  document.getElementById("reset").addEventListener("click", () => {
    state.hero = { x: 50, y: 40, s: 100 };
    state.about = { x: 70, y: 30, s: 100 };
    document.getElementById("hx-s").value = 50;
    document.getElementById("hy-s").value = 40;
    document.getElementById("hs-s").value = 100;
    document.getElementById("ax-s").value = 70;
    document.getElementById("ay-s").value = 30;
    document.getElementById("as-s").value = 100;
    refresh();
  });

  refresh();
})();
