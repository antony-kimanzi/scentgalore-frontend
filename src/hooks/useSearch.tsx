/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../utils/types";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Product[];
  setSearchResults: (results: Product[]) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  isSearching: boolean;
  performSearch: (query: string, allProducts: Product[]) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Function to perform search on product data
  const performSearch = (query: string, allProducts: Product[]) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);
    setIsSearchOpen(true);

    // Simulate API delay for better UX
    setTimeout(() => {
      const searchTerm = query.toLowerCase().trim();

      const results = allProducts.filter((product) => {
        // Search in multiple fields
        const searchFields = [
          product.name,
          product.description,
          product.tone,
          product.category,
        ];

        return searchFields.some((field) => {
          if (!field) return false;

          if (Array.isArray(field)) {
            return field.some((item) =>
              item?.toString().toLowerCase().includes(searchTerm)
            );
          }

          const fieldStr = field.toString().toLowerCase();
          const hasMatch = fieldStr.includes(searchTerm);
          return hasMatch;
        });
      });

      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
    setIsSearching(false);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        isSearchOpen,
        setIsSearchOpen,
        isSearching,
        performSearch,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
