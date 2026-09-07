import {
  useCallback,
  useMemo,
  useState,
  type MouseEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ChangeEvent,
  type DragEvent,
} from "react";

import {
  TripPanel,
  TripSummary,
  TripHeading,
  IconButton,
  DayList,
  DayCard,
  DayMain,
  DayName,
  DayCount,
  DayActions,
  DayRename,
  ActiveDayDetail,
  RouteStats,
  TripStops,
  TripStop,
  StopIndex,
  TripStopName,
  StopMove,
  EmptyTrip,
  TripActions,
  DayEndpoints,
  RiskSummary,
  DaylightSummary,
  FeasibilitySummary,
  RouteWeatherSummary,
  AuroraSummary,
  BudgetSummary,
  BudgetForm,
  TripStatistics,
  TripTimeline,
} from "@/components";
import { UI } from "@/i18n";
import {
  formatDuration,
  categoryLabel,
  getPlaceMeta,
  formatDistance,
  formatDrivingTime,
  formatIcelandTime,
  getDayFeasibility,
  getDaylightInfo,
  weatherCodeLabel,
  getTripStats,
  addMinutesToTime,
  resolveDayPlaces,
} from "@/lib";
import type {
  DayRisk,
  DayFeasibility,
  AuroraForecast,
  RouteElevation,
  BudgetCategory,
  BudgetItem,
  Location,
  Language,
  RouteResult,
  RouteWeatherSegment,
  TripData,
} from "@/types";

interface Props {
  trip: TripData;
  allPlaces: Location[];
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
  setOvernightPlace: (dayId: string, placeId?: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  optimizeDay: (dayId: string) => void;
  currency: "EUR" | "ISK" | "USD";
  travelers: number;
  setCurrency: (currency: "EUR" | "ISK" | "USD") => void;
  setTravelers: (travelers: number) => void;
  onSelect: (place: Location) => void;
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
  elevation: RouteElevation | null;
  elevationLoading: boolean;
  budgetItems: BudgetItem[];
  addBudgetItem: (dayId: string, category: BudgetCategory, amount: number) => void;
  removeBudgetItem: (itemId: string) => void;
  language: Language;
}

const TripBuilder = ({
  trip,
  allPlaces,
  activeDayId,
  setActiveDayId,
  addDay,
  renameDay,
  removeDay,
  removePlaceFromDay,
  movePlace,
  movePlaceBetweenDays,
  setDayEndpoints,
  setOvernightPlace,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  optimizeDay,
  currency,
  travelers,
  setCurrency,
  setTravelers,
  onSelect,
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
  elevation,
  elevationLoading,
  budgetItems,
  addBudgetItem,
  removeBudgetItem,
  language,
}: Props) => {
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [draggedStop, setDraggedStop] = useState<{
    dayId: string;
    placeId: string;
  } | null>(null);
  const [budgetCategory, setBudgetCategory] = useState<BudgetCategory>("fuel");
  const [budgetAmount, setBudgetAmount] = useState("");
  const activeDay = trip.days.find((day) => day.id === activeDayId) ?? null;
  const dayPlaces = useMemo(
    () => (activeDay ? resolveDayPlaces(activeDay, allPlaces) : []),
    [activeDay, allPlaces],
  );
  const stopMinutes = dayPlaces.reduce(
    (total, place) => total + getPlaceMeta(place).stopMinutes,
    0,
  );
  const plannedCount = Object.values(trip.placeStates).filter(
    (state) => state.planned,
  ).length;
  const favoriteCount = Object.values(trip.placeStates).filter(
    (state) => state.favorite,
  ).length;
  const activeDayIndex = activeDay
    ? trip.days.findIndex((day) => day.id === activeDay.id)
    : 0;
  const activeDate = useMemo(() => {
    const date = new Date(`${startDate || new Date().toISOString().slice(0, 10)}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + Math.max(activeDayIndex, 0));
    return date;
  }, [activeDayIndex, startDate]);
  const daylight = useMemo(() => getDaylightInfo(activeDate), [activeDate]);
  const feasibility = useMemo<DayFeasibility>(
    () =>
      getDayFeasibility(
        route ? route.durationSeconds / 60 : 0,
        stopMinutes,
        daylight.daylightMinutes,
      ),
    [daylight.daylightMinutes, route, stopMinutes],
  );
  const stats = useMemo(() => getTripStats(trip, allPlaces), [trip, allPlaces]);
  const categorySummary = useMemo(
    () =>
      Object.entries(stats.categories)
        .map(([category, count]) => `${categoryLabel(category, language)} ${count}`)
        .join(" · "),
    [language, stats.categories],
  );
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const activeBudget = budgetItems.filter((item) => item.dayId === activeDayId);

  const selectDay = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const id = event.currentTarget.value;
      setActiveDayId(id === activeDayId ? null : id);
    },
    [activeDayId, setActiveDayId],
  );
  const editDay = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const id = event.currentTarget.value;
    setEditingDay((current) => (current === id ? null : id));
  }, []);
  const deleteDay = useCallback(
    (event: MouseEvent<HTMLButtonElement>) =>
      removeDay(event.currentTarget.value),
    [removeDay],
  );
  const saveDayName = useCallback(
    (input: HTMLInputElement) => {
      const day = trip.days.find((item) => item.id === input.dataset.dayId);
      if (day) renameDay(day.id, input.value || day.name);
      setEditingDay(null);
    },
    [trip.days, renameDay],
  );
  const blurDayName = useCallback(
    (event: FocusEvent<HTMLInputElement>) => saveDayName(event.currentTarget),
    [saveDayName],
  );
  const keyDayName = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") saveDayName(event.currentTarget);
    },
    [saveDayName],
  );
  const selectStop = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const place = dayPlaces.find(
        (item) => item.id === event.currentTarget.value,
      );
      if (place) onSelect(place);
    },
    [dayPlaces, onSelect],
  );
  const moveStop = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!activeDayId) return;
      movePlace(
        activeDayId,
        event.currentTarget.value,
        event.currentTarget.dataset.direction === "up" ? -1 : 1,
      );
    },
    [activeDayId, movePlace],
  );
  const removeStop = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (activeDayId)
        removePlaceFromDay(activeDayId, event.currentTarget.value);
    },
    [activeDayId, removePlaceFromDay],
  );
  const changeEndpoint = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const [dayId, endpoint] = event.currentTarget.name.split(":");
      setDayEndpoints(dayId, {
        [endpoint]: event.currentTarget.value || undefined,
      });
    },
    [setDayEndpoints],
  );
  const changeStartDate = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setStartDate(event.currentTarget.value),
    [setStartDate],
  );
  const changeStartTime = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setStartTime(event.currentTarget.value),
    [setStartTime],
  );
  const changeCurrency = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) =>
      setCurrency(event.currentTarget.value as "EUR" | "ISK" | "USD"),
    [setCurrency],
  );
  const changeTravelers = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setTravelers(Number(event.currentTarget.value)),
    [setTravelers],
  );
  const changeOvernight = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      if (activeDayId) setOvernightPlace(activeDayId, event.currentTarget.value || undefined);
    },
    [activeDayId, setOvernightPlace],
  );
  const optimizeActiveDay = useCallback(() => {
    if (activeDayId) optimizeDay(activeDayId);
  }, [activeDayId, optimizeDay]);
  const changeBudgetCategory = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) =>
      setBudgetCategory(event.currentTarget.value as BudgetCategory),
    [],
  );
  const changeBudgetAmount = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setBudgetAmount(event.currentTarget.value),
    [],
  );
  const addBudget = useCallback(() => {
    if (!activeDayId) return;
    addBudgetItem(activeDayId, budgetCategory, Number(budgetAmount));
    setBudgetAmount("");
  }, [activeDayId, addBudgetItem, budgetAmount, budgetCategory]);
  const removeBudget = useCallback(
    (event: MouseEvent<HTMLButtonElement>) =>
      removeBudgetItem(event.currentTarget.value),
    [removeBudgetItem],
  );
  const allowDrop = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  const startDrag = useCallback((event: DragEvent<HTMLDivElement>) => {
    const dayId = event.currentTarget.dataset.dayId;
    const placeId = event.currentTarget.dataset.placeId;
    if (!dayId || !placeId) return;
    setDraggedStop({ dayId, placeId });
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `${dayId}:${placeId}`);
  }, []);
  const finishDrag = useCallback(() => setDraggedStop(null), []);
  const dropOnDay = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const targetDayId = event.currentTarget.dataset.dayId;
      if (draggedStop && targetDayId)
        movePlaceBetweenDays(draggedStop.dayId, targetDayId, draggedStop.placeId);
      setDraggedStop(null);
    },
    [draggedStop, movePlaceBetweenDays],
  );
  const dropOnStop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const targetDayId = event.currentTarget.dataset.dayId;
      const targetIndex = Number(event.currentTarget.dataset.index);
      if (draggedStop && targetDayId && Number.isFinite(targetIndex))
        movePlaceBetweenDays(
          draggedStop.dayId,
          targetDayId,
          draggedStop.placeId,
          targetIndex,
        );
      setDraggedStop(null);
    },
    [draggedStop, movePlaceBetweenDays],
  );
  const exportJson = useCallback(() => onExport("json"), [onExport]);
  const exportCsv = useCallback(() => onExport("csv"), [onExport]);

  return (
    <TripPanel className="trip-panel">
      <TripSummary className="trip-summary">
        <div>
          <strong>{favoriteCount}</strong>
          <span>{UI[language].favorites}</span>
        </div>
        <div>
          <strong>{plannedCount}</strong>
          <span>{UI[language].planned}</span>
        </div>
        <div>
          <strong>{trip.days.length}</strong>
          <span>{UI[language].days}</span>
        </div>
      </TripSummary>

      <TripStatistics className="trip-statistics">
        <span>{UI[language].tripStats}: {stats.places} {UI[language].places}</span>
        <span>≈ {Math.round(stats.estimatedKilometers)} km</span>
        <span>{Math.round(stats.stopMinutes / 60 * 10) / 10}h {UI[language].stops}</span>
        {categorySummary && <span>{categorySummary}</span>}
      </TripStatistics>

      <TripHeading className="trip-heading">
        <div>
          <h3>{UI[language].tripBuilder}</h3>
          <p>{UI[language].tripInstructions}</p>
        </div>
        <IconButton
          className="icon-button"
          onClick={addDay}
          title={UI[language].newDay}
        >
          ＋
        </IconButton>
      </TripHeading>

      <DayEndpoints className="trip-date">
        <label>
          {UI[language].tripDate}
          <input type="date" value={startDate} onChange={changeStartDate} />
        </label>
        <label>
          {UI[language].departureTime}
          <input type="time" value={startTime} onChange={changeStartTime} />
        </label>
        <label>
          {UI[language].overnight}
          <select value={activeDay?.overnightPlaceId ?? ""} onChange={changeOvernight}>
            <option value="">{UI[language].notSet}</option>
            {allPlaces.filter((place) => place.category === "stay").map((place) => (
              <option key={place.id} value={place.id}>{place.name}</option>
            ))}
          </select>
        </label>
      </DayEndpoints>

      <TripActions className="trip-actions">
        <button onClick={onShare}>{UI[language].shareTrip}</button>
        <button onClick={exportJson}>{UI[language].exportJson}</button>
        <button onClick={exportCsv}>{UI[language].exportCsv}</button>
      </TripActions>

      <DayList className="day-list">
        {trip.days.map((day) => {
          const places = resolveDayPlaces(day, allPlaces);
          const selected = day.id === activeDayId;
          return (
            <DayCard
              key={day.id}
              className={`day-card ${selected ? "selected" : ""}`}
              data-day-id={day.id}
              onDragOver={allowDrop}
              onDrop={dropOnDay}
            >
              <DayMain className="day-main" value={day.id} onClick={selectDay}>
                <DayName className="day-name">{day.name}</DayName>
                <DayCount className="day-count">{places.length}</DayCount>
              </DayMain>
              <DayActions className="day-actions">
                <button value={day.id} onClick={editDay}>
                  ✎
                </button>
                <button value={day.id} onClick={deleteDay}>
                  ×
                </button>
              </DayActions>
              {editingDay === day.id && (
                <DayRename
                  className="day-rename"
                  autoFocus
                  defaultValue={day.name}
                  data-day-id={day.id}
                  onBlur={blurDayName}
                  onKeyDown={keyDayName}
                />
              )}
            </DayCard>
          );
        })}
      </DayList>

      {activeDay && (
        <ActiveDayDetail className="active-day-detail">
          <DayEndpoints className="day-endpoints">
            {["startPlaceId", "endPlaceId"].map((endpoint) => (
              <label key={endpoint}>
                {endpoint === "startPlaceId"
                  ? UI[language].start
                  : UI[language].end}
                <select
                  name={`${activeDay.id}:${endpoint}`}
                  value={
                    activeDay[endpoint as "startPlaceId" | "endPlaceId"] ?? ""
                  }
                  onChange={changeEndpoint}
                >
                  <option value="">{UI[language].notSet}</option>
                  {allPlaces.map((place) => (
                    <option key={place.id} value={place.id}>
                      {place.name}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </DayEndpoints>
          <RouteStats className="route-stats">
            <div>
              <b>
                {routeLoading
                  ? "…"
                  : route
                    ? formatDistance(route.distanceMeters)
                    : "—"}
              </b>
              <span>{UI[language].driving}</span>
            </div>
            <div>
              <b>
                {routeLoading
                  ? "…"
                  : route
                    ? formatDrivingTime(route.durationSeconds, language)
                    : "—"}
              </b>
              <span>{UI[language].onRoad}</span>
            </div>
            <div>
              <b>{formatDuration(stopMinutes, language)}</b>
              <span>{UI[language].stops}</span>
            </div>
          </RouteStats>
          <RiskSummary className="elevation-summary">
            <b>{UI[language].elevation}</b>
            {elevationLoading ? (
              <span>…</span>
            ) : elevation ? (
              <span>
                ↑ {Math.round(elevation.ascentMeters)}m · ↓ {Math.round(elevation.descentMeters)}m · {UI[language][elevation.difficulty]}
              </span>
            ) : (
              <span>—</span>
            )}
          </RiskSummary>
          <RiskSummary
            className={`risk-summary risk-${risk?.level ?? "clear"}`}
          >
            <b>
              {riskLoading
                ? "…"
                : UI[language][
                    risk?.level === "danger"
                      ? "highRisk"
                      : risk?.level === "caution"
                        ? "cautionRisk"
                        : "lowRisk"
                  ]}
            </b>
            {risk?.messages.map((message) => (
              <span key={message}>{message}</span>
            ))}
          </RiskSummary>

          <RouteWeatherSummary className="route-weather-summary">
            <b>{UI[language].routeWeather}</b>
            {routeWeatherLoading ? (
              <span>…</span>
            ) : routeWeather.length ? (
              routeWeather.map((segment) => (
                <span key={`${segment.latitude}:${segment.longitude}`}>
                  {segment.label}: {Math.round(segment.temperature)}°C · {weatherCodeLabel(segment.weatherCode, language)} · {UI[language].gusts} {Math.round(segment.windGusts)} km/h
                </span>
              ))
            ) : (
              <span>{UI[language].routeWeatherUnavailable}</span>
            )}
          </RouteWeatherSummary>

          <AuroraSummary className={`aurora-${aurora?.level ?? "possible"}`}>
            <b>{UI[language].auroraForecast}</b>
            {auroraLoading ? (
              <span>…</span>
            ) : aurora ? (
              <span>
                {UI[language][
                  aurora.level === "good"
                    ? "auroraGood"
                    : aurora.level === "unlikely"
                      ? "auroraUnlikely"
                      : "auroraPossible"
                ]} · KP {aurora.kp === null ? "—" : aurora.kp.toFixed(1)} · {UI[language].cloudCover} {aurora.cloudCover === null ? "—" : `${Math.round(aurora.cloudCover)}%`}
              </span>
            ) : (
              <span>{UI[language].auroraUnavailable}</span>
            )}
          </AuroraSummary>

          <BudgetSummary className="budget-summary">
            <b>{UI[language].budget} · {totalBudget.toFixed(0)} {currency} · {UI[language].perPerson} {(totalBudget / travelers).toFixed(0)} {currency}</b>
            <BudgetForm className="budget-form budget-settings">
              <select value={currency} onChange={changeCurrency}>
                {(["EUR", "ISK", "USD"] as const).map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <input type="number" min="1" step="1" value={travelers} onChange={changeTravelers} aria-label={UI[language].travelers} />
              <span>{UI[language].travelers}</span>
            </BudgetForm>
            <BudgetForm className="budget-form">
              <select value={budgetCategory} onChange={changeBudgetCategory}>
                {(["rentalCar", "fuel", "hotels", "food", "parking", "baths", "activities"] as BudgetCategory[]).map((category) => (
                  <option key={category} value={category}>{UI[language][category]}</option>
                ))}
              </select>
              <input type="number" min="0" step="1" value={budgetAmount} onChange={changeBudgetAmount} placeholder="0" />
              <button type="button" onClick={addBudget}>{UI[language].add}</button>
            </BudgetForm>
            {activeBudget.map((item) => (
              <span key={item.id}>
                {UI[language][item.category]} · {item.amount.toFixed(0)} {currency}
                <button value={item.id} onClick={removeBudget}>×</button>
              </span>
            ))}
          </BudgetSummary>

          <TripStops className="trip-stops">
            {dayPlaces.length ? (
              dayPlaces.map((place, index) => (
                <TripStop
                  className={`trip-stop ${draggedStop?.placeId === place.id ? "dragging" : ""}`}
                  key={place.id}
                  draggable
                  data-day-id={activeDay.id}
                  data-place-id={place.id}
                  data-index={index}
                  onDragStart={startDrag}
                  onDragEnd={finishDrag}
                  onDragOver={allowDrop}
                  onDrop={dropOnStop}
                >
                  <StopIndex className="stop-index">{index + 1}</StopIndex>
                  <TripStopName
                    className="trip-stop-name"
                    value={place.id}
                    onClick={selectStop}
                  >
                    {place.name}
                  </TripStopName>
                  <StopMove className="stop-move">
                    <button
                      disabled={index === 0}
                      value={place.id}
                      data-direction="up"
                      onClick={moveStop}
                    >
                      ↑
                    </button>
                    <button
                      disabled={index === dayPlaces.length - 1}
                      value={place.id}
                      data-direction="down"
                      onClick={moveStop}
                    >
                      ↓
                    </button>
                    <button value={place.id} onClick={removeStop}>
                      ×
                    </button>
                  </StopMove>
                </TripStop>
              ))
            ) : (
              <EmptyTrip className="empty-trip">
                {UI[language].noStops}
              </EmptyTrip>
            )}
          </TripStops>
          <DaylightSummary className="daylight-summary">
            <span>
              {UI[language].sunrise}: {formatIcelandTime(daylight.sunrise, language)}
            </span>
            <span>
              {UI[language].sunset}: {formatIcelandTime(daylight.sunset, language)}
            </span>
            <span>
              {UI[language].daylight}: {Math.round(daylight.daylightMinutes / 60 * 10) / 10}h
            </span>
          </DaylightSummary>
          <FeasibilitySummary className={`feasibility-${feasibility.level}`}>
            <b>
              {UI[language][
                feasibility.level === "comfortable"
                  ? "comfortable"
                  : feasibility.level === "full"
                    ? "fullDay"
                    : "unrealistic"
              ]}
            </b>
            <span>
              {Math.round(feasibility.totalMinutes)} / {Math.round(feasibility.daylightMinutes)} {UI[language].plannedMinutes}
            </span>
          </FeasibilitySummary>
          <TripActions className="day-planning-actions">
            <button onClick={optimizeActiveDay}>{UI[language].optimizeRoute}</button>
          </TripActions>
          <TripTimeline className="trip-timeline">
            <b>{UI[language].timeline}</b>
            <span>{startTime} · {UI[language].departure}</span>
            <span>{addMinutesToTime(startTime, route ? route.durationSeconds / 60 : 0)} · {UI[language].arrival}</span>
            <span>{UI[language].plannedTime}: {Math.round(feasibility.totalMinutes)} min</span>
          </TripTimeline>
        </ActiveDayDetail>
      )}
    </TripPanel>
  );
};

export default TripBuilder;
