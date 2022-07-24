import type { BooleanFlag, AnyFlags } from 'meow'

export interface PMFlags extends AnyFlags {
  create: BooleanFlag;
  delete: BooleanFlag;
  copy: BooleanFlag;
  show: BooleanFlag;
  remark: BooleanFlag;
  help: BooleanFlag;
  find: BooleanFlag;
  move: BooleanFlag;
  archive: BooleanFlag;
  edit: BooleanFlag;
  restore: BooleanFlag;
  version: BooleanFlag;
  clean: BooleanFlag;
}

export interface RenderGridOptions {
  beforeWarning?: string
}