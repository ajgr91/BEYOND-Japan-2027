'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,ArrowDown,ChevronDown,Compass,Maximize2,Minus,Plus,TrainFront,X,MoveUpRight,RotateCcw,RotateCw} from 'lucide-react';
import JapanMap from '../components/japan-map';
import TravelCover from '../components/travel-cover';
import BackgroundMusic from '../components/background-music';
import {usePageMotion} from '../hooks/use-page-motion';
import {useAnimatedDrawer} from '../hooks/use-animated-drawer';
import {chapters,dayPlans,highlights,logistics} from '../lib/journey';

type Panel='journal'|'logistics'|null;
const number=(n:number)=>String(n).padStart(2,'0');
function dateForDay(i:number){return new Date(Date.UTC(2027,3,24+i)).toLocaleDateString('es-ES',{day:'numeric',month:'short',timeZone:'UTC'}).replace('.','');}
export default function Home(){
 const {scrollTo,stopScroll,startScroll}=usePageMotion();
 const [active,setActive]=useState(0),[flat,setFlat]=useState(true),[bearing,setBearing]=useState(0),[zoom,setZoom]=useState(1),[overview,setOverview]=useState(true);
 const [panel,setPanel]=useState<Panel>(null),[filter,setFilter]=useState(-1),[openDay,setOpenDay]=useState<number|null>(null);
 const {modal,close}=useAnimatedDrawer({open:panel!==null,onClosed:()=>setPanel(null),stopScroll,startScroll});
 const articleRefs=useRef<(HTMLElement|null)[]>([]),chapterLock=useRef<number|null>(null);
 useEffect(()=>{
  let frame=0;
  const update=()=>{
   frame=0;
   if(chapterLock.current!==null)return;
   const readingLine=window.innerWidth<=760?64+window.innerHeight*.44+60:window.innerHeight*.6;
   const index=articleRefs.current.findIndex(article=>{if(!article)return false;const rect=article.getBoundingClientRect();return rect.top<=readingLine&&rect.bottom>readingLine;});
   if(index>=0)setActive(index);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  // Keep an explicit map selection while its camera and chapter settle.
  // Reading the page again releases that selection and resumes scroll following.
  const resume=(event:Event)=>{
   const target=event.target as Element|null;
   const inAtlas=target?.closest('.atlas-map');
   if(event.type==='pointerdown'&&inAtlas)return;
   if(event instanceof WheelEvent&&(event.ctrlKey||event.metaKey)&&inAtlas)return;
   if(event instanceof KeyboardEvent&&(inAtlas||!['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(event.key)))return;
   chapterLock.current=null;schedule();
  };
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
  window.addEventListener('wheel',resume,{passive:true});window.addEventListener('touchmove',resume,{passive:true});window.addEventListener('pointerdown',resume);window.addEventListener('keydown',resume);
  update();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);window.removeEventListener('wheel',resume);window.removeEventListener('touchmove',resume);window.removeEventListener('pointerdown',resume);window.removeEventListener('keydown',resume);};
 },[]);
 const jump=(i:number)=>{chapterLock.current=i;setActive(i);setOverview(false);const article=articleRefs.current[i];if(article)scrollTo(article);};
 const showDays=(i=-1)=>{setFilter(i);setOpenDay(null);setPanel('journal');};

 return <>
  <header className="site-header">
   <a href="#" className="wordmark" aria-label="BEYOND, inicio">beyond.</a>
   <span className="header-edition">JAPAN FIELD NOTES <span>—</span> 2027</span>
   <nav aria-label="Navegación principal"><a href="#mapa">El recorrido <ArrowUpRight size={12}/></a><button onClick={()=>showDays()}>Cuaderno</button><button onClick={()=>setPanel('logistics')}>Logística</button></nav>
  </header>
  <main>
   <TravelCover />
   <section className="prologue" id="prologo"><div className="prologue-side"><span className="eyebrow">00 — EL PRÓLOGO</span><span className="stamp" lang="ja">旅</span><small>UN CUADERNO POR ESCRIBIR</small></div><div className="prologue-main"><h2>La primera vez fuimos a Japón.<br/>Esta vez, queremos <em>adentrarnos.</em></h2><div className="prologue-text"><p>Más allá de los lugares que ya conocemos. Hacia el norte, los puertos, los bosques y las pequeñas historias que viven entre una parada y la siguiente.</p><p>Este es nuestro viaje, todavía por escribir. Una propuesta para recorrer juntos, compartir lo que nos ilusiona y dejar sitio a lo inesperado.</p></div><a href="#mapa" className="text-link">Siete capítulos. Un mismo hilo. <ArrowDown size={16}/></a></div></section>
   <section className="journey-heading"><div><span className="eyebrow">01 — EL RECORRIDO</span><h2>Dejarse llevar.<br/><em>Sin perder el norte.</em></h2></div><p>De Tokio al norte, y de vuelta por el centro.<br/>Sigue el mapa o salta a tu próxima parada.</p></section>
   <section className="journey" id="mapa" aria-label="Los siete capítulos del viaje">
    <div className="atlas-sticky"><div className="atlas-map">
     <JapanMap selected={active} overview={overview} flat={flat} zoom={zoom} bearing={bearing} onBearingChange={setBearing} onZoomChange={setZoom} onSelect={jump}/>
     <div className="atlas-top"><span className="eyebrow">日本 / ATLAS DEL VIAJE</span><span className="atlas-current">{overview?'LA RUTA COMPLETA':chapters[active].region}</span></div>
     <div className="map-tools" role="group" aria-label="Controles del mapa">
      <button className={overview?'selected':''} onClick={()=>{setOverview(!overview);setZoom(1);}} aria-label={overview?'Centrar en la etapa actual':'Ver la ruta completa'} title={overview?'Centrar etapa':'Ruta completa'}><Maximize2 size={16}/></button><span/>
      <button onClick={()=>setZoom(value=>Math.min(4,value*1.25))} aria-label="Acercar mapa" title="Acercar" disabled={zoom>=4}><Plus size={16}/></button>
      <button onClick={()=>setZoom(value=>Math.max(.5,value/1.25))} aria-label="Alejar mapa" title="Alejar" disabled={zoom<=.5}><Minus size={16}/></button><span/>
      <button onClick={()=>setBearing(value=>(value-15+360)%360)} aria-label="Girar mapa a la izquierda" title="Girar a la izquierda"><RotateCcw size={15}/></button>
      <button onClick={()=>setBearing(value=>(value+15)%360)} aria-label="Girar mapa a la derecha" title="Girar a la derecha"><RotateCw size={15}/></button><span/>
      <button onClick={()=>setFlat(!flat)} aria-label={flat?'Ver mapa en relieve':'Ver mapa en 2D'} className="mode-button">{flat?'3D':'2D'}</button>
     </div>
     <div className="atlas-bottom"><button className="north" onClick={()=>setBearing(0)} aria-label="Orientar mapa al norte" title="Orientar al norte"><span style={{transform:`rotate(${-bearing}deg)`}}>↑</span><b>N</b></button><p>Ondas y tinta · Japón<br/><span>Arrastra para orientar · + / − para cambiar el zoom</span></p></div>
     <div className="map-chapter-nav" aria-label="Saltar a una etapa">{chapters.map((c,i)=><button key={c.id} onClick={()=>jump(i)} className={active===i?'active':''} aria-label={`Capítulo ${i+1}: ${c.name}`} aria-current={active===i?'step':undefined}><span>{number(i+1)}</span><i/></button>)}</div>
    </div></div>
    <div className="chapters">{chapters.map((c,i)=><article key={c.id} className={`chapter ${active===i?'chapter-active':''}`} id={c.id} data-chapter={i} ref={el=>{articleRefs.current[i]=el;}}>
     <div className="chapter-inner"><div className="chapter-meta"><span>CAPÍTULO {number(i+1)}</span><span>{c.dates} · {c.nights} NOCHES</span></div><div className="chapter-name"><h2>{c.name}</h2><span lang="ja">{c.jp}</span></div><figure className="chapter-photo"><img src={`/images/${c.image}.jpg`} alt={c.caption} loading="lazy"/><figcaption><span>{c.caption}</span><span>{number(i+1)} / 07</span></figcaption></figure><h3>{c.title}</h3><p className="chapter-description">{c.description}</p><div className="chapter-spots">{c.spots.map(s=><span key={s}>{s}</span>)}</div><p className="chapter-travel"><MoveUpRight size={14}/>{c.travel}</p><button className="text-link" onClick={()=>showDays(i)}>Abrir los días {number(c.days[0])} — {number(c.days[1])} <ArrowUpRight size={16}/></button></div>
    </article>)}</div>
   </section>
   <section className="highlights" id="destacados"><div className="section-title"><div><span className="eyebrow">02 — LO QUE NOS MUEVE</span><h2>Pequeñas razones<br/>para <em>ir más lejos.</em></h2></div><p className="highlights-note">Bosques, puertos y calles pequeñas.<br/>Lugares para quedarse un poco más.</p></div><div className="highlights-grid">{highlights.map((h,i)=><article key={h.id} className="highlight-card"><div className="highlight-image"><button className="image-link" onClick={()=>jump(h.chapter)} aria-label={`Ver etapa de ${h.title}`}><img src={`/images/${h.image}.jpg`} alt={h.title} loading="lazy"/></button><span className="image-number">{number(i+1)}</span></div><div className="highlight-meta"><span>{h.location}</span><ArrowUpRight size={15}/></div><button className="highlight-title" onClick={()=>jump(h.chapter)}>{h.title}</button><p>{h.note}</p></article>)}</div></section>
   <section className="notebook-banner"><span className="notebook-jp" lang="ja">旅の記録</span><div><span className="eyebrow">03 — LAS PÁGINAS DEL VIAJE</span><h2>Veintidós días.<br/><em>Infinitas posibilidades.</em></h2><p>Un plan para cada jornada, con espacio para cambiar de idea.</p><button className="round-link" onClick={()=>showDays()}><span className="circle-arrow"><ArrowUpRight size={22}/></span>Explorar el día a día</button></div><div className="notebook-preview"><div className="notebook-ruler">BEYOND / FIELD NOTES <span>2027</span></div><span className="eyebrow">DÍA 09 · 02 MAYO</span><h3>Seguir<br/>el agua.</h3><span className="preview-location">OIRASE & LAGO TOWADA</span><div className="notebook-lines"><p>Caminar sin mirar el reloj.</p><p>Escuchar el bosque.</p><p>Volver con algo que contar.</p></div><button onClick={()=>{setFilter(2);setOpenDay(8);setPanel('journal');}}>Abrir esta página <ArrowUpRight size={18}/></button></div></section>
   <section className="practical"><div><span className="eyebrow">04 — ANTES DE PARTIR</span><h2>La aventura también<br/>se <em>prepara.</em></h2></div><div className="practical-items"><button onClick={()=>setPanel('logistics')}><TrainFront size={23}/><div><h3>El hilo entre las paradas</h3><p>Vuelos, trenes y traslados del recorrido.</p></div><ArrowUpRight size={20}/></button><button onClick={()=>setPanel('logistics')}><Compass size={23}/><div><h3>Lo que queda por cerrar</h3><p>Alojamientos, excursiones y entradas.</p></div><ArrowUpRight size={20}/></button></div></section>
   <section className="ending"><div className="ending-visual"><img src="/images/kyoto.jpg" alt="Calles tradicionales de Kioto al atardecer" loading="lazy"/></div><div className="ending-shade"/><span className="eyebrow">BEYOND THE USUAL JAPAN</span><h2>El viaje empieza<br/><em>mucho antes.</em></h2><p>24 de abril — 15 de mayo de 2027</p><a href="#" className="ending-top">Volver al comienzo <ArrowUpRight size={16}/></a></section>
  </main>
  <footer><a href="#" className="wordmark">beyond.</a><span>UN CUADERNO DE JAPÓN · 2027</span><details className="credits"><summary>Referencias y créditos <Plus size={12}/></summary><div><p>Concepto inspirado en <a href="https://fudo.tree-public-squares.com/" target="_blank" rel="noreferrer">FŪDO · Tree Public Squares</a>. Itinerario: <a href="https://chatgpt.com/share/6af3627d-1e54-83ed-8768-30550a0dac2d" target="_blank" rel="noreferrer">nuestro hilo de planificación</a>.</p><p>Cartografía: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Natural Earth</a>, dominio público. Relieve artístico; las líneas representan conexiones, no trazados ferroviarios reales.</p><p>Fotografías de referencia para esta propuesta local: <a href="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf" target="_blank" rel="noreferrer">Unsplash (Tokio)</a>, <a href="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e" target="_blank" rel="noreferrer">Unsplash (Kioto)</a>, <a href="https://www.japan.travel/en/uk/inspiration/launch-of-hokkaido-shinkansen/" target="_blank" rel="noreferrer">JNTO (Goryōkaku)</a>, <a href="https://prtimes.jp/main/html/rd/p/000000095.000067262.html" target="_blank" rel="noreferrer">Towada Oirase Tourism (Oirase)</a>, <a href="https://www.jp-alps.com/en/tourism/area/shiojiri/" target="_blank" rel="noreferrer">Japan Alps (Narai)</a>, <a href="https://www.jre-travel.com/article/00212/" target="_blank" rel="noreferrer">JR East (Matsushima)</a>. Imágenes evocativas: el paisaje cambiará según la estación. Revisar permisos antes de publicar.</p></div></details><span className="footer-note">HECHO PARA COMPARTIR EL CAMINO <span>↗</span></span></footer>
  <BackgroundMusic />
  <dialog ref={modal} onCancel={event=>{event.preventDefault();close();}} className="drawer" aria-labelledby="drawer-title"><div className="drawer-veil" aria-hidden="true" onClick={close}/><div className="drawer-container" data-lenis-prevent><div className="drawer-top"><span className="eyebrow">BEYOND / FIELD NOTES</span><button onClick={close} className="close-button" aria-label="Cerrar panel"><X size={21}/></button></div><div className="drawer-tabs"><button className={panel==='journal'?'active':''} onClick={()=>setPanel('journal')}>Cuaderno</button><button className={panel==='logistics'?'active':''} onClick={()=>setPanel('logistics')}>Logística</button></div>
   {panel==='journal'&&<><p className="eyebrow drawer-label">24 ABRIL — 15 MAYO 2027</p><h2 id="drawer-title">El día a <em>día.</em></h2><p className="drawer-intro">Una propuesta abierta. Los horarios y reservas se concretarán antes de partir.</p><label className="filter-label">Explorar una etapa<select value={filter} onChange={e=>{setFilter(Number(e.target.value));setOpenDay(null);}}><option value={-1}>Todo el viaje · 22 días</option>{chapters.map((c,i)=><option value={i} key={c.id}>{number(i+1)} · {c.name} · {c.dates}</option>)}</select></label><div className="day-list">{dayPlans.map((d,i)=>{const c=chapters.findIndex(ch=>i+1>=ch.days[0]&&i+1<=ch.days[1]);if(filter!==-1&&filter!==c)return null;return <article className={`day-entry ${openDay===i?'day-open':''}`} key={i}><button className="day-toggle" onClick={()=>setOpenDay(openDay===i?null:i)} aria-expanded={openDay===i} aria-controls={`day-plan-${i}`}><span className="day-number">{number(i+1)}</span><span className="day-heading"><small>{dateForDay(i)} · {chapters[c].name}</small><strong>{d.title}</strong></span><ChevronDown size={17}/></button>{openDay===i&&<div className="day-body" id={`day-plan-${i}`}><span className="day-tag">{d.tag}</span><p>{d.plan}</p><a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(chapters[c].name+' Japan')}`} target="_blank" rel="noreferrer">Abrir zona en Google Maps <ArrowUpRight size={14}/></a></div>}</article>;})}</div><p className="drawer-footnote">21 noches · Sapporo 2 + Hakodate 2 dentro de Hokkaidō · El 15 de mayo es el día de regreso.</p></>}

   {panel==='logistics'&&<><p className="eyebrow drawer-label">EL VIAJE, EN LA PRÁCTICA</p><h2 id="drawer-title">Antes de <em>partir.</em></h2><p className="drawer-intro">Los vuelos internos ya están confirmados. Seguimos preparando alojamientos, trenes y entradas del recorrido.</p><div className="logistic-summary"><div><strong>21</strong><span>NOCHES</span></div><div><strong>7</strong><span>BASES DE ESTANCIA</span></div><div><strong>1</strong><span>VUELO INTERNO</span></div></div><div className="preparation-done"><span>01 / COMPLETADO</span><strong>Vuelos internos confirmados</strong><p>Tokio → Sapporo · el primer paso del viaje ya está cerrado.</p></div><h3 className="drawer-subtitle">Los desplazamientos</h3><div className="logistics-list">{logistics.map(([date,route,mode],i)=><div key={route}><span>{date}</span><div><h4>{route}</h4><p>{mode}</p>{i===0&&<small className="confirmed-flight">CONFIRMADO</small>}</div><MoveUpRight size={15}/></div>)}</div><h3 className="drawer-subtitle">Dónde dormimos</h3><div className="stay-list">{chapters.map((c,i)=><p key={c.id}><span>{c.name}{i===1?' · Sapporo 2 + Hakodate 2':''}</span><b>{c.nights} noches</b></p>)}</div><h3 className="drawer-subtitle">Por cerrar, juntos</h3><div className="logistics-notes"><p><strong>Vuelos internacionales</strong>Confirmar aeropuerto, horas y llegada a Tokio para ajustar el primer día.</p><p><strong>Alojamientos y trenes</strong>Revisar disponibilidad en las fechas de Golden Week, especialmente Hokkaidō y Aomori.</p><p><strong>Oirase y Towada</strong>Comprobar los autobuses de primavera de 2027 o valorar un coche para la excursión.</p><p><strong>Universal Studios · 11 mayo</strong>Entradas y condiciones de acceso por concretar. Excursión desde Kioto, sin estancia en Osaka. <a href="https://www.usj.co.jp/web/en/us" target="_blank" rel="noreferrer">Consultar USJ <ArrowUpRight size={12}/></a></p><p><strong>Presupuesto</strong>Pendiente de vuelos, alojamientos y reservas. Todavía no hay un total confirmado.</p></div></>}
  </div></dialog>
 </>;
}
