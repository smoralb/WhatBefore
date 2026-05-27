/**
 * Motor de eventos infinitos usando la API de Wikipedia (Curated Featured Content)
 */

const eventCache = new Map();

// --- Preload manager (module singleton) ---
const preloadedPairs = [];
let preloadCursor = 1;
let inFlightCount = 0;
const queueListeners = new Set();

function emitQueueChange() {
  for (const cb of queueListeners) {
    try { cb(preloadedPairs.length); } catch { /* ignore listener errors */ }
  }
}

function prefetchImages(pair) {
  if (!pair) return;
  for (const event of pair) {
    if (event && event.image) {
      const img = new Image();
      img.src = event.image;
    }
  }
}

// Attempts one fetch with exponential backoff retry on failure.
// Keeps occupying an in-flight slot until it succeeds — never gives up.
function attemptPreloadSlot(round, retryCount = 0) {
  fetchEventPair(round)
    .then((pair) => {
      preloadedPairs.push(pair);
      prefetchImages(pair);
      inFlightCount -= 1;
      emitQueueChange();
    })
    .catch((err) => {
      console.warn('Preload attempt failed, retrying:', err && err.message);
      const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);
      setTimeout(() => attemptPreloadSlot(round, retryCount + 1), delay);
      // Do NOT decrement inFlightCount — the slot is still being worked on.
    });
}

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

  throw new Error("No valid event pair after retries");
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

export function subscribeToQueue(cb) {
  queueListeners.add(cb);
  return () => queueListeners.delete(cb);
}

export function getQueueSize() {
  return preloadedPairs.length;
}

export function consumePreloadedPair() {
  const pair = preloadedPairs.shift();
  if (pair) emitQueueChange();
  return pair;
}

export function resetPreloadQueue() {
  preloadedPairs.length = 0;
  preloadCursor = 1;
  inFlightCount = 0;
  emitQueueChange();
}

// Fill the queue up to `targetSize`. Idempotent: only fires fetches for the
// gap between (queue + in-flight) and targetSize.
export function ensurePreloaded(targetSize = 3) {
  const needed = targetSize - (preloadedPairs.length + inFlightCount);
  if (needed <= 0) return;
  for (let i = 0; i < needed; i++) {
    const round = preloadCursor;
    preloadCursor += 1;
    inFlightCount += 1;
    attemptPreloadSlot(round);
  }
}
