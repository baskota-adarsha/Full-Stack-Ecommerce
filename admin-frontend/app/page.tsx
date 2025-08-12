import { Suspense } from "react";
import { ProductsTable } from "@/components/products-table";
import { ProductsHeader } from "@/components/products-header";
import { ProductsFilters } from "@/components/products-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastHandler } from "@/components/ui/toast-handler";

interface SearchParams {
  page?: string;
  limit?: string;
  query?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  category?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ToastHandler />

      <ProductsHeader />

      <ProductsFilters />

      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductsTable searchParams={params} />
      </Suspense>
    </div>
  );
}

function ProductsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="border rounded-lg">
        <div className="p-4 space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
