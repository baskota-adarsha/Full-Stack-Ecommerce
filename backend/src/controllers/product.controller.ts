import { Response, Request, NextFunction } from "express";
import { supabase } from "../utils/supabaseClient";
import { createError } from "../utils/errorFactory";
import { checkProductExists } from "../utils/validators";
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id, name, description, version,stock, price, image_url,is_deleted ,version,
        categories ( name )
      `
      )
      .eq("id", id)

      .maybeSingle();
    if (error) {
      throw createError("Failed to fetch product", 500);
    }
    if (!data) {
      throw createError(
        `The product with the id ${id} does not exist or is already soft deleted`,
        404
      );
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getProductByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category } = req.params;
    const { sortBy = "best_match" } = req.query;
    const { page, limit, minPrice, maxPrice } = (req as any).validatedQuery;
    const offset = (page - 1) * limit;

    console.log("Sort parameter received:", sortBy); // Debug log

    let supaQuery = supabase
      .from("products")
      .select(
        `
        id, name, description, version, stock, price, image_url, is_deleted, version,
        categories:categories!inner(name)
        `,
        { count: "exact" }
      )
      .eq("categories.name", category)
      .eq("is_deleted", false);

    // Price filters
    if (minPrice) {
      supaQuery = supaQuery.gte("price", Number(minPrice));
    }
    if (maxPrice) {
      supaQuery = supaQuery.lte("price", Number(maxPrice));
    }

    // Apply sorting based on orderBy parameter
    console.log("Applying sorting for:", sortBy); // Debug log
    switch (sortBy) {
      case "price_desc":
        console.log("Sorting by price descending"); // Debug log
        supaQuery = supaQuery.order("price", { ascending: false });
        break;
      case "price_asc":
        console.log("Sorting by price ascending"); // Debug log
        supaQuery = supaQuery.order("price", { ascending: true });
        break;
      case "best_match":
      default:
        console.log("Sorting by name (default)"); // Debug log
        supaQuery = supaQuery.order("name", { ascending: true });
        break;
    }

    // Apply pagination
    const { data, error, count } = await supaQuery.range(
      offset,
      offset + limit - 1
    );

    // Debug: log the first few prices to see the order
    if (data && data.length > 0) {
      console.log(
        "First 5 prices in result:",
        data.slice(0, 5).map((p) => ({ name: p.name, price: p.price }))
      );
    }

    if (!data || data.length === 0) {
      throw createError("No products found", 404);
    }
    if (error) {
      console.error("Supabase error:", error); // Debug log
      throw createError("Failed to get products by category", 500);
    }

    res.status(200).json({
      data,
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count ? count / limit : 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const removeProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .update({
        is_deleted: true,
      })
      .eq("id", id)
      .eq("is_deleted", false)
      .select();

    if (error) {
      throw createError("Database error", 500);
    }

    if (!data?.length) {
      // Distinguish between "already deleted" vs "never existed"
      const exists = await checkProductExists(Number(id));
      throw createError(
        exists ? "Product already deleted" : "Product not found",
        exists ? 409 : 404
      );
    }

    res.status(200).json({
      success: true,
      message: "Product soft deleted",
      data: data[0],
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { version, ...updateData } = req.body;

    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("id, version, is_deleted")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) throw createError("Database error", 500);
    if (!existingProduct) throw createError(`Product ${id} not found`, 404);
    if (existingProduct.is_deleted)
      throw createError(`Product ${id} was  soft deleted`, 410);

    // 2. Check version match (if provided)
    if (version !== undefined && existingProduct.version !== version) {
      throw createError("Version conflict - please refresh", 409);
    }

    // 3. Perform the update
    const { data, error } = await supabase
      .from("products")
      .update({
        ...updateData,
        version: existingProduct.version + 1,
      })
      .eq("id", id)
      .eq("version", existingProduct.version)
      .select();

    if (error) throw createError("Update failed", 500);
    if (!data?.length) throw createError("Update conflict - please retry", 409);

    res.status(200).json({
      success: true,
      data: data[0],
      newVersion: data[0].version,
    });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    query,
    minPrice,
    maxPrice,
    sortBy = "best_match",
    limit = "10",
    page = "1",
  } = (req as any).validatedQuery;

  try {
    const offset = (Number(page) - 1) * Number(limit);
    if (query === "" || typeof query !== "string") {
      throw createError("Invalid search query", 400);
    }

    let supaQuery = supabase
      .from("products")
      .select("*", { count: "exact" })
      .textSearch("name_search", query, {
        type: "plain",
        config: "english",
      });
    if (minPrice) {
      supaQuery = supaQuery.gte("price", Number(minPrice));
    }
    if (maxPrice) {
      supaQuery = supaQuery.lte("price", Number(maxPrice));
    }
    if (sortBy === "price_desc") {
      supaQuery = supaQuery.order("price", { ascending: false });
    }
    if (sortBy === "price_asc") {
      supaQuery = supaQuery.order("price", { ascending: true });
    }

    supaQuery = supaQuery.range(offset, offset + Number(limit) - 1);
    const { data, count, error } = await supaQuery;
    if (error) {
      throw createError("Failed to search products", 500);
    }
    if (!data || data.length === 0) {
      res.status(200).json({
        pagination: {},
        data: [],
      });
    }
    res.status(200).json({
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems: count,
        totalPages: Math.ceil(!count ? 0 : count / limit),
      },

      data,
    });
  } catch (error) {
    next(error);
  }
};
export const restoreProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // 1. Verify product exists and is deleted
    const { data, error } = await supabase
      .from("products")
      .select("id, version, is_deleted")
      .eq("id", id)
      .maybeSingle();

    if (error) throw createError("Database error", 500);
    if (!data) throw createError(`Product ${id} not found`, 404);
    if (!data.is_deleted) throw createError("Product not soft deleted", 409);

    // 2. Atomic restore with version check
    const { data: updatedData, error: updateError } = await supabase
      .from("products")
      .update({
        is_deleted: false,

        version: data.version + 1,
      })
      .eq("id", id)
      .eq("is_deleted", true)
      .eq("version", data.version)
      .select();

    if (updateError) throw createError("Database error", 500);
    if (!updatedData?.length) throw createError("Restore conflict", 409);

    res.status(200).json({
      success: true,
      data: updatedData[0],
      newVersion: updatedData[0].version,
    });
  } catch (error) {
    next(error);
  }
};
export const hardDeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const { data, error } = await supabase
      .from("products")
      .select("id, is_deleted")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw createError("Error finding the product", 500);
    }

    if (!data) {
      throw createError(`Product with the id ${id} not found `, 404);
    }

    const { data: deletedProduct, error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .select();

    if (deleteError) {
      throw createError("Failed to delete product", 500);
    }

    res
      .status(200)
      .json({ message: "Product permanently deleted", data: deletedProduct });
  } catch (error) {
    next(error);
  }
};
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category_name } = req.body;
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", category_name)
      .maybeSingle();
    if (categoryError) {
      throw createError("Database error while fetching category", 500);
    }
    if (!categoryData) {
      throw createError(`Category '${category_name}' not found`, 404);
    }

    req.body.category_id = categoryData.id;
    req.body = {
      category_id: req.body.category_id,
      name: req.body.name,
      description: req.body.description,
      stock: req.body.stock || null,
      price: req.body.price,
      image_url: req.body.image_url,
    };
    const { data, error } = await supabase
      .from("products")
      .insert(req.body)
      .select();
    if (error) {
      throw createError("Failed to create product", 500);
    }
    if (data.length === 0) throw createError("Failed to create product", 500);
    res.status(201).json({ message: "Product created", data });
  } catch (error) {
    next(error);
  }
};

export const bulkSoftDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ids } = req.body;
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id")
      .in("id", ids);
    if (productError) throw createError("Failed to fetch products", 500);
    const existingIds = products.map((p) => p.id);
    const invalidIds = ids.filter((id: number) => !existingIds.includes(id));
    if (existingIds.length === 0) {
      throw createError("No valid product Ids found", 404);
    }
    const { data, error } = await supabase
      .from("products")
      .update({ is_deleted: true })
      .in("id", ids)
      .select();
    if (error) {
      throw createError("Failed to soft delete product", 500);
    }
    if (data.length === 0) throw createError("Product not found", 500);
    res.status(200).json({
      message:
        invalidIds.length > 0
          ? "Some products not found"
          : "All Products soft deleted",
      deleted: data,
      notFound: invalidIds,
    });
  } catch (error) {
    next(error);
  }
};

export const bulkHardDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ids } = req.body;
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id")
      .in("id", ids);

    if (productError) throw createError("Failed to fetch products", 500);

    const existingIds = products.map((p) => p.id);
    const invalidIds = ids.filter((id: number) => !existingIds.includes(id));

    if (existingIds.length === 0) {
      throw createError("No valid product IDs found", 404);
    }

    const { data, error } = await supabase
      .from("products")
      .delete()
      .in("id", existingIds)
      .select();

    if (error) throw createError("Failed to delete products", 500);

    res.status(200).json({
      message:
        invalidIds.length > 0
          ? "Some products deleted, some not found"
          : "All products deleted",
      deleted: data,
      notDeleted: invalidIds,
    });
  } catch (error) {
    next(error);
  }
};
export const restoreMany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ids } = req.body;
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("is_deleted", true)
      .in("id", ids)
      .select();
    if (productError)
      throw createError("Failed to fetch products " + productError, 500);
    if (products.length === 0) {
      throw createError(
        "No valid product IDs found which are soft deleted",
        404
      );
    }
    const existingIds = products.map((p) => p.id);
    const invalidIds = ids.filter((id: number) => !existingIds.includes(id));
    if (existingIds.length === 0) {
      throw createError(
        "No valid product IDs found which are soft deleted",
        404
      );
    }
    const { data, error } = await supabase
      .from("products")
      .update({ is_deleted: false })
      .in("id", existingIds)
      .select();
    if (error || data.length === 0) {
      throw createError("Failed to restore products " + error, 500);
    }
    res.status(200).json({
      message:
        invalidIds.length > 0
          ? "Some products restored, some not found"
          : "All products restored",
      restored: data,
      notRestored: invalidIds,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    query,
    minPrice,
    maxPrice,
    sortBy = "best_match",
    limit = "20",
    page = "1",
    category = "all",
  } = (req as any).validatedQuery;

  try {
    const offset = (Number(page) - 1) * Number(limit);

    let supaQuery = supabase
      .from("products")
      .select(
        "id, name, description, created_at,stock, price, is_deleted,image_url, version,categories:categories!inner(name)",
        { count: "exact" }
      );

    // Add search if query exists
    if (query && typeof query === "string") {
      supaQuery = supaQuery.textSearch("name_search", query, {
        type: "plain",
        config: "english",
      });
    }

    if (category && category !== "all") {
      supaQuery = supaQuery.eq("categories.name", category);
    }

    // Price filters
    if (minPrice) {
      supaQuery = supaQuery.gte("price", Number(minPrice));
    }
    if (maxPrice) {
      supaQuery = supaQuery.lte("price", Number(maxPrice));
    }

    // Sorting
    if (sortBy === "price_desc") {
      supaQuery = supaQuery.order("price", { ascending: false });
    } else if (sortBy === "price_asc") {
      // Added 'if' here
      supaQuery = supaQuery.order("price", { ascending: true });
    }

    // Pagination
    supaQuery = supaQuery.range(offset, offset + Number(limit) - 1);

    const { data, count, error } = await supaQuery;

    if (error) {
      throw createError("Failed to fetch products", 500);
    }

    res.status(200).json({
      data: data || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems: count || 0,
        totalPages: Math.ceil((count || 0) / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};
export const categoryNotProvided = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(400).json({ message: "Category not provided" });
  } catch (error) {
    next(error);
  }
};
