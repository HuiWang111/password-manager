export type PartialPart<T, U extends keyof T> = Omit<T, U> & {
  [P in U]?: T[P]
}

export interface PM {
  id: string;
  account: string;
  password: string;
  board: string;
}

export interface PMStorage {
  save: (list: PM[]) => Promise<void>;
  getList: () => Promise<PM[]>;
  getArchive: () => Promise<PM[]>;
  saveArchive: (list: PM[]) => Promise<void>;
}
