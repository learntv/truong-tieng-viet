## Purpose

What a Khai Minh Đức lesson is in the CMS: one document per bài, identified and ordered by its
bài number, whose body is an ordered list of typed instructional sections drawn from a fixed
vocabulary that mirrors how the lessons are actually taught.

## Requirements

### Requirement: A KMD lesson is its own document

Each Khai Minh Đức bài SHALL be a single document in a collection of its own. That collection
SHALL be independent of the quyển → chủ đề → chặng → nội dung → bài tree: a KMD lesson SHALL NOT
belong to a quyển, a chủ đề, a chặng or a nội dung, and editing KMD lessons SHALL NOT change how
any of those are edited.

A lesson SHALL carry a bài number, a name, and the âm or vần it teaches.

The bài number SHALL be unique across lessons.

#### Scenario: Creating a lesson

- **WHEN** an editor creates a KMD lesson, gives it bài number 48, the name
  "ONG – ÔNG – UNG – ƯNG" and records the vần it teaches
- **THEN** the lesson is saved as its own document, and no quyển, chủ đề, chặng, nội dung or bài
  is created or altered

#### Scenario: A bài number already in use

- **WHEN** an editor saves a lesson with a bài number another lesson already has
- **THEN** the save is rejected and the editor is told the number is taken

### Requirement: Lessons are a flat list ordered by bài number

KMD lessons SHALL be listed as one flat list, ordered by bài number ascending, with no grouping
level above them. An editor SHALL be able to find a lesson by its number or by the âm/vần it
teaches.

#### Scenario: Browsing the lessons

- **WHEN** an editor opens the KMD lessons list holding more than fifty lessons
- **THEN** they are shown in bài-number order, from Bài 1 upward

#### Scenario: Finding the lesson for a vần

- **WHEN** an editor searches for the vần "ưng"
- **THEN** the lessons that teach it are shown

### Requirement: A lesson body is an ordered list of typed sections

A lesson's body SHALL be an ordered list of sections. Each section SHALL have a type chosen from
the fixed vocabulary below, and SHALL hold only the fields belonging to that type.

An editor SHALL be able to add a section of any type at any position, reorder sections, and
remove a section. A type SHALL be usable more than once in the same lesson, and a lesson SHALL
NOT be required to use every type — the source decks repeat drills and vary section counts from
one lesson to the next.

Section types SHALL be named for the instructional sections they represent, in the wording used
in the lessons themselves, so that an editor recognises them without a legend.

The vocabulary SHALL be:

| Type | Section it represents | Holds |
| --- | --- | --- |
| `wordList` | Ôn bài cũ, luyện đọc từ, trò chơi tìm tiếng, đọc nhanh | a heading, a guidance note, and a list of words, each with an optional picture |
| `letterIntro` | Nhận biết âm/vần | the uppercase form, the lowercase form, and example tiếng |
| `spellingSteps` | Đánh vần, tạo tiếng | a list of steps, each breaking a tiếng into its parts and giving the result |
| `toneTable` | Phiếu luyện đọc — sáu thanh | a base âm/vần and its form under each of the six thanh |
| `sentenceReading` | Luyện đọc câu và đoạn | a list of sentences, an optional paragraph, and an optional picture |
| `speakingPrompt` | Luyện nói | a picture and a list of prompting questions |
| `writingPractice` | Luyện viết | the forms to trace and a guidance note |
| `worksheet` | Phiếu luyện đọc & bài tập | free-form rich text, because worksheets vary most between lessons |
| `recap` | Củng cố — em đã học được gì | a list of points learned |
| `homework` | Dặn dò | a list of instructions and a completion checklist |

#### Scenario: Composing a lesson

- **WHEN** an editor builds Bài 48 by adding a `wordList` for ôn bài cũ, a `letterIntro`, a
  `spellingSteps`, two more `wordList` sections for luyện đọc từ, a `sentenceReading`, a
  `speakingPrompt`, a `writingPractice`, a `worksheet`, four `wordList` drills and a `homework`
- **THEN** the lesson holds those sections in that order, and the repeated `wordList` sections
  are each edited separately

#### Scenario: Reordering sections

- **WHEN** an editor moves the `writingPractice` section above the `speakingPrompt` section
- **THEN** the lesson body keeps that new order when saved and reopened

#### Scenario: A lesson that skips a section type

- **WHEN** an editor saves a lesson with no `toneTable` and no `recap` section
- **THEN** the lesson saves, because no section type is required

#### Scenario: Fields are scoped to the section type

- **WHEN** an editor adds a `speakingPrompt` section
- **THEN** they are shown only that section's picture and questions, and none of the fields
  belonging to other section types

### Requirement: Pictures in a lesson are ordinary media uploads

Every picture in a lesson section SHALL be an upload in the CMS's existing media collection,
stored the same way as every other image in the CMS. A KMD lesson SHALL NOT introduce a separate
place to keep images, and an image already in the media collection SHALL be usable in a lesson
without being uploaded again.

#### Scenario: Adding a picture to a word

- **WHEN** an editor attaches a picture to the word "bóng bay" in a `wordList` section
- **THEN** the picture is uploaded into the existing media collection and stored like any other
  CMS image

#### Scenario: Reusing an existing image

- **WHEN** an editor picks an image already in the media collection for a `speakingPrompt`
- **THEN** the lesson uses that image without creating a second copy

### Requirement: Lesson content is entered by hand

Lessons SHALL be created by editors through the CMS. The change SHALL NOT provide any automated
import of the source `.pptx` decks, and no behaviour SHALL depend on those files being present.

#### Scenario: Digitalizing a deck

- **WHEN** an editor digitalizes a source deck
- **THEN** they create the lesson and enter its sections through the CMS, with no import step
