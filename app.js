/* ==========================================================================
   Club Escuela de Tenis Arica · Script de Interacción y Animaciones (v3)
   GSAP ScrollTrigger para fluidez de scroll, dinamismo y componentes interactivos
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. NAVBAR SCROLL EFFECT
// ==========================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
  if (navbar.classList.contains('navbar--open')) setNavOffset();
}, { passive: true });

// Menú móvil (hamburguesa)
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

function setNavOffset() {
  const bottom = Math.max(0, navbar.getBoundingClientRect().bottom);
  document.documentElement.style.setProperty('--nav-offset', `${bottom}px`);
}

function closeNav() {
  navbar.classList.remove('navbar--open');
  navToggle?.setAttribute('aria-expanded', 'false');
}

navToggle?.addEventListener('click', () => {
  setNavOffset();
  const open = navbar.classList.toggle('navbar--open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navMenu?.querySelectorAll('a, button').forEach(el => el.addEventListener('click', closeNav));
window.addEventListener('resize', () => { if (window.innerWidth > 1024) closeNav(); });

// ==========================================
// 2. HERO ANIMATIONS (ENTRADA FLUIDA Y PARALLAX)
// ==========================================
const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
heroTimeline
  .from(".hero__tag", { y: -20, opacity: 0, duration: 0.8, delay: 0.2 })
  .from(".hero__title", { y: 30, opacity: 0, duration: 1 }, "-=0.5")
  .from(".hero__description", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
  .from(".hero__cta-group", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
  .from(".hero__stats > div", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
  .from(".hero__card", { scale: 0.95, opacity: 0, duration: 0.9 }, "-=0.8");

// Parallax sutil en la foto del Hero al hacer scroll
gsap.to("#heroBg", {
  yPercent: 15,
  ease: "none",
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

// ==========================================
// 3. LÍNEA DE TIEMPO INTERACTIVA POR SCROLL
// ==========================================
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineProgress = document.getElementById('timelineProgress');

// Barra vertical de progreso continuo vinculada al scroll
ScrollTrigger.create({
  trigger: ".timeline-wrap",
  start: "top 70%",
  end: "bottom 60%",
  scrub: 0.3,
  onUpdate: (self) => {
    if (timelineProgress) {
      timelineProgress.style.height = `${(self.progress * 100).toFixed(1)}%`;
    }
  }
});

// Iluminación activa de cada hito al pasar por él
timelineItems.forEach((item) => {
  ScrollTrigger.create({
    trigger: item,
    start: "top 65%",
    end: "bottom 45%",
    onEnter: () => item.classList.add('active'),
    onEnterBack: () => item.classList.add('active'),
    onLeave: () => item.classList.remove('active'),
    onLeaveBack: () => item.classList.remove('active')
  });

  // Animación de revelado suave al entrar
  gsap.from(item.querySelector('.timeline-item__content'), {
    y: 35,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: item,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });

  gsap.from(item.querySelector('.timeline-item__media'), {
    y: 35,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: item,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });
});

// ==========================================
// 4. COMPARADOR VISUAL (ANTES Y AHORA)
// ==========================================
const sliderRange = document.getElementById('sliderRange');
const sliderBefore = document.getElementById('sliderBefore');
const sliderDivider = document.getElementById('sliderDivider');
const sliderHandle = document.getElementById('sliderHandle');

function updateSlider(val) {
  if (sliderBefore) sliderBefore.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
  if (sliderDivider) sliderDivider.style.left = `${val}%`;
  if (sliderHandle) sliderHandle.style.left = `${val}%`;
}

if (sliderRange) {
  sliderRange.addEventListener('input', (e) => {
    updateSlider(e.target.value);
  });
  // Auto animación inicial cuando entra en pantalla para invitar al usuario a arrastrar
  ScrollTrigger.create({
    trigger: "#compareSlider",
    start: "top 75%",
    once: true,
    onEnter: () => {
      let tweenObj = { val: 50 };
      gsap.timeline()
        .to(tweenObj, {
          val: 70,
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: () => updateSlider(tweenObj.val)
        })
        .to(tweenObj, {
          val: 30,
          duration: 0.8,
          ease: "power2.inOut",
          onUpdate: () => updateSlider(tweenObj.val)
        })
        .to(tweenObj, {
          val: 50,
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: () => {
            updateSlider(50);
            sliderRange.value = 50;
          }
        });
    }
  });
}

// ==========================================
// 5. MODAL DE VIDEOS / DECLARACIONES
// ==========================================
const videoModal = document.getElementById('videoModal');
const videoModalBody = document.getElementById('videoModalBody');
const videoModalTitle = document.getElementById('videoModalTitle');
const videoModalRole = document.getElementById('videoModalRole');

function openVideoModal(title, role, poster, videoUrl = "") {
  videoModalTitle.textContent = title;
  videoModalRole.textContent = role;

  if (videoUrl && videoUrl.toLowerCase().includes('.mp4')) {
    videoModalBody.innerHTML = `
      <video controls autoplay playsinline controlsList="nodownload" style="width: 100%; height: 100%; max-height: 72vh; object-fit: contain; background: #000; border-radius: 8px;">
        <source src="${videoUrl}" type="video/mp4">
        Tu navegador no soporta reproducción de video.
      </video>
    `;
  } else if (videoUrl && (videoUrl.includes('youtube') || videoUrl.includes('youtu.be'))) {
    videoModalBody.innerHTML = `
      <iframe src="${videoUrl}?autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="width: 100%; height: 100%; border: 0;"></iframe>
    `;
  } else {
    // Tarjeta placeholder con preview y llamado a aportar
    videoModalBody.innerHTML = `
      <div style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px;">
        <img src="${poster}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.35;">
        <div style="position: relative; z-index: 2; max-width: 440px;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--tenis-gold); color: #051026; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto 16px auto; font-weight: 900;">▶</div>
          <h3 style="font-family: var(--font-display); font-size: 1.3rem; margin-bottom: 8px; color: #fff;">Video en preparación</h3>
          <p style="font-size: 0.88rem; color: #cbd5e1; margin-bottom: 16px;">
            Estamos recopilando las grabaciones de clases y testimonios de ex-alumnos. Puedes subir tus videos MP4 directamente a la carpeta del sitio.
          </p>
          <a href="#muro" onclick="closeVideoModal()" class="btn btn--gold btn--sm">Aportar mi historia en el muro</a>
        </div>
      </div>
    `;
  }

  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  videoModal.classList.remove('active');
  const vid = videoModalBody.querySelector('video');
  if (vid) {
    vid.pause();
    vid.src = "";
    vid.load();
  }
  videoModalBody.innerHTML = '';
  document.body.style.overflow = '';
}

// ==========================================
// 6. LIGHTBOX PARA IMÁGENES
// ==========================================
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxCaption.textContent = caption || '';
  lightboxModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Cerrar con Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeVideoModal();
    closeLightbox();
  }
});

// ==========================================
// 7. COMPARTIR EN WHATSAPP
// ==========================================
function shareWhatsApp() {
  const message = encodeURIComponent(
    "🚨 ¡Salvemos el Club Escuela de Tenis Arica! Más de 40 años formando generaciones frente a la orden de desalojo municipal. Conoce la historia y firma la carta de apoyo aquí: " + window.location.href
  );
  window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank', 'noopener');
}

// ==========================================
// 8. PETITORIO CIUDADANO (FIRMAS)
// ==========================================
const BASE_SIGNATURES = 1482;

function updateSignatureCounter() {
  const countEl = document.getElementById('signatureCount');
  const barEl = document.getElementById('signatureBar');
  if (!countEl) return;
  const signatures = JSON.parse(localStorage.getItem('ceta_signatures') || '[]');
  const total = BASE_SIGNATURES + signatures.length;
  countEl.textContent = total.toLocaleString('es-CL');
  if (barEl) {
    const pct = Math.min(100, Math.round((total / 2000) * 100));
    barEl.style.width = `${pct}%`;
  }
}

function handlePetitionSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('signerName').value.trim();
  const contact = document.getElementById('signerContact').value.trim();
  const consent = document.getElementById('signerConsent').checked;
  const status = document.getElementById('petitionStatus');

  if (!name || !contact || !consent) return;

  const signatures = JSON.parse(localStorage.getItem('ceta_signatures') || '[]');
  signatures.push({ name, contact, date: new Date().toISOString() });
  localStorage.setItem('ceta_signatures', JSON.stringify(signatures));

  updateSignatureCounter();
  status.textContent = `¡Muchas gracias ${name}! Tu firma ha sido registrada exitosamente.`;
  document.getElementById('petitionForm').reset();

  setTimeout(() => {
    shareWhatsApp();
  }, 1200);
}

// ==========================================
// 9. MURO COMUNITARIO DE RECUERDOS
// ==========================================
const DEFAULT_MEMORIES = [
  {
    author: "Carlos Henríquez",
    role: "Ex-alumno histórico",
    year: "1991",
    text: "Mi primer torneo lo jugué aquí con 10 años en las canchas de polvo. Hoy mis hijos aprenden a jugar en este mismo lugar. No permitan que nos quiten un pedazo de nuestra infancia y de Arica."
  },
  {
    author: "Patricia Morales",
    role: "Abuela y familia",
    year: "2024",
    text: "Mi nieta entrena todos los sábados por la mañana. Ver su sonrisa y su compromiso con el deporte no tiene precio. El tenis aleja a la juventud de las calles."
  },
  {
    author: "Don Fernando Soto (72 años)",
    role: "Socio Adulto Mayor",
    year: "1985",
    text: "Llevo casi 40 años viniendo a jugar tres veces por semana. Es mi salud física y mi familia. El alcalde debe comprender que esto es vida para los adultos mayores de la ciudad."
  },
  {
    author: "Valentina C. (14 años)",
    role: "Alumna Formativa",
    year: "2026",
    text: "Aquí entrenamos con mis compañeras para representar a Arica en los torneos regionales. ¡Queremos seguir entrenando en nuestras canchas!"
  }
];

function loadMemories() {
  const memoryGrid = document.getElementById('memoryGrid');
  if (!memoryGrid) return;

  const saved = JSON.parse(localStorage.getItem('ceta_memories') || '[]');
  const allMemories = [...saved, ...DEFAULT_MEMORIES];

  memoryGrid.innerHTML = '';
  allMemories.forEach(mem => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.innerHTML = `
      <div class="memory-card__author">${escapeHtml(mem.author)}</div>
      <div class="memory-card__meta">${escapeHtml(mem.role)} ${mem.year ? `· Año ${escapeHtml(mem.year)}` : ''}</div>
      <div class="memory-card__text">"${escapeHtml(mem.text)}"</div>
    `;
    memoryGrid.appendChild(card);
  });
}

function handleMemorySubmit(e) {
  e.preventDefault();
  const author = document.getElementById('memAuthor').value.trim();
  const role = document.getElementById('memRole').value;
  const year = document.getElementById('memYear').value.trim();
  const text = document.getElementById('memText').value.trim();

  if (!author || !text) return;

  const saved = JSON.parse(localStorage.getItem('ceta_memories') || '[]');
  saved.unshift({ author, role, year, text });
  localStorage.setItem('ceta_memories', JSON.stringify(saved));

  loadMemories();
  document.getElementById('memoryForm').reset();
  alert('¡Tu recuerdo ha sido publicado con éxito en el lienzo del club!');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
}

// Cargar recuerdos y contador al inicio
document.addEventListener('DOMContentLoaded', () => {
  loadMemories();
  updateSignatureCounter();
});

// Refrescar ScrollTrigger cuando carguen imágenes y fuentes
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
