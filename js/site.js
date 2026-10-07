const IG = "https://www.instagram.com/mjtherapies/";

document.documentElement.classList.add("js");

document.getElementById("site-header").innerHTML = `
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="#about">
        <img src="photos/logo.jpg" alt="" />
        <span>
          <span class="brand-name">MJ Therapies</span>
          <span class="brand-sub">Osteopathy</span>
        </span>
      </a>
      <nav class="desk-nav">
        <a href="#about">About</a>
        <a href="#help">Treatment</a>
        <a href="#book">Book</a>
        <a href="#reviews">Reviews</a>
        <a href="${IG}" target="_blank" rel="noreferrer">Instagram</a>
      </nav>
      <a class="btn header-book" href="#book">Book</a>
      <button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </header>
  <div class="mobile-nav" hidden>
    <nav>
      <a href="#about">About</a>
      <a href="#help">Treatment</a>
      <a href="#approach">How I work</a>
      <a href="#book">Book</a>
      <a href="#reviews">Reviews</a>
      <a href="${IG}" target="_blank" rel="noreferrer">Instagram</a>
    </nav>
  </div>
`;

document.getElementById("site-footer").innerHTML = `
  <footer>
    <div class="wrap footer-grid">
      <div>
        <p class="script foot-script">MJ Therapies</p>
        <p class="foot-sub">Osteopathy</p>
        <p>With Morgan. Gravesend, Meopham and Eltham.</p>
      </div>
      <div>
        <p><a href="#book">Book a clinic</a></p>
        <p><a href="#help">What I can help with</a></p>
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
    const p = Math.min(0.92, Math.max(0.08, (clientX - rect.left) / rect.width));
    const pct = (p * 100) + "%";
    before.style.width = pct;
    handle.style.left = pct;
    handle.setAttribute("aria-valuenow", String(Math.round(p * 100)));
  };
  fit();
  handle.setAttribute("role", "slider");
  handle.setAttribute("aria-valuemin", "8");
  handle.setAttribute("aria-valuemax", "92");
  handle.setAttribute("aria-valuenow", "50");
  window.addEventListener("resize", fit);
  handle.addEventListener("keydown", (e) => {
    const rect = box.getBoundingClientRect();
    const current = (parseFloat(before.style.width) || 50) / 100;
    if (e.key === "ArrowLeft") setSplit(rect.left + Math.max(0.08, current - 0.06) * rect.width);
    if (e.key === "ArrowRight") setSplit(rect.left + Math.min(0.92, current + 0.06) * rect.width);
  });
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
