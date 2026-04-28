# 📜 WhatBefore — Documento de Planificación del Proyecto

## 1. Visión General

**WhatBefore** es un juego web en el que el jugador debe adivinar cuál de dos opciones mostradas (suceso histórico o personaje histórico) ocurrió **antes** en la historia. La web será completamente frontend, consumiendo datos de una API pública (Wikipedia / Wikidata) sin necesidad de backend propio.

---

## 2. Objetivos

- Crear una experiencia de juego sencilla, visualmente atractiva y adictiva.
- No requerir backend propio; toda la lógica y datos vendrán de APIs públicas.
- Ser responsive y accesible desde cualquier dispositivo.

---

## 3. Stack Tecnológico Propuesto

| Capa | Tecnología | Justificación |
|---|---|---|
| Framework UI | **React + Vite** | Rápido, moderno, ideal para SPAs |
| Estilos | **Tailwind CSS** | Utilidades rápidas, diseño limpio |
| Lenguaje | **TypeScript** | Tipado estático, más mantenible |
| API de datos | **Wikidata API** + **Wikipedia REST API** | Gratuita, sin auth, amplia cobertura histórica |
| Gestión de estado | **Zustand** | Ligero y sencillo para este tipo de juego |
| Animaciones | **Framer Motion** | Transiciones suaves entre pantallas |
| Testing | **Vitest + Testing Library** | Integración nativa con Vite |

### ¿Por qué Wikidata + Wikipedia?
- **Wikidata** permite hacer queries SPARQL para obtener personajes/sucesos históricos con sus fechas exactas, imágenes y descripciones.
- **Wikipedia REST API** permite obtener resúmenes y miniaturas de artículos directamente.
- Ambas son gratuitas, sin necesidad de API key y con amplísima cobertura histórica.
- Alternativa a considerar: **Open Trivia DB** para un fallback si la query de Wikidata falla.

---

## 4. Arquitectura de la Aplicación

```
src/
├── components/
│   ├── MainMenu/
│   │   ├── MainMenu.tsx          # Pantalla de menú principal
│   │   ├── CategorySelector.tsx  # Selector de categoría (suceso / personaje)
│   │   └── StartButton.tsx       # Botón de inicio
│   ├── Game/
│   │   ├── GameScreen.tsx        # Pantalla principal del juego
│   │   ├── HistoryCard.tsx       # Tarjeta de cada opción (imagen + overlay)
│   │   ├── TimerBar.tsx          # Barra de cuenta atrás visual
│   │   └── ScoreCounter.tsx      # Contador de puntos
│   ├── GameOver/
│   │   ├── GameOverScreen.tsx    # Pantalla de Game Over
│   │   └── HistoryReveal.tsx     # Texto explicativo sobre cada opción
│   └── shared/
│       └── Overlay.tsx           # Overlay reutilizable
├── hooks/
│   ├── useTimer.ts               # Lógica del temporizador de 15s
│   ├── useWikidata.ts            # Fetch y parse de la API de Wikidata
│   └── useGame.ts                # Lógica central del juego
├── store/
│   └── gameStore.ts              # Estado global con Zustand
├── services/
│   ├── wikidataService.ts        # Queries SPARQL a Wikidata
│   └── wikipediaService.ts       # Llamadas a Wikipedia REST API
├── types/
│   └── history.types.ts          # Tipos TypeScript del dominio
├── utils/
│   └── dateUtils.ts              # Comparación y formateo de fechas históricas
├── App.tsx
└── main.tsx
```

---

## 5. Flujo de Pantallas

```
┌─────────────────────────────────┐
│         MENÚ PRINCIPAL          │
│                                 │
│     🏛️  W H A T B E F O R E    │
│                                 │
│  [ Suceso Histórico ▼ ]         │
│  [ Personaje Histórico ]        │
│                                 │
│        [ EMPEZAR ]              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│         PANTALLA DE JUEGO       │
│ ████████████░░░░░░░░  12s  🏆 3 │  ← Barra + tiempo + puntos
│                                 │
│  ┌─────────┐  │  ┌─────────┐   │
│  │         │  │  │         │   │
│  │ Imagen  │  │  │ Imagen  │   │
│  │    A    │  │  │    B    │   │
│  │         │  │  │         │   │
│  └─────────┘  │  └─────────┘   │
│  [ Elegir A ] │  [ Elegir B ]  │
└────────────┬──────────┬─────────┘
             │          │
      ✅ Correcto   ❌ Incorrecto
             │          │
             ▼          ▼
      Siguiente     ┌─────────────────┐
      ronda (+1 pt) │   GAME OVER     │
                    │                 │
                    │ ┌─────┐ ┌─────┐ │
                    │ │Info │ │Info │ │
                    │ │  A  │ │  B  │ │
                    │ └─────┘ └─────┘ │
                    │  [ REINTENTAR ] │
                    └─────────────────┘
```

---

## 6. Diseño de Pantallas

### 6.1 Menú Principal
- Fondo oscuro con textura tipo pergamino o mapa antiguo.
- Título **"WhatBefore"** en tipografía serif grande (ej. *Cinzel* de Google Fonts).
- Subtítulo: *"¿Qué ocurrió antes en la Historia?"*
- **Selector de categoría** (dropdown o toggle con dos opciones):
  - 🏛️ Suceso Histórico
  - 👤 Personaje Histórico
- Botón **"EMPEZAR"** destacado (color dorado/sepia).

### 6.2 Pantalla de Juego
- Dividida **50/50** horizontalmente.
- Cada mitad muestra:
  - Imagen representativa del suceso/personaje (obtenida de Wikidata/Wikipedia).
  - Nombre del suceso/personaje visible en la parte inferior de la tarjeta.
  - El jugador hace clic en la tarjeta que cree que es **anterior**.
- **Barra superior**:
  - Barra de progreso visual que se vacía en 15 segundos.
  - Número de segundos restantes.
  - Contador de puntos (esquina superior derecha).
- Al hacer hover sobre una tarjeta, se resalta visualmente.

### 6.3 Pantalla de Game Over
- Se produce cuando:
  - El tiempo llega a 0 sin selección.
  - El jugador elige la opción incorrecta.
- Se muestra sobre las mismas tarjetas:
  - ❌ Overlay rojo sobre la incorrecta / ✅ Overlay verde sobre la correcta.
  - Texto explicativo sobre cada imagen:
    - Nombre completo.
    - Breve descripción (sumario de Wikipedia).
    - Fecha histórica (año o rango).
- Puntuación final: *"Has conseguido X puntos"*.
- Botón **"JUGAR DE NUEVO"**.

---

## 7. Integración con APIs

### 7.1 Wikidata SPARQL (datos principales)

Para **personajes históricos**:
```sparql
SELECT ?person ?personLabel ?birthDate ?image ?articleTitle WHERE {
  ?person wdt:P31 wd:Q5 .                   # instancia de humano
  ?person wdt:P569 ?birthDate .             # tiene fecha de nacimiento
  ?person wdt:P18 ?image .                  # tiene imagen
  ?person wdt:P27 ?country .               # tiene país de ciudadanía
  FILTER(YEAR(?birthDate) < 1950)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
}
ORDER BY RAND()
LIMIT 50
```

Para **sucesos históricos**:
```sparql
SELECT ?event ?eventLabel ?date ?image ?description WHERE {
  ?event wdt:P31/wdt:P279* wd:Q198 .       # instancia de guerra (o similar)
  ?event wdt:P585 ?date .                   # tiene fecha del suceso
  ?event wdt:P18 ?image .                   # tiene imagen
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
}
ORDER BY RAND()
LIMIT 50
```

Endpoint: `https://query.wikidata.org/sparql`

### 7.2 Wikipedia REST API (resúmenes)

```
GET https://es.wikipedia.org/api/rest_v1/page/summary/{title}
```
Devuelve: `extract` (resumen en texto), `thumbnail.source` (imagen), `titles.normalized`.

### 7.3 Estrategia de datos
1. Al iniciar el juego, se lanzan las queries SPARQL según la categoría elegida.
2. Se obtienen ~50 resultados y se almacenan en memoria (Zustand store).
3. En cada ronda se seleccionan 2 al azar del pool local.
4. Se enriquecen con el resumen de Wikipedia solo en Game Over (lazy loading).
5. Cache en `sessionStorage` para evitar llamadas repetidas en la misma sesión.

---

## 8. Lógica de Juego

```typescript
// types/history.types.ts
interface HistoricalItem {
  id: string;           // Wikidata Q-ID
  label: string;        // Nombre
  date: Date;           // Fecha histórica normalizada
  imageUrl: string;     // URL imagen (Wikimedia Commons)
  summary?: string;     // Resumen Wikipedia (cargado en Game Over)
  category: 'event' | 'person';
}

interface GameState {
  category: 'event' | 'person';
  score: number;
  round: number;
  currentPair: [HistoricalItem, HistoricalItem];
  pool: HistoricalItem[];
  status: 'menu' | 'playing' | 'gameover';
  timeLeft: number;     // 0-15
}
```

**Reglas:**
- Se muestran dos opciones. El jugador debe elegir la que ocurrió **antes**.
- La correcta es la que tiene `date` menor.
- Si `date` es igual (misma fecha exacta), se descarta el par y se genera uno nuevo.
- Al acertar: `score++`, nueva ronda, el timer se reinicia a 15s.
- Al fallar o agotar el tiempo: `status = 'gameover'`.

---

## 9. Diseño Visual (Guía de Estilo)

| Elemento | Valor |
|---|---|
| Paleta principal | Dorado `#C9A84C`, Marrón oscuro `#2C1A0E`, Crema `#F5E6C8` |
| Paleta secundaria | Rojo error `#C0392B`, Verde acierto `#27AE60` |
| Tipografía títulos | **Cinzel** (Google Fonts) — serif elegante |
| Tipografía cuerpo | **Lato** o **Inter** — legible |
| Estilo general | Histórico / Antiguo / Sepia |
| Animaciones | Transición de slide entre rondas, fade en Game Over |

---

## 10. Fases de Desarrollo

### Fase 1 — Scaffolding y Menú (Estimación: 1-2 días)
- [ ] Inicializar proyecto Vite + React + TypeScript + Tailwind.
- [ ] Configurar Zustand.
- [ ] Implementar pantalla de Menú Principal con selector y botón.
- [ ] Configurar routing básico (o gestión de vistas por estado).

### Fase 2 — Integración API (Estimación: 2-3 días)
- [ ] Implementar `wikidataService.ts` con queries SPARQL.
- [ ] Implementar `wikipediaService.ts` para resúmenes.
- [ ] Crear hook `useWikidata.ts` con manejo de errores y caché.
- [ ] Probar y validar datos recibidos (fechas, imágenes, etiquetas).

### Fase 3 — Pantalla de Juego (Estimación: 2-3 días)
- [ ] Implementar layout 50/50 con las tarjetas históricas.
- [ ] Implementar `TimerBar` con countdown de 15s (`useTimer.ts`).
- [ ] Lógica de selección y comparación de fechas.
- [ ] Contador de puntos visible.
- [ ] Animaciones de hover y selección.

### Fase 4 — Game Over (Estimación: 1-2 días)
- [ ] Pantalla de Game Over con overlays verde/rojo.
- [ ] Carga lazy del resumen Wikipedia y mostrar en las tarjetas.
- [ ] Mostrar puntuación final.
- [ ] Botón de reinicio.

### Fase 5 — Polish y Testing (Estimación: 2 días)
- [ ] Responsive design (mobile-first).
- [ ] Manejo de errores de API (sin imagen, sin datos, timeout).
- [ ] Tests unitarios de la lógica de juego y utilidades de fecha.
- [ ] Optimización de rendimiento (lazy loading imágenes).
- [ ] Deploy en Vercel / GitHub Pages.

---

## 11. Consideraciones y Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Wikidata puede ser lenta | Alto | Cache en `sessionStorage`, precargar pool al inicio |
| Imágenes de Wikimedia sin licencia adecuada | Medio | Verificar licencias CC; Wikimedia Commons suele ser libre |
| Fechas ambiguas o BC (antes de Cristo) | Medio | Usar `xsd:dateTime` de Wikidata; manejar años negativos en JS |
| CORS en queries SPARQL | Bajo | Wikidata SPARQL permite requests desde browser con header correcto |
| Pares con misma fecha exacta | Bajo | Filtrar pares donde `Math.abs(dateA - dateB) < threshold` |
| Pocos resultados con imagen en español | Medio | Fallback a etiquetas en inglés; usar imagen placeholder si no hay |

---

## 12. Posibles Mejoras Futuras (Backlog)

- 🏆 **Tabla de clasificación** (usando localStorage o un servicio como Supabase).
- 🌍 **Modo por región** (Historia de Europa, América, Asia...).
- 🎯 **Dificultad ajustable** (más tiempo, eventos más conocidos vs. oscuros).
- 🔊 **Efectos de sonido** al acertar/fallar.
- 📱 **PWA** para poder instalarlo en el móvil.
- 🤝 **Modo multijugador** en tiempo real (WebSockets).
- 📊 **Estadísticas del jugador** (racha máxima, categoría favorita).
- 🃏 **Modo "streak"**: cuántas respuestas correctas seguidas puedes encadenar.

---

## 13. Estructura de Repositorio

```
whatbefore/
├── public/
│   └── favicon.ico
├── src/                    # (ver sección 4)
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.example            # Variables de entorno (si se añaden en el futuro)
├── README.md
└── PLANNING.md             # Este documento
```

---

*Documento creado el 9 de abril de 2026.*
