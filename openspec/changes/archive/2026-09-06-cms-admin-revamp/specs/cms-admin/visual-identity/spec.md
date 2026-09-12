## Purpose

The admin panel's design language: the colours, typography and density that make every screen —
including the ones the framework draws for us — read as one product built for Vietnamese
teachers rather than as a generic database tool.

## ADDED Requirements

### Requirement: One palette governs every screen

The panel SHALL present a single colour palette across all of its screens, including screens
rendered entirely by the admin framework with no project-authored components. The palette SHALL
be defined in one place, so that changing a colour changes it everywhere.

The palette SHALL be light-only. The panel does not follow the operating system's dark-mode
setting.

#### Scenario: A framework-owned screen carries the palette

- **WHEN** an editor opens a screen the project has written no components for — the media
  library list, or the account page
- **THEN** its page ground, card surfaces, borders, body text and primary button use the same
  palette as the purpose-built editing screens

#### Scenario: The OS is set to dark mode

- **WHEN** an editor's operating system is set to dark mode
- **THEN** the panel still renders in its light palette, unchanged

### Requirement: Colours meet contrast minimums

Every foreground/background pairing the panel produces SHALL meet WCAG AA: at least 4.5:1 for
body text and at least 3:1 for focus indication and for the borders of interactive controls
against their surroundings.

Palette steps that fall below 4.5:1 against the surfaces they sit on SHALL be documented as
non-text colours and SHALL NOT be used to render text.

#### Scenario: Body text on the page ground

- **WHEN** the computed colours of body text and its actual background are measured on any
  admin screen
- **THEN** their contrast ratio is at least 4.5:1

#### Scenario: A focused control

- **WHEN** an editor moves focus to a control with the keyboard
- **THEN** the focus indication is visible against the control's actual background at a contrast
  ratio of at least 3:1

### Requirement: Vietnamese renders correctly at every weight

The panel SHALL render Vietnamese text with every diacritic intact at regular and bold weight.
The typeface SHALL be served from the panel's own origin, so that no screen depends on a
third-party font request succeeding.

The panel SHALL NOT name a typeface it does not itself serve, because a browser asked for an
absent face synthesises bold from a substitute that drops precomposed Vietnamese marks.

#### Scenario: Bold Vietnamese in the panel

- **WHEN** a bold Vietnamese string containing ệ, ẫ and ỡ is rendered anywhere in the panel
- **THEN** every diacritic appears, correctly positioned, and the glyphs come from the same
  typeface as the surrounding regular text

#### Scenario: No third-party font request

- **WHEN** an admin screen loads
- **THEN** no font is requested from an origin outside the panel's own

### Requirement: The framework is themed, not forked

The design language SHALL be applied without modifying or vendoring the admin framework's own
stylesheets, so that upgrading the framework does not require re-applying the theme.

#### Scenario: Framework upgrade

- **WHEN** the admin framework is upgraded to a new patch or minor version
- **THEN** the theme still applies, with no merge of framework stylesheets required
