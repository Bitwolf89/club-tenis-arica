/* ==========================================================================
   Club Escuela de Tenis Arica · Sistema de Movimiento e Interacción (v4)
   Scroll nativo de alta velocidad + GSAP ScrollTrigger + Anclas de precisión
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out", duration: 0.85 });

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ==========================================
// 1. BARRA DE NAVEGACIÓN & PROGRESO SUPERIOR
// ==========================================
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const pageScrollProgress = document.getElementById("pageScrollProgress");
const navLinks = document.querySelectorAll(".navbar__link");

function setNavOffset() {
  if (!navbar) return;
  const bottom = Math.max(0, navbar.getBoundingClientRect().bottom);
  document.documentElement.style.setProperty("--nav-offset", `${bottom}px`);
}

function closeNav() {
  if (!navbar) return;
  navbar.classList.remove("navbar--open");
  navToggle?.setAttribute("aria-expanded", "false");
}

window.addEventListener("scroll", () => {
  if (navbar) {
    navbar.classList.toggle("navbar--scrolled", window.scrollY > 36);
    if (navbar.classList.contains("navbar--open")) setNavOffset();
  }
  if (pageScrollProgress) {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    pageScrollProgress.style.transform = `scaleX(${progress.toFixed(4)})`;
  }
}, { passive: true });

navToggle?.addEventListener("click", () => {
  setNavOffset();
  const open = navbar.classList.toggle("navbar--open");
  navToggle.setAttribute("aria-expanded", String(open));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1024) closeNav();
});

// ==========================================
// 2. NAVEGACIÓN POR PESTAÑAS CON PRECISIÓN EXACTA
// ==========================================
let activeAnchorTween = null;

function cancelAnchorTween() {
  if (activeAnchorTween) {
    activeAnchorTween.kill();
    activeAnchorTween = null;
  }
}

// Si el usuario gira la rueda del ratón o toca la pantalla, el control pasa de inmediato a su mano
window.addEventListener("wheel", cancelAnchorTween, { passive: true });
window.addEventListener("touchstart", cancelAnchorTween, { passive: true });

function getTargetScrollY(targetEl, targetId) {
  if (targetId === "hero") return 0;
  const navHeight = navbar ? navbar.offsetHeight : 72;
  const rectTop = targetEl.getBoundingClientRect().top + window.scrollY;
  return Math.max(0, Math.round(rectTop - navHeight));
}

function scrollToSection(hash) {
  if (!hash || !hash.startsWith("#") || hash === "#") return;
  const targetId = hash.slice(1);
  const targetEl = document.getElementById(targetId);
  if (!targetEl) return;

  closeNav();
  cancelAnchorTween();

  // Actualizar pestaña activa inmediatamente
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });

  if (history.pushState) {
    history.pushState(null, "", hash);
  }

  if (reduceMotion) {
    window.scrollTo(0, getTargetScrollY(targetEl, targetId));
    ScrollTrigger.refresh();
    return;
  }

  const startY = window.scrollY;
  const state = { progress: 0 };

  activeAnchorTween = gsap.to(state, {
    progress: 1,
    duration: 0.36,
    ease: "power2.out",
    onUpdate: () => {
      const destY = getTargetScrollY(targetEl, targetId);
      const nextY = Math.round(startY + (destY - startY) * state.progress);
      window.scrollTo(0, nextY);
    },
    onComplete: () => {
      activeAnchorTween = null;
      window.scrollTo(0, getTargetScrollY(targetEl, targetId));
      ScrollTrigger.refresh();
    }
  });
}

document.addEventListener("click", (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const href = anchor.getAttribute("href");
  if (!href || href === "#") return;
  const targetEl = document.getElementById(href.slice(1));
  if (!targetEl) return;
  e.preventDefault();
  scrollToSection(href);
});

// Resaltar sección activa en la barra de navegación al hacer scroll con el mouse
const trackedSections = ["historia", "comparativa", "voces", "carta", "muro"];

trackedSections.forEach((id) => {
  const section = document.getElementById(id);
  if (!section) return;
  ScrollTrigger.create({
    trigger: section,
    start: "top 35%",
    end: "bottom 35%",
    onToggle: (self) => {
      if (self.isActive && !activeAnchorTween) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    }
  });
});

// ==========================================
// 3. COREOGRAFÍA GSAP & SCROLLTRIGGER
// ==========================================
const mm = gsap.matchMedia();

mm.add(
  {
    canAnimate: "(prefers-reduced-motion: no-preference)",
    reduced: "(prefers-reduced-motion: reduce)"
  },
  (context) => {
    const { canAnimate } = context.conditions;
    if (!canAnimate) return;

    // 3.1 Entrada editorial del Hero
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl
      .from(".hero__tag", { y: 14, autoAlpha: 0, duration: 0.65 })
      .from(".hero__title", { y: 22, autoAlpha: 0, duration: 0.85 }, "-=0.45")
      .from(".hero__description", { y: 18, autoAlpha: 0, duration: 0.75 }, "-=0.55")
      .from(".hero__cta-group", { y: 16, autoAlpha: 0, duration: 0.7 }, "-=0.55")
      .from(".hero__stat-card", { y: 18, autoAlpha: 0, duration: 0.65, stagger: 0.08 }, "-=0.45")
      .from(".hero__main-frame", { scale: 0.98, autoAlpha: 0, duration: 0.9 }, "-=0.85")
      .from(".hero__card", { y: 20, autoAlpha: 0, duration: 0.8 }, "-=0.65");

    // Parallax suave sobre la fotografía de la cancha en el Hero
    gsap.fromTo(
      "#heroBg",
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.8
        }
      }
    );

    // 3.2 Franja de evidencia
    gsap.from(".evidence-item", {
      y: 18,
      autoAlpha: 0,
      duration: 0.55,
      stagger: 0.06,
      scrollTrigger: {
        trigger: ".evidence-strip",
        start: "top 90%",
        once: true
      }
    });

    // 3.3 Revelado de cabeceras de sección
    gsap.utils.toArray(".section-head").forEach((head) => {
      gsap.from(head.children, {
        y: 16,
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.06,
        scrollTrigger: {
          trigger: head,
          start: "top 90%",
          once: true
        }
      });
    });

    // 3.4 Tarjetas de Voces y Galería
    ScrollTrigger.batch(".voice-card", {
      start: "top 90%",
      once: true,
      onEnter: (batch) => {
        gsap.from(batch, {
          y: 20,
          autoAlpha: 0,
          duration: 0.55,
          stagger: 0.06,
          overwrite: true
        });
      }
    });

    ScrollTrigger.batch(".photo-gallery-item", {
      start: "top 90%",
      once: true,
      onEnter: (batch) => {
        gsap.from(batch, {
          y: 16,
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.04,
          overwrite: true
        });
      }
    });
  }
);

// ==========================================
// 4. LÍNEA DE TIEMPO INTERACTIVA POR SCROLL
// ==========================================
const timelineItems = document.querySelectorAll(".timeline-item");
const timelineProgress = document.getElementById("timelineProgress");

ScrollTrigger.create({
  trigger: ".timeline-wrap",
  start: "top 72%",
  end: "bottom 55%",
  scrub: 0.2,
  onUpdate: (self) => {
    if (timelineProgress) {
      timelineProgress.style.height = `${(self.progress * 100).toFixed(1)}%`;
    }
  }
});

timelineItems.forEach((item) => {
  ScrollTrigger.create({
    trigger: item,
    start: "top 70%",
    end: "bottom 40%",
    onEnter: () => item.classList.add("active"),
    onEnterBack: () => item.classList.add("active"),
    onLeave: () => item.classList.remove("active"),
    onLeaveBack: () => item.classList.remove("active")
  });

  if (!reduceMotion) {
    const content = item.querySelector(".timeline-item__content");
    const media = item.querySelector(".timeline-item__media");

    if (content) {
      gsap.from(content, {
        y: 20,
        autoAlpha: 0,
        duration: 0.55,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          once: true
        }
      });
    }

    if (media) {
      gsap.from(media, {
        y: 20,
        scale: 0.99,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          once: true
        }
      });
    }
  }
});

// ==========================================
// 5. COMPARADOR VISUAL (ANTES Y AHORA)
// ==========================================
const sliderRange = document.getElementById("sliderRange");
const sliderBefore = document.getElementById("sliderBefore");
const sliderDivider = document.getElementById("sliderDivider");
const sliderHandle = document.getElementById("sliderHandle");
const compareChips = document.querySelectorAll(".compare-chip");

function updateSlider(val) {
  const num = Number(val);
  if (sliderBefore) sliderBefore.style.clipPath = `inset(0 ${100 - num}% 0 0)`;
  if (sliderDivider) sliderDivider.style.left = `${num}%`;
  if (sliderHandle) sliderHandle.style.left = `${num}%`;
  if (sliderRange) sliderRange.value = String(num);
}

function setComparisonValue(targetVal) {
  compareChips.forEach((chip) => {
    const isMatch = chip.getAttribute("onclick")?.includes(`(${targetVal})`);
    chip.classList.toggle("compare-chip--active", Boolean(isMatch));
  });

  if (reduceMotion || !sliderRange) {
    updateSlider(targetVal);
    return;
  }

  const current = { val: Number(sliderRange.value || 50) };
  gsap.to(current, {
    val: targetVal,
    duration: 0.55,
    ease: "power3.out",
    onUpdate: () => updateSlider(current.val)
  });
}

if (sliderRange) {
  sliderRange.addEventListener("input", (e) => {
    compareChips.forEach((c) => c.classList.remove("compare-chip--active"));
    updateSlider(e.target.value);
  });

  if (!reduceMotion) {
    ScrollTrigger.create({
      trigger: "#compareSlider",
      start: "top 76%",
      once: true,
      onEnter: () => {
        const tweenObj = { val: 50 };
        gsap.timeline()
          .to(tweenObj, {
            val: 66,
            duration: 0.55,
            ease: "power2.inOut",
            onUpdate: () => updateSlider(tweenObj.val)
          })
          .to(tweenObj, {
            val: 34,
            duration: 0.7,
            ease: "power2.inOut",
            onUpdate: () => updateSlider(tweenObj.val)
          })
          .to(tweenObj, {
            val: 50,
            duration: 0.55,
            ease: "power2.out",
            onUpdate: () => updateSlider(tweenObj.val)
          });
      }
    });
  }
}

// ==========================================
// 6. MODAL DE VIDEOS / DECLARACIONES
// ==========================================
const videoModal = document.getElementById("videoModal");
const videoModalBody = document.getElementById("videoModalBody");
const videoModalTitle = document.getElementById("videoModalTitle");
const videoModalRole = document.getElementById("videoModalRole");

function openVideoModal(title, role, poster, videoUrl = "") {
  if (!videoModal || !videoModalBody) return;
  if (videoModalTitle) videoModalTitle.textContent = title;
  if (videoModalRole) videoModalRole.textContent = role;

  if (videoUrl && videoUrl.toLowerCase().includes(".mp4")) {
    videoModalBody.innerHTML = `
      <video controls autoplay playsinline controlsList="nodownload" poster="${poster}" style="width: 100%; height: 100%; max-height: 74vh; object-fit: contain; background: #000;">
        <source src="${videoUrl}" type="video/mp4">
        Tu navegador no soporta reproducción de video.
      </video>
    `;
  } else if (videoUrl && (videoUrl.includes("youtube") || videoUrl.includes("youtu.be"))) {
    videoModalBody.innerHTML = `
      <iframe src="${videoUrl}?autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="width: 100%; height: 100%; border: 0;"></iframe>
    `;
  } else {
    videoModalBody.innerHTML = `
      <div style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 28px;">
        <img src="${poster}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.3;">
        <div style="position: relative; z-index: 2; max-width: 440px;">
          <h3 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 8px; color: #fff;">Registro audiovisual en archivo</h3>
          <p style="font-size: 0.92rem; color: #cbd5e1; margin-bottom: 18px;">
            Puedes compartir tu propio testimonio en el muro comunitario del club.
          </p>
          <a href="#muro" onclick="closeVideoModal()" class="btn btn--accent btn--sm">Dejar mi testimonio</a>
        </div>
      </div>
    `;
  }

  videoModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeVideoModal() {
  if (!videoModal || !videoModalBody) return;
  videoModal.classList.remove("active");
  const vid = videoModalBody.querySelector("video");
  if (vid) {
    vid.pause();
    vid.src = "";
    vid.load();
  }
  videoModalBody.innerHTML = "";
  document.body.style.overflow = "";
}

// ==========================================
// 7. LIGHTBOX PARA FOTOGRAFÍAS DE ARCHIVO
// ==========================================
const lightboxModal = document.getElementById("lightboxModal");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");

function openLightbox(src, caption) {
  if (!lightboxModal || !lightboxImg) return;
  lightboxImg.src = src;
  if (lightboxCaption) lightboxCaption.textContent = caption || "";
  lightboxModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightboxModal) return;
  lightboxModal.classList.remove("active");
  document.body.style.overflow = "";
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeVideoModal();
    closeLightbox();
  }
});

// ==========================================
// 8. COMPARTIR CAMPAÑA EN WHATSAPP
// ==========================================
function shareWhatsApp() {
  const message = encodeURIComponent(
    "🎾 Salvemos el Club Escuela de Tenis Arica: más de 40 años formando a niñas, niños y adultos mayores frente a la solicitud de desalojo municipal. Conoce la historia y firma la carta abierta aquí: " + window.location.href
  );
  window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank", "noopener");
}

// ==========================================
// 9. PETITORIO CIUDADANO (FIRMAS EN VIVO)
// ==========================================
const BASE_SIGNATURES = 1482;

function updateSignatureCounter() {
  const countEl = document.getElementById("signatureCount");
  const barEl = document.getElementById("signatureBar");
  if (!countEl) return;
  const signatures = JSON.parse(localStorage.getItem("ceta_signatures") || "[]");
  const total = BASE_SIGNATURES + signatures.length;
  countEl.textContent = total.toLocaleString("es-CL");
  if (barEl) {
    const pct = Math.min(100, Math.round((total / 2000) * 100));
    barEl.style.width = `${pct}%`;
  }
}

function handlePetitionSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("signerName")?.value.trim();
  const contact = document.getElementById("signerContact")?.value.trim();
  const consent = document.getElementById("signerConsent")?.checked;
  const status = document.getElementById("petitionStatus");

  if (!name || !contact || !consent) return;

  const signatures = JSON.parse(localStorage.getItem("ceta_signatures") || "[]");
  signatures.push({ name, contact, date: new Date().toISOString() });
  localStorage.setItem("ceta_signatures", JSON.stringify(signatures));

  updateSignatureCounter();
  if (status) {
    status.textContent = `Gracias, ${name}. Tu firma fue registrada en el petitorio ciudadano.`;
  }
  document.getElementById("petitionForm")?.reset();
}

// ==========================================
// 10. MURO COMUNITARIO DE RECUERDOS
// ==========================================
const DEFAULT_MEMORIES = [
  {
    author: "Carlos Henríquez",
    role: "Ex-alumno histórico",
    year: "1991",
    text: "Mi primer torneo lo jugué aquí con 10 años. Hoy mis hijos aprenden a jugar en este mismo recinto. Es parte viva de nuestra infancia y de la historia de Arica."
  },
  {
    author: "Patricia Morales",
    role: "Abuela y apoderada",
    year: "2024",
    text: "Mi nieta entrena todos los sábados por la mañana. Ver su disciplina y alegría en la cancha no tiene precio. El deporte formativo debe cuidarse siempre."
  },
  {
    author: "Fernando Soto (72 años)",
    role: "Socio Adulto Mayor",
    year: "1985",
    text: "Llevo casi cuatro décadas viniendo a jugar tres veces por semana. Es mi salud física y mi comunidad de amigos. Pedimos diálogo y respeto por esta trayectoria."
  },
  {
    author: "Valentina C. (14 años)",
    role: "Alumna Escuela Formativa",
    year: "2026",
    text: "Aquí entrenamos todas las semanas con mis compañeras para representar a Arica en los campeonatos regionales. Queremos seguir creciendo en nuestras canchas."
  }
];

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

function loadMemories() {
  const memoryGrid = document.getElementById("memoryGrid");
  if (!memoryGrid) return;

  const saved = JSON.parse(localStorage.getItem("ceta_memories") || "[]");
  const allMemories = [...saved, ...DEFAULT_MEMORIES];

  memoryGrid.innerHTML = "";
  allMemories.forEach((mem) => {
    const card = document.createElement("article");
    card.className = "memory-card";
    card.innerHTML = `
      <div class="memory-card__author">${escapeHtml(mem.author)}</div>
      <div class="memory-card__meta">${escapeHtml(mem.role)}${mem.year ? ` · Año ${escapeHtml(mem.year)}` : ""}</div>
      <p class="memory-card__text">“${escapeHtml(mem.text)}”</p>
    `;
    memoryGrid.appendChild(card);
  });
}

function handleMemorySubmit(e) {
  e.preventDefault();
  const author = document.getElementById("memAuthor")?.value.trim();
  const role = document.getElementById("memRole")?.value;
  const year = document.getElementById("memYear")?.value.trim();
  const text = document.getElementById("memText")?.value.trim();
  const statusEl = document.getElementById("memoryStatus");

  if (!author || !text) return;

  const saved = JSON.parse(localStorage.getItem("ceta_memories") || "[]");
  saved.unshift({ author, role, year, text });
  localStorage.setItem("ceta_memories", JSON.stringify(saved));

  loadMemories();
  document.getElementById("memoryForm")?.reset();
  if (statusEl) {
    statusEl.textContent = "Tu recuerdo ya forma parte del muro comunitario.";
    setTimeout(() => {
      statusEl.textContent = "";
    }, 5000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadMemories();
  updateSignatureCounter();
});

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
