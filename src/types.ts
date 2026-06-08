export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  image: string;
  bio: string;
  availableHours: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  basePrice: number;
  durationMinutes: number;
}

export interface Booking {
  id: string;
  doctorId: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  notes?: string;
}

export interface Review {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number;
  text: string;
  date: string;
  tag: string;
}

export interface SymptomResult {
  title: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
  suggestedServiceId: string;
}
