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
        <a href="${IG}" target="_blank" rel="noreferrer">Instagram</a>
      </nav>
      <button class="menu-btn" type="button" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </header>
  <div class="mobile-nav" hidden>
    <nav>
      <a href="index.html">Home</a>
      <a href="#book">Book</a>
      <a href="#reviews">Reviews</a>
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
        <p>Osteopathy in Gravesend, Meopham and Eltham.</p>
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
  } else {
    nav.removeAttribute("hidden");
    document.body.classList.add("menu-open");
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    nav.setAttribute("hidden", "");
    document.body.classList.remove("menu-open");
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

(function scrub() {
  const track = document.querySelector(".scrub");
  const video = document.querySelector(".scrub-video");
  if (!track || !video) return;
  video.muted = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  const arm = () => {
    video.muted = true;
    const play = video.play();
    if (play && play.then) play.then(() => video.pause()).catch(() => {});
  };
  video.addEventListener("loadeddata", arm, { once: true });
  window.addEventListener("touchstart", arm, { passive: true });
  window.addEventListener("click", arm);
  video.addEventListener("ended", () => {
    video.pause();
    if (video.duration) video.currentTime = Math.max(video.duration * 0.9, 0);
    arm();
  });
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) arm(); });
  }, { threshold: 0.2 });
  seen.observe(track);
  let ticking = false;
  const update = () => {
    ticking = false;
    if (!video.duration) return;
    if (video.ended) arm();
    const rect = track.getBoundingClientRect();
    const run = track.offsetHeight - window.innerHeight;
    if (run <= 0) return;
    const scrolled = Math.min(Math.max(-rect.top, 0), run);
    const t = (scrolled / run) * Math.max(video.duration * 0.92, 0);
    if (Math.abs(video.currentTime - t) > 0.03) {
      try { video.currentTime = t; } catch (e) {}
    }
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  video.addEventListener("loadedmetadata", update);
})();
