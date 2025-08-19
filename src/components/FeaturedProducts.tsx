import React from "react";
import type { Product } from "../types/product";
import { featuredProducts } from "../data/products";
import "../styles/FeaturedProducts.scss";

export default function FeaturedProducts() {
  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return "invalid amount";
    }
  };

  return (
    <div className="featured-products-grid">
      {featuredProducts.map((product: Product) => (
        <div key={product.id} className="product-card">
          <div
            style={{
              backgroundImage: `url(${product.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              maxWidth: "100%",
              height: "250px",
              // borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          ></div>
          <h3 className="product-name">{product.name}</h3>
          <h3 className="product-description">-{product.description}</h3>
          <p className="product-price">{formatCurrency(product.price)}</p>
          <button className="add-btn">Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
