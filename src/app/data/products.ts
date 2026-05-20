import { Product, getAllProducts, getProductById } from "../utils/myDatabase";

// Re-export types and functions from myDatabase
export type { Product };
export { getAllProducts, getProductById };

// Category list - static export
export const categories = [
  "All",
  "Audio",
  "Wearables",
  "Computers",
  "Cameras",
  "Phones",
  "Tablets",
  "Others",
];
