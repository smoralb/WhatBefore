# WHAT BEFORE - Timeline Duel Game

Un juego de trivia estilo arcade/bolera de los 90 donde demuestras qué evento histórico ocurrió primero.

## Estilo Visual

- **Neo-brutalist Arcade 90s**: Colores neón (azul cyan, rosa magenta, amarillo)
- Estética de máquina arcade(old school) / bolera
- Fuentes retro: Press Start 2P, VT323
- Bordes chunky, sombras dura, efectos glow neon

## Tech Stack

- React 19 + Vite
- Tailwind CSS 4
- Framer Motion (animaciones)
- localStorage (leaderboard)

## Comandos

```bash
npm install    # Instalar dependencias
npm run dev   # Servidor desarrollo
npm run build  # Build producción
npm run lint   # Linter
```

## Estructura

```
src/
├── App.jsx           # Router principal
├── index.css         # Estilos globais + clases neo-brutalist
├── main.jsx          # Entry point
├── components/
│   ├── Home.jsx       # Pantalla inicio
│   ├── Game.jsx      # Juego principal
│   ├── GameOver.jsx  # Fin de juego
│   └── Leaderboard.jsx # Tabla puntuaciones
└── utils/
    └── wikiApi.js   # Eventos históricos
```

## Clases CSS Neo-brutalist

| Clase | Descripción |
|-------|-------------|
| `brutal-border` | Borde 4px negro |
| `brutal-shadow` | Sombra 8px negra |
| `brutal-btn` | Botón azul neon |
| `brutal-card` | Tarjeta rosa |
| `neon-glow` | Efecto glow cyan |
| `arcade-cabin` | Fondo oscuro arcade |
| `score-display` | Display LED score |
| `retro-grid` | Grid retro |
| `pulse-glow` | Pulso animato |

## Colores

```css
--color-electric-blue: #00d4ff
--color-neon-pink: #ff00ff
--color-neon-yellow: #ffff00
```

## Gameplay

1. Pantalla inicio → START GAME
2. Dos eventos históricos aleatorios
3. 15 segundos para elegir cuál ocurrió primero
4. Puntos: 100 + (tiempo × 10)
5. Game over al fallar o timeout
6. Leaderboard top 10 guardado en localStorage