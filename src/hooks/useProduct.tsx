/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback } from "react";
import type { IdParams, Product } from "../utils/types";
import { productService } from "../services/productService";

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "featured";
export type FilterOptions = {
  tone?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};

export const useProduct = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [availableTones, setAvailableTones] = React.useState<string[]>([]);
  const [availableFullTones, setAvailableFullTones] = React.useState<string[]>(
    []
  );
  const [availableCategories, setAvailableCategories] = React.useState<
    string[]
  >([]);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [productsPerPage] = React.useState<number>(12); // Products per page

  // Sorting and filtering state
  const [sortBy, setSortBy] = React.useState<SortOption>("featured");
  const [filters, setFilters] = React.useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const fetchProduct = useCallback(async (id: IdParams) => {
    try {
      setIsLoading(true);
      const response = await productService.getProduct(id);
      setProduct(response.product);
    } catch (err) {
      setError(`Error fetching product number: ${id}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await productService.getAllProduct();
      setProducts(response.products);
      setError(null);

      // Extract and set available tones and categories from products
      const { individualTones, fullTones, categories } =
        extractDataFromProducts(response.products);
      setAvailableTones(individualTones);
      setAvailableFullTones(fullTones);
      setAvailableCategories(categories);
    } catch (err) {
      setError("Error fetching products");
      setProducts([]);
      setAvailableTones([]);
      setAvailableFullTones([]);
      setAvailableCategories([]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper function to split hyphenated tones
  const splitToneString = useCallback((toneString: string): string[] => {
    if (!toneString) return [];

    // Split by various hyphen/dash characters and normalize
    return toneString
      .split(/[-–—]/)
      .map((tone) => tone.trim())
      .filter((tone) => tone.length > 0);
  }, []);

  // Function to extract unique tones and categories from products
  const extractDataFromProducts = useCallback(
    (
      products: Product[]
    ): {
      individualTones: string[];
      fullTones: string[];
      categories: string[];
    } => {
      const individualToneSet = new Set<string>();
      const fullToneSet = new Set<string>();
      const categorySet = new Set<string>();

      products.forEach((product) => {
        // Extract from tone field if it exists
        if (product.tone && typeof product.tone === "string") {
          const fullTone = product.tone.trim();
          if (fullTone) {
            fullToneSet.add(fullTone);

            // Split into individual tones
            const individualTones = splitToneString(fullTone);
            individualTones.forEach((tone) => {
              individualToneSet.add(tone);
            });
          }
        }

        // Extract categories
        if (product.category) {
          if (Array.isArray(product.category)) {
            product.category.forEach((cat) => {
              // Capitalize first letter and add to set
              if (typeof cat === "string") {
                const capitalized =
                  cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
                categorySet.add(capitalized);
              }
            });
          } else if (typeof product.category === "string") {
            // Capitalize first letter
            const capitalized =
              product.category.charAt(0).toUpperCase() +
              product.category.slice(1).toLowerCase();
            categorySet.add(capitalized);
          }
        }
      });

      // Sort the results
      const individualTones = Array.from(individualToneSet).sort();
      const fullTones = Array.from(fullToneSet).sort();
      const categories = Array.from(categorySet).sort();

      return { individualTones, fullTones, categories };
    },
    [splitToneString]
  );

  // Function to get the primary tone for a product
  const getProductTone = useCallback(
    (product: Product): string => {
      if (product.tone && typeof product.tone === "string") {
        const tones = splitToneString(product.tone);
        if (tones.length > 0) {
          return tones[0];
        }
      }

      // Fallback: check name
      const fragranceTones = [
        "Woody",
        "Oriental",
        "Fruity",
        "Floral",
        "Spicy",
        "Gourmand",
        "Fresh",
        "Aromatic",
        "Vanilla",
        "Amber",
        "Warm",
        "Sweet",
      ];

      if (product.name) {
        for (const tone of fragranceTones) {
          if (product.name.toLowerCase().includes(tone.toLowerCase())) {
            return tone;
          }
        }
      }

      return "Featured";
    },
    [splitToneString]
  );

  // Function to get all tones for a product
  const getAllProductTones = useCallback(
    (product: Product): string[] => {
      if (product.tone && typeof product.tone === "string") {
        return splitToneString(product.tone);
      }
      return [getProductTone(product)];
    },
    [splitToneString, getProductTone]
  );

  // ADD THIS FUNCTION - FeaturedProducts.tsx needs it
  const getFeaturedProductsByTone = useCallback(() => {
    if (!products.length) return [];

    const featuredProducts: any[] = [];
    const usedProductIds = new Set<number>();
    const toneProductMap = new Map<string, Product>();

    // First pass: Map primary tones to products
    products.forEach((product) => {
      const primaryTone = getProductTone(product);
      if (!toneProductMap.has(primaryTone)) {
        toneProductMap.set(primaryTone, product);
      }
    });

    // Second pass: Create featured products list, prioritizing unique tones
    const sortedTones = Array.from(toneProductMap.keys()).sort();

    // Try to get one product for each unique primary tone
    sortedTones.forEach((tone) => {
      if (featuredProducts.length >= 12) return;

      const product = toneProductMap.get(tone);
      if (product && !usedProductIds.has(product.id)) {
        featuredProducts.push({
          ...product,
          featuredTone: tone,
          allTones: getAllProductTones(product),
        });
        usedProductIds.add(product.id);
      }
    });

    // If we still need more products, add more variety
    if (featuredProducts.length < 8) {
      products.forEach((product) => {
        if (featuredProducts.length >= 8) return;
        if (!usedProductIds.has(product.id)) {
          featuredProducts.push({
            ...product,
            featuredTone: getProductTone(product),
            allTones: getAllProductTones(product),
          });
          usedProductIds.add(product.id);
        }
      });
    }

    return featuredProducts;
  }, [products, getProductTone, getAllProductTones]);

  // Filter handlers
  const handleToneFilter = (tone: string | null) => {
    setFilters((prev) => ({ ...prev, tone: tone || undefined }));
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: string | null) => {
    setFilters((prev) => ({ ...prev, category: category || undefined }));
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  const handlePriceFilter = (min?: number, max?: number) => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery("");
    setSortBy("featured");
    setCurrentPage(1);
  };

  // Sorting handler - also resets to page 1
  const handleSetSortBy = useCallback((sortOption: SortOption) => {
    setSortBy(sortOption);
    setCurrentPage(1); // Reset to page 1 when sorting changes
  }, []);

  // Search handler - also resets to page 1
  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 when search changes
  }, []);

  // Pagination handlers - SIMPLE VERSION (validation happens in ShopList)
  const goToPage = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Simple next/prev without validation (ShopList will validate)
  const nextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return {
    // Products data
    products,
    product,
    isLoading,
    error,

    // Filtering and sorting data
    availableTones,
    availableFullTones,
    availableCategories,
    sortBy,
    filters,
    searchQuery,

    // Pagination data
    currentPage,
    productsPerPage,

    // Actions
    fetchProduct,
    fetchAllProducts,

    // Sorting and filtering actions
    setSortBy: handleSetSortBy, // Use the wrapper that resets page
    setSearchQuery: handleSetSearchQuery, // Use the wrapper that resets page
    handleToneFilter,
    handleCategoryFilter,
    handlePriceFilter,
    clearAllFilters,

    // Pagination actions (simple, validation happens in ShopList)
    goToPage,
    nextPage,
    prevPage,

    // Helper functions
    getProductTone,
    getAllProductTones,
    splitToneString,

    // Featured products function
    getFeaturedProductsByTone,
  };
};

export type useProductReturn = ReturnType<typeof useProduct>;
