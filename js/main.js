// URL of the deployed Google Apps Script web app (see README, "Brancher le RSVP").
const RSVP_ENDPOINT = "";

const WEDDING_DATE = new Date("2027-10-16T14:00:00+02:00");
const SUPPORTED_LANGS = ["fr", "en"];
const LANG_STORAGE_KEY = "lang";

let currentLang = "fr";

function t(key) {
  const value = window.TRANSLATIONS[currentLang][key];
  if (value === undefined) throw new Error(`Missing translation: ${currentLang}.${key}`);
  return value;
}

// ---------- i18n ----------

function detectLang() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (SUPPORTED_LANGS.includes(saved)) return saved;
  } catch (_) { /* storage unavailable: fall through to browser language */ }
  return navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
}

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  });
  updateCountdown();
}

function initLangSwitch() {
  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      applyLang(btn.dataset.lang);
      try { localStorage.setItem(LANG_STORAGE_KEY, btn.dataset.lang); } catch (_) { /* not persisted */ }
    });
  });
}

// ---------- Mobile menu ----------

function initMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("nav");
  const setOpen = open => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setOpen(false)));
}

// ---------- Countdown ----------

function updateCountdown() {
  const diff = WEDDING_DATE - Date.now();
  const box = document.querySelector(".countdown");
  if (diff <= 0) {
    box.textContent = t("cd.done");
    return;
  }
  const minutes = Math.floor(diff / 60000);
  document.getElementById("cd-days").textContent = Math.floor(minutes / 1440);
  document.getElementById("cd-hours").textContent = Math.floor((minutes % 1440) / 60);
  document.getElementById("cd-minutes").textContent = minutes % 60;
}

// ---------- RSVP ----------

function initRsvp() {
  const form = document.getElementById("rsvp-form");
  const attendingBlock = form.querySelector(".if-attending");
  const status = form.querySelector(".form-status");
  const submit = form.querySelector("button[type=submit]");

  form.querySelectorAll("input[name=attending]").forEach(radio => {
    radio.addEventListener("change", () => { attendingBlock.hidden = form.elements["attending"].value !== "oui"; });
  });

  const setStatus = (key, kind) => {
    status.textContent = t(key);
    status.dataset.kind = kind;
  };

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (!form.elements["name"].value.trim() || !form.elements["attending"].value) {
      setStatus("rsvp.invalid", "error");
      return;
    }
    if (!RSVP_ENDPOINT) {
      setStatus("rsvp.notConfigured", "error");
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    data.lang = currentLang;
    if (data.attending !== "oui") {
      for (const key of ["adults", "children", "guests", "diet", "brunch", "tipi"]) delete data[key];
    }

    submit.disabled = true;
    setStatus("rsvp.sending", "info");
    try {
      // text/plain avoids the CORS preflight, which Apps Script does not handle.
      const response = await fetch(RSVP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error);
      form.reset();
      attendingBlock.hidden = true;
      setStatus("rsvp.success", "success");
    } catch (err) {
      console.error("RSVP submission failed:", err);
      setStatus("rsvp.error", "error");
    } finally {
      submit.disabled = false;
    }
  });
}

// ---------- Boot ----------

initLangSwitch();
initMenu();
initRsvp();
applyLang(detectLang());
setInterval(updateCountdown, 30000);
