import React from "react";
import { useCart } from "../../hooks/useCart";
import "../../styles/Shop.scss";
import ShopList from "../../components/ShopList";

export default function Shop() {
  const { fetchCart } = useCart();

  const isMobile: boolean = window.innerWidth <= 800;

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
  return (
    <>
      {isMobile ? (
        <div className="shop-mobile">
          <div className="header-section-mobile">
            <h1>shop</h1>
            <h3>Entire Collection</h3>
          </div>
          <div className="products-section-mobile">
            <ShopList />
          </div>
        </div>
      ) : (
        <div className="shop">
          <div className="header-section">
            <h1>shop</h1>
            <h3>Entire Collection</h3>
          </div>
          <div className="products-section">
            <ShopList />
          </div>
        </div>
      )}
    </>
  );
}
