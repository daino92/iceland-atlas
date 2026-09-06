import type {
  Location,
  LocationCategory,
  Language,
  PlaceMeta,
  WinterLevel,
} from "@/types";
import { RESOURCES } from "@/i18n";

const ICONS: Record<LocationCategory, string> = {
  attraction: "◆",
  waterfall: "💧",
  thermal: "♨",
  glacier: "❄",
  beach: "≈",
  viewpoint: "◉",
  parking: "P",
  stay: "⌂",
  shop: "▣",
  fuel: "⛽",
  food: "●",
};

const DURATIONS: Record<LocationCategory, number> = {
  attraction: 45,
  waterfall: 40,
  thermal: 120,
  glacier: 90,
  beach: 45,
  viewpoint: 25,
  parking: 10,
  stay: 15,
  shop: 30,
  fuel: 15,
  food: 60,
};

const SEASONAL_NAMES =
  /landmannalaugar|kerlingarfj|hveradalir|sigölduglj|fimmvör|laki|askja|þórsmörk|thorsmork/i;
const DIFFICULT_NAMES =
  /glymur|hengifoss|múlaglj|mulaglj|reykjadalur|svartifoss|sólheimajökull|solheimajokull|snaefellsjokull/i;
const CAUTION_NAMES =
  /reynisfjara|dyrhólaey|dyrholaey|detti|látrabjarg|latrabjarg|stuðlagil|studlagil|fjadrargljufur|fjaðrárgljúfur/i;

export const getPlaceMeta = (place: Location): PlaceMeta => {
  let winter: WinterLevel = "easy";
  if (SEASONAL_NAMES.test(place.name)) winter = "seasonal";
  else if (DIFFICULT_NAMES.test(place.name) || place.category === "glacier")
    winter = "difficult";
  else if (
    CAUTION_NAMES.test(place.name) ||
    ["beach", "viewpoint"].includes(place.category)
  )
    winter = "caution";

  let stopMinutes = DURATIONS[place.category];
  if (/national park/i.test(place.name)) stopMinutes = 120;
  if (/blue lagoon|secret lagoon|vök|vok baths|hvammsvik/i.test(place.name))
    stopMinutes = 150;
  if (/parking/i.test(place.name)) stopMinutes = 5;

  return { winter, stopMinutes, icon: ICONS[place.category] };
};

export const winterLabel = (level: WinterLevel, language: Language) => {
  return RESOURCES[language].winter[level];
};

export const formatDuration = (minutes: number, language: Language) => {
  const units = RESOURCES[language].units;
  if (minutes < 60) return `${minutes} ${units.minutes}`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!rest) return `${hours} ${units.hours}`;
  return `${hours} ${units.hours} ${rest} ${units.shortMinutes}`;
};
