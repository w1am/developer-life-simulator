"use strict";

import ITEMS from "./items.js";
import { Product, Developer } from "./models.js";

export const product0 = new Product(0, "RDS", ITEMS.amazonServer, 1299, [1, 1]);
export const product1 = new Product(
  1,
  "Azure DB",
  ITEMS.azureServer,
  2999,
  [1, 1]
);
export const product2 = new Product(
  2,
  "Firebase",
  ITEMS.firebaseServer,
  599,
  [1, 1]
);

export const product3 = new Developer(
  3,
  "John",
  ITEMS.developer1,
  30000,
  [3, 2],
  ["Python", "Javascript"],
  5000
);
export const product4 = new Developer(
  4,
  "Isabella",
  ITEMS.developer2,
  15000,
  [3, 2],
  ["SQL", "ReactJS"],
  3000
);
export const product5 = new Developer(
  5,
  "Andrew",
  ITEMS.developer3,
  20000,
  [3, 2],
  ["C++", "Python"],
  2500
);
export const product6 = new Developer(
  6,
  "Bobby",
  ITEMS.developer4,
  75000,
  [3, 2],
  ["Scala", "Java"],
  10000
);
export const product7 = new Developer(
  7,
  "Jade",
  ITEMS.developer5,
  56000,
  [3, 2],
  ["AWS"],
  5000
);
export const product8 = new Developer(
  8,
  "Chris",
  ITEMS.developer6,
  59000,
  [3, 2],
  ["Javascript"],
  8000
);

export const product9 = new Product(9, "Cafe", ITEMS.cafeImage, 45000, [3, 3]);
export const product10 = new Product(
  10,
  "Board Room",
  ITEMS.bordRoomImage,
  25000,
  [3, 2]
);
export const product11 = new Product(
  11,
  "Table Tennis",
  ITEMS.tableTennisImage,
  25000,
  [4, 2]
);
