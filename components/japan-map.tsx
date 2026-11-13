'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { chapters } from '../lib/journey';
import { layoutMapLabels, type MapLabel, type MapRect } from '../lib/map-label-layout';
import './japan-map-labels.css';
import { illustratedPolygons, mapBounds, mapPoint, reliefHeight, waveOffset, type JapanGeometry } from '../lib/japan-relief';

type Props = {
  selected: number; onSelect?: (index: number) => void; overview?: boolean;
  flat?: boolean; zoom?: number;
  bearing?: number; onBearingChange?: (bearing: number) => void; onZoomChange?: (zoom: number) => void;
};
const stops = [
  { name: 'Tokio', coords: [139.6917, 35.6895], chapter: 0 },
  { name: 'Sapporo', coords: [141.3545, 43.0618], chapter: 1 },
  { name: 'Hakodate', coords: [140.729, 41.7687], chapter: 1 },
  { name: 'Aomori', coords: [140.7474, 40.8222], chapter: 2 },
  { name: 'Sendai', coords: [140.8694, 38.2682], chapter: 3 },
  { name: 'Matsumoto', coords: [137.972, 36.238], chapter: 4 },
  { name: 'Kioto', coords: [135.7681, 35.0116], chapter: 5 },
  { name: 'Otaru', coords: [140.9947, 43.1907], chapter: 1 },
  { name: 'Hirosaki', coords: [140.473, 40.603], chapter: 2 },
  { name: 'Oirase', coords: [141.02, 40.535], chapter: 2 },
  { name: 'Towada', coords: [140.88, 40.46], chapter: 2 },
  { name: 'Matsushima', coords: [141.065, 38.371], chapter: 3 },
  { name: 'Narai-juku', coords: [137.811, 35.966], chapter: 4 },
  { name: 'Universal Studios', coords: [135.432, 34.665], chapter: 5 },
];
const westLabels = new Set(['Hakodate', 'Aomori', 'Matsumoto', 'Kioto', 'Otaru', 'Hirosaki', 'Narai-juku']);
const chapterStops = [0, 1, 3, 4, 5, 6, 0];
function project(lon: number, lat: number, blend = 1) {
  const [x, z] = mapPoint(lon, lat);
  return new THREE.Vector3(x, reliefHeight(x, z, blend), z);
}
const cloudShader = `
varying vec2 vUv; uniform float uTime; uniform float uBlend;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,v=0.;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+4.3;a*=.5;}return v;}
void main(){vec2 p=vUv*vec2(5.,7.)+vec2(uTime*.018,uTime*.009);float n=fbm(p+fbm(p*.65));float edge=smoothstep(0.,.2,vUv.x)*smoothstep(1.,.8,vUv.x)*smoothstep(0.,.2,vUv.y)*smoothstep(1.,.8,vUv.y);float a=smoothstep(.47,.75,n)*edge*(.13+.30*uBlend);gl_FragColor=vec4(.957,.945,.910,a);}
`;

function makeTextures(data: JapanGeometry) {
  const size = 2048, width = mapBounds.right - mapBounds.left, depth = mapBounds.bottom - mapBounds.top;
  const pixel = (x: number, z: number) => [(x - mapBounds.left) / width * size, (z - mapBounds.top) / depth * size];
  const mask = document.createElement('canvas'); mask.width = mask.height = size;
  const ink = document.createElement('canvas'); ink.width = ink.height = size;
  const maskContext = mask.getContext('2d')!, context = ink.getContext('2d')!;
  maskContext.fillStyle = 'black'; maskContext.fillRect(0, 0, size, size); maskContext.fillStyle = 'white';
  for (const polygon of illustratedPolygons(data)) {
    maskContext.beginPath();
    for (const ring of polygon) {
      ring.forEach(([x, z], i) => { const p = pixel(x, z); if (!i) maskContext.moveTo(p[0], p[1]); else maskContext.lineTo(p[0], p[1]); });
      maskContext.closePath();
    }
    maskContext.fill('evenodd');
  }
  const wash = context.createLinearGradient(0, 0, size, size);
  wash.addColorStop(0, '#fafcf6'); wash.addColorStop(1, '#d8e1d8');
  context.fillStyle = wash; context.fillRect(0, 0, size, size);
  for (let z = mapBounds.top - .5; z < mapBounds.bottom + .5; z += .23) {
    context.beginPath();
    for (let x = mapBounds.left; x <= mapBounds.right; x += .035) {
      const p = pixel(x, z + waveOffset(x, z));
      if (x === mapBounds.left) context.moveTo(p[0], p[1]); else context.lineTo(p[0], p[1]);
    }
    context.strokeStyle = '#82988866'; context.lineWidth = 1.2;
    context.save(); context.translate(0, 2.5); context.stroke(); context.restore();
    context.strokeStyle = '#fcfff3dc'; context.lineWidth = 2; context.stroke();
  }
  context.fillStyle = '#46534709'; let seed = 23;
  for (let i = 0; i < 18000; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0; const x = seed / 4294967296 * size;
    seed = (seed * 1664525 + 1013904223) >>> 0; context.fillRect(x, seed / 4294967296 * size, 1, 1);
  }
  const alpha = new THREE.CanvasTexture(mask), color = new THREE.CanvasTexture(ink);
  color.colorSpace = THREE.SRGBColorSpace;
  return { alpha, color };
}

export default function JapanMap({ selected, onSelect, overview = false, flat = false, zoom = 1, bearing = 0, onBearingChange, onZoomChange }: Props) {
  const host = useRef<HTMLDivElement>(null), labels = useRef<(HTMLButtonElement | null)[]>([]);
  const dots = useRef<(HTMLButtonElement | null)[]>([]), leaders = useRef<(SVGPathElement | null)[]>([]);
  const [failed, setFailed] = useState(false), [ready, setReady] = useState(false);
  const state = useRef({ selected, overview, flat, zoom, bearing });
  state.current = { selected, overview, flat, zoom, bearing };
  const callbacks = useRef({ onSelect, onBearingChange, onZoomChange }); callbacks.current = { onSelect, onBearingChange, onZoomChange };
  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    let dead = false, frame = 0, visible = true, lastFrame = 0, lastBlend = -1, mapReady = false;
    let textures: ReturnType<typeof makeTextures> | undefined;
    const abort = new AbortController();
    const fail = () => { if (!dead) { setFailed(true); } };
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch { fail(); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75)); renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute('aria-hidden', 'true'); container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-10, 10, 8, -8, .1, 100);
    const center = state.current.overview ? new THREE.Vector3(0, 0, -1.4) : project(...chapters[state.current.selected].coords);
    camera.position.copy(center).add(new THREE.Vector3(-3, 20, 13));
    renderer.domElement.style.touchAction = 'pan-y';
    let inclination = state.current.flat ? .002 : .58;
    let angle = THREE.MathUtils.degToRad(state.current.bearing), manualTilt = .58;
    const pointers = new Map<number, { x: number; y: number }>();
    let gesture = { x: 0, y: 0, bearing: 0, tilt: .58, distance: 0, zoom: 1 };
    const normalize = (value: number) => (value % 360 + 360) % 360;
    const changeZoom = (value: number) => callbacks.current.onZoomChange?.(Math.max(.5, Math.min(4, value)));
    const pointerDown = (event: PointerEvent) => {
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      renderer.domElement.setPointerCapture(event.pointerId);
      const points = [...pointers.values()];
      gesture = { x: event.clientX, y: event.clientY, bearing: state.current.bearing, tilt: manualTilt,
        distance: points.length === 2 ? Math.hypot(points[0].x-points[1].x, points[0].y-points[1].y) : 0, zoom: state.current.zoom };
      renderer.domElement.classList.add('is-dragging');
    };
    const pointerMove = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const points = [...pointers.values()];
      if (points.length === 2 && gesture.distance > 0) {
        changeZoom(gesture.zoom * Math.hypot(points[0].x-points[1].x, points[0].y-points[1].y) / gesture.distance);
      } else if (points.length === 1) {
        callbacks.current.onBearingChange?.(normalize(gesture.bearing - (event.clientX - gesture.x) * .35));
        if (!state.current.flat) manualTilt = Math.max(.15, Math.min(1.1, gesture.tilt + (event.clientY - gesture.y) * .005));
      }
    };
    const pointerUp = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
      if (!pointers.size) renderer.domElement.classList.remove('is-dragging');
    };
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault(); changeZoom(state.current.zoom * Math.exp(-event.deltaY * .005));
    };
    renderer.domElement.addEventListener('pointerdown', pointerDown);
    renderer.domElement.addEventListener('pointermove', pointerMove);
    renderer.domElement.addEventListener('pointerup', pointerUp);
    renderer.domElement.addEventListener('pointercancel', pointerUp);
    renderer.domElement.addEventListener('wheel', wheel, { passive: false });
    scene.add(new THREE.AmbientLight(0xf3f4ec, 2));
    const sun = new THREE.DirectionalLight(0xfffaee, 1.1); sun.position.set(-7, 18, 6); scene.add(sun);
    const width = mapBounds.right - mapBounds.left, depth = mapBounds.bottom - mapBounds.top;
    const surface = new THREE.PlaneGeometry(width, depth, 180, 202);
    surface.rotateX(-Math.PI / 2); surface.translate(0, 0, (mapBounds.top + mapBounds.bottom) / 2);
    const material = new THREE.MeshStandardMaterial({ color: '#b8c9b8', roughness: 1, alphaTest: .5, side: THREE.DoubleSide, transparent: true });
    const paper = new THREE.Mesh(surface, material); paper.visible = false; scene.add(paper);
    const shadowGeometry = new THREE.PlaneGeometry(width, depth); shadowGeometry.rotateX(-Math.PI / 2);
    shadowGeometry.translate(0, -.045, (mapBounds.top + mapBounds.bottom) / 2);
    const shadowMaterial = new THREE.MeshBasicMaterial({ color: '#7c9180', alphaTest: .5, transparent: true, opacity: .13, depthWrite: false, side: THREE.DoubleSide });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial); shadow.position.set(.025, 0, .035); shadow.visible = false; scene.add(shadow);
    const routes = new THREE.Group(); scene.add(routes);
    const pathStops = [stops[0], stops[1], stops[2], stops[3], stops[4], stops[5], stops[6], stops[0]];
    const routePoints: THREE.Vector3[][] = [], routeMaterials: THREE.LineBasicMaterial[] = [];
    pathStops.slice(1).forEach((stop, i) => {
      const a = project(...pathStops[i].coords as [number, number]), b = project(...stop.coords as [number, number]);
      const mid = a.clone().lerp(b, .5); mid.x -= i === 0 ? .8 : .06;
      const points = new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(90); routePoints.push(points);
      const routeMaterial = i === 0 ? new THREE.LineDashedMaterial({ color: '#a65343', dashSize: .055, gapSize: .075, transparent: true, opacity: .65 }) : new THREE.LineBasicMaterial({ color: '#a65343', transparent: true, opacity: .8 });
      routeMaterials.push(routeMaterial);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), routeMaterial); line.computeLineDistances(); routes.add(line);
    });
    const markers = stops.map(stop => project(...stop.coords as [number, number]));
    const mistMaterial = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: { uTime: { value: 0 }, uBlend: { value: 1 } }, vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}', fragmentShader: cloudShader });
    const mist = new THREE.Mesh(new THREE.PlaneGeometry(20, 24), mistMaterial); mist.rotation.x = -Math.PI / 2; mist.position.set(0, .8, -1); scene.add(mist);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let motionReduced = reduced.matches, time = 0, size = 8;
    const onMotion = () => { motionReduced = reduced.matches; }; reduced.addEventListener('change', onMotion);
    let labelSizes: { width: number; height: number }[] = [], sizesDirty = true;
    const labelObserver = new ResizeObserver(() => { sizesDirty = true; });
    labels.current.forEach(label => { if (label) labelObserver.observe(label); });
    let slots = new Map<number, number>();
    let layoutKey = '';
    const resize = () => { const { width, height } = container.getBoundingClientRect(); if (!width || !height) return; renderer.setSize(width, height); };
    const ro = new ResizeObserver(resize); ro.observe(container); resize();
    const io = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }); io.observe(container);
    const onLost = (event: Event) => { event.preventDefault(); visible = false; fail(); }; renderer.domElement.addEventListener('webglcontextlost', onLost);
    fetch('/japan.json', { signal: abort.signal }).then(response => { if (!response.ok) throw Error('map'); return response.json() as Promise<JapanGeometry>; }).then(data => {
      if (dead) return;
      textures = makeTextures(data); material.alphaMap = textures.alpha; material.map = textures.color; material.needsUpdate = true;
      shadowMaterial.alphaMap = textures.alpha; shadowMaterial.needsUpdate = true;
      paper.visible = shadow.visible = true; mapReady = true; setReady(true);
    }).catch(error => { if (error.name !== 'AbortError') fail(); });
    function updateRelief(b: number) {
      const vertices = surface.getAttribute('position');
      for (let i = 0; i < vertices.count; i++) vertices.setY(i, reliefHeight(vertices.getX(i), vertices.getZ(i), b));
      vertices.needsUpdate = true; surface.computeVertexNormals();
      material.color.set('#90998f').lerp(new THREE.Color('#b9cbb9'), b); material.opacity = .7 + .3 * b; shadowMaterial.opacity = .04 + .12 * b;
      routes.children.forEach((child, index) => { const buffer = (child as THREE.Line).geometry.getAttribute('position'); routePoints[index].forEach((p, i) => buffer.setXYZ(i, p.x, reliefHeight(p.x, p.z, b) + .06, p.z)); buffer.needsUpdate = true; routeMaterials[index].opacity = .4 + .38 * b; });
      for (const dot of markers) dot.y = reliefHeight(dot.x, dot.z, b) + .065;
      mistMaterial.uniforms.uBlend.value = b; lastBlend = b;
    }
    function animate(now: number) {
      frame = requestAnimationFrame(animate); const elapsed = Math.min(60, now - lastFrame);
      if (!visible || now - lastFrame < 1000 / 40) return; lastFrame = now;
      const current = state.current, b = 1;
      const target = current.overview ? new THREE.Vector3(0, 0, -1.4) : project(...chapters[current.selected].coords);
      const aspect = container.clientWidth / Math.max(1, container.clientHeight);
      const desiredSize = (current.overview ? Math.max(8.5, 7.3 / aspect) : current.selected === 1 ? 3.8 : current.selected === 2 ? 2.3 : 2.5) / current.zoom;
      const speed = motionReduced ? 1 : 1 - Math.exp(-elapsed / 260);
      center.lerp(target, speed);
      inclination = THREE.MathUtils.lerp(inclination, current.flat ? .002 : manualTilt, speed);
      const desiredAngle = THREE.MathUtils.degToRad(current.bearing);
      angle += Math.atan2(Math.sin(desiredAngle-angle), Math.cos(desiredAngle-angle)) * (motionReduced ? 1 : .22);
      const radius = Math.sin(inclination) * 25;
      camera.position.copy(center).add(new THREE.Vector3(Math.sin(angle) * radius, Math.cos(inclination) * 25, Math.cos(angle) * radius));
      camera.up.set(0, 1, 0); camera.lookAt(center);
      size = THREE.MathUtils.lerp(size, desiredSize, speed);
      camera.left = -size * aspect; camera.right = size * aspect; camera.top = size; camera.bottom = -size; camera.updateProjectionMatrix();
      if (Math.abs(b - lastBlend) > .0001) updateRelief(b);
      if (!motionReduced) time += elapsed / 1000; mistMaterial.uniforms.uTime.value = time;
      renderer.render(scene, camera);
      // Project only after render updates the camera's world matrix.
      const width = container.clientWidth, height = container.clientHeight;
      const key = `${current.selected}/${current.overview}/${width}/${height}`;
      if (key !== layoutKey) { slots.clear(); sizesDirty = true; layoutKey = key; }
      if (sizesDirty) { labelSizes = labels.current.map(el => ({ width: el?.offsetWidth ?? 0, height: el?.offsetHeight ?? 0 })); sizesDirty = false; }
      const compact = width <= 480;
      const bounds = { x: compact ? 12 : 24, y: compact ? 40 : 66, width: width - (compact ? 70 : 110), height: height - (compact ? 78 : 142) };
      const hostRect = container.getBoundingClientRect();
      const obstacles: MapRect[] = [];
      for (const selector of ['.map-tools', '.map-chapter-nav']) {
        const rect = container.parentElement?.querySelector(selector)?.getBoundingClientRect();
        if (rect?.width && rect.height) obstacles.push({ x: rect.left - hostRect.left - 8, y: rect.top - hostRect.top - 8, width: rect.width + 16, height: rect.height + 16 });
      }
      const candidates: MapLabel[] = [];
      for (let i = 0; i < stops.length; i++) {
        const el = labels.current[i], dot = dots.current[i], leader = leaders.current[i]; if (!el || !dot || !leader) continue;
        const primary = i === chapterStops[current.selected];
        const nearby = stops[i].chapter === current.selected;
        const show = i < 7 || (!current.overview && nearby);
        const p = markers[i].clone().project(camera);
        const x = (p.x * .5 + .5) * width, y = (-p.y * .5 + .5) * height;
        const inFrame = mapReady && show && p.z > -1 && p.z < 1 && x > bounds.x && x < bounds.x + bounds.width && y > bounds.y && y < bounds.y + bounds.height;
        el.style.visibility = 'hidden'; el.style.opacity = '0';
        dot.hidden = !inFrame; leader.style.visibility = 'hidden';
        if (!inFrame) continue;
        dot.style.transform = `translate(${x - 16}px,${y - 16}px)`;
        dot.tabIndex = 0;
        candidates.push({ id: i, x, y, ...labelSizes[i], priority: primary ? 3 : nearby ? 2 : 1, west: westLabels.has(stops[i].name) });
      }
      const placed = layoutMapLabels(candidates, bounds, obstacles, slots);
      slots = new Map(placed.map(label => [label.id, label.slot]));
      for (const label of placed) {
        const el = labels.current[label.id]!, leader = leaders.current[label.id]!;
        el.style.transform = `translate(${label.left}px,${label.top}px)`;
        el.style.visibility = 'visible'; el.style.opacity = '1'; dots.current[label.id]!.tabIndex = -1;
        const endX = Math.max(label.left, Math.min(label.x, label.left + label.width));
        const endY = Math.max(label.top, Math.min(label.y, label.top + label.height));
        leader.setAttribute('d', `M ${label.x} ${label.y} L ${(label.x + endX) / 2} ${endY} L ${endX} ${endY}`);
        leader.style.visibility = 'visible';
      }
    }
    frame = requestAnimationFrame(animate);
    return () => {
      dead = true; abort.abort(); cancelAnimationFrame(frame); ro.disconnect(); io.disconnect(); labelObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', pointerDown);
      renderer.domElement.removeEventListener('pointermove', pointerMove);
      renderer.domElement.removeEventListener('pointerup', pointerUp);
      renderer.domElement.removeEventListener('pointercancel', pointerUp);
      renderer.domElement.removeEventListener('wheel', wheel);
      reduced.removeEventListener('change', onMotion); renderer.domElement.removeEventListener('webglcontextlost', onLost);
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
      scene.traverse(object => { if ('geometry' in object) geometries.add(object.geometry as THREE.BufferGeometry); if ('material' in object) (Array.isArray(object.material) ? object.material : [object.material]).forEach(m => materials.add(m)); });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(m => m.dispose()); textures?.alpha.dispose(); textures?.color.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  function selectStop(index: number) { callbacks.current.onSelect?.(stops[index].chapter); }
  return <div className={`japan-map japan-waves ${overview ? 'map-overview' : ''}`} data-failed={failed} ref={host} role="group" tabIndex={0} onKeyDown={event => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); onBearingChange?.((bearing + (event.key === 'ArrowRight' ? 15 : -15) + 360) % 360); }
    if (['+', '=', '-'].includes(event.key)) { event.preventDefault(); onZoomChange?.(Math.max(.5, Math.min(4, zoom * (event.key === '-' ? .8 : 1.25)))); }
    if (event.key === 'Home') { event.preventDefault(); onBearingChange?.(0); onZoomChange?.(1); }
  }} aria-label="Mapa interactivo de Japón, ilustrado con ondas de tinta y relieve suave">
    {failed ? <div className="map-fallback"><img src="/japan-waves.svg" alt="Silueta de Japón con ondas de tinta" /><div>{chapters.map((chapter, i) => <button key={chapter.id} onClick={() => callbacks.current.onSelect?.(i)} aria-pressed={selected === i}>{String(i + 1).padStart(2, '0')} · {chapter.name} ↗</button>)}</div></div> : <>
      {!ready && <div className="map-loading">Dibujando Japón <span>···</span></div>}
      <svg className="map-label-leaders" aria-hidden="true">{stops.map((stop, i) => <path key={stop.name} ref={el => { leaders.current[i] = el; }} data-selected={i === chapterStops[selected]} />)}</svg>
      {stops.map((stop, i) => {
        const primary = i === chapterStops[selected];
        return <div className="map-location" key={stop.name}>
          <button className="map-location-dot" ref={el => { dots.current[i] = el; }} hidden data-selected={primary} tabIndex={-1} aria-label={`Ver etapa de ${stop.name}`} onClick={() => selectStop(i)} />
          <button ref={el => { labels.current[i] = el; }} className="map-location-label" data-selected={primary} data-nearby={stop.chapter === selected} style={{ opacity: 0, visibility: 'hidden' }} aria-label={primary ? `Etapa actual, capítulo ${selected + 1}: ${stop.name}` : `Ver etapa de ${stop.name}`} aria-pressed={primary} onClick={() => selectStop(i)}>
            {primary && <small>{String(selected + 1).padStart(2, '0')} / ETAPA ACTUAL</small>}
            <span>{stop.name}</span>
          </button>
        </div>;
      })}
      <div className="map-water sea-one">MAR DEL JAPÓN</div><div className="map-water sea-two">OCÉANO PACÍFICO</div>
    </>}
  </div>;
}
