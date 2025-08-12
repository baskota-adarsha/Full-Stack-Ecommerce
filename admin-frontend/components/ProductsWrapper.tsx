"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductsTableClient } from "./ProductsTableClient";
import { ProductsTableSkeleton } from "./ProductsTableSkeleton";

interface ProductsWrapperProps {
  initialData: any;
  initialPagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export function ProductsWrapper({
  initialData,
  initialPagination,
}: ProductsWrapperProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(initialData);
  const [pagination, setPagination] = useState(initialPagination);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Build query parameters
        const params = new URLSearchParams();

        // Get all search params
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "20";
        const sortBy = searchParams.get("sortBy") || "best_match";
        const category = searchParams.get("category") || "all";
        const query = searchParams.get("query") || "";
        const minPrice = searchParams.get("minPrice") || "";
        const maxPrice = searchParams.get("maxPrice") || "";

        params.set("page", page);
        params.set("limit", limit);
        params.set("sortBy", sortBy);

        if (category && category !== "all") {
          params.set("category", category);
        }
        if (query) {
          params.set("query", query);
        }
        if (minPrice) {
          params.set("minPrice", minPrice);
        }
        if (maxPrice) {
          params.set("maxPrice", maxPrice);
        }

        const res = await fetch(
          `http://localhost:5000/products?${params.toString()}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const result = await res.json();
        setData(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Keep current data on error
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if search params changed (not on initial load)
    const currentParams = searchParams.toString();
    const initialParams = new URLSearchParams({
      page: initialPagination.page.toString(),
      limit: initialPagination.limit.toString(),
      sortBy: "best_match",
    }).toString();

    if (currentParams !== initialParams) {
      fetchData();
    }
  }, [searchParams, initialPagination.page, initialPagination.limit]);

  if (isLoading) {
    return <ProductsTableSkeleton />;
  }

  return <ProductsTableClient initialData={data} pagination={pagination} />;
}
