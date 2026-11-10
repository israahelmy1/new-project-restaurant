"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const backToTop = document.querySelector(".back-to-top");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  const updateScrollUI = () => {
    const isScrolled = window.scrollY > 24;
    header?.classList.toggle("scrolled", isScrolled);
    backToTop?.classList.toggle("visible", window.scrollY > 420);
  };
  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navLinks?.classList.toggle("open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });
  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle?.setAttribute("aria-expanded", "false");
      navToggle?.setAttribute("aria-label", "Open navigation menu");
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks?.classList.contains("open")) {
      navToggle?.setAttribute("aria-expanded", "false");
      navToggle?.setAttribute("aria-label", "Open navigation menu");
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");
    }
  });

  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const filterTabs = [...document.querySelectorAll(".filter-tab")];
  const menuCards = [...document.querySelectorAll(".menu-card")];
  const filterStatus = document.querySelector(".filter-status");
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;
      filterTabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      let shown = 0;
      menuCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category === filter;
        card.hidden = !matches;
        if (matches) shown += 1;
      });
      if (filterStatus) filterStatus.textContent = `${shown} ${filter === "all" ? "menu items" : `${filter} items`} shown.`;
    });
  });

  const testimonials = [
    { quote: "“The kind of place where dinner turns into the whole evening. Every dish was beautiful, and the welcome was even warmer.”", name: "Anna M.", detail: "Guest, last Saturday", initials: "AM" },
    { quote: "“The lamb was extraordinary, the room felt like home, and nobody rushed us out the door. We’ve already booked again.”", name: "Daniel R.", detail: "Guest, last month", initials: "DR" },
    { quote: "“A little slice of the Mediterranean in Brooklyn. Thoughtful food, lovely people, and the best panna cotta I’ve had.”", name: "Leila K.", detail: "Guest, two weeks ago", initials: "LK" }
  ];
  const quote = document.querySelector("[data-testimonial-quote]");
  const reviewerName = document.querySelector("[data-testimonial-name]");
  const reviewerDetail = document.querySelector(".reviewer small");
  const reviewerAvatar = document.querySelector(".reviewer-avatar");
  const testimonialDots = [...document.querySelectorAll("[data-testimonial-dot]")];
  let testimonialIndex = 0;
  const showTestimonial = (index) => {
    testimonialIndex = (index + testimonials.length) % testimonials.length;
    const testimonial = testimonials[testimonialIndex];
    if (quote) quote.textContent = testimonial.quote;
    if (reviewerName) reviewerName.textContent = testimonial.name;
    if (reviewerDetail) reviewerDetail.textContent = testimonial.detail;
    if (reviewerAvatar) reviewerAvatar.textContent = testimonial.initials;
    testimonialDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === testimonialIndex);
      dot.setAttribute("aria-current", String(dotIndex === testimonialIndex));
    });
  };
  document.querySelector("[data-testimonial-prev]")?.addEventListener("click", () => showTestimonial(testimonialIndex - 1));
  document.querySelector("[data-testimonial-next]")?.addEventListener("click", () => showTestimonial(testimonialIndex + 1));
  testimonialDots.forEach((dot) => {
    dot.addEventListener("click", () => showTestimonial(Number(dot.dataset.testimonialDot)));
  });

  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxClose = lightbox?.querySelector(".lightbox-close");
  let lastFocusedElement = null;
  const closeLightbox = () => {
    lightbox?.classList.remove("open");
    lightbox?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    lightboxImage?.removeAttribute("src");
    lastFocusedElement?.focus();
  };
  document.querySelectorAll("[data-lightbox]").forEach((item) => {
    item.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      lastFocusedElement = item;
      lightboxImage.src = item.dataset.lightbox;
      lightboxImage.alt = item.querySelector("img")?.alt ?? "Enlarged restaurant gallery image";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      lightboxClose?.focus();
    });
  });
  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  const reservationForm = document.querySelector("#reservation-form");
  if (reservationForm) {
    const dateInput = reservationForm.querySelector("#booking-date");
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput?.setAttribute("min", localToday);

    const fieldErrors = {
      name: { input: reservationForm.elements.namedItem("name"), error: document.querySelector("#name-error"), message: "Please enter your name (at least 2 characters)." },
      phone: { input: reservationForm.elements.namedItem("phone"), error: document.querySelector("#phone-error"), message: "Please enter a valid phone number." },
      email: { input: reservationForm.elements.namedItem("email"), error: document.querySelector("#email-error"), message: "Please enter a valid email address." },
      guests: { input: reservationForm.elements.namedItem("guests"), error: document.querySelector("#guests-error"), message: "Please select the number of guests." },
      date: { input: reservationForm.elements.namedItem("date"), error: document.querySelector("#date-error"), message: "Please choose today or a future date." },
      time: { input: reservationForm.elements.namedItem("time"), error: document.querySelector("#time-error"), message: "Please select a preferred time." }
    };
    const validateField = (key) => {
      const field = fieldErrors[key];
      if (!field?.input || !field.error) return true;
      const value = field.input.value.trim();
      let valid = field.input.checkValidity();
      if (key === "name") valid = value.length >= 2;
      if (key === "phone") valid = /^[+()\d.\-\s]{7,}$/.test(value) && value.replace(/\D/g, "").length >= 7;
      if (key === "date") valid = Boolean(value) && value >= localToday;
      field.input.setAttribute("aria-invalid", String(!valid));
      field.error.textContent = valid ? "" : field.message;
      return valid;
    };
    Object.entries(fieldErrors).forEach(([key, field]) => {
      field.input?.addEventListener("input", () => validateField(key));
      field.input?.addEventListener("change", () => validateField(key));
    });
    reservationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const valid = Object.keys(fieldErrors).map(validateField).every(Boolean);
      const message = document.querySelector("#form-message");
      if (!valid) {
        reservationForm.querySelector('[aria-invalid="true"]')?.focus();
        if (message) message.textContent = "Please check the highlighted fields and try again.";
        return;
      }
      if (message) message.textContent = "Thanks, " + reservationForm.elements.namedItem("name").value.trim() + "! Your request is ready. Please call us at (718) 555-0148 to confirm your table.";
      reservationForm.reset();
      dateInput?.setAttribute("min", localToday);
      Object.values(fieldErrors).forEach(({ input, error }) => {
        input?.removeAttribute("aria-invalid");
        if (error) error.textContent = "";
      });
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox?.classList.contains("open")) closeLightbox();
  });
});
