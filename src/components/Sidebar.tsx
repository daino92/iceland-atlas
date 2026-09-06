import { useCallback, type ChangeEvent, type MouseEvent } from "react";

import {
  SidebarPanel,
  BrandRow,
  Brand,
  Count,
  LanguageSwitch,
  SidebarTabs,
  Search,
  SectionTitle,
  Filters,
  Chip,
  Results,
  PlaceRow,
  PlaceRowMain,
  MiniCategory,
  Empty,
  TripBuilder,
} from "@/components";
import { categoryLabel, UI, getPlaceMeta } from "@/lib";
import type {
  AuroraForecast,
  BudgetCategory,
  BudgetItem,
  DayRisk,
  Location,
  Language,
  RouteResult,
  RouteWeatherSegment,
  TripData,
} from "@/types";

interface Props {
  places: Location[];
  allPlaces: Location[];
  query: string;
  setQuery: (query: string) => void;
  activeLayer: string;
  setActiveLayer: (layer: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onSelect: (place: Location) => void;
  open: boolean;
  language: Language;
  setLanguage: (language: Language) => void;
  activeTab: "explore" | "trip";
  setActiveTab: (tab: "explore" | "trip") => void;
  onlyFavorites: boolean;
  setOnlyFavorites: (value: boolean) => void;
  onlyPlanned: boolean;
  setOnlyPlanned: (value: boolean) => void;
  onlyVisited: boolean;
  setOnlyVisited: (value: boolean) => void;
  trip: TripData;
  activeDayId: string | null;
  setActiveDayId: (id: string | null) => void;
  addDay: () => void;
  renameDay: (dayId: string, name: string) => void;
  removeDay: (dayId: string) => void;
  removePlaceFromDay: (dayId: string, placeId: string) => void;
  movePlace: (dayId: string, placeId: string, direction: -1 | 1) => void;
  movePlaceBetweenDays: (
    sourceDayId: string,
    targetDayId: string,
    placeId: string,
    targetIndex?: number,
  ) => void;
  setDayEndpoints: (
    dayId: string,
    endpoints: { startPlaceId?: string; endPlaceId?: string },
  ) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  budgetItems: BudgetItem[];
  addBudgetItem: (dayId: string, category: BudgetCategory, amount: number) => void;
  removeBudgetItem: (itemId: string) => void;
  onShare: () => void;
  onExport: (format: "json" | "csv") => void;
  route: RouteResult | null;
  routeLoading: boolean;
  risk: DayRisk | null;
  riskLoading: boolean;
  routeWeather: RouteWeatherSegment[];
  routeWeatherLoading: boolean;
  aurora: AuroraForecast | null;
  auroraLoading: boolean;
}

const Sidebar = (props: Props) => {
  const {
    places,
    allPlaces,
    query,
    setQuery,
    activeLayer,
    setActiveLayer,
    activeCategory,
    setActiveCategory,
    onSelect,
    open,
    language,
    setLanguage,
    activeTab,
    setActiveTab,
    onlyFavorites,
    setOnlyFavorites,
    onlyPlanned,
    setOnlyPlanned,
    onlyVisited,
    setOnlyVisited,
    trip,
    activeDayId,
    setActiveDayId,
    addDay,
    renameDay,
    removeDay,
    removePlaceFromDay,
    movePlace,
    movePlaceBetweenDays,
    setDayEndpoints,
    startDate,
    setStartDate,
    budgetItems,
    addBudgetItem,
    removeBudgetItem,
    onShare,
    onExport,
    route,
    routeLoading,
    risk,
    riskLoading,
    routeWeather,
    routeWeatherLoading,
    aurora,
    auroraLoading,
  } = props;
  const layers = ["all", ...new Set(allPlaces.map((place) => place.layer))];
  const cats = ["all", ...new Set(allPlaces.map((place) => place.category))];
  const t = UI[language];

  const changeLanguage = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const next = event.currentTarget.value;
      if (next === "en" || next === "el") setLanguage(next);
    },
    [setLanguage],
  );
  const changeTab = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const next = event.currentTarget.value;
      if (next === "explore" || next === "trip") setActiveTab(next);
    },
    [setActiveTab],
  );
  const changeQuery = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setQuery(event.currentTarget.value),
    [setQuery],
  );
  const toggleFavorites = useCallback(
    () => setOnlyFavorites(!onlyFavorites),
    [onlyFavorites, setOnlyFavorites],
  );
  const togglePlanned = useCallback(
    () => setOnlyPlanned(!onlyPlanned),
    [onlyPlanned, setOnlyPlanned],
  );
  const toggleVisited = useCallback(
    () => setOnlyVisited(!onlyVisited),
    [onlyVisited, setOnlyVisited],
  );
  const changeLayer = useCallback(
    (event: MouseEvent<HTMLButtonElement>) =>
      setActiveLayer(event.currentTarget.value),
    [setActiveLayer],
  );
  const changeCategory = useCallback(
    (event: MouseEvent<HTMLButtonElement>) =>
      setActiveCategory(event.currentTarget.value),
    [setActiveCategory],
  );
  const selectPlace = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const place = places.find(
        (item) => item.id === event.currentTarget.value,
      );
      if (place) onSelect(place);
    },
    [places, onSelect],
  );

  return (
    <SidebarPanel className={`sidebar ${open ? "open" : ""}`}>
      <BrandRow className="brand-row">
        <Brand className="brand">
          <div>
            <h1>{t.appTitle}</h1>
            <p>{t.appSubtitle}</p>
          </div>
          <Count className="count">
            {places.length}/{allPlaces.length}
          </Count>
        </Brand>
        <LanguageSwitch className="language-switch" aria-label={t.language}>
          <button
            className={language === "el" ? "active" : ""}
            value="el"
            onClick={changeLanguage}
          >
            EL
          </button>
          <button
            className={language === "en" ? "active" : ""}
            value="en"
            onClick={changeLanguage}
          >
            EN
          </button>
        </LanguageSwitch>
      </BrandRow>

      <SidebarTabs className="sidebar-tabs">
        <button
          className={activeTab === "explore" ? "active" : ""}
          value="explore"
          onClick={changeTab}
        >
          {UI[language].explore}
        </button>
        <button
          className={activeTab === "trip" ? "active" : ""}
          value="trip"
          onClick={changeTab}
        >
          {UI[language].myTrip}
        </button>
      </SidebarTabs>

      {activeTab === "explore" ? (
        <>
          <Search
            className="search"
            value={query}
            onChange={changeQuery}
            placeholder={t.search}
          />

          <div>
            <SectionTitle className="section-title">
              {UI[language].status}
            </SectionTitle>
            <Filters className="filters status-filters">
              <Chip
                className={`chip ${onlyFavorites ? "active" : ""}`}
                onClick={toggleFavorites}
              >
                ♥ {UI[language].favorites}
              </Chip>
              <Chip
                className={`chip ${onlyPlanned ? "active" : ""}`}
                onClick={togglePlanned}
              >
                ✓ {t.planned}
              </Chip>
              <Chip
                className={`chip ${onlyVisited ? "active" : ""}`}
                onClick={toggleVisited}
              >
                ● {t.visited}
              </Chip>
            </Filters>
          </div>

          <div>
            <SectionTitle className="section-title">{t.layers}</SectionTitle>
            <Filters className="filters compact-filters">
              {layers.map((layer) => (
                <Chip
                  key={layer}
                  className={`chip ${activeLayer === layer ? "active" : ""}`}
                  value={layer}
                  onClick={changeLayer}
                >
                  {layer === "all" ? t.all : layer}
                </Chip>
              ))}
            </Filters>
          </div>

          <div>
            <SectionTitle className="section-title">{t.category}</SectionTitle>
            <Filters className="filters compact-filters">
              {cats.map((cat) => (
                <Chip
                  key={cat}
                  className={`chip ${activeCategory === cat ? "active" : ""}`}
                  value={cat}
                  onClick={changeCategory}
                >
                  {cat === "all" ? t.allFem : categoryLabel(cat, language)}
                </Chip>
              ))}
            </Filters>
          </div>

          <Results className="results">
            {places.length ? (
              places.map((place) => {
                const meta = getPlaceMeta(place);
                const state = trip.placeStates[place.id];
                return (
                  <PlaceRow
                    className="place-row"
                    key={place.id}
                    value={place.id}
                    onClick={selectPlace}
                  >
                    <PlaceRowMain className="place-row-main">
                      <MiniCategory
                        className={`mini-category cat-${place.category}`}
                      >
                        {meta.icon}
                      </MiniCategory>
                      {place.name}
                    </PlaceRowMain>
                    <small>
                      {place.layer} · {categoryLabel(place.category, language)}{" "}
                      {state?.favorite ? " · ♥" : ""}
                      {state?.planned ? " · ✓" : ""}
                      {state?.visited ? " · ●" : ""}
                    </small>
                  </PlaceRow>
                );
              })
            ) : (
              <Empty className="empty">{t.noPlaces}</Empty>
            )}
          </Results>
        </>
      ) : (
        <TripBuilder
          trip={trip}
          allPlaces={allPlaces}
          activeDayId={activeDayId}
          setActiveDayId={setActiveDayId}
          addDay={addDay}
          renameDay={renameDay}
          removeDay={removeDay}
          removePlaceFromDay={removePlaceFromDay}
          movePlace={movePlace}
          movePlaceBetweenDays={movePlaceBetweenDays}
          setDayEndpoints={setDayEndpoints}
          startDate={startDate}
          setStartDate={setStartDate}
          budgetItems={budgetItems}
          addBudgetItem={addBudgetItem}
          removeBudgetItem={removeBudgetItem}
          onShare={onShare}
          onExport={onExport}
          onSelect={onSelect}
          route={route}
          routeLoading={routeLoading}
          risk={risk}
          riskLoading={riskLoading}
          routeWeather={routeWeather}
          routeWeatherLoading={routeWeatherLoading}
          aurora={aurora}
          auroraLoading={auroraLoading}
          language={language}
        />
      )}
    </SidebarPanel>
  );
};

export default Sidebar;
