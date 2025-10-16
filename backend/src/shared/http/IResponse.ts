export interface IResponse<T> {
  status: number;
  data: T;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
}
