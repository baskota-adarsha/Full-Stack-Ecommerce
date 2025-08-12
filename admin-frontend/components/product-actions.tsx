"use client";
import { Eye, Edit, Trash2, RotateCcw, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import {
  hardDeleteProduct,
  restoreProduct,
  softDeleteProduct,
} from "@/app/products/[id]/page";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  is_deleted: boolean;
  description?: string;
  price?: number;
  stock?: number;
  image_url?: string;
  categories?: {
    name: string;
  };
}

interface ProductActionsProps {
  product: Product;
  onProductUpdate?: (updates: Partial<Product>) => void;
  onProductDelete?: () => void;
}

export function ProductActions({
  product,
  onProductUpdate,
  onProductDelete,
}: ProductActionsProps) {
  const router = useRouter();

  const handleSoftDelete = async () => {
    try {
      const result = await softDeleteProduct(product.id.toString());

      if (result.success) {
        toast.success(
          `"${product.name}" has been soft deleted successfully. It can be restored later.`,
          {
            position: "top-center",
            autoClose: 3000,
          }
        );

        // Update local state immediately
        if (onProductUpdate) {
          onProductUpdate({ is_deleted: true });
        } else {
          router.refresh();
        }
      } else {
        toast.error(
          result.message ||
            "Failed to soft delete the product. Please try again.",
          {
            position: "top-center",
            autoClose: 5000,
          }
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  const handleHardDelete = async () => {
    try {
      const result = await hardDeleteProduct(product.id.toString());

      if (result.success) {
        toast.success(
          `"${product.name}" has been permanently deleted successfully.`,
          {
            position: "top-center",
            autoClose: 3000,
          }
        );

        // Remove from local state immediately
        if (onProductDelete) {
          onProductDelete();
        } else {
          router.refresh();
        }
      } else {
        toast.error(
          result.message ||
            "Failed to permanently delete the product. Please try again.",
          {
            position: "top-center",
            autoClose: 5000,
          }
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  const handleRestore = async () => {
    try {
      const result = await restoreProduct(product.id.toString());

      if (result.success) {
        toast.success(`"${product.name}" has been restored successfully.`, {
          position: "top-center",
          autoClose: 3000,
        });

        // Update local state immediately
        if (onProductUpdate) {
          onProductUpdate({ is_deleted: false });
        } else {
          router.refresh();
        }
      } else {
        toast.error(
          result.message || "Failed to restore the product. Please try again.",
          {
            position: "top-center",
            autoClose: 5000,
          }
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/products/${product.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </DropdownMenuItem>

        {!product.is_deleted && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/products/${product.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSoftDelete}
              className="text-orange-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Soft Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleHardDelete}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hard Delete
            </DropdownMenuItem>
          </>
        )}

        {product.is_deleted && (
          <DropdownMenuItem onClick={handleRestore} className="text-green-600">
            <RotateCcw className="h-4 w-4 mr-2" />
            Restore
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
