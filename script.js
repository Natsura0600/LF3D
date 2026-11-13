/* ==========================================================
   LF3D — interacciones
   ========================================================== */

// EDITAR: datos de contacto. WhatsApp con código de país, sin + ni espacios.
const WHATSAPP = "5491144069225";
const EMAIL = "lf3d.impresiones@gmail.com";
const DEFAULT_MSG = "¡Hola! Vi la web de LF3D y quería consultar por una impresión 3D.";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const waUrl = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- WhatsApp: todos los links con data-wa ---------- */
$$("[data-wa]").forEach((a) => {
  a.href = waUrl(a.dataset.wa || DEFAULT_MSG);
  a.target = "_blank";
  a.rel = "noopener";
});

/* ---------- Aparición al hacer scroll ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
const watchReveal = (el) => revealObserver.observe(el);
$$(".reveal").forEach(watchReveal);

const steps = $("#steps");
if (steps) {
  new IntersectionObserver(([e], obs) => {
    if (e.isIntersecting) { steps.classList.add("in"); obs.disconnect(); }
  }, { threshold: 0.3 }).observe(steps);
}

/* ---------- Header, barra de progreso y botón flotante ---------- */
const header = $("#header");
const progressBar = $("#progressBar");
const waFloat = $("#waFloat");
let ticking = false;
function onScroll() {
  const y = scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  header.classList.toggle("scrolled", y > 24);
  progressBar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
  waFloat.classList.toggle("show", y > 480);
  ticking = false;
}
addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

// El botón flotante se esconde cuando el formulario está en pantalla (para no taparlo).
const form = $("#contactForm");
new IntersectionObserver(([e]) => waFloat.classList.toggle("hide-near-form", e.isIntersecting), { threshold: 0.25 }).observe(form);

/* ---------- Menú hamburguesa ---------- */
const burger = $("#burger");
const nav = $("#nav");
function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}
burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
$$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
matchMedia("(min-width: 861px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

/* ---------- Link activo según la sección visible ---------- */
const navLinks = $$(".nav li a");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach((s) => sectionObserver.observe(s));

/* ---------- Hero: leve parallax con el mouse ---------- */
const heroArt = $("#heroArt");
if (heroArt && !reduceMotion && matchMedia("(hover: hover)").matches) {
  const hero = $(".hero");
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    heroArt.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    heroArt.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  });
  hero.addEventListener("pointerleave", () => {
    heroArt.style.setProperty("--mx", 0);
    heroArt.style.setProperty("--my", 0);
  });
}

/* ---------- Portfolio ---------- */
let artId = 0;
// Ilustraciones de muestra (se usan cuando un trabajo todavía no tiene foto).
function art(kind, tone) {
  const id = `ly${artId++}`;
  const dark = tone === "ice" || tone === "sky";
  const a = dark ? "#1a5cf0" : "#8bd9ff";
  const b = dark ? "#1348c8" : "#6cc4f2";
  const hole = dark ? "#cfe6f9" : "#0b1f44";
  const fill = `fill="url(#${id})"`;
  const shapes = {
    vase: `<path ${fill} d="M74 20h52c0 26 34 46 34 96 0 44-24 72-30 84H70c-6-12-30-40-30-84 0-50 34-70 34-96z"/><ellipse cx="100" cy="20" rx="26" ry="7" fill="${hole}" opacity=".85"/>`,
    organizer: `<rect ${fill} x="14" y="60" width="172" height="110" rx="16"/><rect x="32" y="78" width="30" height="74" rx="8" fill="${hole}" opacity=".8"/><rect x="72" y="78" width="30" height="74" rx="8" fill="${hole}" opacity=".8"/><rect x="112" y="78" width="56" height="32" rx="8" fill="${hole}" opacity=".8"/><rect x="112" y="120" width="56" height="32" rx="8" fill="${hole}" opacity=".8"/>`,
    tag: `<g transform="rotate(-10 100 110)"><rect ${fill} x="18" y="72" width="164" height="78" rx="22"/><circle cx="46" cy="111" r="11" fill="${hole}" opacity=".85"/><rect x="70" y="97" width="92" height="10" rx="5" fill="#fff" opacity=".85"/><rect x="70" y="115" width="58" height="10" rx="5" fill="#fff" opacity=".5"/></g>`,
    bracket: `<path ${fill} d="M26 36h50a10 10 0 0 1 10 10v78h78a10 10 0 0 1 10 10v40a10 10 0 0 1-10 10H26a10 10 0 0 1-10-10V46a10 10 0 0 1 10-10z"/><circle cx="51" cy="70" r="11" fill="${hole}" opacity=".85"/><circle cx="51" cy="154" r="11" fill="${hole}" opacity=".85"/><circle cx="140" cy="154" r="11" fill="${hole}" opacity=".85"/>`,
    gear: `<g transform="translate(100 110)">${Array.from({ length: 10 }, (_, i) => `<rect ${fill} x="-13" y="-92" width="26" height="40" rx="5" transform="rotate(${i * 36})"/>`).join("")}<circle ${fill} r="70"/><circle r="24" fill="${hole}" opacity=".85"/></g>`,
    pot: `<path ${fill} d="M30 62h140l-20 126a12 12 0 0 1-12 10H62a12 12 0 0 1-12-10z"/><rect ${fill} x="20" y="40" width="160" height="30" rx="10"/><ellipse cx="100" cy="44" rx="66" ry="6" fill="${hole}" opacity=".7"/>`
  };
  return `<svg viewBox="0 0 200 220" aria-hidden="true"><defs><pattern id="${id}" width="8" height="7" patternUnits="userSpaceOnUse"><rect width="8" height="7" fill="${a}"/><rect y="5.500" width="8" height="1.500" fill="${b}"/></pattern></defs>${shapes[kind] || shapes.vase}</svg>`;
}

const gallery = $("#gallery");
const filters = $("#filters");
const items = window.LF3D_PORTFOLIO || [];
const media = (item) => item.image
  ? `<img src="${item.image}" alt="${item.title} — impresión 3D de LF3D" loading="lazy" decoding="async">`
  : art(item.art, item.tone);

if (gallery && items.length) {
  gallery.innerHTML = items.map((item, i) => `
    <button type="button" class="shot reveal ${item.size || ""}" style="--d:${(i % 3) * 0.08}s" data-i="${i}" data-cat="${item.category}" aria-label="Ver ${item.title}">
      <span class="shot-media ${item.image ? "" : `tone-${item.tone || "night"}`}">${media(item)}</span>
      <span class="shot-info"><span><small>${item.category}</small><strong>${item.title}</strong></span><span class="shot-go"><svg><use href="#i-arrow"/></svg></span></span>
    </button>`).join("");
  $$(".shot", gallery).forEach(watchReveal);

  const cats = ["Todos", ...new Set(items.map((i) => i.category))];
  filters.innerHTML = cats.map((c, i) => `<button type="button" class="filter" aria-pressed="${i === 0}" data-cat="${c}">${c}</button>`).join("");
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    $$(".filter", filters).forEach((f) => f.setAttribute("aria-pressed", String(f === btn)));
    $$(".shot", gallery).forEach((shot) => {
      const show = btn.dataset.cat === "Todos" || shot.dataset.cat === btn.dataset.cat;
      shot.classList.toggle("is-hidden", !show);
      shot.classList.add("visible");
      shot.classList.remove("pop");
      if (show) { void shot.offsetWidth; shot.classList.add("pop"); }
    });
  });

  // Detalle de cada trabajo
  const lightbox = $("#lightbox");
  gallery.addEventListener("click", (e) => {
    const shot = e.target.closest(".shot");
    if (!shot) return;
    const item = items[shot.dataset.i];
    const lbMedia = $("#lbMedia");
    lbMedia.className = `lb-media ${item.image ? "" : `tone-${item.tone || "night"}`}`;
    lbMedia.innerHTML = media(item);
    $("#lbCat").textContent = item.category;
    $("#lbTitle").textContent = item.title;
    $("#lbText").textContent = item.text || "";
    $("#lbCta").href = waUrl(`¡Hola LF3D! Vi "${item.title}" en la web y quiero consultar por algo así.`);
    lightbox.showModal();
  });
  $("#lbClose").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
}

/* ---------- Formulario → WhatsApp ---------- */
const formError = $("#formError");
function buildMessage() {
  const nombre = form.nombre.value.trim();
  const mensaje = form.mensaje.value.trim();
  return { nombre, mensaje, text: `¡Hola LF3D! Soy ${nombre}.\nConsulta por: ${form.servicio.value}\n\n${mensaje}` };
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const { nombre, mensaje, text } = buildMessage();
  form.nombre.classList.toggle("invalid", !nombre);
  form.mensaje.classList.toggle("invalid", !mensaje);
  formError.hidden = Boolean(nombre && mensaje);
  if (!nombre || !mensaje) {
    (nombre ? form.mensaje : form.nombre).focus();
    return;
  }
  window.open(waUrl(text), "_blank", "noopener");
});
form.addEventListener("input", (e) => {
  e.target.classList.remove("invalid");
  formError.hidden = true;
});
// "Prefiero enviarlo por email": lleva lo que ya escribió.
$("#mailAlt").addEventListener("click", (e) => {
  const { nombre, mensaje, text } = buildMessage();
  if (nombre || mensaje) e.currentTarget.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Consulta desde la web")}&body=${encodeURIComponent(text)}`;
});

$("#year").textContent = new Date().getFullYear();
