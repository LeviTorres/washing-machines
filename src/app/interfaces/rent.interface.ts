export interface Rent {
  id?: string;
  client: string;
  machine: string;
  start_date: number;
  finish_date: number;
  status: 'rented';
}
