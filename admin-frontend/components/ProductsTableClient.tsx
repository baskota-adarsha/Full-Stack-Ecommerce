"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductActions } from "@/components/product-actions";
import { Pagination } from "@/components/pagination";
import { BulkActions } from "./BulkActions";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  is_deleted: boolean;
  image_url?: string;
  categories: {
    name: string;
  };
}

interface ProductsTableClientProps {
  initialData: Product[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export function ProductsTableClient({
  initialData,
  pagination,
}: ProductsTableClientProps) {
  // Convert initialData to local state
  const [products, setProducts] = useState<Product[]>(initialData);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { page, limit, totalItems, totalPages } = pagination;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(products.map((product) => product.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, productId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  // Handle product updates (soft delete, restore)
  const handleProductUpdate = (
    productId: number,
    updates: Partial<Product>
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
    // Clear selection if the product was selected
    setSelectedIds((prev) => prev.filter((id) => id !== productId));
  };

  // Handle product deletion (hard delete)
  const handleProductDelete = (productId: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    // Clear selection if the product was selected
    setSelectedIds((prev) => prev.filter((id) => id !== productId));
  };

  // Handle bulk actions data changes
  const handleBulkDataChange = () => {
    // For hard delete: remove deleted products from state
    // For soft delete: update is_deleted status
    // For restore: update is_deleted status

    // Since we don't know exactly what changed, we need to refetch or use optimistic updates
    // For now, let's use window.location.reload() as a simple solution
    // In a real app, you'd want to refetch the data from your API
    window.location.reload();
  };

  const isAllSelected =
    products.length > 0 && selectedIds.length === products.length;
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < products.length;

  const selectedProducts = products.filter((product) =>
    selectedIds.includes(product.id)
  );

  // Determine the checked state for the "select all" checkbox
  const selectAllChecked = isAllSelected
    ? true
    : isIndeterminate
    ? "indeterminate"
    : false;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>Products ({totalItems})</span>
              <BulkActions
                selectedIds={selectedIds}
                selectedProducts={selectedProducts}
                onSelectionChange={setSelectedIds}
                onDataChange={handleBulkDataChange}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
              {totalItems}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectAllChecked}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  className={product.is_deleted ? "opacity-50" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(product.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(product.id, !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {product.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.categories.name}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.is_deleted ? "destructive" : "default"}
                    >
                      {product.is_deleted ? "Deleted" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ProductActions
                      product={product}
                      onProductUpdate={(updates) =>
                        handleProductUpdate(product.id, updates)
                      }
                      onProductDelete={() => handleProductDelete(product.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={limit}
      />
    </div>
  );
}
