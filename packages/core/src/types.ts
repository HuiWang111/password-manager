export interface PM {
  id: string;
  account: string;
  password: string;
  board: string;
}

export interface PMStorage {
  save: (list: PM[]) => void;
  getList: () => PM[];
  getArchive: () => PM[];
  saveArchive: (list: PM[]) => void;
}
