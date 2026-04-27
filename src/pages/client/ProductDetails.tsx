import React, { useEffect, useState } from "react";
import { useProduct, type useProductReturn } from "../../hooks/useProduct";
import { useCart } from "../../hooks/useCart";
import { useParams, Link } from "react-router-dom";
import type { IdParams } from "../../utils/types";
import "../../styles/ProductDetails.scss";

export default function ProductDetails() {
  const { fetchProduct, isLoading, product, getProductTone }: useProductReturn =
    useProduct();
  const {
    cartItems,
    addItemQuantity,
    subtractItemQuantity,
    addCartItem,
    isAddingToCart,
    fetchCart
  } = useCart(); // Add isAddingToCart
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  // const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const isMobile = window.innerWidth < 1181;
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : NaN;

  // FIX: Compare cartItem.product.id with product?.id
  const cartItem = cartItems.find((item) => item.product.id === product?.id);

  const handleAddQuantity = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: IdParams
  ) => {
    e.preventDefault();
    setUpdatingItems((prev) => new Set(prev).add(id.toString()));
    try {
      await addItemQuantity(id);
    } catch (err) {
      console.error("Failed to add quantity:", err);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id.toString());
        return newSet;
      });
    }
  };

  const handleSubtractQuantity = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: IdParams
  ) => {
    e.preventDefault();
    setUpdatingItems((prev) => new Set(prev).add(id.toString()));
    try {
      await subtractItemQuantity(id);
    } catch (err) {
      console.error("Failed to subtract quantity:", err);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id.toString());
        return newSet;
      });
    }
  };

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: IdParams
  ): Promise<void> => {
    e.preventDefault();
    setUpdatingItems((prev) => new Set(prev).add("add-to-cart"));
    try {
      await addCartItem(id);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete("add-to-cart");
        return newSet;
      });
    }
  };

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `KSh ${amount.toLocaleString()}`;
    }
  };

  useEffect(() => {
    const loadProductData = async () => {
      if (typeof productId === "number" && !Number.isNaN(productId)) {
        setError(null);
        try {
          await fetchProduct(productId);
        } catch (err) {
          setError("Failed to load product. Please try again.");
          console.error("Product load error:", err);
        }
      } else {
        setError("Invalid product ID.");
      }
    };

    loadProductData();
  }, [fetchProduct, productId]);

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

  if (isLoading) {
    return (
      <div className="loading-container">
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
      <div className={isMobile ? "product-page-mobile" : "product-page"}>
        <div className="error-state">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={isMobile ? "product-page-mobile" : "product-page"}>
        <div className="error-state">
          <div className="error-icon">🔍</div>
          <h2>Product Not Found</h2>
          <p>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/shop">
            <button className="retry-btn">Back to Shop</button>
          </Link>
        </div>
      </div>
    );
  }

  const tone = getProductTone(product);
  const category = Array.isArray(product.category)
    ? product.category[0]
    : product.category;

  const isAdding = updatingItems.has("add-to-cart");

  return (
    <div className={isMobile ? "product-page-mobile" : "product-page"}>
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <span className="current">{product.name}</span>
      </div>

      <div className="content-wrapper">
        <div
          className={isMobile ? "content-section-mobile" : "content-section"}
        >
          {/* Image Section */}
          <div className={isMobile ? "image-section-mobile" : "image-section"}>
            <div className="main-image-container">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' text-anchor='middle' dy='.3em' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              ) : (
                <div className="image-placeholder">
                  <span>📦</span>
                  <span>No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div
            className={isMobile ? "details-section-mobile" : "details-section"}
          >
            {/* Product Header */}
            <div className="product-header">
              <h1>{product.name}</h1>
              <div className="product-subtitle">
                {category && <span className="category-tag">{category}</span>}
                {tone && tone !== "Featured" && (
                  <span className="tone-tag">{tone}</span>
                )}
              </div>
            </div>

            {/* Price Section */}
            <div
              className={isMobile ? "price-section-mobile" : "price-section"}
            >
              <span className={isMobile ? "price-mobile" : "price"}>
                {formatCurrency(product.price)}
              </span>
              <span className="tax-info">Taxes included</span>
            </div>

            {/* Product Actions */}
            <div className="product-actions">
              {cartItem ? (
                <>
                  <div className="cart-status">This item is in your cart</div>
                  <div className="quantity-section">
                    <div className="quantity-label">Quantity:</div>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={(e) => handleSubtractQuantity(e, cartItem.id)}
                        disabled={
                          updatingItems.has(cartItem.id.toString()) ||
                          cartItem.quantity <= 1
                        }
                      >
                        {updatingItems.has(cartItem.id.toString())
                          ? "..."
                          : "−"}
                      </button>
                      <div className="quantity-display">
                        {cartItem.quantity}
                      </div>
                      <button
                        className="quantity-btn"
                        onClick={(e) => handleAddQuantity(e, cartItem.id)}
                        disabled={updatingItems.has(cartItem.id.toString())}
                      >
                        {updatingItems.has(cartItem.id.toString())
                          ? "..."
                          : "+"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => handleAddToCart(e, product.id)}
                  disabled={isAdding || isAddingToCart}
                >
                  {isAdding ? (
                    "Adding..."
                  ) : (
                    <>
                      <span className="btn-icon">🛒</span>
                      Add to Cart
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Product Description */}
            <div className="product-description">
              <h3>Description</h3>
              <div className="description-content">
                {product.description || "No description available."}
              </div>
            </div>

            {/* Product Details */}
            <div className="product-details">
              <h4>Product Details</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Fragrance Tone</span>
                  <span className="detail-value">{tone || "N/A"}</span>
                </div>
                {product.category && (
                  <div className="detail-item">
                    <span className="detail-label">Gender</span>
                    <span className="detail-value">{product.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
