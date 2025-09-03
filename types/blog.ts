export interface BlogPost {
  id: number;
  title: string;
  description: string;
  imgSrc: string;
}

export const blogData: BlogPost[] = [
  {
    id: 1,
    title: "Ali's First Car with DriveXDeals",
    description: `Buying a car has always been a big dream for me. I used to think the process would take weeks, maybe even months — endless showroom visits, long negotiations, and lots of waiting. But with Drive X Deal, everything was surprisingly simple.
When I visited the showroom, the car looked even better than the pictures. The staff was professional, answered all my questions, and helped me with the paperwork immediately. To my surprise, the entire process — from test drive to final delivery — was completed in just three days!
Now, I'm happily driving my dream car on the roads, all thanks to Drive X Deal for making the journey so smooth and hassle-free.`,
    imgSrc: "blog1.png"
  },
  {
    id: 2,
    title: "Zara Upgrades Her Ride",
    description: "Zara needed a reliable car for university. She found a 2019 Civic through our platform and couldn't be happier.",
    imgSrc: "blog2.png",
  },
  {
    id: 3,
    title: "Farhan's Dream Car Found",
    description: "After months of searching, Farhan finally found the exact model he wanted at the best price available online.",
    imgSrc: "blog3.avif",
  },
  {
    id: 4,
    title: "A Family SUV for Ahmed",
    description: "Ahmed wanted a car spacious enough for his growing family. The Civic turned out to be a perfect blend of comfort and efficiency.",
    imgSrc: "blog6.png",
  },
  {
    id: 5,
    title: "Mina's First Purchase Without a Dealer",
    description: "Mina used DriveXDeals to skip dealerships and buy directly from the owner. The process was smooth and trustworthy.",
    imgSrc: "blog3.png",
  },
  {
    id: 6,
    title: "Haris Sold & Bought With Ease",
    description: "Haris sold his old car on DriveXDeals and found a Civic in great condition the very next week.",
    imgSrc: "blog4.png",
  },
  {
    id: 7,
    title: "Noor's Budget-Friendly Car Hunt",
    description: "Noor needed a car under budget, and DriveXDeals showed her exactly what she could afford with no hidden fees.",
    imgSrc: "blog5.png",
  },
  {
    id: 8,
    title: "Sara's Quick Trade-In Experience",
    description: "Sara traded in her old car and drove away with a newer model in less than 24 hours using DriveXDeals.",
    imgSrc: "blog7.png"
  }
];
