## ADDED Requirements

### Requirement: A lesson has a slug that is its public address

A lesson SHALL carry a slug. The slug SHALL be the address the lesson is read at outside the CMS.

The slug SHALL be unique across lessons, and SHALL be derived from the lesson's name when an
editor leaves it blank, with Vietnamese diacritics reduced to plain ASCII so it is safe to type
and to share. An editor SHALL be able to override the derived slug.

A lesson's slug SHALL NOT change on its own once set, because it is the address people share.
Renaming a lesson SHALL leave its slug alone.

The slug SHALL NOT carry any notion of sequence. The order lessons are taught in stays with the
arrangement editors give them, and the slug says only which lesson this is.

#### Scenario: A slug derived from the name

- **WHEN** an editor creates a lesson named "ONG – ÔNG – UNG – ƯNG" and leaves the slug blank
- **THEN** the lesson is saved with the slug `ong-ong-ung-ung`

#### Scenario: A slug already in use

- **WHEN** an editor saves a lesson whose slug another lesson already has
- **THEN** the save is rejected and the editor is told the address is taken

#### Scenario: Choosing a different address

- **WHEN** an editor replaces a derived slug with one of their own
- **THEN** the lesson keeps the slug the editor entered

#### Scenario: Renaming a lesson

- **WHEN** an editor changes the name of a lesson that already has a slug
- **THEN** the slug is left as it was, so links already shared keep working

### Requirement: A lesson is readable by the public only when its editor says so

Each lesson SHALL carry a visibility flag. A newly created lesson SHALL start not visible.

A lesson that is not visible SHALL NOT be readable by the public, and SHALL be readable by a
signed-in CMS user, so that a lesson can be entered over several sittings without appearing
half-finished to a reader.

Marking a lesson visible SHALL be a single action an editor takes when the lesson is ready. The
system SHALL NOT require a separate draft-and-publish workflow, and SHALL NOT keep a history of
earlier versions of a lesson.

#### Scenario: A lesson being written

- **WHEN** an editor creates a lesson and enters half of its sections
- **THEN** the lesson is not visible, and a request for it from outside the CMS finds nothing

#### Scenario: Making a lesson visible

- **WHEN** an editor marks a finished lesson as visible
- **THEN** the public can read it at its slug from that point on

#### Scenario: Withdrawing a lesson

- **WHEN** an editor clears the visibility flag on a lesson that was visible
- **THEN** the public can no longer read it, and its content is left untouched
