import { RESOURCES } from "@/i18n";
import type {
  AuroraForecast,
  Language,
  Location,
  PlaceWeather,
  RouteWeatherSegment,
  WeatherGridPoint,
} from "@/types";
import { getJson } from "@/lib";

export const getPlaceWeather = async (
  place: Location,
  signal?: AbortSignal,
): Promise<PlaceWeather | null> => {
  const params = new URLSearchParams({
    latitude: String(place.lat),
    longitude: String(place.lng),
    current:
      "temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m",
    timezone: "Atlantic/Reykjavik",
  });
  const data = await getJson<any>(
    `https://api.open-meteo.com/v1/forecast?${params}`,
    signal,
  );
  const c = data.current;
  if (!c) return null;
  return {
    temperature: c.temperature_2m,
    apparentTemperature: c.apparent_temperature,
    precipitation: c.precipitation,
    windSpeed: c.wind_speed_10m,
    windGusts: c.wind_gusts_10m,
    weatherCode: c.weather_code,
    time: c.time,
  };
};

export const ROAD_CONDITION_URL =
  "/api/roads/query?where=1%3D1&outFields=NAFN_LEIDAR%2CAST1_LITUR%2CAST1_NAFN%2CDB_MODIFY&returnGeometry=true&outSR=4326&f=geojson";

export const weatherCodeLabel = (code: number, language: Language) => {
  const key =
    code === 0
      ? "clear"
      : code <= 3
        ? "cloudy"
        : code <= 48
          ? "fog"
          : code <= 67
            ? "rain"
            : code <= 77
              ? "snow"
              : code <= 82
                ? "showers"
                : code <= 86
                  ? "snowShowers"
                  : "storm";
  return RESOURCES[language].weather[key];
};

const WEATHER_ANCHORS = [
  { label: "Reykjavík", lat: 64.1466, lng: -21.9426 },
  { label: "Vík", lat: 63.4194, lng: -19.0097 },
  { label: "Höfn", lat: 64.2539, lng: -15.2082 },
  { label: "Egilsstaðir", lat: 65.2669, lng: -14.3948 },
  { label: "Mývatn", lat: 65.6039, lng: -16.9961 },
  { label: "Akureyri", lat: 65.6885, lng: -18.1262 },
  { label: "Hvammstangi", lat: 65.3971, lng: -20.9435 },
  { label: "Ísafjörður", lat: 66.0749, lng: -23.134 },
  { label: "Grundarfjörður", lat: 64.9243, lng: -23.2631 },
];

export const getWeatherGrid = async (
  signal?: AbortSignal,
): Promise<WeatherGridPoint[]> => {
  const params = new URLSearchParams({
    latitude: WEATHER_ANCHORS.map((p) => p.lat).join(","),
    longitude: WEATHER_ANCHORS.map((p) => p.lng).join(","),
    current:
      "temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m",
    timezone: "Atlantic/Reykjavik",
  });
  const data = await getJson<any>(
    `https://api.open-meteo.com/v1/forecast?${params}`,
    signal,
  );
  const rows = Array.isArray(data) ? data : [data];
  return rows.map((row: any, index: number) => ({
    lat: WEATHER_ANCHORS[index].lat,
    lng: WEATHER_ANCHORS[index].lng,
    label: WEATHER_ANCHORS[index].label,
    temperature: row.current.temperature_2m,
    apparentTemperature: row.current.apparent_temperature,
    precipitation: row.current.precipitation,
    windSpeed: row.current.wind_speed_10m,
    windGusts: row.current.wind_gusts_10m,
    weatherCode: row.current.weather_code,
    time: row.current.time,
  }));
};

const routeSamples = (coordinates: [number, number][]) => {
  const count = Math.min(5, coordinates.length);
  return Array.from({ length: count }, (_, index) => {
    const sourceIndex = Math.round((index * (coordinates.length - 1)) / Math.max(count - 1, 1));
    return coordinates[sourceIndex];
  });
};

export const getRouteWeather = async (
  coordinates: [number, number][],
  signal?: AbortSignal,
): Promise<RouteWeatherSegment[]> => {
  const samples = routeSamples(coordinates);
  if (!samples.length) return [];
  const params = new URLSearchParams({
    latitude: samples.map(([, lat]) => lat).join(","),
    longitude: samples.map(([lng]) => lng).join(","),
    current:
      "temperature_2m,precipitation,weather_code,wind_gusts_10m",
    timezone: "Atlantic/Reykjavik",
  });
  const data = await getJson<any>(
    `https://api.open-meteo.com/v1/forecast?${params}`,
    signal,
  );
  const rows = Array.isArray(data) ? data : [data];
  return rows.map((row, index) => ({
    label: index === 0 ? "Start" : index === rows.length - 1 ? "End" : `Segment ${index}`,
    latitude: samples[index][1],
    longitude: samples[index][0],
    temperature: row.current?.temperature_2m ?? 0,
    windGusts: row.current?.wind_gusts_10m ?? 0,
    precipitation: row.current?.precipitation ?? 0,
    weatherCode: row.current?.weather_code ?? 0,
  }));
};

const AURORA_LATITUDE = 64.1466;
const AURORA_LONGITUDE = -21.9426;

export const getAuroraForecast = async (
  signal?: AbortSignal,
): Promise<AuroraForecast> => {
  const weatherParams = new URLSearchParams({
    latitude: String(AURORA_LATITUDE),
    longitude: String(AURORA_LONGITUDE),
    hourly: "cloud_cover",
    forecast_days: "1",
    timezone: "Atlantic/Reykjavik",
  });
  const [cloudData, kpData] = await Promise.all([
    getJson<any>(
      `https://api.open-meteo.com/v1/forecast?${weatherParams}`,
      signal,
    ),
    getJson<any[]>("/api/aurora/kp", signal),
  ]);
  const cloudValues = cloudData.hourly?.cloud_cover ?? [];
  const cloudCover = cloudValues.length
    ? Number(cloudValues[Math.min(20, cloudValues.length - 1)])
    : null;
  const kpRows = Array.isArray(kpData) ? kpData.slice(1) : [];
  const kpCandidates = kpRows
    .map((row) => Number(row?.[1] ?? row?.[2]))
    .filter(Number.isFinite);
  const kp = kpCandidates.length ? Math.max(...kpCandidates) : null;
  const score = (kp ?? 0) >= 4 ? 2 : (kp ?? 0) >= 2.5 ? 1 : 0;
  const cloudScore = cloudCover === null ? 0 : cloudCover <= 35 ? 2 : cloudCover <= 65 ? 1 : 0;
  const total = score + cloudScore;
  return { kp, cloudCover, level: total >= 3 ? "good" : total >= 1 ? "possible" : "unlikely" };
};
