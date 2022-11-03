export interface User {
  id?: string;
  name: string;
  last_name: string;
  rol: 'ADMIN';
  email: string;
  password: string;
  image_employee?: any;
}
