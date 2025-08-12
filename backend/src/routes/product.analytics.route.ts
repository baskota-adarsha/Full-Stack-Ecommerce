import { Router } from "express";
import {
  getNumberOfProductsByCategory,
  getNumberOfDeletedProducts,
  getNumberOfLowStockProducts,
} from "../controllers/products-analytics";
const router = Router();

router.get("/", getNumberOfProductsByCategory);
router.get("/numberOfDeletedProducts", getNumberOfDeletedProducts);
router.get("/numberOfLowStockProducts", getNumberOfLowStockProducts);
export default router;
