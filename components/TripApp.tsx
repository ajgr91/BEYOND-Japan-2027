"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { days, highlights, logistics, stops } from "@/data/itinerary";
import Countdown from "./Countdown";
import { ArrowDown, ArrowUpRight, CalendarDays, Check, ChevronDown, Compass, Heart, MapPin, Menu, Plane, TrainFront, X } from "lucide-react";
const Map = dynamic(() => import("./Map"), { ssr:false, loading:()=> <div className="map-loading map-placeholder">Cargando mapa interactivo…</div> });

const nav = [{id:"route",label:"La ruta"},{id:"days",label:"Día a día"},{id:"highlights",label:"Destacados"},{id:"logistics",label:"Logística"}];
export default function TripApp() {
  const [saved,setSaved] = useState<string[]>([]);
  useEffect(() => { try { const stored = window.localStorage.getItem("beyond-japan-favorites"); if (stored) setSaved(JSON.parse(stored)); } catch {} }, []);
  useEffect(() => { try { window.localStorage.setItem("beyond-japan-favorites", JSON.stringify(saved)); } catch {} }, [saved]);
  const [filter,setFilter] = useState("Todos");
  const [menuOpen,setMenuOpen] = useState(false);
  const [showSaved,setShowSaved] = useState(false);
  const [expanded,setExpanded] = useState<number|null>(0);
  const [showAll,setShowAll] = useState(false);
  const categories = ["Todos","Ciudad","Cultura","Naturaleza","Excursión","Traslado","Experiencia","Flexible","Salida"];
  const filteredDays = useMemo(()=>days.filter(d=>filter==="Todos"||d.category===filter),[filter]);
  const toggleSaved = (name:string) => setSaved(s=>s.includes(name)?s.filter(x=>x!==name):[...s,name]);
  const isSaved = (name:string)=>saved.includes(name);
  return <main>
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">B.</span><span>BEYOND <small>JAPAN 2027</small></span></a>
      <nav className={menuOpen?"nav-links open":"nav-links"}>{nav.map(n=><a key={n.id} href={`#${n.id}`} onClick={()=>setMenuOpen(false)}>{n.label}</a>)}</nav>
      <button className="saved-nav" onClick={()=>setShowSaved(!showSaved)}><Heart size={15} fill={showSaved?"currentColor":"none"}/> Guardados <b>{saved.length}</b></button>
      <button className="menu-btn" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Abrir menú">{menuOpen?<X/>:<Menu/>}</button>
    </header>
    {showSaved && <div className="saved-pop"><div className="saved-head"><b>Vuestra lista</b><button onClick={()=>setShowSaved(false)} aria-label="Cerrar"><X size={16}/></button></div>{saved.length===0?<p>Aún no habéis guardado nada. Tocad el corazón en los destacados.</p>:saved.map(s=><div className="saved-item" key={s}>{s}<button onClick={()=>toggleSaved(s)}>Quitar</button></div>)}</div>}
    <section className="hero" id="top">
      <div className="hero-image" />
      <div className="hero-content"><p className="eyebrow light">24 ABRIL — 15 MAYO · 2027</p><h1>Beyond<br/><em>the usual.</em></h1><p className="hero-sub">Un viaje hacia el norte de Japón.<br/>Bosques, ciudades portuarias y caminos antiguos.</p><a href="#route" className="hero-cta">Explorar el viaje <ArrowDown size={16}/></a></div>
      <div className="hero-side">JAPAN / 2027 <span>01 — 22 DAYS</span></div>
      <div className="hero-caption">HOKKAIDO · TOHOKU · CHUBU · KYOTO · TOKYO</div>
    </section>
    <section className="intro section-wrap"><div><span className="eyebrow">EL VIAJE, EN UNA MIRADA</span><h2>Más allá de<br/><em>lo conocido.</em></h2></div><div className="intro-copy"><p>Una segunda vuelta por Japón, esta vez mirando hacia el norte. De Hokkaido a los paisajes de Tohoku, pasando por pueblos de montaña y terminando entre las luces de Tokyo.</p><div className="stats"><div><b>22</b><span>DÍAS</span></div><div><b>21</b><span>NOCHES</span></div><div><b>5</b><span>REGIONES</span></div><div><b>2</b><span>ISLAS</span></div></div></div></section>
    <section className="count-section"><div><span className="eyebrow light">LA CUENTA ATRÁS</span><h2>El norte<br/><em>os espera.</em></h2></div><Countdown/><p className="count-note">Hasta el primer día del viaje · hora de Japón</p></section>
    <section className="section-wrap route-section" id="route"><div className="section-heading"><div><span className="eyebrow">01 / GEOGRAFÍA DEL VIAJE</span><h2>La ruta, <em>sobre el mapa.</em></h2></div><p>De Tokyo a Hokkaido, bajando por Tohoku y los Alpes japoneses hasta Kyoto. Un recorrido de norte a sur, sin perder de vista los desvíos que hacen especial el camino.</p></div><Map stops={stops}/><div className="route-strip">{["TOKYO","HOKKAIDO","TOHOKU","CHUBU","KYOTO","TOKYO"].map((s,i)=><div key={i}><span>0{i+1}</span><b>{s}</b></div>)}</div></section>
    <section className="days-section" id="days"><div className="section-wrap"><div className="section-heading"><div><span className="eyebrow">02 / EL CALENDARIO</span><h2>Día a <em>día.</em></h2></div><p>Veintidós jornadas, con espacio para descubrir y también para dejarse llevar. Abre cada día para ver el plan previsto.</p></div>
      <div className="filter-row">{categories.map(c=><button key={c} className={filter===c?"filter active":"filter"} onClick={()=>setFilter(c)}>{c}</button>)}</div>
      <div className="day-list">{filteredDays.slice(0,showAll?filteredDays.length:12).map((d,i)=><article className={`day-card ${expanded===i?"expanded":""}`} key={d.date}>
        <button className="day-main" onClick={()=>setExpanded(expanded===i?null:i)}><div className="day-date"><b>{d.date.slice(8,10)}</b><span>{d.weekday}</span></div><div className="day-text"><span className="day-place">{d.place} <i>·</i> {d.category}</span><h3>{d.title}</h3><p>{d.description}</p></div><div className="day-right">{d.featured&&<span className="featured-label">DESTACADO</span>}<ChevronDown className={expanded===i?"rotated":""}/></div></button>
        {expanded===i&&<div className="day-details"><div className="tag-row">{d.tags.map(t=><span key={t}>{t}</span>)}</div><button className="save-inline" onClick={()=>toggleSaved(d.title)}><Heart size={15} fill={isSaved(d.title)?"currentColor":"none"}/>{isSaved(d.title)?"Guardado":"Guardar este día"}</button></div>}
      </article>)}</div>
      {filteredDays.length>12&&<button className="outline-btn" onClick={()=>setShowAll(!showAll)}>{showAll?"Ver menos":"Ver todos los días"} <ArrowDown size={15}/></button>}
    </div></section>
    <section className="section-wrap highlights-section" id="highlights"><div className="section-heading"><div><span className="eyebrow">03 / LO QUE NO OS PODÉIS PERDER</span><h2>Pequeños <em>grandes momentos.</em></h2></div><p>Una selección inicial de lugares y experiencias. Guardad vuestros favoritos para tenerlos siempre a mano.</p></div>
      <div className="highlight-grid">{highlights.map((h,i)=><article className={`highlight-card card-${i+1}`} key={h.name}><div className="highlight-image" style={{backgroundImage:`url("${h.image}")`}}/><div className="highlight-overlay"/><div className="highlight-top"><span>{h.type}</span><button aria-label={`Guardar ${h.name}`} onClick={()=>toggleSaved(h.name)}><Heart size={18} fill={isSaved(h.name)?"currentColor":"none"}/></button></div><div className="highlight-copy"><span className="highlight-tag">{h.tag}</span><h3>{h.name}</h3><p>{h.desc}</p></div></article>)}</div>
    </section>
    <section className="logistics-section" id="logistics"><div className="section-wrap"><div className="section-heading"><div><span className="eyebrow light">04 / ANTES DE SALIR</span><h2>La letra <em>pequeña.</em></h2></div><p>Los detalles prácticos que harán que el viaje fluya. Algunos horarios y servicios de 2027 todavía no están publicados: marcadlos para revisar más adelante.</p></div>
      <div className="logistics-grid">{logistics.map((l,i)=><article key={l.title} className="log-card"><span className="log-number">0{i+1}</span><span className="log-type">{l.type}</span><h3>{l.title}</h3><p>{l.detail}</p></article>)}</div>
      <div className="important-note"><span>!</span><p><b>Nota sobre el calendario:</b> Golden Week coincide con varios días de esta ruta (29 abril y 3–5 mayo). Reservad alojamiento y trenes con antelación. La jornada de Oirase/Towada depende de los buses de temporada.</p></div>
    </div></section>
    <footer><a className="brand footer-brand" href="#top"><span className="brand-mark">B.</span><span>BEYOND <small>JAPAN 2027</small></span></a><p>Hecho para perderse un poco. Y encontrar mucho.</p><span className="footer-date">24.04.27 — 15.05.27</span></footer>
  </main>;
}
