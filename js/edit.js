(function () {
  if (!new URLSearchParams(location.search).has("edit")) return;

  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "css/edit.css?v=8";
  document.head.appendChild(style);

  const heroImg = document.querySelector(".hero-photo");
  const aboutImg = document.querySelector(".grad-band img");
  const heroFrameEl = document.querySelector(".hero-frame");

  function makeLayer(img) {
    if (!img) return null;
    const frame = img.parentElement;
    const src = img.currentSrc || img.src;
    img.style.setProperty("display", "none", "important");
    frame.style.setProperty("position", "relative", "important");
    frame.style.setProperty("overflow", "hidden", "important");

    const layer = document.createElement("div");
    layer.style.cssText = "position:absolute;inset:0;z-index:0;background-repeat:no-repeat;background-size:cover;background-position:50% 50%;pointer-events:none;";
    layer.style.backgroundImage = "url(" + src + ")";
    frame.insertBefore(layer, frame.firstChild);

    [...frame.children].forEach((child) => {
      if (child !== layer) {
        child.style.setProperty("position", "relative", "important");
        child.style.setProperty("z-index", "2", "important");
      }
    });

    return { frame, layer };
  }

  const hero = makeLayer(heroImg);
  const about = makeLayer(aboutImg);

  const state = {
    hero: { x: 50, y: 55, crop: 100, size: 100, fade: 54 },
    about: { x: 70, y: 40, crop: 100, size: 100 }
  };

  function apply(target, v) {
    if (!target) return;
    target.layer.style.setProperty("background-size", v.crop + "% auto", "important");
    target.layer.style.setProperty("background-position", v.x + "% " + v.y + "%", "important");
    target.layer.style.setProperty("transform", "scale(" + (v.size / 100) + ")", "important");
    target.layer.style.setProperty("transform-origin", "center center", "important");
  }

  function applyFade(pct) {
    if (!heroFrameEl) return;
    const solid = Math.max(0, pct - 26);
    const mid = Math.max(0, pct - 14);
    const end = pct;
    const css = "linear-gradient(90deg, #f6f3ee 0%, #f6f3ee " + solid + "%, rgba(246,243,238,0.55) " + mid + "%, rgba(246,243,238,0) " + end + "%)";
    // Override the existing ::before by injecting a style rule
    let tag = document.getElementById("edit-fade-style");
    if (!tag) {
      tag = document.createElement("style");
      tag.id = "edit-fade-style";
      document.head.appendChild(tag);
    }
    tag.textContent = ".hero-frame::before { background: " + css + " !important; }";
  }

  function vals(name, v) {
    let s = name + ":\nbackground-size: " + v.crop + "% auto;\nbackground-position: " + v.x + "% " + v.y + "%;\nphoto-scale: " + (v.size / 100).toFixed(2) + ";";
    if (v.fade !== undefined) s += "\nfade-end: " + v.fade + "%;";
    return s;
  }

  const panel = document.createElement("div");
  panel.className = "edit-panel";
  panel.innerHTML = `
    <div class="section">
      <h4>Hero</h4>
      <label>X (left ↔ right) <span id="hx">50</span></label>
      <input type="range" id="hx-s" min="0" max="100" value="50" />
      <label>Y (up ↕ down) <span id="hy">55</span></label>
      <input type="range" id="hy-s" min="0" max="100" value="55" />
      <label>Crop zoom (frame stays same) <span id="hcrop">100</span>%</label>
      <input type="range" id="hcrop-s" min="60" max="180" value="100" />
      <label>Size zoom (photo only) <span id="hsize">100</span>%</label>
      <input type="range" id="hsize-s" min="70" max="140" value="100" />
      <label>Fade (how far it reaches) <span id="hfade">54</span>%</label>
      <input type="range" id="hfade-s" min="30" max="90" value="54" />
      <div class="values" id="hero-vals"></div>
    </div>
    <div class="section">
      <h4>More about me</h4>
      <label>X (left ↔ right) <span id="ax">70</span></label>
      <input type="range" id="ax-s" min="0" max="100" value="70" />
      <label>Y (up ↕ down) <span id="ay">40</span></label>
      <input type="range" id="ay-s" min="0" max="100" value="40" />
      <label>Crop zoom (frame stays same) <span id="acrop">100</span>%</label>
      <input type="range" id="acrop-s" min="60" max="180" value="100" />
      <label>Size zoom (photo only) <span id="asize">100</span>%</label>
      <input type="range" id="asize-s" min="70" max="140" value="100" />
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
    applyFade(state.hero.fade);
    document.getElementById("hx").textContent = state.hero.x;
    document.getElementById("hy").textContent = state.hero.y;
    document.getElementById("hcrop").textContent = state.hero.crop;
    document.getElementById("hsize").textContent = state.hero.size;
    document.getElementById("hfade").textContent = state.hero.fade;
    document.getElementById("ax").textContent = state.about.x;
    document.getElementById("ay").textContent = state.about.y;
    document.getElementById("acrop").textContent = state.about.crop;
    document.getElementById("asize").textContent = state.about.size;
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
  bind("hcrop-s", "hero", "crop");
  bind("hsize-s", "hero", "size");
  bind("hfade-s", "hero", "fade");
  bind("ax-s", "about", "x");
  bind("ay-s", "about", "y");
  bind("acrop-s", "about", "crop");
  bind("asize-s", "about", "size");

  document.getElementById("copy-all").addEventListener("click", () => {
    const text = vals("HERO", state.hero) + "\n\n" + vals("ABOUT", state.about);
    navigator.clipboard.writeText(text).then(() => {
      document.getElementById("copy-all").textContent = "Copied";
      setTimeout(() => (document.getElementById("copy-all").textContent = "Copy both"), 1200);
    });
  });

  document.getElementById("reset").addEventListener("click", () => {
    state.hero = { x: 50, y: 55, crop: 100, size: 100, fade: 54 };
    state.about = { x: 70, y: 40, crop: 100, size: 100 };
    document.getElementById("hx-s").value = 50;
    document.getElementById("hy-s").value = 55;
    document.getElementById("hcrop-s").value = 100;
    document.getElementById("hsize-s").value = 100;
    document.getElementById("hfade-s").value = 54;
    document.getElementById("ax-s").value = 70;
    document.getElementById("ay-s").value = 40;
    document.getElementById("acrop-s").value = 100;
    document.getElementById("asize-s").value = 100;
    refresh();
  });

  refresh();
})();
