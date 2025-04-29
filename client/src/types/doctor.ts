export interface Doctor {
  id: number;
  name: string;
  image: string;
  specialization: string;
  internalMedicine: boolean;
  experience: number;
  qualification: string;
  location: string;
  hospital: string;
  price: number;
  cashback: number;
  languages: string[];
  rating: number;
  totalRatings: number;
  availableIn: number;
  isHourDoctor: boolean;
  modes: string[];
  facility?: string;
}

export interface FilterState {
  modes: string[];
  experienceRange: [number, number][];
  priceRange: [number, number][];
  languages: string[];
  facilities: string[];
  search: string;
  page: number;
  limit: number;
  sort: "relevance" | "experience" | "price_low_to_high" | "price_high_to_low" | "rating";
}

export interface DoctorsResponse {
  doctors: Doctor[];
  total: number;
}
