import { Router } from "express";
import {
  getAllProducts,
  bulkHardDelete,
  bulkSoftDelete,
  createProduct,
  getProductByCategory,
  getProductById,
  hardDeleteProduct,
  removeProduct,
  restoreMany,
  restoreProduct,
  searchProducts,
  updateProduct,
  categoryNotProvided,
} from "../controllers/product.controller";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middlewares/validateBody";
import {
  bulkDeleteSchema,
  createProductSchema,
  paginationSchema,
  productCategory,
  productIdSchema,
  searchSchema,
  updateProductSchema,
} from "../schema/product.schema";
import { requireAuth } from "@clerk/express";

const router = Router();

// Bulk operations (protected routes)
router.patch(
  "/soft-delete-many",
  requireAuth(),
  validateBody(bulkDeleteSchema),
  bulkSoftDelete
);

router.delete(
  "/hard-delete-many",
  requireAuth(),
  validateBody(bulkDeleteSchema),
  bulkHardDelete
);

router.patch(
  "/restore-many",
  requireAuth(),
  validateBody(bulkDeleteSchema),
  restoreMany
);

// Search and filtering (public routes)
router.get("/search", validateQuery(searchSchema), searchProducts);

router.get("/category", categoryNotProvided);
router.get(
  "/category/:category",
  validateParams(productCategory),
  validateQuery(paginationSchema),
  getProductByCategory
);

// Single product operations
router.post(
  "/",
  requireAuth(),
  validateBody(createProductSchema),
  createProduct
);

router.get("/", validateQuery(paginationSchema), getAllProducts);
router.get("/:id", validateParams(productIdSchema), getProductById);

router.delete(
  "/:id",
  requireAuth(),
  validateParams(productIdSchema),
  hardDeleteProduct
);

router.patch(
  "/:id/soft-delete",
  requireAuth(),
  validateParams(productIdSchema),
  removeProduct
);

router.patch(
  "/:id/update",
  requireAuth(),
  validateParams(productIdSchema),
  validateBody(updateProductSchema),
  updateProduct
);

router.patch(
  "/:id/restore",
  requireAuth(),
  validateParams(productIdSchema),
  restoreProduct
);

export default router;
