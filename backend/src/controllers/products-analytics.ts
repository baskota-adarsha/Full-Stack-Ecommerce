import { Request, Response, NextFunction } from "express";
import { supabase } from "../utils/supabaseClient";
import { createError } from "../utils/errorFactory";

export async function getNumberOfProductsByCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { data, error } = await supabase.rpc("get_products_by_category");

    if (error || !data?.length) {
      throw createError("Database error", 500);
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}
export async function getNumberOfDeletedProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { error, count } = await supabase
      .from("products")
      .select("id", { count: "exact" })
      .eq("is_deleted", true);

    if (error) {
      throw createError("Database error", 500);
    }

    res.status(200).json({ totalNumberOfDeletedProducts: count });
  } catch (error) {
    next(error);
  }
}
export async function getNumberOfLowStockProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { data, error, count } = await supabase
      .from("products")
      .select("id", { count: "exact" })

      .eq("is_deleted", false)
      .lt("stock", 10);
    if (error || !data?.length) {
      throw createError("Database error", 500);
    }

    res.status(200).json({ totalNumberOfLowStockProducts: count });
  } catch (error) {
    next(error);
  }
}
