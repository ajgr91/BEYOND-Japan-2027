import { ArrowDown, ArrowUpRight } from 'lucide-react';
import './travel-cover.css';

export default function TravelCover() {
  return <section className="travel-cover" aria-labelledby="cover-title">
    <div className="cover-opening">
      <div className="cover-copy">
        <p className="cover-overline">北へ / RUMBO AL NORTE</p>
        <h1 id="cover-title">Más allá<br />del primer<br /><em>Japón.</em></h1>
        <p className="cover-description">Un cuaderno de viaje.<br />Pequeñas historias del norte.<br />Y otra forma de volver.</p>
        <a className="cover-link" href="#mapa"><span><ArrowUpRight size={21} /></span>Explorar el recorrido</a>
      </div>
      <figure className="cover-photograph">
        <div className="cover-photo-top"><span>一 / EL COMIENZO</span><span>青森</span></div>
        <img src="/images/oirase.jpg" alt="El río Oirase entre árboles y rocas cubiertas de musgo, en Aomori" fetchPriority="high" />
        <figcaption><span>Oirase, Aomori</span><span>Seguir el sonido del agua.</span></figcaption>
      </figure>
      <span className="cover-japanese" lang="ja">まだ知らない日本へ</span>
      <div className="cover-inscription"><span lang="ja">日本</span><p>Primero, imaginarlo.<br />Después, recorrerlo.</p></div>
    </div>
    <div className="cover-colophon"><span>24 ABRIL — 15 MAYO 2027</span><span>TOKIO → HOKKAIDŌ → TŌHOKU → CHŪBU → KIOTO</span><a href="#prologo">UN CUADERNO POR ESCRIBIR <ArrowDown size={13} /></a></div>
  </section>;
}
