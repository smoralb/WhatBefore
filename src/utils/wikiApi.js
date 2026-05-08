/**
 * Motor de eventos infinitos usando la API de Wikipedia (Curated Featured Content)
 */

const eventCache = new Map();

export async function fetchEventPair(round = 1) {
  const maxDiff = Math.max(5, 80 - ((round - 1) * 3));
  const maxAttempts = 5;

  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const month = Math.floor(Math.random() * 12) + 1;
      const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const day = Math.floor(Math.random() * daysInMonth[month]) + 1;

      const mm = month.toString().padStart(2, '0');
      const dd = day.toString().padStart(2, '0');
      const cacheKey = `${mm}/${dd}`;

      let eventsData;
      if (eventCache.has(cacheKey)) {
        eventsData = eventCache.get(cacheKey);
      } else {
        const response = await fetch(
          `https://es.wikipedia.org/api/rest_v1/feed/onthisday/events/${mm}/${dd}`
        );
        eventsData = await response.json();
        eventCache.set(cacheKey, eventsData);
      }

      if (!eventsData.events || eventsData.events.length < 2) {
        attempts++;
        continue;
      }

      const validEvents = eventsData.events
        .filter(event => event.pages && event.pages[0].thumbnail)
        .map(event => ({
          title: event.text,
          year: event.year,
          image: event.pages[0].thumbnail.source,
          description: event.pages[0].extract
        }));

      if (validEvents.length >= 2) {
        const shuffled = validEvents.sort(() => Math.random() - 0.5);

        if (round <= 10) {
          return [shuffled[0], shuffled[1]];
        }

        let pair = shuffled.find((e1) => 
          shuffled.some(e2 => {
            const diff = Math.abs(e1.year - e2.year);
            return e2 !== e1 && diff <= maxDiff;
          })
        );

        if (pair) {
          const partner = shuffled.find(e => e !== pair && Math.abs(e.year - pair.year) <= maxDiff);
          if (partner) {
            return [pair, partner];
          }
        }

        if (attempts < maxAttempts - 3) {
          attempts++;
          continue;
        }

        const relaxedDiff = maxDiff + 20;
        const relaxedPair = shuffled.find((e1) => 
          shuffled.some(e2 => e2 !== e1 && Math.abs(e1.year - e2.year) <= relaxedDiff)
        );
        if (relaxedPair) {
          const relaxedPartner = shuffled.find(e => e !== relaxedPair && Math.abs(e.year - relaxedPair.year) <= relaxedDiff);
          if (relaxedPartner) {
            return [relaxedPair, relaxedPartner];
          }
        }

        return [shuffled[0], shuffled[1]];
      }
    } catch (error) {
      console.error("Error fetching from Wikipedia API:", error);
    }
    attempts++;
  }

  return [
    { title: "Construcción de la Torre Eiffel", year: 1887, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Tour_Eiffel_march_1888.jpg/400px-Tour_Eiffel_march_1888.jpg" },
    { title: "Invención del Cinematógrafo", year: 1895, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Cin%C3%A9matographe_Lumi%C3%A8re_en_1895.jpg/400px-Cin%C3%A9matographe_Lumi%C3%A8re_en_1895.jpg" }
  ];
}

export async function fetchEventPairs(round = 1, count = 1) {
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(fetchEventPair(round + i));
  }
  return Promise.all(promises);
}

export function getEarlierEvent(event1, event2) {
  return event1.year <= event2.year ? event1 : event2;
}
