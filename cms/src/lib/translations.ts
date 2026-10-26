import type { Field, TextField } from 'payload'

// The languages a label can be translated into, besides Vietnamese. Vietnamese is the field
// itself and is always required where the field is; these are optional glosses the site shows
// under it when the visitor has picked that language. Adding a language here adds a column per
// translatable field (so it needs a migration) and a "+ XX" control under each of them.
export const TRANSLATION_LOCALES = [{ code: 'en', label: 'tiếng Anh' }] as const

export type TranslationLocale = (typeof TRANSLATION_LOCALES)[number]

// A text field plus its translations, stored side by side in the same row: `title` and
// `titleTranslations.en`. Not Payload's own localization, which keeps one locale in the form at
// a time and has editors switch the whole document to type each language; here every language
// is typed in place, under the Vietnamese, and saved in the same submit.
//
// For only the labels around the lessons (a topic's name, a section heading, a bài's
// instruction), never the Vietnamese being taught: chặng titles and captions stay single fields.
export function translatable(field: TextField): Field[] {
  return [
    {
      ...field,
      admin: {
        ...field.admin,
        components: {
          ...field.admin?.components,
          afterInput: [
            ...(field.admin?.components?.afterInput ?? []),
            '@/components/admin/TranslationInputs#TranslationsAfterInput',
          ],
        },
      },
    },
    {
      name: `${field.name}Translations`,
      type: 'group',
      // Edited from the field above, so the group itself renders nothing. Not `admin.hidden`:
      // Payload leaves hidden fields out of the form state, and the inputs need them there.
      admin: { components: { Field: '@/components/admin/TranslationInputs#RenderNothing' } },
      fields: TRANSLATION_LOCALES.map((locale) => ({ name: locale.code, type: 'text' as const })),
    },
  ]
}

/** Where a field's translation into `code` lives in form state, given the field's own path. */
export function translationPath(fieldPath: string, code: string): string {
  return `${fieldPath}Translations.${code}`
}
