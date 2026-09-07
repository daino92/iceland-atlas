import { useCallback, useMemo, useState } from "react";

import {
  Shell,
  MobileToggle,
  MapWrap,
  IcelandMap,
  PlaceModal,
  Sidebar,
  MapTools,
} from "@/components";
import { LOCATIONS } from "@/data";
import { UI } from "@/i18n";
import {
  downloadText,
  resolveDayRoutePlaces,
  tripCsv,
  tripShareUrl,
  useTripStore,
} from "@/lib";
import {
  useAuroraForecast,
  useDayRisk,
  useDrivingRoute,
  useRouteWeather,
  useRouteElevation,
} from "@/hooks";
import type { Location, Language, PlaceState } from "@/types";

interface Props {
  language: Language;
  setLanguage: (language: Language) => void;
}

const Atlas = ({ language, setLanguage }: Props) => {
  const [query, setQuery] = useState("");
  const [activeLayer, setActiveLayer] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState<Location | null>(null);
  const [flyTo, setFlyTo] = useState<Location | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"explore" | "trip">("explore");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyPlanned, setOnlyPlanned] = useState(false);
  const [onlyVisited, setOnlyVisited] = useState(false);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [showRoadConditions, setShowRoadConditions] = useState(false);
  const [showWeatherLayer, setShowWeatherLayer] = useState(false);
  const [fitRouteSignal, setFitRouteSignal] = useState(0);
  const [replayRouteSignal, setReplayRouteSignal] = useState(0);
  const store = useTripStore();

  const filteredPlaces = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return LOCATIONS.filter((place) => {
      const state = store.getPlaceState(place.id);
      return (
        (activeLayer === "all" || place.layer === activeLayer) &&
        (activeCategory === "all" || place.category === activeCategory) &&
        (!normalized || place.name.toLowerCase().includes(normalized)) &&
        (!onlyFavorites || state.favorite) &&
        (!onlyPlanned || state.planned) &&
        (!onlyVisited || state.visited)
      );
    });
  }, [
    query,
    activeLayer,
    activeCategory,
    onlyFavorites,
    onlyPlanned,
    onlyVisited,
    store.trip.placeStates,
  ]);

  const activeDayPlaces = useMemo(() => {
    const day = store.trip.days.find((item) => item.id === activeDayId);
    return day ? resolveDayRoutePlaces(day, LOCATIONS) : [];
  }, [activeDayId, store.trip.days]);
  const activeDayDate = useMemo(() => {
    const index = store.trip.days.findIndex((day) => day.id === activeDayId);
    const date = new Date(
      `${store.trip.startDate ?? new Date().toISOString().slice(0, 10)}T00:00:00Z`,
    );
    date.setUTCDate(date.getUTCDate() + Math.max(index, 0));
    return date.toISOString().slice(0, 10);
  }, [activeDayId, store.trip.days, store.trip.startDate]);

  const { data: route = null, isLoading: routeLoading } =
    useDrivingRoute(activeDayPlaces);
  const { data: risk = null, isLoading: riskLoading } = useDayRisk(
    activeDayPlaces,
    Boolean(activeDayId),
  );
  const { data: routeWeather = [], isLoading: routeWeatherLoading } =
    useRouteWeather(
      route,
      Boolean(activeDayId),
      activeDayDate,
      store.trip.startTime ?? "08:00",
    );
  const { data: aurora = null, isLoading: auroraLoading } = useAuroraForecast(
    Boolean(activeDayId),
    activeDayDate,
    "21:00",
  );
  const { data: elevation = null, isLoading: elevationLoading } = useRouteElevation(
    route,
    Boolean(activeDayId),
  );

  const selectFromMap = useCallback((place: Location) => {
    setSelectedPlace(place);
    setFlyTo(null);
  }, []);
  const selectFromSidebar = useCallback((place: Location) => {
    setSelectedPlace(place);
    setFlyTo(place);
    setSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(
    () => setSidebarOpen((value) => !value),
    [],
  );
  const toggleWeather = useCallback(
    () => setShowWeatherLayer((value) => !value),
    [],
  );
  const toggleRoads = useCallback(
    () => setShowRoadConditions((value) => !value),
    [],
  );
  const fitRoute = useCallback(() => setFitRouteSignal((value) => value + 1), []);
  const replayRoute = useCallback(() => setReplayRouteSignal((value) => value + 1), []);
  const showTrip = useCallback(() => setActiveTab("trip"), []);
  const closePlace = useCallback(() => setSelectedPlace(null), []);
  const selectDay = useCallback((id: string | null) => {
    setActiveDayId(id);
    if (id) setActiveTab("trip");
  }, []);
  const { togglePlaceState, addPlaceToDay } = store;
  const toggleSelectedPlaceState = useCallback(
    (key: keyof PlaceState) => {
      if (selectedPlace) togglePlaceState(selectedPlace.id, key);
    },
    [selectedPlace, togglePlaceState],
  );
  const addSelectedPlaceToDay = useCallback(
    (dayId: string) => {
      if (!selectedPlace) return;
      addPlaceToDay(dayId, selectedPlace.id);
      setActiveDayId(dayId);
      setActiveTab("trip");
    },
    [selectedPlace, addPlaceToDay],
  );
  const shareTrip = useCallback(async () => {
    const url = tripShareUrl(store.trip);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt(UI[language].copyShareLink, url);
    }
  }, [language, store.trip]);
  const exportTrip = useCallback(
    (format: "json" | "csv") => {
      const content =
        format === "json"
          ? JSON.stringify(store.trip, null, 2)
          : tripCsv(store.trip, LOCATIONS);
      downloadText(
        `iceland-trip.${format}`,
        content,
        format === "json" ? "application/json" : "text/csv",
      );
    },
    [store.trip],
  );

  return (
    <Shell className="shell">
      <MobileToggle className="mobile-toggle" onClick={toggleSidebar}>
        ☰ {UI[language].places}
      </MobileToggle>
      <Sidebar
        places={filteredPlaces}
        allPlaces={LOCATIONS}
        query={query}
        setQuery={setQuery}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onSelect={selectFromSidebar}
        open={sidebarOpen}
        language={language}
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onlyFavorites={onlyFavorites}
        setOnlyFavorites={setOnlyFavorites}
        onlyPlanned={onlyPlanned}
        setOnlyPlanned={setOnlyPlanned}
        onlyVisited={onlyVisited}
        setOnlyVisited={setOnlyVisited}
        trip={store.trip}
        activeDayId={activeDayId}
        setActiveDayId={selectDay}
        addDay={store.addDay}
        renameDay={store.renameDay}
        removeDay={store.removeDay}
        removePlaceFromDay={store.removePlaceFromDay}
        movePlace={store.movePlace}
        movePlaceBetweenDays={store.movePlaceBetweenDays}
        setDayEndpoints={store.setDayEndpoints}
        setOvernightPlace={store.setOvernightPlace}
        startDate={store.trip.startDate ?? ""}
          setStartDate={store.setStartDate}
          startTime={store.trip.startTime ?? "08:00"}
        setStartTime={store.setStartTime}
        currency={store.trip.currency ?? "EUR"}
        travelers={store.trip.travelers ?? 1}
        setCurrency={store.setCurrency}
        setTravelers={store.setTravelers}
          optimizeDay={(dayId) => store.optimizeDay(dayId, LOCATIONS)}
          budgetItems={store.trip.budgetItems ?? []}
          addBudgetItem={store.addBudgetItem}
          removeBudgetItem={store.removeBudgetItem}
        onShare={shareTrip}
        onExport={exportTrip}
        route={route}
        routeLoading={routeLoading}
        risk={risk}
        riskLoading={riskLoading}
        routeWeather={routeWeather}
        routeWeatherLoading={routeWeatherLoading}
        aurora={aurora}
        auroraLoading={auroraLoading}
        elevation={elevation}
        elevationLoading={elevationLoading}
      />
      <MapWrap className="map-wrap">
        <MapTools
          language={language}
          showWeatherLayer={showWeatherLayer}
          showRoadConditions={showRoadConditions}
          onToggleWeather={toggleWeather}
          onToggleRoads={toggleRoads}
          activeDay={store.trip.days.find((day) => day.id === activeDayId)}
          onSelectDay={showTrip}
          route={route}
          routeLoading={routeLoading}
          onFitRoute={fitRoute}
          onReplayRoute={replayRoute}
        />
        <IcelandMap
          language={language}
          places={filteredPlaces}
          selectedPlace={selectedPlace}
          onSelect={selectFromMap}
          flyTo={flyTo}
          routeCoordinates={route?.coordinates}
          showRoadConditions={showRoadConditions}
          showWeatherLayer={showWeatherLayer}
          fitRouteSignal={fitRouteSignal}
          replayRouteSignal={replayRouteSignal}
        />
      </MapWrap>
      {selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          onClose={closePlace}
          language={language}
          state={store.getPlaceState(selectedPlace.id)}
          onToggleState={toggleSelectedPlaceState}
          days={store.trip.days}
          onAddToDay={addSelectedPlaceToDay}
        />
      )}
    </Shell>
  );
};

export default Atlas;
