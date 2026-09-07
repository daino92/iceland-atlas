import { useCallback, useEffect, useRef } from "react";
import L from "leaflet";

import { MapCanvas } from "@/components";
import { UI } from "@/i18n";
import { useRoadConditions, useWeatherGrid } from "@/hooks";
import { getPlaceMeta } from "@/lib";
import type { Language, Location } from "@/types";

const EMPTY_ROUTE: [number, number][] = [];

const ICELAND_FRAME = L.latLngBounds([63.28, -24.82], [66.66, -13.18]);
const ICELAND_PAN_BOUNDS = L.latLngBounds([63.08, -25.15], [66.84, -12.88]);

interface Props {
  language: Language;
  places: Location[];
  selectedPlace: Location | null;
  onSelect: (place: Location) => void;
  flyTo?: Location | null;
  routeCoordinates?: [number, number][];
  showRoadConditions: boolean;
  showWeatherLayer: boolean;
  fitRouteSignal: number;
  replayRouteSignal: number;
}

type Cluster = { lat: number; lng: number; places: Location[] };

const SERVICE_CATEGORIES = new Set<Location["category"]>([
  "parking",
  "fuel",
  "shop",
  "food",
]);

const MAJOR_CATEGORIES = new Set<Location["category"]>([
  "attraction",
  "waterfall",
  "thermal",
  "glacier",
  "beach",
  "viewpoint",
]);

export const selectVisiblePlaces = (
  places: Location[],
  zoom: number,
  selectedPlace: Location | null,
) => {
  const visible =
    zoom <= 6
      ? places.filter((place) => MAJOR_CATEGORIES.has(place.category))
      : zoom < 8
        ? places.filter((place) => !SERVICE_CATEGORIES.has(place.category))
        : places;
  if (
    selectedPlace &&
    places.some((place) => place.id === selectedPlace.id) &&
    !visible.some((place) => place.id === selectedPlace.id)
  )
    return [...visible, selectedPlace];
  return visible;
};

const clusterPlaces = (places: Location[], map: L.Map): Cluster[] => {
  const zoom = map.getZoom();
  if (zoom >= 9)
    return places.map((place) => ({
      lat: place.lat,
      lng: place.lng,
      places: [place],
    }));
  const cell = zoom <= 6 ? 70 : zoom <= 7 ? 48 : 30;
  const groups = new Map<
    string,
    { x: number; y: number; places: Location[] }
  >();
  places.forEach((place) => {
    const point = map.project([place.lat, place.lng], zoom);
    const key = `${Math.floor(point.x / cell)}:${Math.floor(point.y / cell)}`;
    const group = groups.get(key) ?? { x: 0, y: 0, places: [] };
    group.x += point.x;
    group.y += point.y;
    group.places.push(place);
    groups.set(key, group);
  });
  return [...groups.values()].map((group) => {
    const point = L.point(
      group.x / group.places.length,
      group.y / group.places.length,
    );
    const latLng = map.unproject(point, zoom);
    return { lat: latLng.lat, lng: latLng.lng, places: group.places };
  });
};

const markerIcon = (place: Location, selected: boolean) => {
  const meta = getPlaceMeta(place);
  return L.divIcon({
    className: "category-marker-wrap",
    html: `<div class="category-marker ${selected ? "selected" : ""} cat-${place.category}"><span>${meta.icon}</span></div>`,
    iconSize: [32, 36],
    iconAnchor: [16, 34],
    tooltipAnchor: [0, -30],
  });
};

const IcelandMap = ({
  language,
  places,
  selectedPlace,
  onSelect,
  flyTo,
  routeCoordinates = EMPTY_ROUTE,
  showRoadConditions,
  showWeatherLayer,
  fitRouteSignal,
  replayRouteSignal,
}: Props) => {
  const { data: roads } = useRoadConditions(showRoadConditions);
  const { data: weatherPoints } = useWeatherGrid(showWeatherLayer);
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const roadsLayerRef = useRef<L.GeoJSON | null>(null);
  const weatherLayerRef = useRef<L.LayerGroup | null>(null);
  const replayTimerRef = useRef<number | null>(null);
  const placesRef = useRef(places);
  const selectedRef = useRef(selectedPlace);
  const onSelectRef = useRef(onSelect);

  placesRef.current = places;
  selectedRef.current = selectedPlace;
  onSelectRef.current = onSelect;

  const renderMarkers = useCallback(() => {
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const visiblePlaces = selectVisiblePlaces(
      placesRef.current,
      map.getZoom(),
      selectedRef.current,
    );
    clusterPlaces(visiblePlaces, map).forEach((cluster) => {
      if (cluster.places.length === 1) {
        const place = cluster.places[0];
        const marker = L.marker([place.lat, place.lng], {
          icon: markerIcon(place, selectedRef.current?.id === place.id),
        });
        marker.bindTooltip(place.name, { direction: "top", offset: [0, -4] });
        marker.on("click", () => onSelectRef.current(place));
        marker.addTo(layer);
      } else {
        const marker = L.marker([cluster.lat, cluster.lng], {
          icon: L.divIcon({
            className: "cluster-marker-wrap",
            html: `<div class="cluster-marker">${cluster.places.length}</div>`,
            iconSize: [42, 42],
            iconAnchor: [21, 21],
          }),
        });
        marker.bindTooltip(`${cluster.places.length} places`);
        marker.on("click", () =>
          map.flyTo(
            [cluster.lat, cluster.lng],
            Math.min(map.getZoom() + 2, 12),
            { duration: 0.6 },
          ),
        );
        marker.addTo(layer);
      }
    });
  }, []);

  useEffect(() => {
    if (!mapElement.current || mapRef.current) return;
    const map = L.map(mapElement.current, {
      zoomControl: false,
      maxBounds: ICELAND_PAN_BOUNDS,
      maxBoundsViscosity: 1,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      worldCopyJump: false,
      bounceAtZoomLimits: false,
    });
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      noWrap: true,
      // Pan bounds constrain navigation; tiles must cover the entire viewport.
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const frameIsland = () => {
      map.setMinZoom(0);
      map.fitBounds(ICELAND_FRAME, { padding: [2, 2], animate: false });
      map.setMinZoom(map.getZoom());
      map.setMaxBounds(ICELAND_PAN_BOUNDS);
      map.panInsideBounds(ICELAND_PAN_BOUNDS, { animate: false });
    };

    frameIsland();
    const markerLayer = L.layerGroup().addTo(map);
    markerLayerRef.current = markerLayer;
    mapRef.current = map;
    map.on("resize", frameIsland);
    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(mapElement.current);
    map.on("zoomend", renderMarkers);
    renderMarkers();

    return () => {
      resizeObserver.disconnect();
      map.off("resize", frameIsland);
      map.off("zoomend", renderMarkers);
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, [renderMarkers]);

  useEffect(() => {
    renderMarkers();
  }, [places, selectedPlace, renderMarkers]);

  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    mapRef.current.flyTo(
      [flyTo.lat, flyTo.lng],
      Math.max(mapRef.current.getZoom(), 10),
      { duration: 0.8 },
    );
  }, [flyTo]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    routeLayerRef.current?.remove();
    routeLayerRef.current = null;
    if (routeCoordinates.length > 1) {
      routeLayerRef.current = L.polyline(routeCoordinates, {
        color: "#F4C95D",
        weight: 5,
        opacity: 0.92,
      }).addTo(map);
      map.fitBounds(routeLayerRef.current.getBounds(), {
        padding: [70, 70],
        maxZoom: 10,
      });
    }
  }, [routeCoordinates]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || routeCoordinates.length < 2 || !fitRouteSignal) return;
    map.fitBounds(L.latLngBounds(routeCoordinates), {
      padding: [70, 70],
      maxZoom: 10,
    });
  }, [fitRouteSignal, routeCoordinates]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || routeCoordinates.length < 2 || !replayRouteSignal) return;
    if (replayTimerRef.current) window.clearInterval(replayTimerRef.current);
    const line = L.polyline([routeCoordinates[0]], {
      color: "#F4C95D",
      weight: 5,
      opacity: 0.92,
    }).addTo(map);
    routeLayerRef.current?.remove();
    routeLayerRef.current = line;
    let index = 1;
    replayTimerRef.current = window.setInterval(() => {
      line.addLatLng(routeCoordinates[index]);
      index += 1;
      if (index >= routeCoordinates.length && replayTimerRef.current) {
        window.clearInterval(replayTimerRef.current);
        replayTimerRef.current = null;
      }
    }, 35);
    return () => {
      if (replayTimerRef.current) window.clearInterval(replayTimerRef.current);
      replayTimerRef.current = null;
    };
  }, [replayRouteSignal, routeCoordinates]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    roadsLayerRef.current?.remove();
    roadsLayerRef.current = null;
    if (!showRoadConditions || !roads) return;
    roadsLayerRef.current = L.geoJSON(roads, {
      style: (feature) => ({
        color: feature?.properties?.AST1_LITUR || "#8996A3",
        weight: 4,
        opacity: 0.88,
      }),
      onEachFeature: (feature, layer) => {
        const props = feature.properties ?? {};
        const name = props.NAFN_LEIDAR || "Road";
        const condition = props.AST1_NAFN || "Unknown";
        layer.bindTooltip(`${name} · ${condition}`);
      },
    }).addTo(map);
    return () => {
      roadsLayerRef.current?.remove();
    };
  }, [showRoadConditions, roads]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    weatherLayerRef.current?.remove();
    weatherLayerRef.current = null;
    if (!showWeatherLayer || !weatherPoints) return;
    const group = L.layerGroup();
    weatherPoints.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], {
        icon: L.divIcon({
          className: "weather-marker-wrap",
          html: `<div class="weather-marker"><b>${Math.round(point.temperature)}°</b><span>${Math.round(point.windSpeed)} km/h</span></div>`,
          iconSize: [66, 43],
          iconAnchor: [33, 22],
        }),
        interactive: false,
      });
      marker.bindTooltip(
        `${point.label} · ${point.temperature}°C · ${Math.round(point.windSpeed)} km/h wind`,
      );
      marker.addTo(group);
    });
    group.addTo(map);
    weatherLayerRef.current = group;
    return () => {
      group.remove();
    };
  }, [showWeatherLayer, weatherPoints]);

  return (
    <MapCanvas ref={mapElement} id="map" aria-label={UI[language].mapLabel} />
  );
};

export default IcelandMap;
