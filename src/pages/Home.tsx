import React from 'react'
import '../styles/Home.scss'
import FeaturedProducts from '../components/FeaturedProducts';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const handleShopNow = (e: React.MouseEvent) => {
      e.preventDefault();
      navigate("/shop");
    };

  return (
    <div className='home'>
      <div className="landing">
        <div className='landing-text'>
          <h1>Welcome to Scent Galore</h1>
          <p>Discover the finest fragrances for your everyday indulgence.</p>
          <span>Elevate Your Scent Experience</span>
        </div>
        <div><button className='shop-btn' onClick={e => handleShopNow(e)}>Shop</button></div>
      </div>
      <div className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-list">
          <FeaturedProducts />
        </div>
      </div>
      <div className="about-us">
        <h2>About Us</h2>
        <p>At Scent Galore, we curate the best fragrances to enhance your lifestyle. Our collection features a wide range of perfumes and essential oils, each crafted with care to provide a unique scent experience. You can come pick your lovely perfume from our store but we can also deliver to your specific location.</p>
      </div>
    </div>
  )
}
