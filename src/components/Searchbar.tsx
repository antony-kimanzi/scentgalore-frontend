import React, {
  useState,
  type ChangeEvent,
  type FormEvent,
  useEffect,
} from "react";
import { useSearch } from "../hooks/useSearch";
import { useProduct } from "../hooks/useProduct";
import "../styles/Searchbar.scss";

export default function Searchbar() {
  const { performSearch, clearSearch, setIsSearchOpen } = useSearch();
  const { products, isLoading, fetchAllProducts } = useProduct(); // Added fetchAllProducts
  const [query, setQuery] = useState("");
  const [hasProducts, setHasProducts] = useState(false);

  // Fetch products on mount if not already loaded
  useEffect(() => {
    if (products.length === 0 && !isLoading) {
      fetchAllProducts();
    } else if (products.length > 0) {
      setHasProducts(true);
    }
  }, [products, isLoading, fetchAllProducts, hasProducts]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Only trigger search if we have products
    if (value.trim() && products.length > 0) {
      setIsSearchOpen(true);
      performSearch(value.trim(), products);
    } else if (!value.trim()) {
      clearSearch();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && products.length > 0) {
      setIsSearchOpen(true);
      performSearch(query.trim(), products);
    }
  };

  const handleClear = () => {
    setQuery("");
    clearSearch();
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className="searchbar-wrapper">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search perfumes..."
            className="search-input"
            aria-label="Search products"
            disabled={isLoading} // Disable input while loading
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-search-btn"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="search-button"
          disabled={isLoading || products.length === 0}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="-2 -2 39 39"
            height="39"
            width="39"
          >
            <desc>
              Magnifying Glass Streamline Icon: https://streamlinehq.com
            </desc>
            <g id="magnifying-glass--glass-search-magnifying">
              <path
                id="Union"
                fill="#000000"
                fillRule="evenodd"
                d="M5 15a10 10 0 1 1 20 0 10 10 0 0 1 -20 0Zm10 -15a15 15 0 1 0 8.69 27.225l7.0425 7.0425a2.5 2.5 0 0 0 3.5349999999999997 -3.5349999999999997l-7.039999999999999 -7.039999999999999A15 15 0 0 0 15 0Z"
                clipRule="evenodd"
                strokeWidth="2.5"
              ></path>
            </g>
          </svg>
        </button>
      </form>
      {products.length === 0 && !isLoading && (
        <div className="search-warning">No products available to search</div>
      )}
    </div>
  );
}
