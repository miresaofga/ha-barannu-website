(() => {
  const header = document.getElementById("site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = [...document.querySelectorAll(".primary-nav a")];
  const sectionLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]:not(.nav-cta)')];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setNav = (open) => {
    header.classList.toggle("nav-open", open);
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.querySelector(".nav-toggle-label").textContent = open ? "Close" : "Menu";
  };

  navToggle.addEventListener("click", () => {
    setNav(!header.classList.contains("nav-open"));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setNav(false));
  });

  document.addEventListener("click", (event) => {
    if (header.classList.contains("nav-open") && !header.contains(event.target)) {
      setNav(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("nav-open")) {
      setNav(false);
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 940 && header.classList.contains("nav-open")) {
      setNav(false);
    }
  });

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const setActiveLink = (id) => {
    sectionLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const sections = [...document.querySelectorAll("main section[id]")];
  const updateActiveLink = () => {
    let current = "home";
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.38) {
        current = section.id;
      }
    }
    setActiveLink(current);
  };
  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });

  const revealItems = [...document.querySelectorAll(".reveal")];
  revealItems.forEach((item) => {
    const delay = item.dataset.delay;
    if (delay) item.style.setProperty("--delay", `${delay}ms`);
  });

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -9% 0px", threshold: 0.06 }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
