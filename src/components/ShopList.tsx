import React from "react";
import type { Product } from "../types/product";
import { products, cart } from "../data/products";
import '../styles/ShopList.scss'
import { Link } from "react-router-dom";

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
      {products.map((product: Product) => {
        const cartItem = cart.find((item: Product) => item.id === product.id);
        return (
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
            {cartItem ? (
              <div className="cart-item-quantity">
                <span>(in cart)</span>
                {/* <div className="quantity-controls">
                  <button className="decrease-btn">
                    -
                  </button>
                  <span className="quantity-value">
                    {cartItem.quantity || 1}
                  </span>
                  <button>
                    +
                  </button>
                </div> */}
                <Link to="/cart" className="view-cart-btn">
                  View Cart<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-0.75 -0.75 16 16" stroke="#000000" aria-hidden="true" id="Arrow-Right--Streamline-Heroicons-Outline" height="16" width="16">
  <desc>
    Arrow Right Streamline Icon: https://streamlinehq.com
  </desc>
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.15625 2.71875 12.6875 7.25m0 0 -4.53125 4.53125M12.6875 7.25H1.8125" stroke-width="1.5"></path>
</svg></Link>
              </div>
            ) : (
              <button className="add-btn">Add to Cart</button>
            )}
          </div>
        );
      })}
    </div>
  );
}
