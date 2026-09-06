import type { geoJSON } from "leaflet";

export type LocationCategory =
  | "attraction"
  | "waterfall"
  | "thermal"
  | "glacier"
  | "beach"
  | "viewpoint"
  | "parking"
  | "stay"
  | "shop"
  | "fuel"
  | "food";

export type Location = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  layer: string;
  category: LocationCategory;
  description: string;
};

export type Language = "en" | "el";

export type PlaceWeather = {
  temperature: number;
  apparentTemperature: number;
  precipitation: number;
  windSpeed: number;
  windGusts: number;
  weatherCode: number;
  time: string;
};

export type WeatherGridPoint = PlaceWeather & {
  lat: number;
  lng: number;
  label: string;
};

export type WinterLevel = "easy" | "caution" | "difficult" | "seasonal";

export type PlaceMeta = {
  winter: WinterLevel;
  stopMinutes: number;
  icon: string;
};

export type WikiSummary = {
  extract?: string;
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
  content_urls?: { desktop?: { page?: string } };
  type?: string;
  lang?: Language;
};

export type RouteResult = {
  distanceMeters: number;
  durationSeconds: number;
  coordinates: [number, number][];
};

export type PlaceState = {
  favorite: boolean;
  planned: boolean;
  visited: boolean;
};

export type TripDay = {
  id: string;
  name: string;
  placeIds: string[];
  startPlaceId?: string;
  endPlaceId?: string;
};

export type TripData = {
  placeStates: Record<string, PlaceState>;
  days: TripDay[];
  startDate?: string;
  budgetItems?: BudgetItem[];
};

export type BudgetCategory =
  | "rentalCar"
  | "fuel"
  | "hotels"
  | "food"
  | "parking"
  | "baths"
  | "activities";

export type BudgetItem = {
  id: string;
  dayId: string;
  category: BudgetCategory;
  amount: number;
};

export type TripStats = {
  places: number;
  estimatedKilometers: number;
  estimatedDrivingMinutes: number;
  stopMinutes: number;
  categories: Partial<Record<LocationCategory, number>>;
};

export type DayRisk = {
  level: "clear" | "caution" | "danger";
  messages: string[];
};

export type RouteWeatherSegment = {
  label: string;
  latitude: number;
  longitude: number;
  temperature: number;
  windGusts: number;
  precipitation: number;
  weatherCode: number;
};

export type AuroraForecast = {
  kp: number | null;
  cloudCover: number | null;
  level: "unlikely" | "possible" | "good";
};

export type DaylightInfo = {
  sunrise: Date | null;
  sunset: Date | null;
  daylightMinutes: number;
};

export type FeasibilityLevel = "comfortable" | "full" | "unrealistic";

export type DayFeasibility = {
  level: FeasibilityLevel;
  totalMinutes: number;
  daylightMinutes: number;
};

export type RoadConditions = NonNullable<Parameters<typeof geoJSON>[0]>;
