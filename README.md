# BEYOND — Japan 2027

Web editorial responsive para presentar el viaje a Japón del 24 de abril al 15 de mayo de 2027.

## Incluye
- Mapa interactivo con puntos, etiquetas, línea de recorrido y ficha al seleccionar cada lugar.
- Calendario de 22 días con filtros por tipo de actividad y paneles desplegables.
- Destacados con fotografías y lista de favoritos local.
- Logística, alertas de Golden Week y notas pendientes de verificar.
- Cuenta atrás automática hasta el 24 de abril de 2027.
- Diseño responsive para móvil, tablet y escritorio.

## Ejecutar en local

Necesitas Node.js 20.9 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000

Para comprobar la compilación de producción:

```bash
npm run build
npm run start
```

## Publicar en Vercel
1. Descomprime el ZIP.
2. Sube el contenido de la carpeta a un repositorio nuevo en GitHub.
3. Entra en https://vercel.com/new e importa ese repositorio.
4. Framework: Next.js (detección automática). No necesitas variables de entorno.
5. Pulsa Deploy. Vercel generará una URL `*.vercel.app`.

## Personalización
- Fechas, paradas, días y logística: `data/itinerary.ts`.
- Estilos: `app/globals.css`.
- Mapa y marcadores: `components/Map.tsx`.
- Imágenes: URLs de Unsplash en `data/itinerary.ts` y en `app/globals.css`.

## Notas importantes
- El mapa usa Leaflet y teselas de OpenStreetMap. Se muestra atribución en el propio mapa; respeta la política de uso de teselas de OpenStreetMap.
- Las imágenes son remotas desde Unsplash; hace falta conexión a internet para cargarlas.
- Los favoritos se guardan en el navegador mediante localStorage; no se sincronizan entre dispositivos ni miembros del grupo.
- El itinerario es una propuesta inicial. Los horarios de buses de Oirase/Towada, trenes y calendario de USJ de 2027 deben confirmarse cuando se publiquen.
- La ruta de Narai-juku el día de traslado a Kyoto puede ser apretada. Considerad dejar equipaje en Matsumoto y confirmar conexiones; si no encaja, usad ese día solo para viajar.
- El número de noches y el calendario siguen la distribución acordada: Tokyo 2 + Hokkaido 4 + Aomori 5 + Sendai 2 + Matsumoto 2 + Kyoto 3 + Tokyo 3 = 21 noches.
