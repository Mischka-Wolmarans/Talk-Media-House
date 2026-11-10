/* Retains the original main.js smooth scroll, active links, footer year,
   700ms ease-out reveal timing and smart mobile header behaviour. */
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const panel = document.getElementById("menu-panel");
  const toggles = document.querySelectorAll(".menu-toggle");
  let activeToggle = null;
  const closeButton = document.querySelector(".menu-close");
  const scrim = document.querySelector(".nav-scrim");
  const main = document.querySelector("main");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(max-width: 900px)");

  function sync() {
    const open = body.classList.contains("mobile-nav-active");
    panel.inert = !open;
    main.inert = open && mobile.matches;
    toggles.forEach((toggle) => {
      toggle.querySelector(".menu-caption").textContent = open ? "CLOSE" : "MENU";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });

    if (open) {
      document
        .querySelector(".mobile-header")
        .classList.remove("mobile-header--hidden");
    }
  }

  function close() {
    body.classList.remove("mobile-nav-active");
    sync();
    (activeToggle || toggles[0]).focus();
  }

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      activeToggle = toggle;
      sync();
      if (body.classList.contains("mobile-nav-active")) panel.querySelector("a").focus();
    });
  });

  closeButton.addEventListener("click", close);

  scrim.addEventListener("click", close);

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && body.classList.contains("mobile-nav-active")) {
        event.preventDefault();
        close();
      }
    },
    true,
  );

  document.querySelectorAll("#navbar a").forEach((link) => {
    link.addEventListener("click", () => {
      sync();

      // Re-align after the page expands back and section heights settle.
      if (!mobile.matches) {
        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
          setTimeout(
            () =>
              target.scrollIntoView({
                behavior: reduced.matches ? "auto" : "smooth",
                block: "start",
              }),
            reduced.matches ? 0 : 570,
          );
        }
      }
    });
  });

  mobile.addEventListener("change", sync);

  document.addEventListener("keydown", (event) => {
    if (!body.classList.contains("mobile-nav-active")) {
      sync();
      return;
    }

    if (event.key === "Escape") {
      close();
      return;
    }

    if (event.key === "Tab" && mobile.matches) {
      const focusableItems = [activeToggle || toggles[0], ...panel.querySelectorAll("a[href],button")];
      const activeIndex = focusableItems.indexOf(document.activeElement);

      if (event.shiftKey && activeIndex <= 0) {
        event.preventDefault();
        focusableItems.at(-1).focus();
      } else if (
        !event.shiftKey &&
        (activeIndex === focusableItems.length - 1 || activeIndex === -1)
      ) {
        event.preventDefault();
        (activeToggle || toggles[0]).focus();
      }
    }
  });

  const config = window.TALK_CONFIG || {};
  const number = String(config.whatsappNumber || "").replace(/\D/g, "");

  if (/^[1-9]\d{7,14}$/.test(number)) {
    document.querySelectorAll("[data-whatsapp]").forEach((link) => {
      link.href =
        "https://wa.me/" +
        number +
        "?text=" +
        encodeURIComponent(config.whatsappMessage || "Hi TALK!");
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    document.getElementById("contact-status").hidden = true;
  } else {
    document.querySelectorAll("[data-whatsapp]").forEach((link) => {
      link.addEventListener("click", () => {
        if (body.classList.contains("mobile-nav-active")) {
          close();
        }

        document.getElementById("contact-status").hidden = false;
      });
    });
  }

  if (config.portfolioUrl && /^https:\/\//.test(config.portfolioUrl)) {
    document.querySelector("[data-portfolio]").href = config.portfolioUrl;
  }

  // AOS-compatible local fallback; uploaded vendor files were not supplied.
  if (
    typeof AOS === "undefined" &&
    "IntersectionObserver" in window &&
    !reduced.matches
  ) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );

    document.documentElement.classList.add("js-reveal");
    document.querySelectorAll("[data-aos]").forEach((element) => {
      element.style.setProperty(
        "--reveal-delay",
        (Number(element.dataset.aosDelay) || 0) + "ms",
      );
      observer.observe(element);
    });
  }

  sync();
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".service-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      const detail = document.getElementById(button.getAttribute("aria-controls"));
      detail.hidden = expanded;
      button.querySelector("small").textContent = expanded ? "VIEW MORE" : "VIEW LESS";
    });
  });
  document.querySelectorAll('.intro-grid a[href^="#service-"]').forEach((link) => {
    link.addEventListener("click", () => {
      const service = document.querySelector(link.getAttribute("href"));
      const button = service?.querySelector(".service-toggle");
      if (!button) return;
      const detail = document.getElementById(button.getAttribute("aria-controls"));
      button.setAttribute("aria-expanded", "true");
      if (detail) detail.hidden = false;
      const label = button.querySelector("small");
      if (label) label.textContent = "VIEW LESS";
    });
  });
  const projectMobile = matchMedia("(max-width: 900px)");
  const projectCards = [...document.querySelectorAll(".portfolio-tile")];
  const setProjectExpanded = (card, expanded) => {
    card.classList.toggle("is-expanded", expanded);
    card.setAttribute("aria-expanded", String(expanded));
    card.querySelector(".portfolio-caption")?.setAttribute(
      "aria-hidden",
      String(projectMobile.matches && !expanded),
    );
  };
  projectCards.forEach((card) => {
    setProjectExpanded(card, false);
    card.addEventListener("click", () => {
      if (!projectMobile.matches) return;
      const expanded = card.getAttribute("aria-expanded") !== "true";
      projectCards.forEach((otherCard) => setProjectExpanded(otherCard, false));
      setProjectExpanded(card, expanded);
    });
    card.addEventListener("keydown", (event) => {
      if (!projectMobile.matches || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      card.click();
    });
  });
  projectMobile.addEventListener("change", () => {
    projectCards.forEach((card) => setProjectExpanded(card, false));
  });
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
