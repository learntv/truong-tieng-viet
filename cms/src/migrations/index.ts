import * as migration_20260819_082806_initial from './20260819_082806_initial';
import * as migration_20260821_065040_learning_tree from './20260821_065040_learning_tree';
import * as migration_20260821_072301_bai_title from './20260821_072301_bai_title';
import * as migration_20260821_074714_remove_bai_texts from './20260821_074714_remove_bai_texts';

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
    name: '20260821_074714_remove_bai_texts'
  },
];
