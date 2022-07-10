import type { BooleanFlag, AnyFlags } from 'meow'

export interface PMConfig {
  pmDirectory: string;
}

export interface PMFlags extends AnyFlags {
  create: BooleanFlag;
  delete: BooleanFlag;
  copy: BooleanFlag;
  show: BooleanFlag;
  help: BooleanFlag;
  find: BooleanFlag;
  move: BooleanFlag;
  archive: BooleanFlag;
  edit: BooleanFlag;
  restore: BooleanFlag;
  version: BooleanFlag;
}