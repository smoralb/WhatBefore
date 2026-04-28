const HISTORICAL_EVENTS = [
  { title: "Caída del Muro de Berlín", year: 1989, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/West_and_East_Germans_at_the_Brandenburg_Gate_in_1989.jpg/400px-West_and_East_Germans_at_the_Brandenburg_Gate_in_1989.jpg" },
  { title: "Llegada del Hombre a la Luna", year: 1969, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Aldrin_Apollo_11.jpg/400px-Aldrin_Apollo_11.jpg" },
  { title: "Fin de la Segunda Guerra Mundial", year: 1945, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bundesarchiv_Bild_183-S55480%2C_St%27 Petersburg%2C_Kapitulation.jpg/400px-Bundesarchiv_Bild_183-S55480%2C_St%27_Petersburg%2C_Kapitulation.jpg" },
  { title: "Revolución Francesa", year: 1789, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Prise_de_la_Bastille.jpg/400px-Prise_de_la_Bastille.jpg" },
  { title: "Descubrimiento de América", year: 1492, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Columbus_Taking_Possession.jpg/400px-Columbus_Taking_Possession.jpg" },
  { title: "Invención de la Imprenta", year: 1440, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/PrintMus_037.jpg/400px-PrintMus_037.jpg" },
  { title: "Construcción de las Pirámides de Giza", year: -2560, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/400px-Kheops-Pyramid.jpg" },
  { title: "Caída del Imperio Romano", year: 476, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Romulus_Augustulus_resigns_the_Crown.jpg/400px-Romulus_Augustulus_resigns_the_Crown.jpg" },
  { title: "Inicio de la Revolución Industrial", year: 1760, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Calton_Hill_Weaving_Shed.jpg/400px-Calton_Hill_Weaving_Shed.jpg" },
  { title: "Primera Guerra Mundial", year: 1914, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/WW1_Battlefield_2.jpg/400px-WW1_Battlefield_2.jpg" },
  { title: "Guerra Civil Española", year: 1936, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Madrid_1936.jpg/400px-Madrid_1936.jpg" },
  { title: "Independencia de Estados Unidos", year: 1776, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Declaration_of_Independence_%281819%29%2C_by_John_Trumbull.jpg/400px-Declaration_of_Independence_%281819%29%2C_by_John_Trumbull.jpg" },
  { title: "Revolución Rusa", year: 1917, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bolshoi_Crew.jpg/400px-Bolshoi_Crew.jpg" },
  { title: "Primeros Juegos Olímpicos", year: -776, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ancient_Olympic_Games.gif/400px-Ancient_Olympic_Games.gif" },
  { title: "Imperio Otomano conquista Constantinopla", year: 1453, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Siege_Constantinople.jpg/400px-Siege_Constantinople.jpg" },
  { title: "Muerte de Alejandro Magno", year: -323, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Alexander_the_Great_mosaic.jpg/400px-Alexander_the_Great_mosaic.jpg" },
  { title: "Construcción de la Gran Muralla China", year: -221, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Great_Wall_of_China.jpg/400px-Great_Wall_of_China.jpg" },
  { title: "Primer vuelo de los Hermanos Wright", year: 1903, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/First_flight2.jpg/400px-First_flight2.jpg" },
  { title: "Fin de la Guerra Fría", year: 1991, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Reagan_and_Gorbachev_at_Geneva_1985.jpg/400px-Reagan_and_Gorbachev_at_Geneva_1985.jpg" },
  { title: "Creación de la ONU", year: 1945, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UN_General_Assembly_hall.jpg/400px-UN_General_Assembly_hall.jpg" },
];

export async function fetchEventPair() {
  const shuffled = [...HISTORICAL_EVENTS].sort(() => Math.random() - 0.5);
  const event1 = shuffled[0];
  const event2 = shuffled[1];
  
  const pair = [
    { ...event1, image: await getValidImage(event1.title) },
    { ...event2, image: await getValidImage(event2.title) },
  ];
  
  return pair;
}

async function getValidImage(title) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    );
    const data = await response.json();
    
    if (data.thumbnail && data.thumbnail.source) {
      return data.thumbnail.source;
    }
  } catch (error) {
    console.error("Error fetching image:", error);
  }
  
  return null;
}

export function getEarlierEvent(event1, event2) {
  return event1.year <= event2.year ? event1 : event2;
}