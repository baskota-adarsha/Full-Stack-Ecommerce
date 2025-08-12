// components/toast-handler.tsx
"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

export function ToastHandler() {
  useEffect(() => {
    // Check for success message in sessionStorage
    const deleteSuccess = sessionStorage.getItem("deleteSuccess");

    if (deleteSuccess) {
      try {
        const { message, type } = JSON.parse(deleteSuccess);

        toast.success(message, {
          position: "top-right",
          autoClose: 4000,
        });

        // Clean up sessionStorage after showing toast
        sessionStorage.removeItem("deleteSuccess");
      } catch (error) {
        console.error("Error parsing delete success message:", error);
        sessionStorage.removeItem("deleteSuccess");
      }
    }
  }, []);

  return null;
}
