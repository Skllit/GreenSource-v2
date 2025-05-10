export type ProductCategory = 
  | 'vegetables'
  | 'fruits'
  | 'dairy'
  | 'poultry'
  | 'meat'
  | 'seafood'
  | 'grains'
  | 'spices'
  | 'oils'
  | 'pickles'
  | 'honey'
  | 'organic';

export type ProductSubCategory = {
  vegetables: 'leafy' | 'root' | 'gourds' | 'beans' | 'other';
  fruits: 'seasonal' | 'tropical' | 'citrus' | 'berries' | 'other';
  dairy: 'milk' | 'curd' | 'butter' | 'cheese' | 'ghee' | 'other';
  poultry: 'chicken' | 'eggs' | 'duck' | 'turkey' | 'other';
  meat: 'mutton' | 'pork' | 'beef' | 'other';
  seafood: 'fish' | 'prawns' | 'crabs' | 'shellfish' | 'other';
  grains: 'rice' | 'wheat' | 'millets' | 'pulses' | 'other';
  spices: 'whole' | 'powder' | 'masala' | 'other';
  oils: 'cooking' | 'essential' | 'other';
  pickles: 'fruit' | 'vegetable' | 'meat' | 'other';
  honey: 'raw' | 'processed' | 'flavored' | 'other';
  organic: 'certified' | 'natural' | 'other';
};

export type FarmerSpecialty = {
  category: ProductCategory;
  subCategory: string;
  description: string;
  certification?: string[];
  yearsOfExperience: number;
};

export type DeliveryVehicle = {
  type: 'bike' | 'auto' | 'truck' | 'lorry';
  capacity: number; // in kg
  range: number; // in km
  costPerKm: number;
};

export type DeliveryAgent = {
  id: string;
  name: string;
  phone: string;
  vehicles: DeliveryVehicle[];
  availablePincodes: string[];
  rating: number;
  isAvailable: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
};

export type FarmerProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  specialties: FarmerSpecialty[];
  dailyProductionCapacity: {
    [key in ProductCategory]?: {
      quantity: number;
      unit: string;
    };
  };
  certifications: string[];
  rating: number;
  isVerified: boolean;
  operatingHours: {
    start: string;
    end: string;
  };
  deliveryRadius: number; // in km
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  subCategory: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  images: string[];
  farmerId: string;
  isOrganic: boolean;
  harvestDate?: Date;
  expiryDate?: Date;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  rating: number;
  reviews: Review[];
  tags: string[];
};

export type Review = {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  date: Date;
  images?: string[];
};

export type Order = {
  id: string;
  consumerId: string;
  farmerId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryAgent?: DeliveryAgent;
  deliveryVehicle?: DeliveryVehicle;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'vegetables',
  'fruits',
  'dairy',
  'poultry',
  'meat',
  'seafood',
  'grains',
  'spices',
  'oils',
  'pickles',
  'honey',
  'organic'
]; 