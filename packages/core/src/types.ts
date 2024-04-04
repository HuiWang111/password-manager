export interface PM {
  id: string;
  account: string;
  password: string;
  board: string;
  remark: string;
  isArchived?: boolean;
}

export interface PMStorage {
  save: (list: PM[]) => Promise<void>;
  getList: () => Promise<PM[]>;
  getArchive: () => Promise<PM[]>;
  saveArchive: (list: PM[]) => Promise<void>;
  getConfig: () => Promise<any>;
  setConfig: (config: any) => Promise<void>;
  export: (content: PM[], dest: string) => Promise<void>;
}
