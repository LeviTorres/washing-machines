export interface Rent {
  id?: string;
  client: string;
  machine: string;
  start_date: number;
  finish_date: number;
  requested_date?: number;
  delivered_date?: number;
  canceled_date?: number;
  collect_date?: number;
  status: 'delivered' | 'canceled' | 'waiting_to_deliver' | 'collect';
}
