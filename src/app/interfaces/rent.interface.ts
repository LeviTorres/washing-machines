export interface Rent {
  id?: string;
  client: string;
  start_date: number;
  finish_date: number;
  requested_date?: number;
  delivered_date?: number;
  canceled_date?: number;
  collect_date?: number;
  requested_user?: string;
  delivered_user?: string;
  canceled_user?:string;
  collect_user?: string;
  status: 'ACTIVA' | 'CERRADA' | 'PROXIMO A VENCER' | 'VENCIDA';
}
