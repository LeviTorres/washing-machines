export interface Client {
  id?: string
  name: string
  last_name: string
  email: string
  phone_number: string
  street: string
  suburb: string
  postal_code: string
  number_house: string
  observations: string
  status: 'available',
  image_credential?: any;
}
