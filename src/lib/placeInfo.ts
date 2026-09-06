import { getJson, HttpError } from "@/lib";
import type { Location, Language, WikiSummary } from "@/types";
import { categoryLabel, RESOURCES } from "@/i18n";

const cleanWikiName = (name: string) => {
  return name
    .replace(/\s+(Parking|Parking P\d+|car park|meeting point)$/i, "")
    .replace(/^The\s+/i, "")
    .trim();
};

const searchWikiTitle = async (
  place: Location,
  language: Language,
  signal?: AbortSignal,
): Promise<string | null> => {
  const host = language === "el" ? "el.wikipedia.org" : "en.wikipedia.org";
  const name = cleanWikiName(place.name);
  const query = language === "el" ? `${name} Ισλανδία` : `${name} Iceland`;
  const url = `https://${host}/w/api.php?origin=*&action=query&list=search&format=json&srlimit=5&srsearch=${encodeURIComponent(query)}`;

  try {
    const data = await getJson<any>(url, signal);
    const results = data.query?.search ?? [];
    if (!results.length) return null;

    // Prefer a title that actually resembles the place name. This avoids a
    // generic Iceland result when a localised article does not exist.
    const needle = name.toLocaleLowerCase(
      language === "el" ? "el-GR" : "en-US",
    );
    const best =
      results.find((item: { title?: string }) =>
        item.title
          ?.toLocaleLowerCase(language === "el" ? "el-GR" : "en-US")
          .includes(needle),
      ) ?? results[0];
    return best?.title ?? null;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null;
    throw error;
  }
};

const fetchSummaryByTitle = async (
  title: string,
  language: Language,
  signal?: AbortSignal,
): Promise<WikiSummary | null> => {
  const host = language === "el" ? "el.wikipedia.org" : "en.wikipedia.org";
  try {
    const data = await getJson<WikiSummary>(
      `https://${host}/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      signal,
    );
    if (data.type === "disambiguation") return null;
    return { ...data, lang: language };
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null;
    throw error;
  }
};

export const getWiki = async (
  place: Location,
  language: Language,
  signal?: AbortSignal,
): Promise<WikiSummary | null> => {
  // Greek mode first tries Greek Wikipedia. If no useful Greek article exists,
  // it falls back to English rather than showing an unrelated result.
  const languages: Language[] = language === "el" ? ["el", "en"] : ["en"];
  let result: WikiSummary | null = null;

  for (const lang of languages) {
    const candidates = [...new Set([cleanWikiName(place.name), place.name])];

    for (const candidate of candidates) {
      const direct = await fetchSummaryByTitle(candidate, lang, signal);
      if (direct) {
        result = direct;
        break;
      }
    }
    if (result) break;

    const title = await searchWikiTitle(place, lang, signal);
    if (title) result = await fetchSummaryByTitle(title, lang, signal);
    if (result) break;
  }

  return result;
};

export const getMedia = async (
  place: Location,
  signal?: AbortSignal,
): Promise<string[]> => {
  const query = `${cleanWikiName(place.name)} Iceland`;
  const url = `https://commons.wikimedia.org/w/api.php?origin=*&action=query&generator=search&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json&gsrsearch=${encodeURIComponent(query)}`;
  const data = await getJson<any>(url, signal);
  return Object.values(data.query?.pages ?? {})
    .map(
      (page: any) => page.imageinfo?.[0]?.thumburl ?? page.imageinfo?.[0]?.url,
    )
    .filter(Boolean)
    .filter((image: string) => !image.toLowerCase().endsWith(".svg"))
    .slice(0, 4);
};

export const fallbackSummary = (place: Location, language: Language) => {
  if (place.description) return place.description;
  return RESOURCES[language].fallbackSummary
    .replace("{category}", categoryLabel(place.category, language))
    .replace("{lat}", place.lat.toFixed(5))
    .replace("{lng}", place.lng.toFixed(5));
};
