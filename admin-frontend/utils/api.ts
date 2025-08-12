// lib/api/products.ts or utils/api.ts

interface BulkOperationResult {
  success: boolean;
  message: string;
  deleted?: any[];
  restored?: any[];
  notFound?: number[];
  notDeleted?: number[];
  notRestored?: number[];
}

export const bulkSoftDeleteProducts = async (
  ids: number[]
): Promise<BulkOperationResult> => {
  try {
    const response = await fetch(
      "http://localhost:5000/products/soft-delete-many",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to soft delete products",
      };
    }

    return {
      success: true,
      message: data.message,
      deleted: data.deleted,
      notFound: data.notFound,
    };
  } catch (error) {
    console.error("Error in bulk soft delete:", error);
    return {
      success: false,
      message: "An unexpected error occurred during bulk soft delete",
    };
  }
};

export const bulkHardDeleteProducts = async (
  ids: number[]
): Promise<BulkOperationResult> => {
  try {
    const response = await fetch(
      "http://localhost:5000/products/hard-delete-many",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to hard delete products",
      };
    }

    return {
      success: true,
      message: data.message,
      deleted: data.deleted,
      notDeleted: data.notDeleted,
    };
  } catch (error) {
    console.error("Error in bulk hard delete:", error);
    return {
      success: false,
      message: "An unexpected error occurred during bulk hard delete",
    };
  }
};

export const bulkRestoreProducts = async (
  ids: number[]
): Promise<BulkOperationResult> => {
  try {
    const response = await fetch(
      "http://localhost:5000/products/restore-many",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to restore products",
      };
    }

    return {
      success: true,
      message: data.message,
      restored: data.restored,
      notRestored: data.notRestored,
    };
  } catch (error) {
    console.error("Error in bulk restore:", error);
    return {
      success: false,
      message: "An unexpected error occurred during bulk restore",
    };
  }
};
