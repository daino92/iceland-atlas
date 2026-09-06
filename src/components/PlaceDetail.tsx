import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import {
  Detail,
  DetailInner,
  DetailTopbar,
  Back,
  LanguageSwitch,
  DetailTitle,
  DetailMeta,
  Hero,
  Placeholder,
  DetailGrid,
  DetailCopy,
  DetailGallery,
  Facts,
  Fact,
} from "@/components";
import { usePlaceInfo } from "@/hooks";
import { LOCATIONS } from "@/data";
import {
  categoryLabel,
  UI,
  fallbackSummary,
  formatDuration,
  getPlaceMeta,
  winterLabel,
  weatherCodeLabel,
} from "@/lib";
import type { Language } from "@/types";

interface Props {
  language: Language;
}

const PlaceDetail = ({ language }: Props) => {
  const { id } = useParams();
  const place = useMemo(() => LOCATIONS.find((item) => item.id === id), [id]);
  const { wiki, media, weather, loading } = usePlaceInfo(place, language);
  const t = UI[language];

  if (!place) return <Navigate to="/" replace />;
  const images = [
    wiki?.originalimage?.source,
    wiki?.thumbnail?.source,
    ...media,
  ]
    .filter(Boolean)
    .filter((value, index, all) => all.indexOf(value) === index) as string[];
  const meta = getPlaceMeta(place);

  return (
    <Detail className="detail">
      <DetailInner className="detail-inner">
        <DetailTopbar className="detail-topbar">
          <Back className="back" to="/">
            ← {t.backToMap}
          </Back>
          <LanguageSwitch
            className="language-switch detail-language"
            aria-label={t.language}
          >
            <Link
              className={language === "el" ? "active" : ""}
              to={`/place/${place.id}?lang=el`}
            >
              EL
            </Link>
            <Link
              className={language === "en" ? "active" : ""}
              to={`/place/${place.id}?lang=en`}
            >
              EN
            </Link>
          </LanguageSwitch>
        </DetailTopbar>
        <DetailTitle className="detail-title">{place.name}</DetailTitle>
        <DetailMeta className="detail-meta">
          {place.layer} · {categoryLabel(place.category, language)} ·{" "}
          {place.lat.toFixed(5)}, {place.lng.toFixed(5)}
        </DetailMeta>

        <Hero className="hero">
          {images[0] ? (
            <img src={images[0]} alt={place.name} />
          ) : (
            <Placeholder className="placeholder hero-placeholder">
              {loading ? t.loadingInfo : t.noImages}
            </Placeholder>
          )}
        </Hero>

        <DetailGrid className="detail-grid">
          <DetailCopy className="detail-copy">
            <p>{wiki?.extract ?? fallbackSummary(place, language)}</p>
            {wiki?.content_urls?.desktop?.page && (
              <p>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={wiki.content_urls.desktop.page}
                >
                  {t.source}: Wikipedia ({wiki.lang?.toUpperCase()}) ↗
                </a>
              </p>
            )}
            {images.length > 1 && (
              <DetailGallery className="detail-gallery">
                {images.slice(1, 4).map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt={place.name}
                    loading="lazy"
                  />
                ))}
              </DetailGallery>
            )}
          </DetailCopy>
          <Facts className="facts">
            <Fact className="fact">
              <b>{t.layer}</b>
              {place.layer}
            </Fact>
            <Fact className="fact">
              <b>{t.category}</b>
              {categoryLabel(place.category, language)}
            </Fact>
            <Fact className="fact">
              <b>{UI[language].estimatedStop}</b>
              {formatDuration(meta.stopMinutes, language)}
            </Fact>
            <Fact className="fact">
              <b>{UI[language].winterAccess}</b>
              {winterLabel(meta.winter, language)}
            </Fact>
            {weather && (
              <>
                <Fact className="fact">
                  <b>{UI[language].weatherNow}</b>
                  {weather.temperature}°C ·{" "}
                  {weatherCodeLabel(weather.weatherCode, language)}
                </Fact>
                <Fact className="fact">
                  <b>{UI[language].wind}</b>
                  {Math.round(weather.windSpeed)} km/h · {t.gusts}{" "}
                  {Math.round(weather.windGusts)} km/h
                </Fact>
              </>
            )}
            <Fact className="fact">
              <b>{t.latitude}</b>
              {place.lat.toFixed(6)}
            </Fact>
            <Fact className="fact">
              <b>{t.longitude}</b>
              {place.lng.toFixed(6)}
            </Fact>
            <Fact className="fact">
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
              >
                {t.openMaps} ↗
              </a>
            </Fact>
          </Facts>
        </DetailGrid>
      </DetailInner>
    </Detail>
  );
};

export default PlaceDetail;
