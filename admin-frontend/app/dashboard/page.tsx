import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Archive,
  WifiOff,
} from "lucide-react";
import { formatTimeAgo } from "@/utils/format-time";
import { Suspense } from "react";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { Product } from "../types/products";
import {
  CategoryCountResponse,
  DeletedProductsResponse,
  LowStockProductsResponse,
  ProductsResponse,
} from "../types/api-responses";

const colorPalette = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-lime-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-sky-500",
];

const getCategoryColor = (categoryName: string, index: number) => {
  return colorPalette[index % colorPalette.length];
};

async function getProducts(): Promise<ProductsResponse> {
  const res = await fetch("http://localhost:5000/products?limit=6", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch products: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

async function getNumberOfProductsByCategories(): Promise<
  CategoryCountResponse[]
> {
  const res = await fetch("http://localhost:5000/products-analytics", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch category analytics: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}

async function getNumberOfDeletedProducts(): Promise<DeletedProductsResponse> {
  const res = await fetch(
    "http://localhost:5000/products-analytics/numberOfDeletedProducts",
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(
      `Failed to fetch deleted products count: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}

async function getNumberOfLowStockProducts(): Promise<LowStockProductsResponse> {
  const res = await fetch(
    "http://localhost:5000/products-analytics/numberOfLowStockProducts",
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(
      `Failed to fetch low stock products count: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}

// Error fallback component for individual sections

async function DashboardContent() {
  // This will throw and trigger error boundary if any critical API fails
  const [
    NumberOfProductsByCategories,
    numberOfDeletedProducts,
    numberOfLowStockProducts,
    { pagination, data },
  ] = await Promise.all([
    getNumberOfProductsByCategories(),
    getNumberOfDeletedProducts(),
    getNumberOfLowStockProducts(),
    getProducts(),
  ]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your product inventory
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Products
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pagination.totalItems -
                numberOfDeletedProducts.totalNumberOfDeletedProducts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {numberOfLowStockProducts.totalNumberOfLowStockProducts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Deleted Products
            </CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {numberOfDeletedProducts.totalNumberOfDeletedProducts}
            </div>
            <p className="text-xs text-muted-foreground">Can be restored</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No recent products found</p>
              </div>
            ) : (
              data.map((product: Product) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden border border-muted/30 bg-gradient-to-br from-muted/20 to-muted/50 flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Added {formatTimeAgo(product.created_at)}
                    </p>
                  </div>
                  <Badge variant="outline">{product.categories.name}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {NumberOfProductsByCategories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No categories found</p>
              </div>
            ) : (
              NumberOfProductsByCategories.map(
                (category: CategoryCountResponse, index: number) => (
                  <div
                    key={category.category_name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getCategoryColor(
                          category.category_name,
                          index
                        )}`}
                      />
                      <span className="text-sm font-medium">
                        {category.category_name}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {category.product_count}
                    </span>
                  </div>
                )
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
