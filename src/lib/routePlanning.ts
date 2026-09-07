import type { Location, TripData } from "@/types";

const distance = (from: Location, to: Location) => {
  const latitude = (to.lat - from.lat) * (Math.PI / 180);
  const longitude = (to.lng - from.lng) * (Math.PI / 180);
  const a =
    Math.sin(latitude / 2) ** 2 +
    Math.cos(from.lat * (Math.PI / 180)) *
      Math.cos(to.lat * (Math.PI / 180)) *
      Math.sin(longitude / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const optimizeDayStops = (
  trip: TripData,
  dayId: string,
  allPlaces: Location[],
): TripData => {
  const day = trip.days.find((item) => item.id === dayId);
  if (!day || day.placeIds.length < 3) return trip;
  const byId = new Map(allPlaces.map((place) => [place.id, place]));
  const remaining = day.placeIds
    .map((id) => byId.get(id))
    .filter((place): place is Location => Boolean(place));
  const ordered: Location[] = [];
  const start = day.startPlaceId ? byId.get(day.startPlaceId) : remaining[0];
  let current = start ?? remaining[0];
  while (current && remaining.length) {
    ordered.push(current);
    const currentIndex = remaining.findIndex((place) => place.id === current.id);
    if (currentIndex >= 0) remaining.splice(currentIndex, 1);
    if (!remaining.length) break;
    current = remaining.reduce((closest, place) =>
      distance(current, place) < distance(current, closest) ? place : closest,
    );
  }
  return {
    ...trip,
    days: trip.days.map((item) =>
      item.id === dayId ? { ...item, placeIds: ordered.map((place) => place.id) } : item,
    ),
  };
};

export const addMinutesToTime = (time: string, minutes: number) => {
  const [hours, initialMinutes] = time.split(":").map(Number);
  const date = new Date(2000, 0, 1, hours || 0, initialMinutes || 0);
  date.setMinutes(date.getMinutes() + Math.max(0, minutes));
  return date.toTimeString().slice(0, 5);
};
