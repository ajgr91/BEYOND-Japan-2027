# BEYOND — Un cuaderno de Japón

Cuaderno de viaje con portada editorial: papel cálido, fotografía de Oirase, títulos serif y un atlas independiente con el acabado **Ondas y tinta**.

Experiencia editorial local para presentar el viaje del **24 de abril al 15 de mayo de 2027**. Combina un cuaderno de siete capítulos con cartografía WebGL, nubes procedurales y saltos de cámara entre regiones.

## Ver en local

Requiere Node.js 22.13 o posterior.

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 3000
```

Abre http://127.0.0.1:3000. Los cambios se actualizan durante el desarrollo.

```sh
npx tsc --noEmit
npm run build
```

## Contenido y funciones

- Siete capítulos, 21 noches y las 22 jornadas del viaje.
- Tokio 2 noches; Hokkaidō 4 (Sapporo 2 + Hakodate 2); Aomori 5; Sendai 2; Matsumoto 2; Kioto 3; Tokio 3.
- Universal Studios Japan el 11 de mayo, como excursión desde Kioto.
- Portada fotográfica y editorial con un acceso al recorrido, sin mapa ni controles visuales.
- Atlas Three.js con silueta de Japón y ondas gráficas. Vista 2D y relieve, paradas, conexiones, giro por arrastre o botones, zoom de 0,5× a 4× y orientación al norte. El zoom mantiene la orientación. También admite teclado (flechas, +/− y Home) y gesto de pinza.
- Atmósfera sutil con un shader procedural y respeto de `prefers-reduced-motion`.
- Cuaderno con filtro de etapa y días desplegables. Velado con transición de opacidad y panel que entra desde la derecha, con cierre animado y Escape.
- Lenis para scroll y saltos a secciones y etapas; el panel conserva su desplazamiento nativo.
- Revelado de titulares y galería, parallax y movimiento continuo del banner de Kioto.
- Música local: `public/audio/naruto-main-theme.mp3`, aportada por el usuario como `Naruto+Main+Theme.mp3`. Solicita autoplay con sonido al cargar y cuando el MP3 está listo; bucle y volumen inicial del 25 %. ON solo se muestra durante la reproducción real. Si el navegador bloquea autoplay, aparece ACTIVAR y arranca con la primera interacción. La web no puede anular la política de autoplay del navegador. El botón ON/OFF está en la esquina inferior izquierda.
- Vuelos internos confirmados: primer paso de preparación completado; sin inventar horarios ni números de vuelo.
- Panel de logística con traslados, distribución de noches y pendientes.
- Diseño adaptable y navegación por teclado. Si WebGL no está disponible, el mapa ofrece una lista de etapas.
- Fuentes, cartografía y fotografías alojadas en el propio proyecto.

## Editar

- `lib/journey.ts`: itinerario, destacados, textos y logística.
- `components/travel-cover.tsx` y `components/travel-cover.css`: portada editorial.
- `lib/japan-relief.ts`: silueta, ondas y disposición de las islas.
- `components/japan-map.tsx`: escena Three.js, coordenadas y shader.
- `app/page.tsx`: narrativa y paneles interactivos.
- `app/globals.css`: diseño base.
- `hooks/use-animated-drawer.ts`: apertura/cierre del panel después de asignar foco en su posición final, sin desplazar el contenedor de la página.
- `hooks/use-page-motion.ts` y `components/page-motion.css`: Lenis, animaciones, panel, galería y ajustes de lectura para pantallas grandes.
- `components/background-music.tsx` y su CSS: reproducción del MP3 y control ON/OFF.
- `public/images`: fotografías; `public/japan.json`: geometría de Japón.

## Referencias y alcance

Dirección visual inspirada en [FŪDO de Tree Public Squares](https://fudo.tree-public-squares.com/). Contenido inicial extraído del [hilo compartido del viaje](https://chatgpt.com/share/6af3627d-1e54-83ed-8768-30550a0dac2d).

El relieve es una interpretación gráfica, no elevación topográfica medida. Las líneas representan conexiones, no trazados ferroviarios. Los puntos usan coordenadas geográficas de referencia. El usuario ha confirmado los vuelos internos. No se han facilitado sus horarios ni números de vuelo; el resto de reservas y precios sigue pendiente.

Cartografía [Natural Earth](https://www.naturalearthdata.com/), dominio público. Fotografías de referencia de Unsplash, JNTO, Towada Oirase Tourism, Japan Alps y JR East, enlazadas en el pie de la web. Las fotos de organismos y publicaciones se incluyen para revisión local; revisar sus condiciones o sustituirlas por fotografías propias o licenciadas antes de publicar. Las imágenes ilustran los destinos, sin garantizar su aspecto en las fechas del viaje.

Fuentes DM Sans e Instrument Serif con licencias OFL en `public/fonts`.

Proyecto React + TypeScript con el entorno de desarrollo Vinext/Vite. Este trabajo se ha preparado y comprobado **en local**, sin desplegar ni modificar la web publicada. `npm run build` genera la compilación del entorno actual; para un alojamiento distinto, adaptar su salida al proveedor elegido.
