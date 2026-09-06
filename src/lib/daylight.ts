import type { DayFeasibility, DaylightInfo, FeasibilityLevel } from "@/types";

const ICELAND_LATITUDE = 64.9631;
const ICELAND_LONGITUDE = -19.0208;
const RADIANS = Math.PI / 180;

const toDate = (date: Date, minutes: number) => {
  const result = new Date(date);
  result.setUTCHours(0, minutes, 0, 0);
  return result;
};

export const getDaylightInfo = (
  dateInput: string | Date,
  latitude = ICELAND_LATITUDE,
  longitude = ICELAND_LONGITUDE,
): DaylightInfo => {
  const date = new Date(dateInput);
  const dayOfYear = Math.floor(
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
      Date.UTC(date.getUTCFullYear(), 0, 0)) /
      86_400_000,
  );
  const declination = -23.44 * RADIANS *
    Math.cos((360 / 365) * RADIANS * (dayOfYear + 10));
  const solarAltitude = -0.833 * RADIANS;
  const latitudeRadians = latitude * RADIANS;
  const cosineHourAngle =
    (Math.sin(solarAltitude) -
      Math.sin(latitudeRadians) * Math.sin(declination)) /
    (Math.cos(latitudeRadians) * Math.cos(declination));
  const solarNoon = 720 - 4 * longitude;

  if (cosineHourAngle >= 1) return { sunrise: null, sunset: null, daylightMinutes: 0 };
  if (cosineHourAngle <= -1)
    return { sunrise: null, sunset: null, daylightMinutes: 1440 };

  const hourAngle = Math.acos(cosineHourAngle) / RADIANS;
  const daylightMinutes = (8 * hourAngle);
  return {
    sunrise: toDate(date, solarNoon - daylightMinutes / 2),
    sunset: toDate(date, solarNoon + daylightMinutes / 2),
    daylightMinutes,
  };
};

export const getDayFeasibility = (
  drivingMinutes: number,
  stopMinutes: number,
  daylightMinutes: number,
): DayFeasibility => {
  const totalMinutes = drivingMinutes + stopMinutes;
  let level: FeasibilityLevel = "comfortable";
  if (daylightMinutes === 0 || totalMinutes > daylightMinutes) level = "unrealistic";
  else if (totalMinutes > daylightMinutes * 0.7) level = "full";
  return { level, totalMinutes, daylightMinutes };
};

export const formatIcelandTime = (date: Date | null, language: "en" | "el") =>
  date
    ? new Intl.DateTimeFormat(language === "el" ? "el-GR" : "en-GB", {
        timeZone: "Atlantic/Reykjavik",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date)
    : "—";
