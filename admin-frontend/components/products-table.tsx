import { ProductsWrapper } from "./ProductsWrapper";

async function getProducts({
  page = 1,
  limit = 20,
  sortBy = "best_match",
  category = "all",
  query = "",
  minPrice = "",
  maxPrice = "",
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  category?: string;
  query?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
  });

  // Only add category if it's not "all"
  if (category && category !== "all") {
    params.append("category", category);
  }

  // Add other filters if they exist
  if (query) {
    params.append("query", query);
  }
  if (minPrice) {
    params.append("minPrice", minPrice);
  }
  if (maxPrice) {
    params.append("maxPrice", maxPrice);
  }

  const res = await fetch(
    `http://localhost:5000/products?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

interface SearchParams {
  page?: string;
  limit?: string;
  query?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  category?: string;
}

interface ProductsTableProps {
  searchParams: SearchParams;
}

export async function ProductsTable({ searchParams }: ProductsTableProps) {
  const page = Number.parseInt(searchParams.page || "1");
  const limit = Number.parseInt(searchParams.limit || "20");
  const sortBy = searchParams.sortBy || "best_match";
  const category = searchParams.category || "all";
  const query = searchParams.query || "";
  const minPrice = searchParams.minPrice || "";
  const maxPrice = searchParams.maxPrice || "";

  const { pagination, data } = await getProducts({
    page,
    limit,
    sortBy,
    category,
    query,
    minPrice,
    maxPrice,
  });

  return <ProductsWrapper initialData={data} initialPagination={pagination} />;
}
