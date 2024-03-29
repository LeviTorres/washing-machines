export interface Client {
  id?: string;
  name: string;
  email?: string;
  phone_number: string;
  street: string;
  suburb: string;
  postal_code?: string;
  number_house: string;
  observations: string;
  status: 'available' | 'busy';
  image_credential?: any;
}
