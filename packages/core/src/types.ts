export interface PM {
  id: string;
  account: string;
  password: string;
  board: string;
  remark: string;
  isArchived?: boolean;
}

export interface PMStorage {
  save: (list: PM[]) => void;
  getList: () => PM[];
  getArchive: () => PM[];
  saveArchive: (list: PM[]) => void;
  getConfig: () => any;
  setConfig: (config: any) => void;
  export: (content: string, dest: string) => void;
}
