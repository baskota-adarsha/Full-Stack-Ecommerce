import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SoftDeleteButton, HardDeleteButton } from "./delete-buttons";
import RestoreProduct from "@/components/restore-product";
import ProductPageSkeleton from "./loading";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProductById(id: string) {
  try {
    const res = await fetch(`http://localhost:5000/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function softDeleteProduct(id: string) {
  try {
    const res = await fetch(
      `http://localhost:5000/products/${id}/soft-delete`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to soft delete product");
    }
    return { success: true, message: "Product soft deleted successfully" };
  } catch (error) {
    console.error("Error soft deleting product:", error);
    return { success: false, message: "Failed to soft delete product" };
  }
}

export async function hardDeleteProduct(id: string) {
  try {
    const res = await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to hard delete product");
    }
    return { success: true, message: "Product permanently deleted" };
  } catch (error) {
    console.error("Error hard deleting product:", error);
    return { success: false, message: "Failed to permanently delete product" };
  }
}

export async function restoreProduct(id: string) {
  try {
    const res = await fetch(`http://localhost:5000/products/${id}/restore`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to restore product");
    }
    return { success: true, message: "Product restored successfully" };
  } catch (error) {
    console.error("Error restoring product:", error);
    return { success: false, message: "Failed to restore product" };
  }
}

async function ProductContent({ id }: { id: string }) {
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Product not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Product Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Image */}
        <Card>
          <CardContent className="p-6">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-auto rounded-lg object-cover"
            />
          </CardContent>
        </Card>

        {/* Product Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{product.category_name}</Badge>
                    <Badge
                      variant={product.is_deleted ? "destructive" : "default"}
                    >
                      {product.is_deleted ? "Deleted" : "Active"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    ${product.price.toFixed(2)}
                  </div>
                  <Badge
                    variant={
                      product.stock > 10
                        ? "default"
                        : product.stock > 0
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {product.stock} in stock
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{product.description}</p>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!product.is_deleted ? (
                <>
                  <Button className="w-full" asChild>
                    <Link href={`/products/${product.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Product
                    </Link>
                  </Button>
                  <Separator />
                  <SoftDeleteButton
                    productId={product.id}
                    productName={product.name}
                  />
                  <HardDeleteButton
                    productId={product.id}
                    productName={product.name}
                  />
                </>
              ) : (
                <RestoreProduct product={product} />
              )}
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product ID:</span>
                <span className="font-medium">#{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version:</span>
                <span className="font-medium">v{product.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">
                  {product.categories?.name || product.category_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock Level:</span>
                <span className="font-medium">{product.stock} units</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductContent id={id} />
    </Suspense>
  );
}
