const IG = "https://www.instagram.com/mjtherapies/";

const page = location.pathname.split("/").pop() || "index.html";

document.getElementById("site-header").innerHTML = `
  <div class="preview-banner">Preview mockup by <a href="https://halfpennydigital.co.uk/">Halfpenny Digital</a> — not the live site yet</div>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="index.html">
        <img src="photos/logo.jpg" alt="" />
        <span>MJ <em>Therapies</em></span>
      </a>
      <nav class="desk-nav">
        <a href="index.html" class="${page === "index.html" ? "active" : ""}">Home</a>
        <a href="#book">Book</a>
        <a href="#reviews">Reviews</a>
        <a href="#about">About</a>
        <a href="${IG}" target="_blank" rel="noreferrer">Instagram</a>
      </nav>
      <button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </header>
  <div class="mobile-nav" hidden>
    <nav>
      <a href="index.html">Home</a>
      <a href="#book">Book</a>
      <a href="#reviews">Reviews</a>
      <a href="#about">About</a>
      <a href="${IG}" target="_blank" rel="noreferrer">Instagram</a>
    </nav>
  </div>
  <div class="mobile-cta">
    <a class="btn" href="#book">Book</a>
    <a class="btn ghost" href="${IG}" target="_blank" rel="noreferrer">Instagram</a>
  </div>
`;

document.getElementById("site-footer").innerHTML = `
  <footer>
    <div class="wrap footer-grid">
      <div>
        <p class="foot-name">MJ Therapies</p>
        <p>Osteopathy with Morgan. Gravesend, Meopham and Eltham.</p>
      </div>
      <div>
        <p><a href="#book">Book a clinic</a></p>
        <p><a href="${IG}" target="_blank" rel="noreferrer">Instagram</a></p>
      </div>
      <div>
        <p>Gravesend · ANA Therapies</p>
        <p>Meopham · ANA Therapies</p>
        <p>Eltham · Moreno Osteopathy</p>
      </div>
    </div>
    <div class="wrap credit">Website built by <a href="https://halfpennydigital.co.uk/">Halfpenny Digital</a></div>
  </footer>
`;

const btn = document.querySelector(".menu-btn");
const nav = document.querySelector(".mobile-nav");
btn.addEventListener("click", () => {
  const open = !nav.hasAttribute("hidden");
  if (open) {
    nav.setAttribute("hidden", "");
    document.body.classList.remove("menu-open");
    btn.setAttribute("aria-label", "Menu");
    btn.setAttribute("aria-expanded", "false");
  } else {
    nav.removeAttribute("hidden");
    document.body.classList.add("menu-open");
    btn.setAttribute("aria-label", "Close");
    btn.setAttribute("aria-expanded", "true");
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    nav.setAttribute("hidden", "");
    document.body.classList.remove("menu-open");
    btn.setAttribute("aria-label", "Menu");
    btn.setAttribute("aria-expanded", "false");
  });
});

(function dockAfterHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const sync = () => {
    if (window.innerWidth > 819) {
      document.body.classList.remove("dock-on");
      return;
    }
    const bottom = hero.getBoundingClientRect().bottom;
    if (bottom < 90) document.body.classList.add("dock-on");
    else document.body.classList.remove("dock-on");
  };
  window.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  sync();
})();

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduce) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  document.querySelectorAll("[data-stagger]").forEach((parent) => {
    [...parent.children].forEach((child, i) => {
      child.classList.add("reveal");
      child.style.transitionDelay = `${80 + i * 90}ms`;
      io.observe(child);
    });
  });
} else {
  document.querySelectorAll(".reveal, [data-stagger] > *").forEach((el) => el.classList.add("is-in"));
}

(function compare() {
  const box = document.getElementById("compare-box");
  const before = document.getElementById("compare-before");
  const handle = document.getElementById("compare-handle");
  if (!box || !before || !handle) return;
  const beforeImg = before.querySelector("img");
  const fit = () => { beforeImg.style.width = box.offsetWidth + "px"; };
  const setSplit = (clientX) => {
    const rect = box.getBoundingClientRect();
    const p = Math.min(0.96, Math.max(0.04, (clientX - rect.left) / rect.width));
    const pct = (p * 100) + "%";
    before.style.width = pct;
    handle.style.left = pct;
  };
  fit();
  window.addEventListener("resize", fit);
  handle.addEventListener("pointerdown", (e) => {
    handle.setPointerCapture(e.pointerId);
    setSplit(e.clientX);
  });
  handle.addEventListener("pointermove", (e) => {
    if (handle.hasPointerCapture(e.pointerId)) setSplit(e.clientX);
  });
  box.addEventListener("pointerdown", (e) => {
    if (e.target === handle) return;
    box.setPointerCapture(e.pointerId);
    setSplit(e.clientX);
  });
  box.addEventListener("pointermove", (e) => {
    if (box.hasPointerCapture(e.pointerId)) setSplit(e.clientX);
  });
})();
