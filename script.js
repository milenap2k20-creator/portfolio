(() => {
  const doc = document.documentElement;

  /* --- Reveal on scroll --- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el, i) => {
      // small stagger for siblings that enter together
      const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains("reveal")) : [];
      const idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = `${Math.min(idx, 4) * 80}ms`;
      io.observe(el);
    });
  } else {
    doc.classList.add("no-js");
  }

  /* --- Nav border on scroll --- */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- Active section in nav --- */
  const links = [...document.querySelectorAll(".nav__links a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => s && spy.observe(s));
  }

  /* --- Mobile menu --- */
  const burger = document.querySelector(".burger");
  const menu = document.getElementById("mobile-menu");
  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  window.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
  window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => e.matches && setMenu(false));

  /* --- Local clock & year --- */
  const clock = document.querySelector("[data-clock]");
  const tick = () => {
    const d = new Date();
    const off = -d.getTimezoneOffset() / 60;
    clock.textContent = `${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })} GMT${off >= 0 ? "+" : ""}${off}`;
  };
  if (clock) { tick(); setInterval(tick, 30000); }
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
