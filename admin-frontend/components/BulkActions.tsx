"use client";

import { useState } from "react";
import { Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { useRouter } from "next/navigation";
import {
  bulkRestoreProducts,
  bulkHardDeleteProducts,
  bulkSoftDeleteProducts,
} from "@/utils/api";

interface BulkActionsProps {
  selectedIds: number[];
  selectedProducts: { id: number; name: string; is_deleted: boolean }[];
  onSelectionChange: (ids: number[]) => void;
  onDataChange?: () => void;
}

export function BulkActions({
  selectedIds,
  selectedProducts,
  onSelectionChange,
  onDataChange,
}: BulkActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const router = useRouter();

  const activeProducts = selectedProducts.filter((p) => !p.is_deleted);
  const deletedProducts = selectedProducts.filter((p) => p.is_deleted);

  const handleBulkSoftDelete = async () => {
    if (activeProducts.length === 0) {
      toast.warning("No active products selected for soft delete", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const activeIds = activeProducts.map((p) => p.id);
      const result = await bulkSoftDeleteProducts(activeIds);

      if (result.success) {
        const deletedCount = result.deleted?.length || 0;
        const notFoundCount = result.notFound?.length || 0;

        let message = `${deletedCount} product${
          deletedCount !== 1 ? "s" : ""
        } soft deleted successfully`;
        if (notFoundCount > 0) {
          message += `. ${notFoundCount} product${
            notFoundCount !== 1 ? "s" : ""
          } not found.`;
        }

        toast.success(message, {
          position: "top-center",
          autoClose: 3000,
        });

        onSelectionChange([]);
        if (onDataChange) {
          onDataChange();
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.message, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred during bulk soft delete", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
      setDialogOpen(null);
    }
  };

  const handleBulkHardDelete = async () => {
    if (selectedIds.length === 0) {
      toast.warning("No products selected for permanent deletion", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await bulkHardDeleteProducts(selectedIds);

      if (result.success) {
        const deletedCount = result.deleted?.length || 0;
        const notDeletedCount = result.notDeleted?.length || 0;

        let message = `${deletedCount} product${
          deletedCount !== 1 ? "s" : ""
        } permanently deleted`;
        if (notDeletedCount > 0) {
          message += `. ${notDeletedCount} product${
            notDeletedCount !== 1 ? "s" : ""
          } could not be deleted.`;
        }

        toast.success(message, {
          position: "top-center",
          autoClose: 3000,
        });

        onSelectionChange([]);
        if (onDataChange) {
          onDataChange();
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.message, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred during bulk hard delete", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
      setDialogOpen(null);
    }
  };

  const handleBulkRestore = async () => {
    if (deletedProducts.length === 0) {
      toast.warning("No deleted products selected for restore", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const deletedIds = deletedProducts.map((p) => p.id);
      const result = await bulkRestoreProducts(deletedIds);

      if (result.success) {
        const restoredCount = result.restored?.length || 0;
        const notRestoredCount = result.notRestored?.length || 0;

        let message = `${restoredCount} product${
          restoredCount !== 1 ? "s" : ""
        } restored successfully`;
        if (notRestoredCount > 0) {
          message += `. ${notRestoredCount} product${
            notRestoredCount !== 1 ? "s" : ""
          } could not be restored.`;
        }

        toast.success(message, {
          position: "top-center",
          autoClose: 3000,
        });

        onSelectionChange([]);
        if (onDataChange) {
          onDataChange();
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.message, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred during bulk restore", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
      setDialogOpen(null);
    }
  };

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedIds.length} selected
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isLoading}>
            Bulk Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {activeProducts.length > 0 && (
            <>
              <AlertDialog
                open={dialogOpen === "soft-delete"}
                onOpenChange={(open) => !open && setDialogOpen(null)}
              >
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-orange-600"
                    onSelect={(e) => {
                      e.preventDefault();
                      setDialogOpen("soft-delete");
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Soft Delete ({activeProducts.length})
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Soft Delete Products</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to soft delete{" "}
                      {activeProducts.length} product
                      {activeProducts.length !== 1 ? "s" : ""}? They can be
                      restored later.
                    </AlertDialogDescription>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Products: {activeProducts.map((p) => p.name).join(", ")}
                    </div>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkSoftDelete}
                      disabled={isLoading}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {isLoading ? "Deleting..." : "Soft Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          {selectedIds.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <AlertDialog
                open={dialogOpen === "hard-delete"}
                onOpenChange={(open) => !open && setDialogOpen(null)}
              >
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-600"
                    onSelect={(e) => {
                      e.preventDefault();
                      setDialogOpen("hard-delete");
                    }}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Permanent Delete ({selectedIds.length})
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Permanently Delete Products
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to permanently delete{" "}
                      {selectedIds.length} product
                      {selectedIds.length !== 1 ? "s" : ""}? This action cannot
                      be undone!
                    </AlertDialogDescription>
                    <div className="flex items-center gap-2 mb-2 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-semibold text-sm">
                        Warning: This action is permanent
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Products: {selectedProducts.map((p) => p.name).join(", ")}
                    </div>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkHardDelete}
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isLoading ? "Deleting..." : "Permanently Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          {deletedProducts.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <AlertDialog
                open={dialogOpen === "restore"}
                onOpenChange={(open) => !open && setDialogOpen(null)}
              >
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-green-600"
                    onSelect={(e) => {
                      e.preventDefault();
                      setDialogOpen("restore");
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore ({deletedProducts.length})
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Restore Products</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to restore {deletedProducts.length}{" "}
                      product{deletedProducts.length !== 1 ? "s" : ""}?
                    </AlertDialogDescription>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Products: {deletedProducts.map((p) => p.name).join(", ")}
                    </div>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkRestore}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? "Restoring..." : "Restore"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
