## Purpose

How a teacher edits the bài inside a chặng: a flat numbered list of always-visible rows, each
showing what the bài holds and carrying its own controls, instead of a stack of collapsibles
that must be opened one at a time.

## ADDED Requirements

### Requirement: Bài are a flat list of always-visible rows

The bài of a nội dung SHALL be presented as a numbered list in which every row is visible at
once. A row SHALL NOT have to be expanded, opened or hovered for its contents to be readable.

Rows SHALL be numbered by their position within their nội dung, and the numbers SHALL follow the
rows when the order changes.

#### Scenario: Opening a chặng

- **WHEN** an editor opens a chặng
- **THEN** every bài in it is listed with its number, name and contents visible, with no
  collapsed rows to open

#### Scenario: Numbers follow a reorder

- **WHEN** an editor moves the third bài to the first position
- **THEN** it is numbered 1, and the bài that were first and second are numbered 2 and 3

### Requirement: A row shows what its bài holds

A bài's row SHALL show, without being opened:

- the bài's name, editable in place;
- the bài's first hình as a picture, or an empty picture slot when it has none;
- an indication for each of the three attachments — audio, video, link — that is set, and no
  indication for one that is not.

Two bài that share a name SHALL be distinguishable from their rows alone whenever their contents
differ.

#### Scenario: Bài sharing a name

- **WHEN** two bài in the same chặng are both named "Nhìn hình, nghe và nhắc lại" but hold
  different hình
- **THEN** their rows show different pictures, and an editor can tell which is which without
  opening either

#### Scenario: Attachment indications

- **WHEN** a bài has an audio file and a link set, and no video
- **THEN** its row shows exactly two attachment indications — audio and link — and none for
  video

#### Scenario: A picture that cannot be loaded

- **WHEN** a bài's first hình references a file that fails to load
- **THEN** the row still renders its number, name, attachment indications and controls, and does
  not report the bài as holding nothing

### Requirement: A row is edited in place

Typing in a row's name SHALL rename the bài, and SHALL NOT collapse, open, reorder or otherwise
disturb the row.

Setting a picture from a row's picture slot SHALL attach it to that bài as its first hình.

#### Scenario: Renaming from the row

- **WHEN** an editor clicks the name in a bài's row and types
- **THEN** the text is entered into the name, the row stays where it is, and the change is held
  in the document until it is saved

#### Scenario: Adding a picture from the row

- **WHEN** an editor uses the picture slot of a bài that has no hình and chooses an image
- **THEN** that image becomes the bài's first hình and appears in the slot immediately

### Requirement: Each row carries reorder, duplicate and delete

Every bài row SHALL carry its own controls, presented together and outside the row's editable
fields, for: moving the bài up or down within its nội dung, duplicating it, and deleting it.

Duplicating a bài SHALL produce a new bài immediately after it, holding the same name, hình,
captions and attachments. The copy SHALL be independent: editing it SHALL NOT change the
original.

Deleting a bài SHALL require confirmation, because a bài carries its hình and captions with it
and there is no undo.

#### Scenario: Duplicating

- **WHEN** an editor duplicates a bài that has two hình with captions and an audio file
- **THEN** a new bài appears directly below it with the same name, both hình, their captions and
  the same audio, and editing the copy's name leaves the original's unchanged

#### Scenario: Moving the first bài up

- **WHEN** an editor uses the "move up" control on the first bài in a nội dung
- **THEN** nothing moves, and the control indicates that it is unavailable

#### Scenario: Deleting

- **WHEN** an editor uses the delete control on a bài
- **THEN** they are asked to confirm, and the bài is removed only if they do

### Requirement: Bài are added from the end of the list

Adding a bài SHALL be offered directly beneath the list of bài it will join. A newly added bài
SHALL appear at the end of that nội dung's list, named as unnamed, and SHALL be editable
immediately without a further step.

#### Scenario: Adding a bài

- **WHEN** an editor uses the add control beneath a nội dung's bài
- **THEN** a new empty row appears at the end of that list, marked as holding nothing, with its
  name ready to be typed into

### Requirement: The rest of a bài is reachable without losing the list

Everything a row cannot show — a bài's further hình, its captions, and the full editors for its
audio, video and link — SHALL be reachable from that row. Reaching it SHALL NOT hide, reorder or
collapse the other bài in the list, and returning SHALL leave the editor at the same place in
the list.

#### Scenario: Opening a bài's detail and returning

- **WHEN** an editor opens the detail of the tenth bài in a long chặng, adds a caption, and
  closes it
- **THEN** the list is still showing the same bài in the same order, at the same scroll position,
  with the tenth bài's row reflecting the change
