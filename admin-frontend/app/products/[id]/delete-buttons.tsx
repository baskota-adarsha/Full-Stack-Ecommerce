"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { softDeleteProduct, hardDeleteProduct } from "./page";

interface DeleteButtonsProps {
  productId: string;
  productName: string;
}

export function SoftDeleteButton({
  productId,
  productName,
}: DeleteButtonsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSoftDelete = async () => {
    setLoading(true);
    try {
      const result = await softDeleteProduct(productId);

      if (result.success) {
        toast.success(
          `"${productName}" has been soft deleted successfully. It can be restored later.`,
          {
            position: "top-center",
            autoClose: 3000,
          }
        );

        router.push("/");
      } else {
        toast.error(
          result.message ||
            "Failed to soft delete the product. Please try again.",
          {
            position: "top-center",
            autoClose: 5000,
          }
        );
        setLoading(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full text-orange-600 hover:text-orange-700 bg-transparent"
          disabled={loading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {loading ? "Soft Deleting..." : "Soft Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to soft delete this product?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will mark "{productName}" as deleted, but it can be restored
            later. The product will be hidden from the main product list but
            will remain in the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSoftDelete}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {loading ? "Deleting..." : "Yes, Soft Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function HardDeleteButton({
  productId,
  productName,
}: DeleteButtonsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleHardDelete = async () => {
    setLoading(true);
    try {
      const result = await hardDeleteProduct(productId);

      if (result.success) {
        toast.success(
          `"${productName}" has been permanently deleted from the database.`,
          {
            position: "top-center",
            autoClose: 3000,
          }
        );

        router.push("/");
      } else {
        toast.error(
          result.message ||
            "Failed to permanently delete the product. Please try again.",
          {
            position: "top-center",
            autoClose: 5000,
          }
        );
        setLoading(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full" disabled={loading}>
          <Trash2 className="h-4 w-4 mr-2" />
          {loading ? "Hard Deleting..." : "Hard Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to permanently delete this product?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. "{productName}" will be permanently
            removed from the database along with all associated data. This is
            irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleHardDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Yes, Delete Permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
