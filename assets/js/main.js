/**
 * =========================================================
 * The Cutting Edge Carpenters
 * Main JavaScript
 * =========================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /*=======================================================
      Shared Elements
    =======================================================*/

  const body = document.body;

  const navToggles = document.querySelectorAll(".mobile-nav-toggle");

  const navClose = document.querySelector(".menu-close");

  const navLinks = document.querySelectorAll("#navbar .scrollto");

  const year = document.getElementById("year");

  const backToTop = document.querySelector(".back-to-top");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  /*=======================================================
      Mobile Navigation
    =======================================================*/

  const closeMobileNavigation = () => {
    if (!body.classList.contains("mobile-nav-active")) {
      return;
    }

    body.classList.remove("mobile-nav-active");

    navToggles.forEach((navToggle) => {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    });
  };

  navToggles.forEach((navToggle) => {
    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("mobile-nav-active");

      navToggles.forEach((toggle) => {
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      });
    });
  });

  if (navClose) {
    navClose.addEventListener("click", closeMobileNavigation);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNavigation);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileNavigation();
    }
  });

  /*=======================================================
  Smart Mobile Header
=======================================================*/

  const mobileHeader = document.querySelector(".mobile-header");

  let lastScrollPosition = Math.max(window.scrollY, 0);

  let headerTicking = false;

  /*-------------------------------------------------------
  Header helpers
-------------------------------------------------------*/

  const showMobileHeader = () => {
    if (!mobileHeader) {
      return;
    }

    mobileHeader.classList.remove("mobile-header--hidden");
  };

  const hideMobileHeader = () => {
    if (!mobileHeader) {
      return;
    }

    mobileHeader.classList.add("mobile-header--hidden");
  };

  /*-------------------------------------------------------
  Detect scroll direction
-------------------------------------------------------*/

  const updateMobileHeader = () => {
    if (!mobileHeader) {
      headerTicking = false;
      return;
    }

    const currentScrollPosition = Math.max(window.scrollY, 0);

    const navigationOpen = body.classList.contains("mobile-nav-active");

    /*-----------------------------------------------
      Desktop
    -----------------------------------------------*/

    if (window.innerWidth >= 1200) {
      showMobileHeader();

      lastScrollPosition = currentScrollPosition;

      headerTicking = false;

      return;
    }

    /*-----------------------------------------------
      Always show near top of page
    -----------------------------------------------*/

    if (currentScrollPosition <= 80) {
      showMobileHeader();

      lastScrollPosition = currentScrollPosition;

      headerTicking = false;

      return;
    }

    /*-----------------------------------------------
      Keep visible while side navigation is open
    -----------------------------------------------*/

    if (navigationOpen) {
      showMobileHeader();

      lastScrollPosition = currentScrollPosition;

      headerTicking = false;

      return;
    }

    /*-----------------------------------------------
      Scroll down = hide
    -----------------------------------------------*/

    if (currentScrollPosition > lastScrollPosition + 2) {
      hideMobileHeader();
    } else if (currentScrollPosition < lastScrollPosition - 2) {

    /*-----------------------------------------------
      Scroll up = show
    -----------------------------------------------*/
      showMobileHeader();
    }

    lastScrollPosition = currentScrollPosition;

    headerTicking = false;
  };

  /*-------------------------------------------------------
  Scroll listener
-------------------------------------------------------*/

  window.addEventListener(
    "scroll",
    () => {
      if (headerTicking) {
        return;
      }

      headerTicking = true;

      window.requestAnimationFrame(updateMobileHeader);
    },
    {
      passive: true,
    },
  );

  /*-------------------------------------------------------
  Reset header when viewport changes
-------------------------------------------------------*/

  window.addEventListener("resize", () => {
    showMobileHeader();

    lastScrollPosition = Math.max(window.scrollY, 0);
  });

  /*=======================================================
      Smooth Scrolling
    =======================================================*/

  document.querySelectorAll('a.scrollto[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  /*=======================================================
      Active Navigation Link
    =======================================================*/

  const sections = document.querySelectorAll("section[id]");

  const updateActiveNavigation = () => {
    const scrollPosition = window.scrollY + 180;

    sections.forEach((section) => {
      const sectionId = section.getAttribute("id");

      const navigationLink = document.querySelector(
        `#navbar a[href="#${sectionId}"]`,
      );

      if (!navigationLink) {
        return;
      }

      const sectionTop = section.offsetTop;

      const sectionBottom = sectionTop + section.offsetHeight;

      const isActive =
        scrollPosition >= sectionTop && scrollPosition < sectionBottom;

      navigationLink.classList.toggle("active", isActive);
    });
  };

  window.addEventListener("scroll", updateActiveNavigation, { passive: true });

  updateActiveNavigation();

  /*=======================================================
      Back To Top
    =======================================================*/

  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle("active", window.scrollY > 500);
    };

    window.addEventListener("scroll", updateBackToTop, { passive: true });

    updateBackToTop();
  }

  /*=======================================================
      Footer Year
    =======================================================*/

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  /*=======================================================
      AOS Animations
    =======================================================*/

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      once: true,
      easing: "ease-out",
      offset: 40,
      disable: prefersReducedMotion.matches,
    });
  }

  /*=======================================================
    Testimonials Slider
    =======================================================*/

  const testimonialsSlider = document.querySelector(".testimonials-slider");

  if (testimonialsSlider && typeof Swiper !== "undefined") {
    const currentCounter = document.querySelector(".testimonial-current");

    const totalCounter = document.querySelector(".testimonial-total");

    const formatSlideNumber = (number) => String(number).padStart(2, "0");

    const updateCounter = (swiper) => {
      if (currentCounter) {
        currentCounter.textContent = formatSlideNumber(swiper.realIndex + 1);
      }

      if (totalCounter) {
        totalCounter.textContent = formatSlideNumber(swiper.slides.length);
      }
    };

    new Swiper(testimonialsSlider, {
      slidesPerView: 1,
      slidesPerGroup: 1,

      spaceBetween: 24,

      speed: prefersReducedMotion.matches ? 0 : 550,

      loop: false,
      rewind: false,

      autoHeight: true,

      watchOverflow: true,

      grabCursor: true,

      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },

      navigation: {
        nextEl: ".testimonial-button-next",
        prevEl: ".testimonial-button-prev",
      },

      a11y: {
        enabled: true,
        prevSlideMessage: "Previous testimonial",
        nextSlideMessage: "Next testimonial",
      },

      on: {
        init(swiper) {
          updateCounter(swiper);
        },

        slideChange(swiper) {
          updateCounter(swiper);
        },
      },
    });
  }
});
