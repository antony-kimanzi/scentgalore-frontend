/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../hooks/useCart"; // Add this import
import { useNavigate } from "react-router-dom"; // Add this import
import "../styles/FeaturedProducts.scss";

export default function FeaturedProducts() {
  const {
    products,
    isLoading,
    error,
    fetchAllProducts,
    getFeaturedProductsByTone,
    getAllProductTones,
    availableTones,
    availableFullTones,
  } = useProduct();

  const { addCartItem, cartItems, isAddingToCart } = useCart(); // Add cart hook
  const navigate = useNavigate(); // Add navigate hook

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  useEffect(() => {
    if (products.length > 0) {
      const filteredProducts = getFeaturedProductsByTone();
      setFeaturedProducts(filteredProducts);
    }
  }, [products, getFeaturedProductsByTone]);

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return "KES " + amount.toFixed(2);
    }
  };

  const handleToneClick = (tone: string) => {
    setSelectedTone(tone === selectedTone ? null : tone);
  };

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: number
  ): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    if (addingProductId === productId) return;

    try {
      setAddingProductId(productId);
      await addCartItem(productId);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setAddingProductId(null);
    }
  };

  const handleViewProduct = (e: React.MouseEvent, id: number, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${id}/${name}`);
  };

  const isProductInCart = React.useCallback(
    (productId: number): boolean => {
      return cartItems.some((item) => item.product.id === productId);
    },
    [cartItems]
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading featured products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
        <button onClick={fetchAllProducts} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="featured-products-section">
      <div className="section-header">
        <h2>Fragrance Families</h2>
        <p className="section-subtitle">
          Explore scents by their unique tone combinations
        </p>

        {availableTones.length > 0 && (
          <div className="tones-filter">
            <p className="filter-label">Filter by fragrance note:</p>
            <div className="tones-grid">
              {availableTones.slice(0, 10).map((tone) => (
                <button
                  key={tone}
                  className={`tone-filter-btn ${selectedTone === tone ? "active" : ""}`}
                  onClick={() => handleToneClick(tone)}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="featured-products-grid">
        {featuredProducts.length > 0 ? (
          featuredProducts.map((product) => {
            const allTones = product.allTones || getAllProductTones(product);
            const fullTone = product.tone || allTones.join(" – ");
            const inCart = isProductInCart(product.id);
            const isAdding = addingProductId === product.id;

            return (
              <div
                key={product.id}
                className="product-card"
                onClick={(e) => handleViewProduct(e, product.id, product.name)}
              >
                <div className="product-image-wrapper">
                  <div
                    className="product-image"
                    style={{
                      backgroundImage: `url(${product.imageUrl || "/placeholder-image.jpg"})`,
                    }}
                  />
                  <div className="product-tone-badge">
                    {product.featuredTone || allTones[0]}
                  </div>
                </div>

                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>

                  <div className="product-tones">
                    <span className="full-tone">{fullTone}</span>
                    <div className="tone-breakdown">
                      {allTones.map((tone: string, index: number) => (
                        <span key={index} className="individual-tone">
                          {tone}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="product-description">
                    {product.description?.substring(0, 80)}
                    {product.description && product.description.length > 80
                      ? "..."
                      : ""}
                  </p>

                  <div className="product-footer">
                    <span className="product-price">
                      {formatCurrency(product.price || 0)}
                    </span>
                    {inCart ? (
                      <span className="in-cart-badge">In Cart</span>
                    ) : (
                      <button
                        className={`add-btn ${isAdding ? "adding" : ""}`}
                        onClick={(e) => handleAddToCart(e, product.id)}
                        disabled={isAdding || isAddingToCart}
                      >
                        {isAdding ? "Adding..." : "Add to Cart"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : products.length > 0 ? (
          // Fallback: show first 8 products
          products.slice(0, 8).map((product) => {
            const inCart = isProductInCart(product.id);
            const isAdding = addingProductId === product.id;

            return (
              <div
                key={product.id}
                className="product-card"
                onClick={(e) => handleViewProduct(e, product.id, product.name)}
              >
                <div className="product-image-wrapper">
                  <div
                    className="product-image"
                    style={{
                      backgroundImage: `url(${product.imageUrl || "/placeholder-image.jpg"})`,
                    }}
                  />
                </div>

                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  {product.tone && (
                    <div className="product-tones">
                      <span className="full-tone">{product.tone}</span>
                    </div>
                  )}
                  <p className="product-description">
                    {product.description?.substring(0, 80)}
                    {product.description && product.description.length > 80
                      ? "..."
                      : ""}
                  </p>

                  <div className="product-footer">
                    <span className="product-price">
                      {formatCurrency(product.price || 0)}
                    </span>
                    {inCart ? (
                      <span className="in-cart-badge">In Cart</span>
                    ) : (
                      <button
                        className={`add-btn ${isAdding ? "adding" : ""}`}
                        onClick={(e) => handleAddToCart(e, product.id)}
                        disabled={isAdding || isAddingToCart}
                      >
                        {isAdding ? "Adding..." : "Add to Cart"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-products-message">
            <p>No products available at the moment.</p>
          </div>
        )}
      </div>

      {availableFullTones.length > 0 && (
        <div className="full-tones-section">
          <h3>All Fragrance Combinations</h3>
          <div className="full-tones-grid">
            {availableFullTones.slice(0, 20).map((fullTone, index) => (
              <div key={index} className="full-tone-item">
                {fullTone}
              </div>
            ))}
          </div>
          {availableFullTones.length > 20 && (
            <p className="more-tones-note">
              ...and {availableFullTones.length - 20} more fragrance
              combinations
            </p>
          )}
        </div>
      )}
    </section>
  );
}
