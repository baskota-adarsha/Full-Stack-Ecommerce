import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ProductFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Product Name Field */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-24 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Price Field */}
      <div className="space-y-2">
        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Category Field */}
      <div className="space-y-2">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Image Upload Field */}
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse border-2 border-dashed border-gray-300" />
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <div className="h-10 w-32 bg-gray-300 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function NewProductPageSkeleton() {
  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductFormSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
