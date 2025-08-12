import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ProductsHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your product inventory and catalog
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href="/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>
    </div>
  );
}
