import { skipToken, useQuery } from "@tanstack/react-query";

import type {
  AuroraForecast,
  DayRisk,
  Location,
  Language,
  RoadConditions,
  RouteResult,
  RouteWeatherSegment,
} from "@/types";
import {
  getWiki,
  getMedia,
  getPlaceWeather,
  getWeatherGrid,
  ROAD_CONDITION_URL,
  getDrivingRoute,
  getJson,
  getPlaceMeta,
  getRouteWeather,
  getAuroraForecast,
} from "@/lib";

const CONTENT_STALE_TIME = 24 * 60 * 60 * 1000;
const LIVE_STALE_TIME = 5 * 60 * 1000;
const EMPTY_MEDIA: string[] = [];

export const usePlaceInfo = (
  place: Location | undefined,
  language: Language,
) => {
  const wiki = useQuery({
    queryKey: ["wiki", place?.id, place?.name, language],
    queryFn: place
      ? ({ signal }) => getWiki(place, language, signal)
      : skipToken,
    staleTime: CONTENT_STALE_TIME,
  });
  const media = useQuery({
    queryKey: ["media", place?.id, place?.name],
    queryFn: place ? ({ signal }) => getMedia(place, signal) : skipToken,
    staleTime: CONTENT_STALE_TIME,
  });
  const weather = useQuery({
    queryKey: ["weather", place?.lat, place?.lng],
    queryFn: place ? ({ signal }) => getPlaceWeather(place, signal) : skipToken,
    staleTime: LIVE_STALE_TIME,
  });
  return {
    wiki: wiki.data ?? null,
    media: media.data ?? EMPTY_MEDIA,
    weather: weather.data ?? null,
    loading: wiki.isLoading || media.isLoading,
  };
};

export const useDrivingRoute = (places: Location[]) => {
  return useQuery({
    queryKey: ["driving-route", places.map(({ lat, lng }) => [lat, lng])],
    queryFn:
      places.length >= 2
        ? ({ signal }) => getDrivingRoute(places, signal)
        : skipToken,
    staleTime: CONTENT_STALE_TIME,
  });
};

export const useRoadConditions = (enabled: boolean) => {
  return useQuery({
    queryKey: ["road-conditions"],
    queryFn: ({ signal }) =>
      getJson<RoadConditions>(ROAD_CONDITION_URL, signal),
    enabled,
    staleTime: LIVE_STALE_TIME,
    refetchInterval: enabled ? LIVE_STALE_TIME : false,
  });
};

export const useWeatherGrid = (enabled: boolean) => {
  return useQuery({
    queryKey: ["weather-grid"],
    queryFn: ({ signal }) => getWeatherGrid(signal),
    enabled,
    staleTime: LIVE_STALE_TIME,
    refetchInterval: enabled ? LIVE_STALE_TIME : false,
  });
};

export const useDayRisk = (places: Location[], enabled: boolean) =>
  useQuery<DayRisk>({
    queryKey: ["day-risk", places.map(({ id }) => id)],
    enabled: enabled && places.length > 0,
    queryFn: async ({ signal }) => {
      const [weather, roads] = await Promise.all([
        Promise.all(places.map((place) => getPlaceWeather(place, signal))),
        getJson<RoadConditions>(ROAD_CONDITION_URL, signal),
      ]);
      const messages: string[] = [];
      let level: DayRisk["level"] = "clear";
      const promote = (next: DayRisk["level"]) => {
        if (next === "danger" || (next === "caution" && level === "clear"))
          level = next;
      };
      places.forEach((place, index) => {
        const current = weather[index];
        const winter = getPlaceMeta(place).winter;
        if (winter === "seasonal" || winter === "difficult") {
          messages.push(
            `${place.name}: ${winter === "seasonal" ? "seasonal access" : "difficult winter access"}`,
          );
          promote(winter === "seasonal" ? "caution" : "danger");
        }
        if (current && (current.windGusts >= 70 || current.weatherCode >= 95)) {
          messages.push(`${place.name}: severe weather conditions`);
          promote("danger");
        } else if (
          current &&
          (current.windGusts >= 45 || current.weatherCode >= 51)
        ) {
          messages.push(`${place.name}: changing weather conditions`);
          promote("caution");
        }
      });
      const roadText = JSON.stringify(roads).toLowerCase();
      if (/closed|impassable|unfær|lokað/.test(roadText)) {
        messages.push("Live road data reports a closure or impassable section");
        promote("danger");
      } else if (/icy|slippery|difficult|erfitt/.test(roadText)) {
        messages.push("Live road data reports difficult driving conditions");
        promote("caution");
      }
      return { level, messages: messages.slice(0, 4) };
    },
    staleTime: LIVE_STALE_TIME,
    refetchInterval: enabled ? LIVE_STALE_TIME : false,
  });

export const useRouteWeather = (
  route: RouteResult | null,
  enabled: boolean,
) =>
  useQuery<RouteWeatherSegment[]>({
    queryKey: ["route-weather", route?.coordinates],
    queryFn: route
      ? ({ signal }) => getRouteWeather(route.coordinates, signal)
      : skipToken,
    enabled: enabled && Boolean(route),
    staleTime: LIVE_STALE_TIME,
  });

export const useAuroraForecast = (enabled: boolean) =>
  useQuery<AuroraForecast>({
    queryKey: ["aurora-forecast"],
    queryFn: ({ signal }) => getAuroraForecast(signal),
    enabled,
    staleTime: LIVE_STALE_TIME,
    refetchInterval: enabled ? LIVE_STALE_TIME : false,
  });
