import { z } from "zod";

export const updateProductSchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  price: z.number().nonnegative().optional(),
  stock: z.number().nonnegative().optional(),
  category_id: z.number().nonnegative().optional(),
  is_deleted: z.boolean().optional(),
  image_url: z.string().trim().url().optional(),
  version: z.number().int().positive(),
});
export const searchSchema = z.object({
  query: z.string().min(1),
  minPrice: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  sortBy: z.enum(["price_asc", "price_desc", "best_match"]).optional(),
  limit: z
    .string()
    .default("10")
    .transform((val) => Number(val)),
  page: z
    .string()
    .default("1")
    .transform((val) => Number(val)),
});
export const productIdSchema = z.object({
  id: z
    .string()
    .trim()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: "Product ID must be a number",
    }),
});
export const productCategory = z.object({
  category: z
    .string()
    .trim()
    .transform(
      (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    )
    .pipe(
      z.enum(["Electronics", "Clothes", "Furniture", "Shoes", "Miscellaneous"])
    ),
});
export const createProductSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.number().nonnegative(),
  stock: z.number().nonnegative(),
  category_name: z.enum([
    "Electronics",
    "Clothes",
    "Furniture",
    "Shoes",
    "Miscellaneous",
  ]),
  image_url: z.string(),
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1),
});
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) || val <= 0, {
      message: "Page must be a number and must be greater than 0",
    }),
  limit: z
    .string()
    .optional()
    .default("20")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) || (val > 0 && val <= 100), {
      message: "Limit must be a number and has to be between 1 and 100",
    }),
  sortBy: z.enum(["best_match", "price_asc", "price_desc"]).optional(),
  minPrice: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  category: z
    .enum([
      "all",
      "Electronics",
      "Clothes",
      "Furniture",
      "Shoes",
      "Miscellaneous",
    ])
    .optional(),
  query: z.string().optional(),
});
