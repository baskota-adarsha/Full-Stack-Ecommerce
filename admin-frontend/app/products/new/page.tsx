import NewProductPageSkeleton from "@/components/NewProductPageSkeleton";
import { ProductForm } from "@/components/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
function NewProductPageComponent() {
  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
export default function NewProductPage() {
  return (
    <Suspense fallback={<NewProductPageSkeleton />}>
      <NewProductPageComponent />
    </Suspense>
  );
}
