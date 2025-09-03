"use client";
// Car Section Data
export interface CarSectionItem {
  id: number;
  images: string[];
  title: string;
  sub_title: string;
  num: number;
  num2: string;
  num3: string;
  price: string;
  amount_price: string;
  sub_price: string;
  engine: string;
  auction_grade: string;
  assembly: string;
  imported_year: string;
  mileage: string;
  color: string;
  interior_color: string;
}

export const carSectionData: CarSectionItem[] = [
  {
    id: 1,
    images: ["/honda-civic-2019.png", "/toyota-camry-2020.png", "/ford-f-150-2021.png"],
    title: "Honda Civic 2019",
    sub_title: "Reliable Sedan",
    num: 5,
    num2: "Petrol",
    num3: "180 km/h",
    price: "Price",
    amount_price: "PKR 45,000",
    sub_price: "PKR 50,000",
    engine: "1.5L Turbo",
    auction_grade: "4.5",
    assembly: "Local",
    imported_year: "2019",
    mileage: "25,000 km",
    color: "White",
    interior_color: "Black"
  },
  {
    id: 2,
    images: ["/toyota-camry-2020.png", "/honda-civic-2019.png", "/ford-f-150-2021.png"],
    title: "Toyota Camry 2020",
    sub_title: "Executive Sedan",
    num: 5,
    num2: "Hybrid",
    num3: "200 km/h",
    price: "Price",
    amount_price: "PKR 65,000",
    sub_price: "PKR 70,000",
    engine: "2.5L Hybrid",
    auction_grade: "4.8",
    assembly: "Imported",
    imported_year: "2020",
    mileage: "15,000 km",
    color: "Silver",
    interior_color: "Beige"
  },
  {
    id: 3,
    images: ["/ford-f-150-2021.png", "/honda-civic-2019.png", "/toyota-camry-2020.png"],
    title: "Ford F-150 2021",
    sub_title: "Powerful Truck",
    num: 5,
    num2: "Petrol",
    num3: "160 km/h",
    price: "Price",
    amount_price: "PKR 85,000",
    sub_price: "PKR 90,000",
    engine: "3.5L V6",
    auction_grade: "4.6",
    assembly: "Imported",
    imported_year: "2021",
    mileage: "12,000 km",
    color: "Blue",
    interior_color: "Black"
  },
  {
    id: 4,
    images: ["/car1.png", "/honda-civic-2019.png", "/toyota-camry-2020.png"],
    title: "BMW X5 2020",
    sub_title: "Luxury SUV",
    num: 7,
    num2: "Diesel",
    num3: "240 km/h",
    price: "Price",
    amount_price: "PKR 120,000",
    sub_price: "PKR 130,000",
    engine: "3.0L Diesel",
    auction_grade: "4.9",
    assembly: "Imported",
    imported_year: "2020",
    mileage: "8,000 km",
    color: "Black",
    interior_color: "Brown"
  }
];
