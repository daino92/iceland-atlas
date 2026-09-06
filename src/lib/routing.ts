import { RESOURCES } from "@/i18n";
import type { Language, Location, RouteResult } from "@/types";
import { getJson } from "@/lib";

export const getDrivingRoute = async (
  places: Location[],
  signal?: AbortSignal,
): Promise<RouteResult | null> => {
  if (places.length < 2) return null;
  const coords = places.map((place) => `${place.lng},${place.lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`;
  const data = await getJson<any>(url, signal);
  const route = data.routes?.[0];
  if (!route) return null;
  return {
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    coordinates: route.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng] as [number, number],
    ),
  };
};

export const formatDistance = (meters: number) => {
  return `${Math.round(meters / 1000)} km`;
};

export const formatDrivingTime = (seconds: number, language: Language) => {
  const minutes = Math.round(seconds / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const units = RESOURCES[language].units;
  if (!h) return `${m} ${units.shortMinutes}`;
  return `${h} ${units.hours} ${m} ${units.shortMinutes}`;
};
