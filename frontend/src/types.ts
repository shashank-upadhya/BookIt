// Types for the HD Booking application

export interface Experience {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  price: number;
  duration: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  availability: DateAvailability[];
}

export interface DateAvailability {
  date: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  available: number;
  total: number;
}

export interface BookingData {
  experienceId: string;
  experienceTitle: string;
  experienceImage: string;
  price: number;
  selectedDate: string;
  selectedSlot: string;
  participants: number;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
}

export interface BookingResult {
  success: boolean;
  booking?: {
    id: string;
    experienceTitle: string;
    date: string;
    time: string;
    participants: number;
    total: number;
    status: string;
  };
  error?: string;
}

export interface PromoValidationResponse {
  valid: boolean;
  discount: number;
  type?: string;
  value?: number;
  message: string;
}

export interface BookingRequest {
  experienceId: string;
  selectedDate: string;
  selectedSlot: string;
  name: string;
  email: string;
  phone: string;
  participants: number;
  promoCode: string;
  discount: number;
  subtotal: number;
  total: number;
}
