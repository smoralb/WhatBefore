/**
 * Motor de eventos infinitos usando la API de Wikipedia (Curated Featured Content)
 */

export async function fetchEventPair() {
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      // 1. Elegir un día y mes aleatorio
      const month = Math.floor(Math.random() * 12) + 1;
      const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const day = Math.floor(Math.random() * daysInMonth[month]) + 1;

      // Formatear para la API (MM/DD)
      const mm = month.toString().padStart(2, '0');
      const dd = day.toString().padStart(2, '0');

      // 2. Consultar eventos históricos de ese día en la Wikipedia en español
      const response = await fetch(
        `https://es.wikipedia.org/api/rest_v1/feed/onthisday/events/${mm}/${dd}`
      );
      const data = await response.json();

      if (!data.events || data.events.length < 2) {
        attempts++;
        continue;
      }

      // 3. Filtrar eventos que tengan imagen y un año válido
      const validEvents = data.events
        .filter(event => event.pages && event.pages[0].thumbnail)
        .map(event => ({
          title: event.text,
          year: event.year,
          image: event.pages[0].thumbnail.source,
          description: event.pages[0].extract
        }));

      if (validEvents.length >= 2) {
        // Barajar y devolver dos
        const shuffled = validEvents.sort(() => Math.random() - 0.5);
        return [shuffled[0], shuffled[1]];
      }
    } catch (error) {
      console.error("Error fetching from Wikipedia API:", error);
    }
    attempts++;
  }

  // Fallback de seguridad por si falla la red
  return [
    { title: "Construcción de la Torre Eiffel", year: 1887, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Tour_Eiffel_march_1888.jpg/400px-Tour_Eiffel_march_1888.jpg" },
    { title: "Invención del Cinematógrafo", year: 1895, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Cin%C3%A9matographe_Lumi%C3%A8re_en_1895.jpg/400px-Cin%C3%A9matographe_Lumi%C3%A8re_en_1895.jpg" }
  ];
}

export function getEarlierEvent(event1, event2) {
  return event1.year <= event2.year ? event1 : event2;
}
