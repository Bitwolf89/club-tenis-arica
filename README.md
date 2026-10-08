# Club Escuela de Tenis Arica - Landing Page Oficial

Sitio web interactivo y línea de tiempo comunitaria en defensa del **Club Escuela de Tenis Arica** frente a la orden de desalojo municipal.

---

## 🎾 ¿Cómo ver y probar la página?
1. Haz doble clic en el archivo [`index.html`](index.html) para abrirlo en cualquier navegador (Chrome, Edge, Safari, Firefox).
2. También puedes servirlo con un servidor local ejecutando en la terminal:
   ```bash
   python -m http.server 8000
   ```
   Y abrir en tu navegador: `http://localhost:8000`

---

## 🎨 Identidad Visual y Colores Implementados
Basado en los colores oficiales del club y los lienzos gráficos:
- **Azul Noche / Fondo Principal**: `#061325` / `#0a1d38`
- **Azul Tenis de Arica**: `#1657c2`
- **Amarillo / Lima Eléctrico Pelota Tenis**: `#d8f610` / `#ccf000`
- **Blanco Nítido**: `#ffffff`
- **Alerta Desalojo**: `#ef4444`

---

## 📂 Cómo ir subiendo más información

### 1. Para agregar o cambiar fotos históricas y actuales
- Coloca tus nuevas imágenes en esta misma carpeta (ejemplo: `foto_historica_1985.jpg` o `torneo_menores_2026.jpg`).
- En [`index.html`](index.html), busca la sección `<section id="linea-tiempo">` o `<section id="comparativa">` y reemplaza el atributo `src` con el nombre de tu archivo.

### 2. Para agregar videos reales (MP4 o YouTube)
En la sección `<section id="videos">`, cada tarjeta tiene un disparador `playVideoModal(...)`. 
Si quieres reproducir un video MP4 local:
1. Guarda tu video como `video_clase_1.mp4` en esta carpeta.
2. En el modal `<div id="videoModal">`, puedes agregar la etiqueta `<video controls src="tu_video.mp4">` para reproducirlo directamente.
3. O si prefieres un video de YouTube, puedes insertar un `<iframe>` de YouTube estándar con la URL de tu video.

### 3. Para actualizar los hitos de la línea de tiempo
En el archivo [`index.html`](index.html), dentro del bloque `<div class="space-y-16 sm:space-y-24">`, cada hito está claramente documentado como:
- `Hito 01 • Las Raíces (1984)`
- `Hito 02 • El Legado Familiar (2000)`
- `Hito 03 • Comunidad Activa (Hoy)`
- `Hito 04 • El Conflicto (Orden de Desalojo)`
- `Hito 05 • Propuesta Ciudadana (Alcalde Orlando Vargas, conversemos)`

---

## 🚀 Cómo publicar en internet (Gratis)
- **Opción A (GitHub Pages)**: Sube esta carpeta a un repositorio en GitHub y activa GitHub Pages en la pestaña *Settings > Pages*.
- **Opción B (Netlify Drop / Vercel)**: Arrastra la carpeta directamente a [app.netlify.com/drop](https://app.netlify.com/drop) y tendrás un enlace público en menos de 1 minuto para compartir en WhatsApp y redes sociales.
