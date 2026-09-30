## Purpose

Lets visitors use the site's interface in Vietnamese or English. Lessons and other learning content stay in Vietnamese in both, since Vietnamese is what the site teaches.

## ADDED Requirements

### Requirement: Supported locales and default
The site SHALL support exactly two interface locales, `vi` and `en`. `en` SHALL be the default whenever no valid preference exists.

#### Scenario: First visit without a preference
- **WHEN** a visitor with no `locale` cookie requests any page
- **THEN** the page is rendered in English and `<html lang="en">`

#### Scenario: Invalid stored preference
- **WHEN** the `locale` cookie holds a value other than `vi` or `en`
- **THEN** the page is rendered in English as if no preference existed

### Requirement: Locale preference is stored in a cookie
The chosen locale SHALL be persisted in a first-party cookie named `locale`, with `Path=/`, `SameSite=Lax`, and a lifetime of one year. The site SHALL NOT encode the locale in the URL: every route serves both locales at the same path.

#### Scenario: Preference survives a new session
- **WHEN** a visitor picks English, closes the browser, and returns to `/hoc-tap` later
- **THEN** the page is rendered in English

#### Scenario: Same URL for both languages
- **WHEN** a visitor switches from Vietnamese to English while on `/bang-xep-hang`
- **THEN** the address stays `/bang-xep-hang`

### Requirement: Server render matches the chosen locale
The server-rendered HTML SHALL already be in the visitor's locale: the `<html lang>` attribute, the document `<title>`, meta and Open Graph descriptions, and all visible interface text. Hydration SHALL NOT change the language of any text.

#### Scenario: No flash of English for a Vietnamese visitor
- **WHEN** a visitor whose `locale` cookie is `vi` loads `/dang-nhap` with JavaScript disabled
- **THEN** the HTML has `lang="vi"`, a Vietnamese `<title>`, and Vietnamese form labels and buttons

#### Scenario: Server error fallback page
- **WHEN** a visitor whose `locale` cookie is `vi` hits a request that fails before the app can render
- **THEN** the fallback error page is in Vietnamese with `lang="vi"`

### Requirement: Language switcher
The Navbar SHALL show a language switcher on desktop and in the mobile menu, for both signed-in and signed-out visitors. It SHALL show the current locale and let the visitor choose the other one, labelling each option in its own language ("Tiếng Việt", "English"). Choosing a locale SHALL persist it and re-render the current page in that locale without a full page reload, without leaving the current route, and without losing in-page state that doesn't depend on language.

#### Scenario: Switching to English
- **WHEN** a visitor on the home page chooses "English" in the switcher
- **THEN** the navbar, footer, page text, and document title change to English, the URL doesn't change, and the `locale` cookie is `en`

#### Scenario: Switching from the mobile menu
- **WHEN** a visitor on a narrow screen opens the menu and chooses "Tiếng Việt"
- **THEN** the interface changes to Vietnamese and the choice persists

### Requirement: First-visit language prompt
A visitor whose browser has never chosen a language (no `locale` cookie) SHALL be shown a bilingual welcome dialog after the page loads. It offers "English" and "Tiếng Việt", each with a flag. The choice SHALL be mandatory: the dialog SHALL have no close button and SHALL NOT close on Escape or on a click outside it. Choosing either option SHALL apply it like the switcher and persist it. The dialog SHALL NOT appear again once a `locale` cookie exists, and it SHALL NOT change the server-rendered HTML.

#### Scenario: First visit
- **WHEN** a visitor with no `locale` cookie opens any page
- **THEN** the page renders in English, and a dialog greeting them in both languages asks them to choose

#### Scenario: Choosing Vietnamese from the prompt
- **WHEN** the visitor chooses "Tiếng Việt" in the dialog
- **THEN** the dialog closes, the page switches to Vietnamese in place, and the `locale` cookie is `vi`

#### Scenario: Choosing the language already shown
- **WHEN** the visitor chooses "English" in the dialog
- **THEN** the dialog closes, the page stays English, the `locale` cookie is `en`, and the dialog doesn't appear on later visits

#### Scenario: Trying to dismiss the prompt
- **WHEN** the visitor presses Escape or clicks outside the dialog
- **THEN** the dialog stays open until they choose a language

### Requirement: Interface text is translated, learning content is not
Every piece of interface chrome SHALL be shown in the active locale: navigation, footer, buttons, page headings and intro text, form labels, placeholders, validation messages, toasts, empty and error states, accessible labels (`aria-label`, `alt` text that isn't learning content), document titles, and the static information pages (usage guide, FAQ, contact, terms, privacy). Learning content SHALL stay in Vietnamese in both locales: lesson bodies and titles from the CMS, alphabet letters, vocabulary, example sentences, topic and place names from the learning data, and anything read aloud by text-to-speech.

#### Scenario: Lesson content stays Vietnamese
- **WHEN** an English-locale visitor opens a Quyển 1 lesson
- **THEN** the surrounding controls (back link, progress labels, buttons) are in English, and the lesson's words, sentences, and audio are in Vietnamese

#### Scenario: Validation messages follow the locale
- **WHEN** an English-locale visitor submits the sign-in form with an invalid email
- **THEN** the validation message is in English

#### Scenario: Toasts follow the locale
- **WHEN** saving speaking progress fails for an English-locale visitor
- **THEN** the error toast title and description are in English

### Requirement: Catalog completeness
Every interface message SHALL exist in both locales. A message missing from either catalog SHALL fail type checking or the build, so a page can never show a raw key or an empty string in production.

#### Scenario: Missing English translation
- **WHEN** a developer adds a Vietnamese message without adding its English counterpart
- **THEN** type checking (`tsc`) reports an error

### Requirement: Locale-aware formatting
Dates and numbers shown in the interface SHALL be formatted for the active locale (`vi-VN` or `en-US`).

#### Scenario: Member-since date
- **WHEN** an English-locale visitor views a profile page
- **THEN** the member-since date uses English month names and ordering

#### Scenario: Large counts
- **WHEN** a Vietnamese-locale visitor views the dashboard totals
- **THEN** thousands separators follow the Vietnamese convention (for example `1.234`)
