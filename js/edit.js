(function () {
  if (!new URLSearchParams(location.search).has("edit")) return;

  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "css/edit.css?v=6";
  document.head.appendChild(style);

  const heroImg = document.querySelector(".hero-photo");
  const aboutImg = document.querySelector(".grad-band img");

  function makeCrop(img) {
    if (!img) return null;
    const frame = img.parentElement;
    const src = img.currentSrc || img.src;
    img.style.setProperty("display", "none", "important");
    frame.style.setProperty("position", "relative", "important");
    frame.style.setProperty("overflow", "hidden", "important");
    frame.style.setProperty("background-image", "url(" + src + ")", "important");
    frame.style.setProperty("background-repeat", "no-repeat", "important");
    frame.style.setProperty("background-size", "cover", "important");
    frame.style.setProperty("background-position", "50% 50%", "important");
    return frame;
  }

  const heroFrame = makeCrop(heroImg);
  const aboutFrame = makeCrop(aboutImg);

  const state = {
    hero: { x: 50, y: 55, crop: 100, size: 100 },
    about: { x: 70, y: 40, crop: 100, size: 100 }
  };

  function apply(frame, v) {
    if (!frame) return;
    // Crop zoom changes what part of the photo is visible. Size zoom changes the frame itself.
    frame.style.setProperty("background-size", v.crop + "% auto", "important");
    frame.style.setProperty("background-position", v.x + "% " + v.y + "%", "important");
    frame.style.setProperty("transform", "scale(" + (v.size / 100) + ")", "important");
    frame.style.setProperty("transform-origin", "center center", "important");
  }

  function vals(name, v) {
    return name + ":\nbackground-size: " + v.crop + "% auto;\nbackground-position: " + v.x + "% " + v.y + "%;\nframe-scale: " + (v.size / 100).toFixed(2) + ";";
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
      <label>Size zoom (frame changes) <span id="hsize">100</span>%</label>
      <input type="range" id="hsize-s" min="70" max="140" value="100" />
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
      <label>Size zoom (frame changes) <span id="asize">100</span>%</label>
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
    apply(heroFrame, state.hero);
    apply(aboutFrame, state.about);
    document.getElementById("hx").textContent = state.hero.x;
    document.getElementById("hy").textContent = state.hero.y;
    document.getElementById("hcrop").textContent = state.hero.crop;
    document.getElementById("hsize").textContent = state.hero.size;
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
    state.hero = { x: 50, y: 55, crop: 100, size: 100 };
    state.about = { x: 70, y: 40, crop: 100, size: 100 };
    document.getElementById("hx-s").value = 50;
    document.getElementById("hy-s").value = 55;
    document.getElementById("hcrop-s").value = 100;
    document.getElementById("hsize-s").value = 100;
    document.getElementById("ax-s").value = 70;
    document.getElementById("ay-s").value = 40;
    document.getElementById("acrop-s").value = 100;
    document.getElementById("asize-s").value = 100;
    refresh();
  });

  refresh();
})();
