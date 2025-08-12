"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const categories = [
  "Electronics",
  "Clothes",
  "Furniture",
  "Shoes",
  "Miscellaneous",
];

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: {
    name: string;
  };
  image_url: string;
  version?: number;
}

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    product?.image_url || ""
  );
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    category_name: product?.categories.name || "",

    image_url: product?.image_url || "",
  });

  // Function to upload image to Supabase
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      setUploadingImage(true);

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from("products-images") // Make sure this bucket exists in your Supabase storage
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("products-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let uploadedImageUrl = "";
    let uploadedFilePath = "";

    try {
      let imageUrl = formData.image_url;

      // If user selected a new file, upload it first
      if (selectedFile) {
        const uploadToast = toast.loading("Uploading image...");
        try {
          uploadedImageUrl = await uploadImageToSupabase(selectedFile);
          // Extract the file path for potential cleanup
          const urlParts = uploadedImageUrl.split("/");
          uploadedFilePath = `product-images/${urlParts[urlParts.length - 1]}`;
          imageUrl = uploadedImageUrl;

          toast.update(uploadToast, {
            render: "Image uploaded successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } catch (error) {
          toast.update(uploadToast, {
            render: "Failed to upload image",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          throw error;
        }
      }

      // Prepare final form data with image URL
      const finalFormData = product?.id
        ? {
            ...formData,
            image_url: imageUrl,
            version: product.version,
          }
        : {
            ...formData,
            image_url: imageUrl,
          };

      console.log("Final form data:", finalFormData);

      const response = await fetch(
        product?.id
          ? `http://localhost:5000/products/${product.id}/update`
          : "http://localhost:5000/products",
        {
          method: product?.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalFormData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        if (uploadedImageUrl && uploadedFilePath) {
          try {
            console.log("Cleaning up uploaded image:", uploadedFilePath);
            await supabase.storage
              .from("products-images")
              .remove([uploadedFilePath]);
            console.log("Image cleanup successful");
          } catch (cleanupError) {
            console.error("Failed to cleanup uploaded image:", cleanupError);
          }
        }

        toast.error(
          errorData.message + errorData.errors ||
            "Failed to save product. Please try again."
        );
        console.log(errorData.message + errorData.errors);
        return;
      }

      toast.success(
        product?.id
          ? "Product updated successfully!"
          : "Product created successfully!"
      );

      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);

      // If any error occurred and we uploaded a new image, clean it up
      if (uploadedImageUrl && uploadedFilePath) {
        try {
          console.log(
            "Cleaning up uploaded image due to error:",
            uploadedFilePath
          );
          await supabase.storage
            .from("products-images")
            .remove([uploadedFilePath]);
          console.log("Image cleanup successful");
        } catch (cleanupError) {
          console.error("Failed to cleanup uploaded image:", cleanupError);
        }
      }

      toast.error("Failed to save product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(product?.image_url || "");
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category_name}
            onValueChange={(value) => handleInputChange("category_name", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter product description"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) =>
              handleInputChange("price", Number.parseFloat(e.target.value) || 0)
            }
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) =>
              handleInputChange("stock", Number.parseInt(e.target.value) || 0)
            }
            placeholder="0"
            required
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-2">
        <Label>Product Image *</Label>

        {!selectedFile && !previewUrl ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && handleFileSelect(e.target.files[0])
              }
              className="hidden"
              id="file-upload"
            />

            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-muted rounded-full">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <p className="text-lg font-medium">Drop your image here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: JPG, PNG, GIF (Max 5MB)
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={uploadingImage}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Product preview"
                    className="w-24 h-24 object-cover rounded-md border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg?height=96&width=96";
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium truncate">
                        {selectedFile?.name || "Current image"}
                      </p>
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleFileRemove}
                      className="text-destructive hover:text-destructive"
                      disabled={uploadingImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? "Uploading..." : "Change Image"}
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileSelect(e.target.files[0])
                      }
                      className="hidden"
                      id="file-upload"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isLoading || uploadingImage}
          className="flex-1"
        >
          {isLoading
            ? "Saving..."
            : product
            ? "Update Product"
            : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
          disabled={isLoading || uploadingImage}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
