## Purpose

How an editor sees what they are building while filling in a KMD lesson section: every section
shows a live mockup of its own contents beside its fields, so the lesson is composed by sight
rather than by typing into labelled inputs blindly.

## Requirements

### Requirement: Every section type previews its own contents

Each section type SHALL show a preview of what that section holds, rendered from the values the
editor has entered, and laid out to convey the section's shape — words as a row of cards, the
âm/vần pair as two letterforms, the six thanh as a table, and so on.

The preview SHALL be shown together with the section's fields, without the editor having to open
another view, leave the lesson, or save first.

#### Scenario: Filling in a word list

- **WHEN** an editor is editing a `wordList` section holding "bóng bay" and "đồng hồ"
- **THEN** they see those two words previewed as the cards they will become, alongside the fields
  they typed them into

#### Scenario: Previewing before the first save

- **WHEN** an editor adds a section to a lesson that has never been saved and fills in its fields
- **THEN** the preview shows those contents without the lesson being saved

### Requirement: A preview follows what the editor types

A section's preview SHALL update as its fields change, without a save, a reload or an explicit
refresh. Removing a value SHALL remove it from the preview.

#### Scenario: Editing a value

- **WHEN** an editor changes a word in a `wordList` section from "bóng bay" to "bóng bàn"
- **THEN** the preview shows "bóng bàn" without the lesson being saved

#### Scenario: Attaching a picture

- **WHEN** an editor attaches a picture to a word
- **THEN** the preview shows that picture on that word's card

#### Scenario: Removing an entry

- **WHEN** an editor deletes a word from a `wordList` section
- **THEN** the preview no longer shows it

### Requirement: An empty or partial section previews without breaking

A preview SHALL render whatever the section currently holds, including nothing at all. A section
with no values yet, or with some values missing, SHALL show an empty or partial preview rather
than an error, a blank area with no explanation, or a broken layout.

#### Scenario: A section just added

- **WHEN** an editor adds a `letterIntro` section and has typed nothing into it
- **THEN** the preview shows the section's empty shape rather than an error

#### Scenario: A word with no picture

- **WHEN** a `wordList` section holds words of which only some have pictures
- **THEN** the preview shows each word, with a picture where one is set and without one where it
  is not

### Requirement: Previews are functional mockups, not slide facsimiles

A preview SHALL convey the arrangement and content of a section — what appears, in what grouping
and order. It SHALL NOT be required to reproduce the visual styling of the source PowerPoint
decks: their colour scheme, title ribbon, or branding footer.

A preview SHALL be read-only. Editing SHALL happen in the fields, and the preview SHALL NOT be a
second place to change a value.

#### Scenario: Judging a section's contents

- **WHEN** an editor reviews the preview of a `toneTable` section
- **THEN** they can see the base âm/vần and its six thanh forms in their table arrangement, even
  though the styling is not that of the original slide

#### Scenario: The preview is not an editor

- **WHEN** an editor clicks a word shown in a preview
- **THEN** nothing about the lesson changes
