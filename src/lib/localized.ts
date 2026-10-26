import { getLocale } from "@/paraglide/runtime";

/**
 * A content label that may have an English version: a speaking topic's title,
 * say, with the English the CMS stores beside it. The Vietnamese is always there and
 * always shown; a translation is only ever a gloss beside it, because on a site
 * that teaches Vietnamese the label is vocabulary too.
 *
 * Learning content (the sentences, letters, lessons) is a plain string and
 * never goes through this type.
 */
export type Localized = { vi: string; en?: string };

/** The translations the CMS stores beside a translatable field, e.g. `titleTranslations`
    (cms/src/lib/translations.ts). Absent or null where no one has translated it. */
export type CmsTranslations = { en?: string | null } | null | undefined;

/** The English from a CMS translations group, or undefined when it is empty. */
export function cmsEnglish(translations: CmsTranslations): string | undefined {
  return translations?.en?.trim() || undefined;
}

/** The gloss to show under `text` in the current UI language: undefined in
    Vietnamese, or when no one has translated this label yet. */
export function glossOf(text: Pick<Localized, "en">): string | undefined {
  const locale = getLocale();
  return locale === "vi" ? undefined : text[locale] || undefined;
}
