import React from "react";
import type { Product } from "../types/product";
import { products } from "../data/products";
import '../styles/ShopList.scss'

export default function ShopList() {
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
  return (
    <div className='products-grid'>
      {products.map((product: Product) => (
        <div key={product.id} className="product-card">
          <div
            style={{
              backgroundImage: `url(${product.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "100%",
              height: "250px",
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
