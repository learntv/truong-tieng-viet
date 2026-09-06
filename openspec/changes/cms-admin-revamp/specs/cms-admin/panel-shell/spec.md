## Purpose

The chrome every admin screen sits inside: the top bar that carries the school's identity and
the panel's navigation, and the card-on-ground page layout that content is presented in.

## ADDED Requirements

### Requirement: Navigation is a top bar, not a sidebar

Every admin screen SHALL present its navigation as a horizontal bar across the top of the
viewport. The panel SHALL NOT present a vertical sidebar navigation.

The bar SHALL carry, from left to right: the school's mark and name, the navigation links, and
the signed-in editor's account control. The bar SHALL remain in the same position and carry the
same items on every screen, so that an editor never loses their way out of a document.

#### Scenario: The bar is present on every screen

- **WHEN** an editor opens the dashboard, a collection list, or a document edit screen
- **THEN** the same top bar appears at the top of each, and no sidebar navigation is rendered

#### Scenario: Reaching the account control

- **WHEN** an editor wants to sign out or open their account
- **THEN** the control is at the right-hand end of the top bar, reachable from any screen

### Requirement: Navigation lists what teachers work on

The navigation SHALL list the panel's content by the names teachers use for it, in Vietnamese —
not by the names of the underlying collections.

Each quyển SHALL appear as its own navigation entry linking straight to that quyển. Quyển SHALL
be resolved by their stable slugs, not by document ids, so that the same entries appear in every
environment.

#### Scenario: A quyển is one click away

- **WHEN** an editor opens any admin screen
- **THEN** each quyển in the roster appears as a navigation entry, and following it opens that
  quyển's page

#### Scenario: A quyển is added to the roster

- **WHEN** a new quyển is added to the fixed roster and the panel is redeployed
- **THEN** a navigation entry for it appears, with no separate edit to the navigation

### Requirement: Chủ đề is reachable but never listed

A chủ đề SHALL remain routable at its own address, so that links to it from a quyển page and
from a browser bookmark continue to work. A chủ đề SHALL NOT appear as a navigation entry, and
the panel SHALL NOT offer a chủ đề collection listing as a way in — a teacher reaches a chủ đề
through its quyển.

#### Scenario: Following a link to a chủ đề

- **WHEN** an editor follows a chủ đề card from a quyển page, or opens a bookmarked chủ đề
  address
- **THEN** the chủ đề's edit screen opens normally

#### Scenario: Chủ đề is absent from navigation

- **WHEN** an editor reads the navigation
- **THEN** no entry for chủ đề appears

### Requirement: Content sits on a card against a tinted ground

Below the top bar, each screen's content SHALL be presented on a single bounded surface — a card
with its own background, padding and rounded corners — floating on a page ground of a different
tint. Content SHALL NOT run edge-to-edge against the viewport.

The card SHALL have a maximum width, so that on a wide display a line of text does not stretch
across the whole screen.

#### Scenario: A document edit screen on a wide display

- **WHEN** an editor opens a chủ đề on a display wider than the card's maximum width
- **THEN** the card is capped at that width and centred, with the page ground visible on both
  sides

#### Scenario: The card is distinguishable from the ground

- **WHEN** any admin screen is rendered
- **THEN** the card's background and the page ground are visibly different, and the boundary
  between them is discernible without relying on a border alone

### Requirement: The panel identifies itself as the school's

The panel SHALL carry the school's identity: its mark and name in the top bar, on the sign-in
screen, and as the browser tab's icon and title suffix.

#### Scenario: Finding the tab

- **WHEN** an editor has several browser tabs open
- **THEN** the CMS tab shows the school's icon and a title ending in the school's name

#### Scenario: The sign-in screen

- **WHEN** a signed-out editor opens the panel
- **THEN** the sign-in screen shows the school's mark and name rather than the framework's
  default branding
