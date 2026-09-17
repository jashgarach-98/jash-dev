const storageKey = "jash-theme";
const root = document.documentElement;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const headerPanel = document.getElementById("header-panel");
const themeToggle = document.querySelector(".theme-toggle");
const themeText = document.querySelector("[data-theme-text]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));
const sections = Array.from(document.querySelectorAll("main section[id]"));
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const themeColors = {
  light: "#f5f9ff",
  dark: "#07111f",
};

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeText.textContent = theme === "dark" ? "Dark" : "Light";
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
  );
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeColorMeta?.setAttribute("content", themeColors[theme]);
}

function closeNav() {
  header.dataset.navOpen = "false";
  navToggle.setAttribute("aria-expanded", "false");
}

function setInitialTheme() {
  const stored = window.localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark") {
    applyTheme(stored);
    return;
  }

  applyTheme(prefersDark.matches ? "dark" : "light");
}

setInitialTheme();

themeToggle.addEventListener("click", () => {
  const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  window.localStorage.setItem(storageKey, nextTheme);
});

prefersDark.addEventListener("change", (event) => {
  if (!window.localStorage.getItem(storageKey)) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

navToggle.addEventListener("click", () => {
  const isOpen = header.dataset.navOpen === "true";
  header.dataset.navOpen = String(!isOpen);
  navToggle.setAttribute("aria-expanded", String(!isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 960) {
      closeNav();
    }
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 960) {
    closeNav();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header.dataset.navOpen === "true") {
    closeNav();
    navToggle.focus();
  }
});

if (reducedMotion) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  {
    rootMargin: "-35% 0px -50% 0px",
    threshold: 0.01,
  },
);

sections.forEach((section) => sectionObserver.observe(section));

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      formStatus.textContent = "Please complete all fields with a valid email address.";
      formStatus.classList.add("is-error");
      formStatus.classList.remove("is-success");
      contactForm.reportValidity();
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = `Portfolio inquiry from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n");
    const mailtoUrl =
      `mailto:garach.jash1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    formStatus.textContent = "Opening your email app...";
    formStatus.classList.add("is-success");
    formStatus.classList.remove("is-error");
    contactForm.reset();
    window.location.href = mailtoUrl;
  });
}

document.getElementById("year").textContent = new Date().getFullYear();

if (headerPanel && !headerPanel.hasAttribute("tabindex")) {
  headerPanel.setAttribute("tabindex", "-1");
}
