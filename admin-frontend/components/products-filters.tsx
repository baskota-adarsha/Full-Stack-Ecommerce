"use client";

import { Search, Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const categories = [
  "Electronics",
  "Clothes",
  "Furniture",
  "Shoes",
  "Miscellaneous",
];

const sortOptions = [
  { value: "best_match", label: "Best Match" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export function ProductsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    query: searchParams.get("query") || "",
    category: searchParams.get("category") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: searchParams.get("sortBy") || "best_match",
  });

  const updateURL = useCallback(
    (newFilters: typeof filters) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      // Reset to page 1 when filters change
      params.set("page", "1");

      router.push(`/?${params.toString()}`);
    },
    [router]
  );

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      query: "",
      category: "all",
      minPrice: "",
      maxPrice: "",
      sortBy: "best_match",
    };
    setFilters(newFilters);
    router.push("/");
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value && value !== "best_match" && value !== "all"
  ).length;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={filters.query}
              onChange={(e) => handleFilterChange("query", e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 h-5 w-5 p-0 text-xs"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-4">
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      Min Price
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      Max Price
                    </label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" onClick={clearFilters} size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.query && (
              <Badge variant="secondary">
                Search: {filters.query}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2"
                  onClick={() => handleFilterChange("query", "")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.category && filters.category !== "all" && (
              <Badge variant="secondary">
                Category: {filters.category}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2"
                  onClick={() => handleFilterChange("category", "all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.minPrice && (
              <Badge variant="secondary">
                Min: ${filters.minPrice}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2"
                  onClick={() => handleFilterChange("minPrice", "")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.maxPrice && (
              <Badge variant="secondary">
                Max: ${filters.maxPrice}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2"
                  onClick={() => handleFilterChange("maxPrice", "")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
