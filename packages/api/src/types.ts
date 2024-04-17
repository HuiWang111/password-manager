export interface IAccountData {
  account: string
  password: string
  board?: string
  remark?: string
}

export interface IEditAccountParams {
  id: string;
  remark?: string;
  password?: string;
  board?: string;
}

export interface IGetListParams {
  ids?: string[];
  mask?: string;
  reverse?: string;
  original?: string;
}
