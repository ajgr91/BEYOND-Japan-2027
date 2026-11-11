export type Chapter = { id: string; name: string; jp: string; region: string; dates: string; nights: number; coords: [number, number]; title: string; description: string; image: string; caption: string; spots: string[]; travel: string; days: [number,number] };
export const chapters: Chapter[] = [
 { id:'tokyo',name:'Tokio',jp:'東京',region:'KANTŌ',dates:'24 — 26 ABR',nights:2,coords:[139.6917,35.6895],title:'Volver. Y mirar distinto.',description:'La primera página se escribe despacio. Callejuelas de Yanaka, un café en Kiyosumi y esa sensación de volver a un lugar que todavía guarda algo para nosotros.',image:'tokyo',caption:'Tokio · el comienzo de otra historia',spots:['Yanaka & Nezu','Kiyosumi-Shirakawa','Kagurazaka'],travel:'Llegada a Tokio · aeropuerto por confirmar',days:[1,2]},
 { id:'hokkaido',name:'Hokkaidō',jp:'北海道',region:'EL NORTE',dates:'26 — 30 ABR',nights:4,coords:[141.3545,43.0618],title:'Donde la primavera llega después.',description:'Volamos al norte. Sapporo nos recibe entre mercados y pequeños restaurantes; Otaru nos acerca al mar. Después, el tren nos lleva a las calles portuarias de Hakodate.',image:'hokkaido',caption:'Goryōkaku, Hakodate · una primavera posible',spots:['Sapporo & Otaru','Hakodate','Goryōkaku'],travel:'Tokio → Sapporo · vuelo / Sapporo → Hakodate · tren',days:[3,6]},
 { id:'aomori',name:'Aomori',jp:'青森',region:'TŌHOKU',dates:'30 ABR — 05 MAY',nights:5,coords:[140.7474,40.8222],title:'El tiempo tiene otro ritmo.',description:'Cinco noches para quedarnos un poco más. El castillo de Hirosaki, el agua de Oirase y las orillas de Towada. Una base, varias escapadas y espacio para improvisar.',image:'oirase',caption:'Oirase · seguir el sonido del agua',spots:['Hirosaki','Oirase & Towada','Museo Nebuta'],travel:'Hakodate → Aomori · conexiones con Hokkaidō Shinkansen',days:[7,11]},
 { id:'sendai',name:'Sendai',jp:'仙台',region:'MIYAGI',dates:'05 — 07 MAY',nights:2,coords:[140.8694,38.2682],title:'Un paréntesis junto al mar.',description:'La vida cotidiana de Sendai y una escapada a Matsushima. Islas pequeñas, pinos sobre el agua y una tarde que no necesita mucho más.',image:'matsushima',caption:'Matsushima · pequeñas islas, grandes pausas',spots:['Matsushima','Paseos por Sendai','Gastronomía local'],travel:'Aomori → Sendai · conexiones con Tōhoku Shinkansen',days:[12,13]},
 { id:'matsumoto',name:'Matsumoto',jp:'松本',region:'CHŪBU',dates:'07 — 09 MAY',nights:2,coords:[137.972,36.238],title:'Entre montañas y madera.',description:'Nos adentramos en el centro. El castillo de Matsumoto, las tiendas de Nakamachi y las fachadas de Narai-juku: otra forma de encontrar el Japón de antes.',image:'narai',caption:'Narai-juku · un paseo por el antiguo Nakasendō',spots:['Castillo de Matsumoto','Nakamachi','Narai-juku'],travel:'Sendai → Matsumoto · tren vía Tokio',days:[14,15]},
 { id:'kyoto',name:'Kioto',jp:'京都',region:'KANSAI',dates:'09 — 12 MAY',nights:3,coords:[135.7681,35.0116],title:'La belleza de volver.',description:'Tres noches entre callejuelas, jardines y el barrio del sake de Fushimi. Y un cambio de ritmo: un día entero en Universal Studios Japan, volviendo a dormir a Kioto.',image:'kyoto',caption:'Kioto · luz de tarde y calles por redescubrir',spots:['Gion & Higashiyama','Fushimi','Universal Studios · 11 mayo'],travel:'Matsumoto → Kioto · tren vía Nagoya',days:[16,18]},
 { id:'return',name:'Tokio, otra vez',jp:'東京',region:'EL REGRESO',dates:'12 — 15 MAY',nights:3,coords:[139.6917,35.6895],title:'Dejar una página en blanco.',description:'Tres últimas noches para seguir las ganas. Vinilos en Shimokitazawa, tiendas pequeñas en Kōenji y una última cena. Hay viajes que terminan antes de que queramos irnos.',image:'tokyo',caption:'Tokio · el final es también un comienzo',spots:['Shimokitazawa','Kōenji','Nakameguro'],travel:'Kioto → Tokio · Tōkaidō Shinkansen',days:[19,22]}
];
export const dayPlans: {title:string;plan:string;tag:string}[] = [
 {title:'Aterrizar en otra historia',plan:'Llegada a Tokio. Traslado al alojamiento y un primer paseo según la hora real de llegada.',tag:'Llegada'},
 {title:'El Tokio de los pequeños detalles',plan:'Yanaka y Nezu por la mañana. Cafés en Kiyosumi-Shirakawa o una tarde en Kagurazaka.',tag:'Ciudad'},
 {title:'Rumbo al norte',plan:'Vuelo a New Chitose, traslado a Sapporo y paseo de bienvenida. Vuelo interno confirmado; consultar la reserva para el horario.',tag:'Traslado'},
 {title:'Otaru, entre canales',plan:'Excursión desde Sapporo a Otaru. Pasear por el canal, descubrir sus comercios y volver a Sapporo.',tag:'Escapada'},
 {title:'Las vías hacia Hakodate',plan:'Tren Sapporo–Hakodate. Dejar las maletas y recorrer el puerto y Motomachi.',tag:'Traslado'},
 {title:'Una estrella en primavera',plan:'Goryōkaku y las calles de Hakodate. La floración dependerá de la temporada de 2027.',tag:'Paseo'},
 {title:'Cruzar a Tōhoku',plan:'Hakodate–Aomori, enlazando con el Shinkansen. Llegada a la base para las próximas cinco noches.',tag:'Traslado'},
 {title:'Hirosaki, sin prisa',plan:'Excursión a Hirosaki: castillo, parque y calles históricas. Floración pendiente de la temporada.',tag:'Escapada'},
 {title:'Seguir el agua',plan:'Oirase y lago Towada. Propuesta condicionada a los autobuses de primavera; valorar coche de alquiler.',tag:'Naturaleza'},
 {title:'Un día para Aomori',plan:'Mercado, museo Nebuta y paseo junto a la bahía. Dejar la tarde abierta.',tag:'Ciudad'},
 {title:'El lujo de un día libre',plan:'Descanso, gastronomía local o escapada opcional a Hachinohe según transporte y ganas.',tag:'Libre'},
 {title:'La siguiente parada: Sendai',plan:'Traslado a Sendai y tarde para conocer sus calles. Conexiones ferroviarias pendientes de reservar.',tag:'Traslado'},
 {title:'Islas sobre el agua',plan:'Excursión a Matsushima desde Sendai. Paseo costero y posible barco según el tiempo y los servicios.',tag:'Naturaleza'},
 {title:'Hacia el Japón de montaña',plan:'Tren Sendai–Matsumoto vía Tokio. Jornada de traslado y un primer paseo al llegar.',tag:'Traslado'},
 {title:'Castillo y camino antiguo',plan:'Castillo de Matsumoto y Nakamachi. Combinar con Narai-juku si las conexiones lo permiten; priorizar una visita con calma.',tag:'Cultura'},
 {title:'La luz de Kioto',plan:'Tren a Kioto vía Nagoya. Llegada y paseo de tarde por Higashiyama y Gion.',tag:'Traslado'},
 {title:'Otra forma de ver Kioto',plan:'Fushimi y su barrio del sake, o alternativa rural en Ōhara. Elegir según el ritmo del grupo.',tag:'Cultura'},
 {title:'Un día para jugar',plan:'Día completo en Universal Studios Japan, viajando desde Kioto y regresando al mismo alojamiento. Entradas pendientes.',tag:'Experiencia'},
 {title:'Volver al principio',plan:'Shinkansen a Tokio y primera tarde de la última estancia. Tres noches antes del vuelo de vuelta.',tag:'Traslado'},
 {title:'Tiendas, música y café',plan:'Shimokitazawa y Kōenji: pequeños comercios, vinilos y cafeterías. Elegir paseos según las ganas.',tag:'Ciudad'},
 {title:'El día que nos faltaba',plan:'Nakameguro, Asakusa o ese lugar que quedó pendiente. Una última cena para cerrar el cuaderno.',tag:'Libre'},
 {title:'Hasta la próxima',plan:'Traslado al aeropuerto de Tokio y vuelo de vuelta. Aeropuerto y horarios pendientes de confirmar.',tag:'Regreso'}
];
export const highlights = [
 {id:'oirase',title:'Seguir el río en Oirase',location:'AOMORI',image:'oirase',chapter:2,note:'Bosques, agua y un camino para caminar despacio.'},
 {id:'goryokaku',title:'La estrella de Goryōkaku',location:'HAKODATE',image:'hokkaido',chapter:1,note:'Un parque con una geometría que se descubre desde arriba.'},
 {id:'narai',title:'Perderse en Narai-juku',location:'NAGANO',image:'narai',chapter:4,note:'Madera oscura, pequeñas tiendas y el antiguo Nakasendō.'},
 {id:'matsushima',title:'Navegar entre islas',location:'MATSUSHIMA',image:'matsushima',chapter:3,note:'Una escapada de mar y pinos desde Sendai.'},
 {id:'kyoto',title:'Redescubrir Kioto',location:'KANSAI',image:'kyoto',chapter:5,note:'Tres noches para volver a nuestras calles favoritas.'},
 {id:'tokyo',title:'El otro Tokio',location:'KANTŌ',image:'tokyo',chapter:6,note:'Barrios, cafés y música para terminar el viaje.'}
];
export const logistics = [
 ['26 ABR','Tokio → Sapporo','Vuelo a New Chitose confirmado + traslado a Sapporo'],
 ['28 ABR','Sapporo → Hakodate','Limited Express Hokuto'],
 ['30 ABR','Hakodate → Aomori','Conexiones vía Shin-Hakodate-Hokuto y Shin-Aomori'],
 ['05 MAY','Aomori → Sendai','Conexiones con Tōhoku Shinkansen'],
 ['07 MAY','Sendai → Matsumoto','Tren vía Tokio'],
 ['09 MAY','Matsumoto → Kioto','Shinano a Nagoya + Tōkaidō Shinkansen'],
 ['11 MAY','Kioto ↔ Universal Studios','Excursión en tren, regreso a Kioto'],
 ['12 MAY','Kioto → Tokio','Tōkaidō Shinkansen']
];
