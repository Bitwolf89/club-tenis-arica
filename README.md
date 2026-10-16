# Club Escuela de Tenis Arica · Landing Page Oficial

Sitio web editorial e interactivo en defensa del **Club Escuela de Tenis Arica** (40+ años de historia deportiva y comunitaria) frente a la solicitud de desalojo municipal.

---

## 🎾 ¿Cómo ver y probar la página?
1. Haz doble clic en el archivo [`index.html`](index.html) para abrirlo en cualquier navegador moderno (Chrome, Edge, Safari, Firefox).
2. O sírvelo con un servidor local ejecutando en la terminal:
   ```bash
   python -m http.server 8000
   ```
   Y abre en tu navegador: `http://localhost:8000`

---

## 🎨 Dirección de Arte y Paleta Cromática (v4 Editorial)
Diseñada con una estética luminosa, serena y de alta gama para facilitar la lectura descansada mientras los datos críticos resaltan con precisión:
- **Marfil Tiza de Cancha (`--bg-ivory`)**: `#F5F6F2` — Superficie principal tranquila y amigable.
- **Piedra Costera (`--bg-sand`)**: `#EAECE6` — Secciones alternas de descanso visual.
- **Azul Cancha Arica (`--court-blue`)**: `#19528A` — Acento institucional de las canchas del club.
- **Azul Pacífico Profundo (`--court-navy`)**: `#0E2238` — Contraste arquitectónico en la sección de la Carta Abierta al Alcalde y el pie de página.
- **Coral Cívico (`--urgent-coral`)**: `#C83E26` — Reservado exclusivamente para destacar datos urgentes (orden de desalojo e hitos críticos).
- **Lima Pelota de Tenis (`--tennis-volt`)**: `#C6EA1B` — Acento de energía deportiva sobre superficies oscuras.

### Tipografía y Movimiento
- **Titulares y Citas**: `Newsreader` (Serif editorial de alto contraste).
- **Cuerpo, UI y Cifras Tabulares**: `Plus Jakarta Sans`.
- **Scroll Fluido con Mouse**: Motor inercial **Lenis** sincronizado cuadro a cuadro con **GSAP 3.12 + ScrollTrigger** (con soporte automático para `prefers-reduced-motion`).
