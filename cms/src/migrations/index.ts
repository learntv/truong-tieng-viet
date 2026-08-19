import * as migration_20260819_082806_initial from './20260819_082806_initial';

export const migrations = [
  {
    up: migration_20260819_082806_initial.up,
    down: migration_20260819_082806_initial.down,
    name: '20260819_082806_initial'
  },
];
