export interface OpeningHourDTO {
  id: number;
  dayOfWeek: number;
  openingTime: string;
  closingTime: string;
}

export interface RestaurantCreateDTO {
  name: string;
  description: string;
  address: string;
  contactNumber: string;
  abn: string;
  ownerName: string;
  ownerMobile: string;
  ownerAddress: string;
  ownerEmail: string;
  ownerCrn: string;
  openingHours: OpeningHourDTO[];
}

export interface RestaurantGetDTO {
  restaurantId: number;
  name: string;
  description: string;
  address: string;
  contactNumber: string;
  abn: string;
  ownerName: string;
  ownerMobile: string;
  ownerAddress: string;
  ownerEmail: string;
  ownerCrn: string;
  averageRating: number;
  openingHours: OpeningHourDTO[];
}

export interface RestaurantUpdateDTO {
  name?: string;
  description?: string;
  address?: string;
  contactNumber?: string;
  abn?: string;
  ownerName?: string;
  ownerMobile?: string;
  ownerAddress?: string;
  ownerEmail?: string;
  ownerCrn?: string;
  openingHours?: OpeningHourDTO[];
}
