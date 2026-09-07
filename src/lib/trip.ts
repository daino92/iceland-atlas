import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  BudgetCategory,
  Location,
  PlaceState,
  TripData,
  TripDay,
} from "@/types";
import { decodeTrip, optimizeDayStops } from "@/lib";

const STORAGE_KEY = "iceland-atlas-trip-v1";
const EMPTY_STATE: PlaceState = {
  favorite: false,
  planned: false,
  visited: false,
};
const INITIAL_TRIP: TripData = {
  placeStates: {},
  startDate: new Date().toISOString().slice(0, 10),
  budgetItems: [],
  startTime: "08:00",
  currency: "EUR",
  travelers: 2,
  days: [
    { id: "day-1", name: "Day 1", placeIds: [] },
    { id: "day-2", name: "Day 2", placeIds: [] },
    { id: "day-3", name: "Day 3", placeIds: [] },
  ],
};

const loadTrip = (): TripData => {
  try {
    const shared = new URLSearchParams(window.location.search).get("trip");
    if (shared) {
      const decoded = decodeTrip(shared);
      if (decoded?.days?.length) return decoded;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_TRIP;
    const parsed = JSON.parse(raw) as TripData;
    return {
      placeStates: parsed.placeStates ?? {},
      startDate: parsed.startDate ?? INITIAL_TRIP.startDate,
      budgetItems: parsed.budgetItems ?? [],
      startTime: parsed.startTime ?? INITIAL_TRIP.startTime,
      currency: parsed.currency ?? INITIAL_TRIP.currency,
      travelers: parsed.travelers ?? INITIAL_TRIP.travelers,
      days: parsed.days?.length
        ? parsed.days.map((day) => ({
            ...day,
            startPlaceId: day.startPlaceId,
            endPlaceId: day.endPlaceId,
            overnightPlaceId: day.overnightPlaceId,
          }))
        : INITIAL_TRIP.days,
    };
  } catch {
    return INITIAL_TRIP;
  }
};

export const useTripStore = () => {
  const [trip, setTrip] = useState<TripData>(loadTrip);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  }, [trip]);

  const getPlaceState = useCallback(
    (placeId: string): PlaceState => trip.placeStates[placeId] ?? EMPTY_STATE,
    [trip.placeStates],
  );

  const patchPlaceState = useCallback(
    (placeId: string, patch: Partial<PlaceState>) => {
      setTrip((current) => ({
        ...current,
        placeStates: {
          ...current.placeStates,
          [placeId]: {
            ...(current.placeStates[placeId] ?? EMPTY_STATE),
            ...patch,
          },
        },
      }));
    },
    [],
  );

  const togglePlaceState = useCallback(
    (placeId: string, key: keyof PlaceState) => {
      setTrip((current) => {
        const state = current.placeStates[placeId] ?? EMPTY_STATE;
        return {
          ...current,
          placeStates: {
            ...current.placeStates,
            [placeId]: { ...state, [key]: !state[key] },
          },
        };
      });
    },
    [],
  );

  const addDay = useCallback(() => {
    setTrip((current) => ({
      ...current,
      days: [
        ...current.days,
        {
          id: `day-${Date.now()}`,
          name: `Day ${current.days.length + 1}`,
          placeIds: [],
        },
      ],
    }));
  }, []);

  const renameDay = useCallback((dayId: string, name: string) => {
    setTrip((current) => ({
      ...current,
      days: current.days.map((day) =>
        day.id === dayId ? { ...day, name } : day,
      ),
    }));
  }, []);

  const removeDay = useCallback((dayId: string) => {
    setTrip((current) => ({
      ...current,
      days: current.days.filter((day) => day.id !== dayId),
    }));
  }, []);

  const addPlaceToDay = useCallback((dayId: string, placeId: string) => {
    setTrip((current) => ({
      ...current,
      placeStates: {
        ...current.placeStates,
        [placeId]: {
          ...(current.placeStates[placeId] ?? EMPTY_STATE),
          planned: true,
        },
      },
      days: current.days.map((day) =>
        day.id === dayId && !day.placeIds.includes(placeId)
          ? { ...day, placeIds: [...day.placeIds, placeId] }
          : day,
      ),
    }));
  }, []);

  const removePlaceFromDay = useCallback((dayId: string, placeId: string) => {
    setTrip((current) => ({
      ...current,
      days: current.days.map((day) =>
        day.id === dayId
          ? { ...day, placeIds: day.placeIds.filter((id) => id !== placeId) }
          : day,
      ),
    }));
  }, []);

  const movePlace = useCallback(
    (dayId: string, placeId: string, direction: -1 | 1) => {
      setTrip((current) => ({
        ...current,
        days: current.days.map((day) => {
          if (day.id !== dayId) return day;
          const index = day.placeIds.indexOf(placeId);
          const target = index + direction;
          if (index < 0 || target < 0 || target >= day.placeIds.length)
            return day;
          const next = [...day.placeIds];
          [next[index], next[target]] = [next[target], next[index]];
          return { ...day, placeIds: next };
        }),
      }));
    },
    [],
  );

  const setDayEndpoints = useCallback(
    (
      dayId: string,
      endpoints: Pick<TripDay, "startPlaceId" | "endPlaceId">,
    ) => {
      setTrip((current) => ({
        ...current,
        days: current.days.map((day) =>
          day.id === dayId ? { ...day, ...endpoints } : day,
        ),
      }));
    },
    [],
  );

  const movePlaceBetweenDays = useCallback(
    (
      sourceDayId: string,
      targetDayId: string,
      placeId: string,
      targetIndex?: number,
    ) => {
      setTrip((current) =>
        movePlaceToDay(current, sourceDayId, targetDayId, placeId, targetIndex),
      );
    },
    [],
  );

  const setStartDate = useCallback((startDate: string) => {
    setTrip((current) => ({ ...current, startDate }));
  }, []);

  const setStartTime = useCallback((startTime: string) => {
    setTrip((current) => ({ ...current, startTime }));
  }, []);

  const setCurrency = useCallback((currency: TripData["currency"]) => {
    setTrip((current) => ({ ...current, currency }));
  }, []);

  const setTravelers = useCallback((travelers: number) => {
    setTrip((current) => ({
      ...current,
      travelers: Math.max(1, Math.round(travelers) || 1),
    }));
  }, []);

  const setOvernightPlace = useCallback((dayId: string, placeId?: string) => {
    setTrip((current) => ({
      ...current,
      days: current.days.map((day) =>
        day.id === dayId ? { ...day, overnightPlaceId: placeId } : day,
      ),
    }));
  }, []);

  const optimizeDay = useCallback(
    (dayId: string, allPlaces: Location[]) => {
      setTrip((current) => optimizeDayStops(current, dayId, allPlaces));
    },
    [],
  );

  const addBudgetItem = useCallback(
    (dayId: string, category: BudgetCategory, amount: number) => {
      if (!Number.isFinite(amount) || amount <= 0) return;
      setTrip((current) => ({
        ...current,
        budgetItems: [
          ...(current.budgetItems ?? []),
          { id: `budget-${Date.now()}`, dayId, category, amount },
        ],
      }));
    },
    [],
  );

  const removeBudgetItem = useCallback((itemId: string) => {
    setTrip((current) => ({
      ...current,
      budgetItems: (current.budgetItems ?? []).filter(
        (item) => item.id !== itemId,
      ),
    }));
  }, []);

  const favoritePlaces = useMemo(
    () =>
      Object.entries(trip.placeStates)
        .filter(([, state]) => state.favorite)
        .map(([id]) => id),
    [trip.placeStates],
  );

  return {
    trip,
    getPlaceState,
    patchPlaceState,
    togglePlaceState,
    addDay,
    renameDay,
    removeDay,
    addPlaceToDay,
    removePlaceFromDay,
    movePlace,
    movePlaceBetweenDays,
    setDayEndpoints,
    setStartDate,
    setStartTime,
    setCurrency,
    setTravelers,
    setOvernightPlace,
    optimizeDay,
    addBudgetItem,
    removeBudgetItem,
    favoritePlaces,
  };
};

export const resolveDayPlaces = (day: TripDay, allPlaces: Location[]) => {
  const byId = new Map(allPlaces.map((place) => [place.id, place]));
  return day.placeIds.map((id) => byId.get(id)).filter(Boolean) as Location[];
};

export const resolveDayRoutePlaces = (day: TripDay, allPlaces: Location[]) => {
  const places = resolveDayPlaces(day, allPlaces);
  const byId = new Map(allPlaces.map((place) => [place.id, place]));
  const start = day.startPlaceId ? byId.get(day.startPlaceId) : undefined;
  const end = day.endPlaceId ? byId.get(day.endPlaceId) : undefined;
  return [start, ...places, end].filter(
    (place, index, route) =>
      place &&
      route.findIndex((candidate) => candidate?.id === place.id) === index,
  ) as Location[];
};

export const movePlaceToDay = (
  trip: TripData,
  sourceDayId: string,
  targetDayId: string,
  placeId: string,
  targetIndex?: number,
): TripData => {
  const source = trip.days.find((day) => day.id === sourceDayId);
  const target = trip.days.find((day) => day.id === targetDayId);
  if (!source || !target || !source.placeIds.includes(placeId)) return trip;

  const sourceIds = source.placeIds.filter((id) => id !== placeId);
  const targetIds = targetDayId === sourceDayId
    ? sourceIds
    : target.placeIds.filter((id) => id !== placeId);
  const index = Math.max(
    0,
    Math.min(targetIndex ?? targetIds.length, targetIds.length),
  );
  targetIds.splice(index, 0, placeId);

  return {
    ...trip,
    days: trip.days.map((day) => {
      if (day.id === sourceDayId && day.id === targetDayId)
        return { ...day, placeIds: targetIds };
      if (day.id === sourceDayId) return { ...day, placeIds: sourceIds };
      if (day.id === targetDayId) return { ...day, placeIds: targetIds };
      return day;
    }),
  };
};
