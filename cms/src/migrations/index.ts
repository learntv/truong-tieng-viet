import * as migration_20260819_082806_initial from './20260819_082806_initial';
import * as migration_20260821_065040_learning_tree from './20260821_065040_learning_tree';
import * as migration_20260821_072301_bai_title from './20260821_072301_bai_title';
import * as migration_20260821_074714_remove_bai_texts from './20260821_074714_remove_bai_texts';
import * as migration_20260821_082037_bai_audio_upload from './20260821_082037_bai_audio_upload';
import * as migration_20260906_093223_kmd_lessons from './20260906_093223_kmd_lessons';
import * as migration_20260907_120010_kmd_lesson_slug_visibility from './20260907_120010_kmd_lesson_slug_visibility';
import * as migration_20260907_133024_remove_kmd_lesson_visibility from './20260907_133024_remove_kmd_lesson_visibility';

export const migrations = [
  {
    up: migration_20260819_082806_initial.up,
    down: migration_20260819_082806_initial.down,
    name: '20260819_082806_initial',
  },
  {
    up: migration_20260821_065040_learning_tree.up,
    down: migration_20260821_065040_learning_tree.down,
    name: '20260821_065040_learning_tree',
  },
  {
    up: migration_20260821_072301_bai_title.up,
    down: migration_20260821_072301_bai_title.down,
    name: '20260821_072301_bai_title',
  },
  {
    up: migration_20260821_074714_remove_bai_texts.up,
    down: migration_20260821_074714_remove_bai_texts.down,
    name: '20260821_074714_remove_bai_texts',
  },
  {
    up: migration_20260821_082037_bai_audio_upload.up,
    down: migration_20260821_082037_bai_audio_upload.down,
    name: '20260821_082037_bai_audio_upload',
  },
  {
    up: migration_20260906_093223_kmd_lessons.up,
    down: migration_20260906_093223_kmd_lessons.down,
    name: '20260906_093223_kmd_lessons',
  },
  {
    up: migration_20260907_120010_kmd_lesson_slug_visibility.up,
    down: migration_20260907_120010_kmd_lesson_slug_visibility.down,
    name: '20260907_120010_kmd_lesson_slug_visibility',
  },
  {
    up: migration_20260907_133024_remove_kmd_lesson_visibility.up,
    down: migration_20260907_133024_remove_kmd_lesson_visibility.down,
    name: '20260907_133024_remove_kmd_lesson_visibility'
  },
];
