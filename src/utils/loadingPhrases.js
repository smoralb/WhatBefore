export const LOADING_PHRASES = [
  "Consultando la biblioteca de Alejandría...",
  "Despertando a los historiadores...",
  "Sobornando a la máquina del tiempo...",
  "Revisando libros polvorientos...",
  "Preguntando a tu abuela...",
  "Descifrando jeroglíficos...",
  "Llamando a Indiana Jones...",
  "Hojeando enciclopedias del abuelo...",
  "Interrogando a Cleopatra...",
  "Buscando en archivos secretos...",
  "Espiando a los romanos...",
  "Robando datos del DeLorean...",
  "Discutiendo con Aristóteles...",
  "Cazando dinosaurios para preguntarles...",
  "Negociando con piratas...",
  "Llamando a Marty McFly...",
  "Buscando entre pergaminos antiguos...",
  "Soplando polvo de un mapa viejo...",
  "Pidiendo permiso a los Mayas...",
  "Consultando con el Oráculo de Delfos...",
  "Recargando la máquina del tiempo...",
  "Pidiéndole pistas a Napoleón...",
  "Sacudiendo el reloj de arena...",
  "Buscando el manuscrito perdido...",
];

export function randomPhrase() {
  return LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)];
}
