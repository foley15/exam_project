# 🌤️ Responsive Weather Application

A clean, modern, and lightweight JavaScript weather dashboard that provides real-time current conditions and a 5-day forecast. Built purely with semantic HTML5, modern CSS3, and Vanilla JavaScript, this app interfaces directly with the open-source **Open-Meteo API** and the **OpenStreetMap Nominatim API** to serve precise, layout-driven meteorological data without tracking or user-key requirements.

---

## 🚀 Live Core Features

* **Dynamic Client-Side Geolocation:** Utilizes the browser's native `navigator.geolocation` API to automatically identify user coordinates upon page load, removing the need for initial manual searches.
* **Reverse Geocoding Search Pipeline:** Coordinates are mapped into real town/city and country names seamlessly using the OpenStreetMap Nominatim endpoint.
* **WMO Weather Code Translation:** Decodes raw World Meteorological Organization weather integer arrays into highly accurate, localized text descriptions and dynamic graphical emojis.
* **Asynchronous Network Safety State:** Custom error-catching pipelines intercept invalid text queries, empty strings, server connection timeouts, and coordinate lookup failures cleanly without crashing the viewport.
* **Asynchronous Loading State UI:** Seamlessly flashes an animated skeleton/loading status interface component to maintain visual pacing while async network data resolves.

---

## 🛠️ Tech Stack & API Engineering

* **Frontend Architecture:** Vanilla ECMAScript 6+ (Asynchronous Fetch API, Object Destructuring, Template Literals, Strict Error Handling)
* **Interface Layout:** HTML5 Core Elements, CSS3 Flexbox Models
* **Primary Core Engine:** [Open-Meteo Weather Forecast API](https://open-meteo.com/) (Current & Daily variables: `temperature_2m`, `relative_humidity_2m`, `wind_speed_10m`, `uv_index`, `weather_code`)
* **Spatial Geocoding Engines:** [Open-Meteo Geocoding Search](https://open-meteo.com/en/docs/geocoding-api) & [OpenStreetMap Nominatim Reverse Geocoding API](https://nominatim.org/)

---

## 📂 Project Architecture

```text
├── index.html       # Structural layout and element anchors
├── style.css        # Layout structure, typography definitions, component UI states
├── app.js           # Main JS engine (State configuration, API controllers, DOM routers)
└── README.md        # Comprehensive implementation overview
