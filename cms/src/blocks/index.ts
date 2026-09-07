import type { Block } from 'payload'

import { FreeText } from './FreeText'

// The block vocabulary a KMD lesson body is composed from. Down to one type — free-form rich
// text — after the ten-type instructional-section vocabulary was dropped; a lesson is now a
// reorderable list of rich-text sections rather than typed slides. Still a `blocks` field, not
// a plain `richText` field, so KmdBlocksField.tsx's slide list/reorder/add/remove behaviour
// keeps working unchanged.
export const KMD_BLOCKS: Block[] = [FreeText]
