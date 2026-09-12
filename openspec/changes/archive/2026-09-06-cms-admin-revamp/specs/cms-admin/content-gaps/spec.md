## Purpose

Making unfinished content findable: what it means for a bài to hold nothing a student could use,
how such a bài is marked, and how the count of them rolls up so a teacher can find them without
opening every document.

## ADDED Requirements

### Requirement: One definition of a bài that holds nothing

A bài SHALL be reported as holding nothing when it has no hình and none of the three attachments
— audio, video, link — set. Any one of those makes it not empty.

A hình row with no image attached SHALL NOT count as content, and an attachment whose value is
blank or whitespace SHALL NOT count as set.

Every surface that reports this condition SHALL apply the same definition, so that the marker on
a row and the counts above it can never disagree.

#### Scenario: A bài with only a link

- **WHEN** a bài has no hình but has a link set
- **THEN** it is not reported as holding nothing, on any surface

#### Scenario: A bài with an empty hình row

- **WHEN** a bài has a hình row whose image has not yet been attached, and nothing else
- **THEN** it is reported as holding nothing

#### Scenario: The same bài seen from two places

- **WHEN** the same bài is judged on its own row and counted on the chặng tab above it
- **THEN** both agree on whether it holds nothing

### Requirement: A bài that holds nothing is marked on its row

A bài reported as holding nothing SHALL be marked on its row, distinctly from the way a selected
or focused row is marked, so that "needs attention" is never mistaken for "chosen".

#### Scenario: The marker appears and clears

- **WHEN** an editor adds a picture to a bài that was marked as holding nothing
- **THEN** the marker clears immediately, before the document is saved

#### Scenario: Not confusable with selection

- **WHEN** a bài that holds nothing sits next to a bài that is currently selected
- **THEN** the two rows are visibly distinguished from one another

### Requirement: The count rolls up to chặng and chủ đề

A chặng SHALL show how many bài it holds that hold nothing. A quyển's chủ đề cards SHALL each
show how many such bài that chủ đề holds. A chặng or chủ đề with none SHALL show no count rather
than a zero.

The chặng count SHALL reflect unsaved edits. The chủ đề count reflects what is stored.

#### Scenario: Finding the gaps in a quyển

- **WHEN** an editor opens a quyển whose chủ đề between them hold twelve bài with nothing in them
- **THEN** the cards of the chủ đề that hold them show their counts, and the cards of the chủ đề
  that hold none show no count

#### Scenario: The chặng count updates before saving

- **WHEN** an editor fills the last bài in a chặng that was showing a count of one
- **THEN** the count disappears from that chặng immediately, without saving

### Requirement: Reading the counts does not fetch the content

Opening a quyển SHALL NOT transfer the chặng, nội dung, bài and hình beneath its chủ đề in order
to display their counts.

#### Scenario: Opening a quyển

- **WHEN** an editor opens a quyển with dozens of chủ đề
- **THEN** the page obtains its counts without transferring the content tree beneath each chủ đề
