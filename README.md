# Iceland Atlas

Interactive Iceland trip planner built with React + Vite + TypeScript and configured for pnpm.

## Run

```bash
pnpm install
pnpm dev
```

Production:

```bash
pnpm build
pnpm preview
```

## Included features

### Map and discovery

- 194 imported KML locations
- Iceland-only Leaflet viewport with whole-island minimum zoom
- Zoom-aware smart markers: major attractions when zoomed out, services such as parking, fuel, shops and food when zoomed in
- Category pin icons and automatic clustering
- Selected markers remain visible when zoom filtering would otherwise hide them
- Search, layer filters, category filters, and favorite/planned/visited filters
- Greek / English interface and place information
- `/place/:id` detail routes
- Wikipedia / Wikimedia information and imagery
- Current weather for opened locations via Open-Meteo
- Optional weather marker layer
- Live Iceland road-condition overlay from Vegagerðin / IRCA ArcGIS data

### Trip planning

- Trip builder with custom days and per-day stop lists
- Add places to days from the map or Explore list
- Reorder stops with drag and drop
- Move stops between days with drag and drop
- Manual up/down stop controls and stop removal
- Custom day names
- Start and end locations for each day
- Driving route lines, distance and driving time via the public OSRM demo endpoint
- Estimated stop duration per place
- Winter accessibility guidance
- Day start-date selection with automatic dates for following days
- Sunrise, sunset and daylight-hour calculations for Iceland
- Day feasibility score: Comfortable, Full day, or Unrealistic
- Route-segment weather summary with temperature, conditions and wind gusts
- Route weather selected for the planned departure date and time
- Aurora forecast using cloud coverage and NOAA KP data
- Weather and road-risk summary for the active day
- Nearest-neighbor route optimization for the active day
- Departure-time selection with estimated arrival
- Active-day timeline showing departure, arrival and planned time
- Overnight accommodation selection per day
- Route elevation summary with ascent, descent, maximum elevation and difficulty

### Trip management

- Favorites, planned and visited state stored in `localStorage`
- Shareable trip URLs that restore the itinerary
- JSON and CSV trip export
- Budget planner for rental cars, fuel, hotels, food, parking, baths and activities
- Daily budget items and total trip budget
- Currency selection and per-person budget totals
- Trip statistics for planned places, estimated kilometers, stop hours and category counts
- Route controls to fit the active route and replay it on the map

### Platform and engineering

- React Query for server-state fetching and caching
- Axios HTTP client with request cancellation and error handling
- Emotion styled components with minimal global CSS
- Centralized i18n configuration in `src/i18n.ts` with `en` and `el` locale files
- Vite PWA support with service-worker generation and cached map tiles
- Offline caching for static application assets
- Vite proxy routes for external services that do not provide browser CORS headers

## Roadmap

These are proposed features. When one is implemented, move it into the relevant section above and document its user-facing behavior here.

- Maximum daily driving-time and road-type preferences
- Saved trip history with named itineraries and duplication
- Route elevation profile and steep-road warnings
- Richer route-weather forecasts by multiple departure windows and route segment
- Aurora history and best viewing windows by hour
- Currency selection and per-person budget splitting
- Accommodation planning with hotel costs and overnight distance checks
- Mobile bottom-sheet trip planner with improved touch interactions
- Import and export using GPX and Google Maps-compatible formats
- Automated tests for trip persistence, drag-and-drop, route calculations and localization
- Accommodation nights and overnight-location planning
- GPX import and export for hiking and driving routes
- Per-person budget splitting and currency conversion
- Elevation profiles and hiking difficulty warnings
- Offline trip-pack downloads for selected places, routes and map areas
- Accessibility filters for parking, walks and facilities

## Data notes

Weather data is fetched client-side from Open-Meteo (no API key required for its public non-commercial service). Route weather uses sampled points along the active route. Aurora conditions combine Open-Meteo cloud coverage with NOAA planetary KP data. Road-condition data comes from the Icelandic Road and Coastal Administration's public ArcGIS service. Route calculations use the public OSRM demo server; for a production/public deployment, use your own routing provider or hosted OSRM instance.

Winter accessibility and stop duration are planning estimates. Always verify current weather, road closures and safety guidance before driving in Iceland.

## Road overlay proxy

The browser requests `/api/roads/query`. Vite development and preview servers
proxy this path to
`https://vegasja.vegagerdin.is/arcgis/rest/services/data/faerd/FeatureServer/16/query`,
preserving the query string. This service does not provide the CORS headers needed
for direct browser access. Restart `pnpm dev` after changing the proxy configuration.

When deploying `dist` to a production host, configure the same reverse-proxy route
(or a serverless endpoint) on that host. Static file hosting alone cannot serve the
live road overlay. The base map and other APIs do not depend on this proxy.

The aurora forecast uses the `/api/aurora/kp` development proxy for NOAA's planetary
K-index forecast. Production deployments should provide the equivalent reverse-proxy
route or serverless endpoint.
