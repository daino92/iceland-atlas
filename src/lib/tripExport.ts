import type { Location, TripData } from "@/types";

export const encodeTrip = (trip: TripData) =>
  btoa(encodeURIComponent(JSON.stringify(trip)));

export const decodeTrip = (value: string): TripData | null => {
  try {
    return JSON.parse(decodeURIComponent(atob(value))) as TripData;
  } catch {
    return null;
  }
};

export const tripShareUrl = (trip: TripData) => {
  const url = new URL(window.location.href);
  url.searchParams.set("trip", encodeTrip(trip));
  return url.toString();
};

export const tripCsv = (trip: TripData, places: Location[]) => {
  const names = new Map(places.map((place) => [place.id, place.name]));
  const rows = [["Day", "Stop", "Place"]];
  trip.days.forEach((day) =>
    day.placeIds.forEach((placeId, index) =>
      rows.push([day.name, String(index + 1), names.get(placeId) ?? placeId]),
    ),
  );
  return rows
    .map((row) =>
      row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
};

export const downloadText = (
  filename: string,
  content: string,
  type: string,
) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};
