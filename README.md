# weather-mesh 

An asynchronous, single-page frontend repository engineered to interface seamlessly with the OpenWeatherMap REST API. This project demonstrates modular UI patterns, asynchronous state handling, and structural optimization without external frameworks, build tools, or npm dependencies.

## Repository Architecture

The codebase is partitioned into two distinct architectural approaches to demonstrate progress from a foundational baseline to an advanced production client:

### 1. `classic-version/`
* **Scope:** Foundational DOM querying, template-string rendering, and standard asynchronous data consumption.
* **Core Tech:** Single-endpoint data binding (`/weather`), linear error blocks, and static CSS styling schemas.

### 2. `optimized-version/` 
* **Scope:** Multi-endpoint integration (`/weather` + `/forecast`), dynamic layout states, optimized browser rendering lifecycles, and strict accessibility handling.
* **Key Visuals:** Contextual background shifting based on weather status and local timezone calculations.

---

## Project Structure

```plaintext
weather-mesh/
│
├── classic-version/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── optimized-version/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

---

##  Atmosphere Technical Specifications (`optimized-version/`)

* **10-Metric Data Grid:** Features modular data nodes displaying localized parameters including temperature, feels-like metrics, humidity, wind velocity vectors, visibility indexes, barometric pressure, astronomical boundaries (sunrise/sunset), cloud spatial density, a 24-hour strip, and a 5-day predictive forecast.
* **Animated SVG Engine:** Core iconography consists of hand-coded, inline SVGs with localized CSS keyframe execution layers (including rotating solar radii, vector raindrop translations, kinetic lightning arcs, and fog-line drift parameters).
* **High-Performance Counter Animations:** Numeric indices dynamically interpolate upwards from zero utilizing a `requestAnimationFrame` render cycle throttled by a cubic ease-out mathematical curve.
* **Asynchronous Layout States:** Shimmering skeleton placeholders mitigate layout shifts during pending API execution frames.
* **Scroll-Snap Temporal Ribbon:** Implements a horizontally scrollable 24-hour structural view constrained by CSS `scroll-snap-type: x mandatory` layout configurations.
* **Defensive Accessibility Layer:** Computational transitions and visual keyframes are nested inside `@media (prefers-reduced-motion: no-preference)` to respect device-level motion choices. Built on clean semantic tags (`<header>`, `<main>`, `<article>`, `<time>`) with `aria-live` regions for screen-reader parity.

---

## Technology Stack Matrix

| Layer | Implementation Details |
| :--- | :--- |
| **Markup** | Semantic HTML5 (Zero template-text nodes, minimal structural layers) |
| **Styles** | Advanced CSS3 (Custom properties, CSS Grid schemas, `@keyframes`, `backdrop-filter`) |
| **Logic** | Vanilla ES6+ (`fetch()`, `async/await`, `requestAnimationFrame`, `classList` operations) |
| **Typography** | Google Fonts API (Cormorant Garamond, Outfit, IBM Plex Mono) |
| **Data Layer** | OpenWeatherMap REST API Core (Concurrent `/weather` and `/forecast` integrations) |

---
## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/youngsharunnn/weather-mesh.git
cd optimized-version
```

---

### 2. Get a Free API Key

Create a free account at:

https://openweathermap.org/api

Generate your API key after signing in.

The free tier supports both endpoints used in this project:

- `/weather`
- `/forecast`

---

### 3. Add Your API Key

Open `script.js` and replace the placeholder value:

```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
```

---







