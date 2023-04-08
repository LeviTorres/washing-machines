export interface Dryer {
  id?: string
  key_dryer: string
  description:string
  image_dryer?: any;
  status: 'available' | 'busy'
}
