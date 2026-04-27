/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import type { Product } from "../utils/types";
import "../styles/ShopList.scss";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../hooks/useCart";
import ShopPagination from "../components/ShopPagination";

export default function ShopList() {
  const {
    products: allProducts,
    isLoading,
    error,
    fetchAllProducts,
    sortBy,
    filters,
    searchQuery,
    setSortBy,
    handleCategoryFilter,
    clearAllFilters,
    productsPerPage,
    currentPage,
    goToPage, // Keep this but we'll use our local version
    availableCategories,
  } = useProduct();

  const { fetchCart, addCartItem, cartItems, isAddingToCart } = useCart();
  const navigate = useNavigate();

  const [addingProductId, setAddingProductId] = React.useState<number | null>(
    null,
  );

  // Debug: Log availableCategories
  React.useEffect(() => {
    // Check what categories products actually have
    if (allProducts.length > 0) {
      const categoriesSet = new Set<string>();
      allProducts.forEach((product) => {
        if (product.category) {
          if (Array.isArray(product.category)) {
            product.category.forEach((cat) => categoriesSet.add(cat));
          } else {
            categoriesSet.add(product.category);
          }
        }
      });
    }
  }, [availableCategories, allProducts]);

  // Filter and sort products directly here
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((product) => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.shortDescription?.toLowerCase().includes(query)
        );
      });
    }

    // Apply category filter (gender/category)
    if (filters.category) {
      result = result.filter((product) => {
        if (!product.category) {
          return false;
        }

        if (Array.isArray(product.category)) {
          const hasCategory = product.category.some((cat) => {
            const matches = cat === filters.category;

            return matches;
          });
          return hasCategory;
        } else {
          const matches = product.category === filters.category;
          return matches;
        }
      });
    }

    // Apply price filters
    if (typeof filters.minPrice === "number" && filters.minPrice > 0) {
      const minPrice = filters.minPrice;
      result = result.filter((product) => product.price >= minPrice);
    }

    if (typeof filters.maxPrice === "number" && filters.maxPrice > 0) {
      const maxPrice = filters.maxPrice;
      result = result.filter((product) => product.price <= maxPrice);
    }

    // Apply sorting

    const sortedResult = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return (b.id || 0) - (a.id || 0);
        case "featured":
        default:
          return (a.id || 0) - (b.id || 0);
      }
    });

    return sortedResult;
  }, [allProducts, sortBy, filters, searchQuery]);

  // Calculate current page products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage),
  ); // FIX: Ensure at least 1 page

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return "Invalid amount";
    }
  };

  // Function to get gender badge based on category
  const getGenderBadge = (product: Product): string => {
    if (!product.category) return "";

    const category = Array.isArray(product.category)
      ? product.category[0]
      : product.category;

    switch (category.toLowerCase()) {
      case "men":
        return "[M]";
      case "women":
        return "[W]";
      case "unisex":
        return "[U]";
      default:
        return "";
    }
  };

  const handleGoToProduct = (e: React.MouseEvent, id: number, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${id}/${name}`);
  };

  const handleAddBtn = async (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product,
  ): Promise<void> => {
    e.stopPropagation();
    e.preventDefault();

    if (addingProductId === product.id) return;

    try {
      setAddingProductId(product.id);
      await addCartItem(product.id);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingProductId(null);
    }
  };

  const isProductInCart = React.useCallback(
    (productId: number): boolean => {
      return cartItems.some((item) => item.product.id === productId);
    },
    [cartItems],
  );

  // Fetch products on mount
  React.useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Fetch cart on mount
  React.useEffect(() => {
    const checkCart = async () => {
      try {
        await fetchCart();
      } catch (error) {
        console.error("Error fetching cart: ", error);
      }
    };

    checkCart();
  }, [fetchCart]);

  const validatedGoToPage = React.useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      if (validPage !== currentPage) {
        goToPage(validPage);
      }
    },
    [totalPages, currentPage, goToPage],
  );

  const validatedNextPage = React.useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const validatedPrevPage = React.useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  // Optimize product rendering with React.memo pattern
  const ProductCard = React.memo(({ product }: { product: Product }) => {
    const inCart = isProductInCart(product.id);
    const isAdding = addingProductId === product.id;
    const genderBadge = getGenderBadge(product);

    return (
      <div
        className="product-card"
        onClick={(e) => handleGoToProduct(e, product.id, product.name)}
      >
        <div
          className="product-image-container"
          style={{
            backgroundImage: `url(${product.imageUrl})`,
          }}
        ></div>

        {product.tone && (
          <div className="product-tone-preview">
            {product.tone.split(/[-–]/)[0]}
          </div>
        )}

        <div className="product-content">
          <h3 className="product-name">
            {product.name}
            {genderBadge && <span className="gender-badge">{genderBadge}</span>}
          </h3>
          <p className="product-description">-{product.shortDescription}</p>
          <p className="product-price">{formatCurrency(product.price)}</p>

          <div className="button-container">
            {inCart ? (
              <div className="cart-item-quantity">
                <span className="in-cart-badge">(in cart)</span>
                <Link
                  to="/cart"
                  className="view-cart-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Cart
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="-0.75 -0.75 16 16"
                    stroke="currentColor"
                    aria-hidden="true"
                    id="Arrow-Right--Streamline-Heroicons-Outline"
                    height="16"
                    width="16"
                  >
                    <desc>
                      Arrow Right Streamline Icon: https://streamlinehq.com
                    </desc>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.15625 2.71875 12.6875 7.25m0 0 -4.53125 4.53125M12.6875 7.25H1.8125"
                      strokeWidth="1.5"
                    ></path>
                  </svg>
                </Link>
              </div>
            ) : (
              <button
                className={`add-btn ${isAdding ? "adding" : ""}`}
                onClick={(e) => handleAddBtn(e, product)}
                disabled={isAdding || isAddingToCart}
                aria-label={`Add ${product.name} to cart`}
              >
                {isAdding ? "Adding..." : "Add to Cart"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  });

  ProductCard.displayName = "ProductCard";

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
        <div className="loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <span className="error-msg">{error}</span>
        <button className="retry-btn" onClick={() => fetchAllProducts()}>
          Retry
        </button>
      </div>
    );
  }

  if (!currentProducts || currentProducts.length === 0) {
    return (
      <div className="empty-container">
        <p>No products match your filters</p>
        <button className="clear-filters-btn" onClick={() => clearAllFilters()}>
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Filter and sort controls */}
      <div className="filter-sort-controls">
        <div className="controls-row">
          <div className="filter-control">
            <label htmlFor="gender-filter">Filter by:</label>
            <select
              id="gender-filter"
              value={filters.category || ""}
              onChange={(e) => handleCategoryFilter(e.target.value || null)}
              className="filter-dropdown"
            >
              <option value="">All Categories</option>
              {availableCategories.length > 0 ? (
                availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))
              ) : (
                <>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </>
              )}
            </select>
          </div>

          <div className="sort-control">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="sort-dropdown"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products count info */}
      <div className="products-info">
        <p className="products-count">
          Showing {(currentPage - 1) * productsPerPage + 1}-
          {Math.min(currentPage * productsPerPage, filteredProducts.length)} of{" "}
          {filteredProducts.length} products
          {filters.category && (
            <span className="active-filter">
              {" "}
              • Filtered by: {filters.category}
            </span>
          )}
        </p>
      </div>

      {/* Products grid */}
      <div className="products-grid">
        {currentProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination - Only show if we have more than 1 page */}
      {totalPages > 1 && (
        <ShopPagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={validatedGoToPage}
          nextPage={validatedNextPage}
          prevPage={validatedPrevPage}
        />
      )}
    </>
  );
}
