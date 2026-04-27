import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import "../styles/SearchModal.scss";

const SearchModal: React.FC = () => {
  const {
    searchQuery,
    searchResults,
    isSearchOpen,
    setIsSearchOpen,
    isSearching,
    clearSearch,
  } = useSearch();

  const navigate = useNavigate();

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        clearSearch();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isSearchOpen, setIsSearchOpen, clearSearch]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSearchOpen]);

  const handleResultClick = (id: number, name: string) => {
    navigate(`/product/${id}/${name}`);
    setIsSearchOpen(false);
    clearSearch();
  };

  const handleCloseModal = () => {
    setIsSearchOpen(false);
    clearSearch();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // Format price with KSh
  const formatPrice = (price: number) => {
    return `KSh${price.toLocaleString()}`;
  };

  if (!isSearchOpen) return null;

  return (
    <>
      {/* Transparent overlay that doesn't cover navbar */}
      <div
        className="search-modal-overlay"
        onClick={handleOverlayClick}
        style={{ top: "80px" }}
        role="presentation"
      />

      {/* Modal positioned below navbar */}
      <div
        className="search-modal-container"
        style={{ top: "80px" }}
        role="dialog"
        aria-modal="true"
        aria-label="Search results"
      >
        <div className="search-modal">
          <div className="search-modal-header">
            <h2 className="search-modal-title">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Search Products"}
            </h2>
            <button
              className="search-modal-close"
              onClick={handleCloseModal}
              aria-label="Close search"
              type="button"
            >
              ✕
            </button>
          </div>

          <div className="search-modal-content">
            {isSearching ? (
              <div className="search-loading">
                <div className="spinner" aria-hidden="true"></div>
                <p>Searching products...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="search-results-count">
                  Found {searchResults.length} product
                  {searchResults.length !== 1 ? "s" : ""}
                </div>

                <div className="search-results-list">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="search-result-item"
                      onClick={() =>
                        handleResultClick(product.id, product.name)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleResultClick(product.id, product.name);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View ${product.name}`}
                    >
                      {product.imageUrl ? (
                        <div className="result-item-image">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="result-item-image placeholder">
                          <div className="image-placeholder" aria-hidden="true">
                            📦
                          </div>
                        </div>
                      )}

                      <div className="result-item-content">
                        <div className="result-item-title-row">
                          <h3 className="result-item-title">{product.name}</h3>
                          {product.price && (
                            <div className="result-item-price">
                              <span className="price-current">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          )}
                        </div>

                        {product.description && (
                          <p className="result-item-description">
                            {product.description.length > 60
                              ? `${product.description.substring(0, 60)}...`
                              : product.description}
                          </p>
                        )}

                        <div className="result-item-meta">
                          {product.tone && (
                            <span className="result-item-tone">
                              {typeof product.tone === "string"
                                ? product.tone.split(/[-–—]/)[0]?.trim() ||
                                  product.tone
                                : product.tone[0] || "Fragrance"}
                            </span>
                          )}

                          {product.category && (
                            <span className="result-item-category">
                              {Array.isArray(product.category)
                                ? product.category[0]
                                : product.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : searchQuery ? (
              <div className="search-no-results">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="64"
                  height="64"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3>No products found</h3>
                <p>We couldn't find any products matching "{searchQuery}"</p>
                <p className="search-tip">
                  Try searching with different keywords or check your spelling
                </p>
              </div>
            ) : (
              <div className="search-empty">
                <p>Type something to start searching...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchModal;
