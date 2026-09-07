import type { BaiKmd } from '@/payload-types'
import type { LessonDoc } from '@ttv/lesson-render'

// Type-only: fails the CMS type-check if Payload's generated `BaiKmd` stops satisfying the
// package's structural `LessonDoc` (see packages/lesson-render/src/types.ts), which is what lets
// `Lesson` render both the CMS preview and the public page without either side importing the
// other's types.
const _assertBaiKmdIsLessonDoc: (lesson: BaiKmd) => LessonDoc = (lesson) => lesson
void _assertBaiKmdIsLessonDoc
