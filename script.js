const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
toggle?.addEventListener("click", () => nav.classList.toggle("open"));
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => nav.classList.remove("open")));

// EDITAR: reemplazá el número por el WhatsApp real de LF3D, con código de país y sin + ni espacios.
const whatsappNumber = "5490000000000";
const whatsappMessage = encodeURIComponent("¡Hola! Vi la web de LF3D y quería consultar por una impresión 3D.");
const whatsappLink = document.getElementById("whatsappLink");
if (whatsappLink) whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
