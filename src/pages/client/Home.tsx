import React from "react";
import "../../styles/Home.scss";
import FeaturedProducts from "../../components/FeaturedProducts";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

export default function Home() {
    const { fetchCart } = useCart();
  
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 800;
  const handleShopNow = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/shop");
  };

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
    }, [fetchCart])

  return (
    <div className={isMobile ? "home-mobile" : "home"}>
      <div className={isMobile ? "landing-mobile" : "landing"}>
        <div className={isMobile ? "landing-text-mobile" : "landing-text"}>
          <h1>Welcome to Scent Galore</h1>
          <p>Discover the finest fragrances for your everyday indulgence.</p>
          <span>Elevate Your Scent Experience</span>
        </div>
        <div>
          <button
            className={isMobile ? "shop-btn-mobile" : "shop-btn"}
            onClick={(e) => handleShopNow(e)}
          >
            Shop
          </button>
        </div>
      </div>
      <div
        className={isMobile ? "featured-products-mobile" : "featured-products"}
      >
        <h2>Featured Products</h2>
        <div className={isMobile ? "products-list-mobile" : "products-list"}>
          <FeaturedProducts />
        </div>
      </div>
      <div className={isMobile ? "about-us-mobile" : "about-us"}>
        <h2>About Us</h2>
        <p>
          At Scent Galore, we curate the best fragrances to enhance your
          lifestyle. Our collection features a wide range of perfumes and
          essential oils, each crafted with care to provide a unique scent
          experience. You can come pick your lovely perfume from our store but
          we can also deliver to your specific location.
        </p>
      </div>
    </div>
  );
}
