import { MapToolsBar, ActiveDayPill } from "@/components";
import { UI } from "@/i18n";
import type { Language, RouteResult, TripDay } from "@/types";

interface Props {
  language: Language;
  showWeatherLayer: boolean;
  showRoadConditions: boolean;
  onToggleWeather: () => void;
  onToggleRoads: () => void;
  activeDay?: TripDay;
  onSelectDay: () => void;
  route: RouteResult | null;
  routeLoading: boolean;
}

const MapTools = ({
  language,
  showWeatherLayer,
  showRoadConditions,
  onToggleWeather,
  onToggleRoads,
  activeDay,
  onSelectDay,
  route,
  routeLoading,
}: Props) => {
  return (
    <MapToolsBar className="map-tools">
      <button
        className={showWeatherLayer ? "active" : ""}
        onClick={onToggleWeather}
      >
        ☁ {UI[language].weather}
      </button>
      <button
        className={showRoadConditions ? "active" : ""}
        onClick={onToggleRoads}
      >
        ☷ {UI[language].liveRoads}
      </button>
      {activeDay && (
        <ActiveDayPill className="active-day-pill" onClick={onSelectDay}>
          {activeDay.name} ·{" "}
          {routeLoading
            ? "…"
            : route
              ? `${Math.round(route.distanceMeters / 1000)} km`
              : "—"}
        </ActiveDayPill>
      )}
    </MapToolsBar>
  );
};

export default MapTools;
