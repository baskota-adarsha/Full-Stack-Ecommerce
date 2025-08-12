import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProductPageSkeleton() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" disabled>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div className="h-8 w-40 bg-muted animate-pulse rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Image Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="w-full aspect-square bg-muted animate-pulse rounded-lg" />
          </CardContent>
        </Card>

        {/* Product Information Skeleton */}
        <div className="space-y-6">
          {/* Product Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-7 w-48 bg-muted animate-pulse rounded mb-3" />
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                    <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <div className="h-6 w-16 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
              <Separator />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>

          {/* Product Details Card */}
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="h-4 w-12 bg-muted animate-pulse rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
