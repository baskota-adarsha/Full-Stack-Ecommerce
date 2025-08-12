"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { restoreProduct } from "@/app/products/[id]/page";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
const handleRestore = async (id: any, name: any, router: any) => {
  try {
    const result = await restoreProduct(id);

    if (result.success) {
      toast.success(`"${name}" has been restored successfully.`, {
        position: "top-center",
        autoClose: 3000,
      });
      router.push("/");
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
const RestoreProduct = ({ product }: { product: any }) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => handleRestore(product.id, product.name, router)}
      variant="outline"
      className="w-full text-green-600 hover:text-green-700 bg-transparent"
    >
      <RotateCcw className="h-4 w-4 mr-2" />
      Restore Product
    </Button>
  );
};

export default RestoreProduct;
