// components/productSection/productData.ts

import car1_img1 from "@/public/car1.png";
import car1_img2 from "@/public/heroCar.png";
import car1_img3 from "@/public/white_car.jpg";
import car1_img4 from "@/public/toyota-camry-2020.png";
import car1_img5 from "@/public/car1.png";

import car2_img1 from "@/public/car1.png";
import car2_img2 from "@/public/car1.png";
import car2_img3 from "@/public/car1.png";
import car2_img4 from "@/public/car1.png";
import car2_img5 from "@/public/car1.png";

// ... same for car3_img1..5, car4_img1..5, etc.

// Then your productData array:
const productData = [
  {
    id: 1,
    images: [car1_img1, car1_img2, car1_img3, car1_img4, car1_img5],
    title: "Honda Tirtiga",
    sub_title: "Automatic",
    num: 4,
    num2: "2.0 CC",
    num3: "5.0G",
    amount_price: "PKR 200,000",
    sub_price: "PKR 350,000",
    engine: "M16A-345678",
    auction_grade: 5,
    assembly: "Imported",
    imported_year: 2021,
    mileage: "15k",
    color: "Red",
    interior_color: "Black",
    features: [
      "Push Start",
      "Cruise Control",
      "Alloy Rims",
      "Reverse Camera",
      "Leather Seats",
      "ABS Brakes",
    ],
  },
    {
    id: 1,
    images: [car1_img1, car1_img2, car1_img3, car1_img4, car1_img5],
    title: "Honda Tirtiga",
    sub_title: "Automatic",
    num: 4,
    num2: "2.0 CC",
    num3: "5.0G",
    amount_price: "PKR 200,000",
    sub_price: "PKR 350,000",
    engine: "M16A-345678",
    auction_grade: 5,
    assembly: "Imported",
    imported_year: 2021,
    mileage: "15k",
    color: "Red",
    interior_color: "Black",
    features: [
      "Push Start",
      "Cruise Control",
      "Alloy Rims",
      "Reverse Camera",
      "Leather Seats",
      "ABS Brakes",
    ],
  },
    {
    id: 1,
    images: [car1_img1, car1_img2, car1_img3, car1_img4, car1_img5],
    title: "Honda Tirtiga",
    sub_title: "Automatic",
    num: 4,
    num2: "2.0 CC",
    num3: "5.0G",
    amount_price: "PKR 200,000",
    sub_price: "PKR 350,000",
    engine: "M16A-345678",
    auction_grade: 5,
    assembly: "Imported",
    imported_year: 2021,
    mileage: "15k",
    color: "Red",
    interior_color: "Black",
    features: [
      "Push Start",
      "Cruise Control",
      "Alloy Rims",
      "Reverse Camera",
      "Leather Seats",
      "ABS Brakes",
    ],
  },
  {
    id: 2,
    images: [car2_img1, car2_img2, car2_img3, car2_img4, car2_img5],
    title: "Toyota Corolla",
    sub_title: "Manual",
    num: 4,
    num2: "1.8 CC",
    num3: "4.0G",
    amount_price: "PKR 250,000",
    sub_price: "PKR 350,000",
    engine: "E20A-123456",
    auction_grade: 4,
    assembly: "Local",
    imported_year: 2020,
    mileage: "20k",
    color: "Blue",
    interior_color: "Grey",
    features: [
      "Push Start",
      "Cruise Control",
      "Alloy Rims",
      "Reverse Camera",
      "Leather Seats",
      "ABS Brakes",
    ],
  },
  // ... and so on for other cars
];

export default productData;
