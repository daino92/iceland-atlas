import { getPlaceMeta, resolveDayRoutePlaces } from "@/lib";
import type { Location, TripData, TripStats } from "@/types";

const EARTH_RADIUS_KM = 6371;

const distance = (from: Location, to: Location) => {
  const lat = (to.lat - from.lat) * (Math.PI / 180);
  const lng = (to.lng - from.lng) * (Math.PI / 180);
  const a =
    Math.sin(lat / 2) ** 2 +
    Math.cos(from.lat * (Math.PI / 180)) *
      Math.cos(to.lat * (Math.PI / 180)) *
      Math.sin(lng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getTripStats = (trip: TripData, allPlaces: Location[]): TripStats => {
  const categories: TripStats["categories"] = {};
  let estimatedKilometers = 0;
  let stopMinutes = 0;
  let places = 0;
  trip.days.forEach((day) => {
    const dayPlaces = resolveDayRoutePlaces(day, allPlaces);
    places += day.placeIds.length;
    dayPlaces.forEach((place, index) => {
      if (index > 0) estimatedKilometers += distance(dayPlaces[index - 1], place);
      if (day.placeIds.includes(place.id)) {
        stopMinutes += getPlaceMeta(place).stopMinutes;
        categories[place.category] = (categories[place.category] ?? 0) + 1;
      }
    });
  });
  return {
    places,
    estimatedKilometers,
    estimatedDrivingMinutes: (estimatedKilometers / 55) * 60,
    stopMinutes,
    categories,
  };
};
