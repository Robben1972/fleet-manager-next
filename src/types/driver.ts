export interface Driver {
  id: number;
  telegram_id: number;
  fullname: string;
  username: string;
  phone_number: string;
  phone_number2?: string;
  car_model: string;
  weight: number;
  lang: string;
  
  car_image_back: string;
  car_image_front: string;
  car_image_side: string;
  car_image_side2: string;
  car_image_inside: string;
  
  technical_passport_front: string;
  technical_passport_back: string;
  
  driving_licence_front: string;
  driving_licence_back: string;
  
  passport_front: string;
  passport_back: string;
  
  own_picture: string;
  
  longitude?: number;
  latitude?: number;
  is_active: boolean;
  is_online: boolean;
  is_free: boolean;
  created_at: string;
  updated_at: string;
}

export interface DriversResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Driver[];
}

export interface FieldOption {
  label: string;
  value: string;
}
