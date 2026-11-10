export type Stop = { id: string; name: string; region: string; lat: number; lng: number; kind: string; note: string };
export type Day = { date: string; weekday: string; place: string; title: string; description: string; category: string; tags: string[]; featured?: boolean };

export const stops: Stop[] = [
  { id:"tokyo-start", name:"Tokyo", region:"Kanto", lat:35.6812, lng:139.7671, kind:"Base", note:"Primera toma de contacto: barrios, comida y ritmo de la ciudad." },
  { id:"sapporo", name:"Sapporo", region:"Hokkaido", lat:43.0618, lng:141.3545, kind:"Base", note:"Capital de Hokkaido, parques, mercados y gastronomía." },
  { id:"otaru", name:"Otaru", region:"Hokkaido", lat:43.1907, lng:140.9947, kind:"Excursión", note:"Canal histórico, almacenes y pequeñas tiendas." },
  { id:"hakodate", name:"Hakodate", region:"Hokkaido", lat:41.7687, lng:140.7291, kind:"Base", note:"Puerto, mercado matinal y vistas desde el monte Hakodate." },
  { id:"aomori", name:"Aomori", region:"Tohoku", lat:40.8222, lng:140.7474, kind:"Base", note:"Base para explorar el norte de Honshu y la cultura Nebuta." },
  { id:"hirosaki", name:"Hirosaki", region:"Tohoku", lat:40.6031, lng:140.4643, kind:"Excursión", note:"Castillo, parque y arquitectura tradicional." },
  { id:"oirase", name:"Oirase Gorge", region:"Tohoku", lat:40.5847, lng:140.9948, kind:"Naturaleza", note:"Sendero junto al río entre bosque y cascadas." },
  { id:"towada", name:"Lake Towada", region:"Tohoku", lat:40.4652, lng:140.8784, kind:"Naturaleza", note:"Lago de caldera rodeado de montañas." },
  { id:"hachinohe", name:"Hachinohe", region:"Tohoku", lat:40.5123, lng:141.4884, kind:"Excursión", note:"Mercados y ambiente portuario; alternativa flexible." },
  { id:"sendai", name:"Sendai", region:"Tohoku", lat:38.2601, lng:140.8824, kind:"Base", note:"Ciudad arbolada y excelente punto de partida para Matsushima." },
  { id:"matsushima", name:"Matsushima", region:"Tohoku", lat:38.3676, lng:141.0616, kind:"Excursión", note:"Bahía salpicada de islotes cubiertos de pinos." },
  { id:"matsumoto", name:"Matsumoto", region:"Chubu", lat:36.2381, lng:137.9720, kind:"Base", note:"Castillo negro, calles históricas y ambiente alpino." },
  { id:"naraijuku", name:"Narai-juku", region:"Chubu", lat:35.9684, lng:137.8122, kind:"Excursión", note:"Pueblo postal de Nakasendo con casas de madera." },
  { id:"kyoto", name:"Kyoto", region:"Kansai", lat:35.0116, lng:135.7681, kind:"Base", note:"Templos, callejuelas y una jornada para descubrir la ciudad." },
  { id:"usj", name:"Universal Studios Japan", region:"Kansai", lat:34.6654, lng:135.4323, kind:"Experiencia", note:"Día completo de parque temático desde Kyoto." },
  { id:"tokyo-end", name:"Tokyo · final", region:"Kanto", lat:35.6812, lng:139.7671, kind:"Base", note:"Últimos días para compras, barrios y despedida." }
];

export const days: Day[] = [
  {date:"2027-04-24",weekday:"Sáb",place:"Tokyo",title:"Llegada a Japón",description:"Llegada, traslado al alojamiento y paseo suave por el barrio. Cena sin demasiados planes.",category:"Ciudad",tags:["Llegada","Tokyo"]},
  {date:"2027-04-25",weekday:"Dom",place:"Tokyo",title:"Tokyo a vuestro ritmo",description:"Día flexible para recuperar energía: Asakusa y Ueno, o los barrios que más os apetezca revisitar.",category:"Ciudad",tags:["Cultura","Flexible"]},
  {date:"2027-04-26",weekday:"Lun",place:"Sapporo",title:"Vuelo al norte · Sapporo",description:"Vuelo Tokyo → Sapporo. Tarde de primer paseo por Odori Park y cena local.",category:"Traslado",tags:["Vuelo","Hokkaido"]},
  {date:"2027-04-27",weekday:"Mar",place:"Otaru",title:"Excursión a Otaru",description:"Tren desde Sapporo para conocer el canal, los antiguos almacenes y sus tiendas. Regreso a dormir a Sapporo.",category:"Excursión",tags:["Canal","Hokkaido"],featured:true},
  {date:"2027-04-28",weekday:"Mié",place:"Sapporo",title:"Sapporo sin prisas",description:"Mercado, arquitectura y gastronomía. Dejad margen para improvisar según el tiempo.",category:"Ciudad",tags:["Gastronomía","Hokkaido"]},
  {date:"2027-04-29",weekday:"Jue",place:"Hakodate",title:"Hacia Hakodate",description:"Limited Express Hokuto hacia Hakodate. Paseo por la zona portuaria y almacenes de ladrillo rojo.",category:"Traslado",tags:["Tren","Golden Week"]},
  {date:"2027-04-30",weekday:"Vie",place:"Aomori",title:"Cruce a Honshu",description:"Hokkaido Shinkansen desde Hakodate hacia Shin-Aomori y conexión a Aomori. Tarde ligera.",category:"Traslado",tags:["Shinkansen","Tohoku"]},
  {date:"2027-05-01",weekday:"Sáb",place:"Hirosaki",title:"Hirosaki histórico",description:"Excursión al castillo y al parque de Hirosaki. En primavera, el paisaje de cerezos puede variar según el año.",category:"Cultura",tags:["Castillo","Tohoku"],featured:true},
  {date:"2027-05-02",weekday:"Dom",place:"Oirase & Lake Towada",title:"Bosque, río y lago",description:"Día de naturaleza en Oirase Gorge y Lake Towada. Confirmad los buses estacionales y sus horarios antes de fijar esta jornada.",category:"Naturaleza",tags:["Senderismo","Tohoku"],featured:true},
  {date:"2027-05-03",weekday:"Lun",place:"Aomori",title:"Aomori y cultura Nebuta",description:"Día de ciudad: museo Nebuta Wa Rasse, paseo marítimo y gastronomía local.",category:"Cultura",tags:["Museo","Golden Week"]},
  {date:"2027-05-04",weekday:"Mar",place:"Hachinohe",title:"Día flexible · Hachinohe",description:"Opción de excursión a Hachinohe y sus mercados, o día colchón para descansar y absorber cambios de transporte.",category:"Flexible",tags:["Mercados","Golden Week"]},
  {date:"2027-05-05",weekday:"Mié",place:"Sendai",title:"Llegada a Sendai",description:"Tohoku Shinkansen hacia Sendai. Tarde para pasear y probar la especialidad local, gyutan.",category:"Traslado",tags:["Shinkansen","Golden Week"]},
  {date:"2027-05-06",weekday:"Jue",place:"Matsushima",title:"La bahía de Matsushima",description:"Excursión desde Sendai para ver los islotes, templos y miradores de la bahía.",category:"Excursión",tags:["Costa","Tohoku"],featured:true},
  {date:"2027-05-07",weekday:"Vie",place:"Matsumoto",title:"De Tohoku a los Alpes",description:"Traslado largo Sendai → Matsumoto, normalmente vía Tokyo. Día principalmente de viaje.",category:"Traslado",tags:["Tren","Chubu"]},
  {date:"2027-05-08",weekday:"Sáb",place:"Matsumoto",title:"Castillo y calles antiguas",description:"Visita al castillo de Matsumoto y paseo por Nakamachi. Tarde para cafés y pequeñas tiendas.",category:"Cultura",tags:["Castillo","Chubu"],featured:true},
  {date:"2027-05-09",weekday:"Dom",place:"Kyoto",title:"Narai-juku y llegada a Kyoto",description:"Excursión temprana a Narai-juku si encaja con el equipaje y los trenes; después traslado Matsumoto → Nagoya → Kyoto. Alternativa: saltarse Narai para viajar con calma.",category:"Traslado",tags:["Nakasendo","Tren"]},
  {date:"2027-05-10",weekday:"Lun",place:"Kyoto",title:"Un día para Kyoto",description:"Elegid una zona y disfrutadla sin intentar abarcarlo todo: Higashiyama y Gion, o Arashiyama y el noroeste.",category:"Cultura",tags:["Templos","Kansai"],featured:true},
  {date:"2027-05-11",weekday:"Mar",place:"Universal Studios Japan",title:"Universal Studios Japan",description:"Día completo en USJ, con salida temprana desde Kyoto. Revisad entradas, horarios y Express Pass cuando se acerque la fecha.",category:"Experiencia",tags:["Parque temático","Kansai"],featured:true},
  {date:"2027-05-12",weekday:"Mié",place:"Tokyo",title:"Regreso a Tokyo",description:"Shinkansen Kyoto → Tokyo. Tarde libre y última etapa urbana del viaje.",category:"Traslado",tags:["Shinkansen","Kanto"]},
  {date:"2027-05-13",weekday:"Jue",place:"Tokyo",title:"Tokyo · barrios y compras",description:"Día abierto para barrios, tiendas, cafés y cualquier visita pendiente.",category:"Ciudad",tags:["Tokyo","Flexible"]},
  {date:"2027-05-14",weekday:"Vie",place:"Tokyo",title:"Último día completo",description:"Despedida a vuestro ritmo. Dejad tiempo para compras finales y preparar el equipaje.",category:"Ciudad",tags:["Tokyo","Despedida"]},
  {date:"2027-05-15",weekday:"Sáb",place:"Tokyo",title:"Vuelo de regreso",description:"Traslado al aeropuerto y regreso a casa.",category:"Salida",tags:["Vuelo","Fin del viaje"]}
];

export const logistics = [
  {title:"Vuelos internos",detail:"Tokyo → Sapporo. Comparad Haneda/Narita con New Chitose y añadid margen para el traslado al aeropuerto.",type:"Avión"},
  {title:"Hokkaido",detail:"Sapporo → Otaru en tren; Sapporo → Hakodate en Limited Express Hokuto.",type:"Tren"},
  {title:"Cruce a Tohoku",detail:"Hakodate → Shin-Aomori en Hokkaido Shinkansen; conexión local a Aomori.",type:"Shinkansen"},
  {title:"Tohoku",detail:"Aomori → Sendai en Tohoku Shinkansen. Reservad asientos con antelación durante Golden Week.",type:"Shinkansen"},
  {title:"Sendai → Matsumoto",detail:"Trayecto largo, normalmente vía Tokyo. Comprobad conexiones y tiempos antes de comprar.",type:"Tren"},
  {title:"Matsumoto → Kyoto",detail:"Vía Nagoya en tren Limited Express Shinano + Tokaido Shinkansen. Narai-juku añade complejidad: valorad dejar equipaje en Matsumoto.",type:"Tren"},
  {title:"Kyoto → Tokyo",detail:"Tokaido Shinkansen. Es el último gran traslado del viaje.",type:"Shinkansen"},
  {title:"Golden Week",detail:"El 29 de abril y del 3 al 5 de mayo son festivos nacionales. Reservad trenes y alojamientos pronto; evitad improvisar trayectos largos.",type:"Importante"},
  {title:"Oirase & Towada",detail:"Los buses de acceso pueden ser estacionales y tener pocas frecuencias. Los horarios de 2027 deben verificarse cuando se publiquen.",type:"Por confirmar"},
  {title:"Universal Studios Japan",detail:"Comprad entradas en el canal oficial cuando esté disponible el calendario. Revisad horarios, acceso a zonas y Express Pass.",type:"Por confirmar"}
];

export const highlights = [
  {name:"Oirase Gorge",type:"Naturaleza",desc:"Un paseo junto al río entre bosque, rápidos y cascadas.",tag:"Imprescindible",image:"https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1000&q=85"},
  {name:"Hirosaki",type:"Cultura",desc:"Castillo y parque histórico en el extremo norte de Honshu.",tag:"Imprescindible",image:"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=85"},
  {name:"Matsushima",type:"Costa",desc:"Una bahía de islas boscosas, templos y miradores.",tag:"Experiencia",image:"https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=85"},
  {name:"Narai-juku",type:"Tradición",desc:"Una antigua localidad postal de la ruta Nakasendo.",tag:"Opcional",image:"https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1000&q=85"},
  {name:"Otaru",type:"Ciudad",desc:"Canal, almacenes históricos y escapada sencilla desde Sapporo.",tag:"Experiencia",image:"https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=85"},
  {name:"Matsumoto",type:"Cultura",desc:"Castillo original y calles con arquitectura tradicional.",tag:"Imprescindible",image:"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=85"}
];
