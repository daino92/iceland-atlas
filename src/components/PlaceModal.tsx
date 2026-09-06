import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  ModalBackdrop,
  ModalPanel,
  ModalHead,
  Meta,
  Close,
  PlaceStateRow,
  Placeholder,
  Gallery,
  Summary,
  QuickFactsGrid,
  AddDayWrap,
  Secondary,
  DayPicker,
  Actions,
  Primary,
  SecondaryLink,
} from "@/components";
import { usePlaceInfo } from "@/hooks";
import {
  categoryLabel,
  UI,
  weatherCodeLabel,
  formatDuration,
  getPlaceMeta,
  winterLabel,
  fallbackSummary,
} from "@/lib";
import type { Location, Language, PlaceState, TripDay } from "@/types";

interface Props {
  place: Location;
  onClose: () => void;
  language: Language;
  state: PlaceState;
  onToggleState: (key: keyof PlaceState) => void;
  days: TripDay[];
  onAddToDay: (dayId: string) => void;
}

const PlaceModal = ({
  place,
  onClose,
  language,
  state,
  onToggleState,
  days,
  onAddToDay,
}: Props) => {
  const navigate = useNavigate();
  const { wiki, media, weather, loading } = usePlaceInfo(place, language);
  const [dayPickerOpen, setDayPickerOpen] = useState(false);
  const t = UI[language];
  const meta = getPlaceMeta(place);

  const closeBackdrop = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );
  const toggleFavorite = useCallback(
    () => onToggleState("favorite"),
    [onToggleState],
  );
  const togglePlanned = useCallback(
    () => onToggleState("planned"),
    [onToggleState],
  );
  const toggleVisited = useCallback(
    () => onToggleState("visited"),
    [onToggleState],
  );
  const toggleDayPicker = useCallback(
    () => setDayPickerOpen((value) => !value),
    [],
  );
  const addToDay = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onAddToDay(event.currentTarget.value);
      setDayPickerOpen(false);
    },
    [onAddToDay],
  );
  const openDetail = useCallback(
    () => navigate(`/place/${place.id}`),
    [navigate, place.id],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const images = [wiki?.thumbnail?.source, ...media]
    .filter(Boolean)
    .filter((value, index, all) => all.indexOf(value) === index)
    .slice(0, 3) as string[];

  return (
    <ModalBackdrop className="modal-backdrop" onMouseDown={closeBackdrop}>
      <ModalPanel
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={place.name}
      >
        <ModalHead className="modal-head">
          <div>
            <Meta className="meta">
              {place.layer} · {categoryLabel(place.category, language)}
            </Meta>
            <h2>{place.name}</h2>
          </div>
          <Close className="close" onClick={onClose} aria-label={t.close}>
            ×
          </Close>
        </ModalHead>

        <PlaceStateRow className="place-state-row">
          <button
            className={state.favorite ? "state-active" : ""}
            onClick={toggleFavorite}
          >
            ♥ {UI[language].favorite}
          </button>
          <button
            className={state.planned ? "state-active" : ""}
            onClick={togglePlanned}
          >
            ✓ {UI[language].planned}
          </button>
          <button
            className={state.visited ? "state-active" : ""}
            onClick={toggleVisited}
          >
            ● {UI[language].visited}
          </button>
        </PlaceStateRow>

        {loading ? (
          <Placeholder className="placeholder">{t.loadingInfo}</Placeholder>
        ) : images.length ? (
          <Gallery className={`gallery ${images.length === 1 ? "one" : ""}`}>
            {images.map((image) => (
              <img key={image} src={image} alt={place.name} loading="lazy" />
            ))}
          </Gallery>
        ) : (
          <Placeholder className="placeholder">{t.noImages}</Placeholder>
        )}

        {!loading && (
          <Summary className="summary">
            {wiki?.extract ?? fallbackSummary(place, language)}
          </Summary>
        )}

        <QuickFactsGrid className="quick-facts-grid">
          <div>
            <span>{UI[language].stopTime}</span>
            <b>{formatDuration(meta.stopMinutes, language)}</b>
          </div>
          <div className={`winter-${meta.winter}`}>
            <span>{UI[language].winter}</span>
            <b>{winterLabel(meta.winter, language)}</b>
          </div>
          {weather && (
            <>
              <div>
                <span>{UI[language].weatherNow}</span>
                <b>
                  {weather.temperature}°C ·{" "}
                  {weatherCodeLabel(weather.weatherCode, language)}
                </b>
              </div>
              <div>
                <span>{UI[language].wind}</span>
                <b>
                  {Math.round(weather.windSpeed)} km/h · {t.gusts}{" "}
                  {Math.round(weather.windGusts)}
                </b>
              </div>
            </>
          )}
        </QuickFactsGrid>

        <AddDayWrap className="add-day-wrap">
          <Secondary className="secondary wide" onClick={toggleDayPicker}>
            ＋ {UI[language].addToDay}
          </Secondary>
          {dayPickerOpen && (
            <DayPicker className="day-picker">
              {days.map((day) => (
                <button key={day.id} value={day.id} onClick={addToDay}>
                  {day.name}
                </button>
              ))}
            </DayPicker>
          )}
        </AddDayWrap>

        <Actions className="actions">
          <Primary className="primary" onClick={openDetail}>
            {t.learnMore}
          </Primary>
          <SecondaryLink
            className="secondary"
            target="_blank"
            rel="noreferrer"
            href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
          >
            Google Maps ↗
          </SecondaryLink>
        </Actions>
      </ModalPanel>
    </ModalBackdrop>
  );
};

export default PlaceModal;
