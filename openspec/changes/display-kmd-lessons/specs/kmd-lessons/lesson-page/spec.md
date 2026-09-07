## Purpose

How a reader reaches a Khai Minh Đức lesson on the public site and what they are shown: the
programme's place among the site's other learning paths, the list of lessons available to read,
and the lesson itself at an address that can be shared.

## ADDED Requirements

### Requirement: Khai Minh Đức appears among the site's learning programmes

The learning page that lists the site's programmes SHALL include Khai Minh Đức alongside the
existing ones, presented the same way they are, and following it SHALL lead to the list of KMD
lessons.

#### Scenario: Finding the programme

- **WHEN** a visitor opens the learning page
- **THEN** Khai Minh Đức is shown as one of the programmes, and following it opens the list of
  lessons

### Requirement: The lesson list shows every visible lesson in teaching order

There SHALL be a page listing the KMD lessons. It SHALL show every visible lesson and no lesson
that is not visible, in the order editors have arranged them, and each entry SHALL identify its
lesson by name and by the âm or vần it teaches. Following an entry SHALL open that lesson.

The list SHALL NOT require the reader to be signed in.

#### Scenario: Browsing the lessons

- **WHEN** a visitor opens the lesson list while ten lessons are visible and three are not
- **THEN** the ten visible lessons are shown, in the order the editors arranged them, each with
  its name and the âm/vần it teaches

#### Scenario: No lessons yet

- **WHEN** a visitor opens the lesson list while no lesson is visible
- **THEN** they are told there are no lessons to read yet, rather than shown an empty page or an
  error

### Requirement: A lesson has its own shareable address

Each visible lesson SHALL be readable at an address built from its slug. That address SHALL work
for a visitor who is not signed in, SHALL be reachable directly without first visiting the list,
and SHALL keep working as long as the lesson keeps its slug.

The page SHALL carry the lesson's name in its title and a canonical link to its own address, so a
shared link previews and indexes as that lesson.

#### Scenario: Opening a lesson from the list

- **WHEN** a visitor follows a lesson from the list
- **THEN** the lesson opens at an address containing its slug

#### Scenario: Following a shared link

- **WHEN** someone who has never visited the site opens a lesson's address directly
- **THEN** the lesson is shown, without a sign-in step

### Requirement: A lesson is shown as its editor composed it

A lesson page SHALL show the lesson's name, the âm or vần it teaches, and every section of its
body in the order the editor arranged them.

Each section SHALL render the content it holds — its text with the emphasis, colours and column
arrangement the editor gave it, its pictures, and its lesson blocks — so that what a reader sees
matches what the editor saw while composing. A section type the editor can use SHALL NOT render as
nothing.

A lesson with no sections SHALL be shown as an empty lesson rather than an error.

#### Scenario: Reading a composed lesson

- **WHEN** a visitor opens a lesson whose sections include coloured text, a two-column
  arrangement, a picture, a vocabulary card, a tạo tiếng chain and a đánh vần diagram
- **THEN** each of those is shown, in order, as the editor arranged it

#### Scenario: A lesson with no content yet

- **WHEN** a visitor opens a visible lesson that has no sections
- **THEN** the page shows the lesson's name and says it has no sections yet

### Requirement: An unavailable lesson is a plain not-found

An address whose slug matches no lesson, or matches a lesson that is not visible, SHALL be
answered as not found. The reader SHALL be told the lesson is not available and offered a way back
to the lesson list.

A lesson that is not visible SHALL be indistinguishable from one that does not exist, so that
withdrawing a lesson does not disclose it.

#### Scenario: A mistyped address

- **WHEN** a visitor opens an address whose slug matches no lesson
- **THEN** they are told the lesson is not available and offered the lesson list

#### Scenario: A lesson that is not visible

- **WHEN** a visitor opens the address of a lesson whose visibility flag is not set
- **THEN** they get the same not-found answer as for a lesson that does not exist

### Requirement: An editor can open a lesson as a reader sees it

From the lesson editor, an editor SHALL be able to open the lesson rendered as a reader sees it.

For a visible lesson that SHALL be the public page at its own address. For a lesson that is not
visible, and therefore has no public page, the editor SHALL still be able to see the same
rendering, and SHALL be told they are looking at the lesson's last saved content rather than their
unsaved edits.

The rendering an editor previews and the rendering the public page shows SHALL be the same, so
that a lesson cannot look one way in the CMS and another way on the site.

#### Scenario: Previewing a visible lesson

- **WHEN** an editor opens the preview of a lesson that is visible
- **THEN** they are taken to the lesson's public page

#### Scenario: Previewing a lesson before it is visible

- **WHEN** an editor opens the preview of a lesson that is not yet visible
- **THEN** they see the lesson rendered exactly as the public page would render it, marked as the
  last saved content
