import { Document, Types } from 'mongoose';

// Batch Types
export interface IBatch extends Document {
  batchNo: string;
  countryOfOrigin: string;
  flagImage: string;
  investors: Types.ObjectId[];
  cars: Types.ObjectId[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Car Types
export interface ICar extends Document {
  carName: string;
  company: string;
  carType: 'SUV' | 'Sedan' | 'Hatchback' | 'Truck' | 'Van' | 'Kei' | 'Other';
  carSegment: string;
  engineNumber: string;
  chasisNumber: string;
  auctionGrade: number;
  importYear: number;
  manufacturingYear: number;
  assembly: 'Import' | 'Local' | 'CKD' | 'CBU' | 'JDM';
  engineCapacity: string;
  engineType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric' | 'Plug-in Hybrid' | 'CNG' | 'LPG';
  interiorColor: string;
  mileage: string;
  keywords: string[];
  features: string[];
  status: 'sold' | 'transit' | 'warehouse' | 'showroom';
  exteriorColor: string;
  deliveryTimeframe: string;
  batchNo: string;
  description: string;
  financing: {
    originCity: string;
    destinationCity: string;
    auctionPrice: {
      amount: number;
      rate: number;
      totalAmount: number;
    };
    auctionExpenses: {
      amount: number;
      rate: number;
      totalAmount: number;
    };
    inlandCharges: {
      amount: number;
      rate: number;
      totalAmount: number;
    };
    loadingCharges: {
      amount: number;
      rate: number;
      totalAmount: number;
    };
    containerCharges: {
      amount: number;
      rate: number;
      totalAmount: number;
    };
    freightSea: {
      amount: number;
      rate: number;
      totalAmount: number;
    };
    variantDuty: number;
    passportCharges: number;
    servicesCharges: number;
    transportCharges: number;
    repairCharges: number;
    miscellaneousCharges: number;
    vehicleValueCif: number;
    landingCharges: number;
    customsDuty: number;
    salesTax: number;
    federalExciseDuty: number;
    incomeTax: number;
    freightAndStorageCharges: number;
    demurage: number;
    ageOfVehicle: number;
  };
  saleInfo?: {
    soldPrice?: number;
    soldDate?: Date;
    buyerInfo?: {
      name?: string;
      contactNumber?: string;
      emailAddress?: string;
      cnic?: string;
    };
  };
  images: {
    invoiceReceipt: string;
    coverPhoto: string;
    auctionSheet: string;
    carPictures: string[];
  };
  notes?: string;
  isFeatured: boolean;
  totalCost?: number; // Virtual field
  createdAt: Date;
  updatedAt: Date;
}

// Input Types for API
export interface CreateBatchInput {
  batchNo: string;
  countryOfOrigin: string;
  flagImage: string;
  investors?: Types.ObjectId[];
  cars?: Types.ObjectId[];
  notes?: string;
}

export interface CreateCarInput {
  carName: string;
  company: string;
  carType: 'SUV' | 'Sedan' | 'Hatchback' | 'Truck' | 'Van' | 'Kei' | 'Other';
  carSegment: string;
  engineNumber: string;
  chasisNumber: string;
  auctionGrade: number;
  importYear: number;
  manufacturingYear: number;
  assembly: 'Import' | 'Local' | 'CKD' | 'CBU' | 'JDM';
  engineCapacity: string;
  engineType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric' | 'Plug-in Hybrid' | 'CNG' | 'LPG';
  interiorColor: string;
  mileage: string;
  keywords?: string[];
  features?: string[];
  status?: 'sold' | 'transit' | 'warehouse' | 'showroom';
  color: string;
  deliveryTimeframe: string;
  batchNo: string;
  description: string;
  financing: {
    originCity: string;
    destinationCity: string;
    auctionPrice: {
      amount: number;
      rate: number;
      totalAmount: number;
    };
    auctionExpenses: {
      amount: number;
      rate: number;
      totalAmount: number;
    };
    inlandCharges: {
      amount: number;
      rate: number;
      totalAmount: number;
    };
    loadingCharges: {
      amount: number;
      rate: number;
      totalAmount: number;
    };
    containerCharges: {
      amount: number;
      rate: number;
      totalAmount: number;
    };
    freightSea: {
      amount: number;
      rate: number;
      totalAmount: number;
    };
    variantDuty: number;
    passportCharges: number;
    servicesCharges: number;
    transportCharges: number;
    repairCharges: number;
    miscellaneousCharges: number;
    vehicleValueCif: number;
    landingCharges: number;
    customsDuty: number;
    salesTax: number;
    federalExciseDuty: number;
    incomeTax: number;
    freightAndStorageCharges: number;
    demurage: number;
    ageOfVehicle: number;
  };
  images: {
    invoiceReceipt: string;
    coverPhoto: string;
    auctionSheet: string;
    carPictures: string[];
  };
  notes?: string;
  isFeatured?: boolean;
}

export interface UpdateCarInput extends Partial<CreateCarInput> {
  status?: 'sold' | 'transit' | 'warehouse' | 'showroom';
  saleInfo?: {
    soldPrice: number;
    soldDate: Date;
    buyerInfo: {
      name: string;
      contactNumber: string;
      emailAddress: string;
      cnic: string;
    };
  };
}
