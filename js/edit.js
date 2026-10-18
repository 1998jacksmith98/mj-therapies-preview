(function () {
  if (!new URLSearchParams(location.search).has("edit")) return;

  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "css/edit.css?v=3";
  document.head.appendChild(style);

  const hero = document.querySelector(".hero-photo");
  const about = document.querySelector(".grad-band img");

  const state = {
    hero: { x: 50, y: 40, size: 100, crop: 100 },
    about: { x: 70, y: 30, size: 100, crop: 100 }
  };

  function apply(el, v) {
    if (!el) return;
    // Frame stays fixed. Size zoom scales the element. Crop zoom scales only the content inside the same box.
    el.style.setProperty("position", "absolute", "important");
    el.style.setProperty("width", v.size + "%", "important");
    el.style.setProperty("height", v.size + "%", "important");
    el.style.setProperty("left", "auto", "important");
    el.style.setProperty("right", "0", "important");
    el.style.setProperty("top", "0", "important");
    el.style.setProperty("object-fit", "cover", "important");
    el.style.setProperty("object-position", v.x + "% " + v.y + "%", "important");
    el.style.setProperty("transform", "scale(" + (v.crop / 100) + ")", "important");
    el.style.setProperty("transform-origin", v.x + "% " + v.y + "%", "important");
  }

  function vals(name, v) {
    return name + ":\nwidth: " + v.size + "%;\nheight: " + v.size + "%;\nobject-position: " + v.x + "% " + v.y + "%;\ntransform: scale(" + (v.crop / 100).toFixed(2) + ");\ntransform-origin: " + v.x + "% " + v.y + "%;";
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
      <label>Size zoom (pic gets bigger) <span id="hsize">100</span>%</label>
      <input type="range" id="hsize-s" min="60" max="140" value="100" />
      <label>Crop zoom (frame stays same) <span id="hcrop">100</span>%</label>
      <input type="range" id="hcrop-s" min="70" max="180" value="100" />
      <div class="values" id="hero-vals"></div>
    </div>
    <div class="section">
      <h4>More about me</h4>
      <label>X (left ↔ right) <span id="ax">70</span></label>
      <input type="range" id="ax-s" min="0" max="100" value="70" />
      <label>Y (up ↕ down) <span id="ay">30</span></label>
      <input type="range" id="ay-s" min="0" max="100" value="30" />
      <label>Size zoom (pic gets bigger) <span id="asize">100</span>%</label>
      <input type="range" id="asize-s" min="60" max="140" value="100" />
      <label>Crop zoom (frame stays same) <span id="acrop">100</span>%</label>
      <input type="range" id="acrop-s" min="70" max="180" value="100" />
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
    document.getElementById("hsize").textContent = state.hero.size;
    document.getElementById("hcrop").textContent = state.hero.crop;
    document.getElementById("ax").textContent = state.about.x;
    document.getElementById("ay").textContent = state.about.y;
    document.getElementById("asize").textContent = state.about.size;
    document.getElementById("acrop").textContent = state.about.crop;
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
  bind("hsize-s", "hero", "size");
  bind("hcrop-s", "hero", "crop");
  bind("ax-s", "about", "x");
  bind("ay-s", "about", "y");
  bind("asize-s", "about", "size");
  bind("acrop-s", "about", "crop");

  document.getElementById("copy-all").addEventListener("click", () => {
    const text = vals("HERO", state.hero) + "\n\n" + vals("ABOUT", state.about);
    navigator.clipboard.writeText(text).then(() => {
      document.getElementById("copy-all").textContent = "Copied";
      setTimeout(() => (document.getElementById("copy-all").textContent = "Copy both"), 1200);
    });
  });

  document.getElementById("reset").addEventListener("click", () => {
    state.hero = { x: 50, y: 40, size: 100, crop: 100 };
    state.about = { x: 70, y: 30, size: 100, crop: 100 };
    ["hx-s","hy-s","hsize-s","hcrop-s","ax-s","ay-s","asize-s","acrop-s"].forEach((id) => {
      const el = document.getElementById(id);
      if (id.includes("size") || id.includes("crop")) el.value = 100;
      else if (id.startsWith("h")) el.value = id.includes("x") ? 50 : 40;
      else el.value = id.includes("x") ? 70 : 30;
    });
    refresh();
  });

  refresh();
})();
