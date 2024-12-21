import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./ShopCards.css"; // Custom styling

const shops = [
  {
    name: "Food Shop",
    images: ["/images/f3.jpeg", "/images/f4.jpeg", "/images/f1.jpeg", "/images/f2.jpeg"],
    path: "/food-shop", // Add path for routing
  },
  {
    name: "Electronics Shop",
    images: ["/images/m1.jpeg", "/images/m2.jpeg", "/images/m3.jpeg", "/images/m4.jpeg"],
    path: "/electronics-shop", // Add path for routing
  },
  {
    name: "Dresses Shop",
    images: ["/images/d1.jpeg", "/images/d2.jpeg", "/images/d3.jpeg", "/images/d4.jpeg"],
    path: "/dresses-shop", // Add path for routing
  },
  {
    name: "Grocery Shop",
    images: ["/images/g1.jpeg", "/images/g2.jpeg", "/images/g3.jpeg", "/images/g4.jpeg"],
    path: "/grocery-shop", // Add path for routing
  },
];

const ShopCards = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(
    Array(shops.length).fill(0)
  );
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevState) =>
        prevState.map((index, i) => (index + 1) % shops[i].images.length)
      );
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const handleViewShopClick = (path) => {
    navigate(path); // Navigate to the specific shop page
  };

  return (
    <div className="shop-page-container">
      <Navbar />
      <div className="content-container">
        <div className="sidebar">
          <h3 className="sidebar-heading">Shops</h3>
          <ul>
            {shops.map((shop, index) => (
              <li key={index} className="sidebar-item">
                {shop.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="shop-cards-section">
          <h2 className="section-heading">Explore Categories</h2>
          <div className="shop-cards-container">
            {shops.map((shop, index) => (
              <div key={index} className="shop-card">
                <img
                  src={shop.images[currentImageIndex[index]]}
                  alt={shop.name}
                  className="shop-image"
                />
                <h3>{shop.name}</h3>
                <button
                  className="view-shop-button"
                  onClick={() => handleViewShopClick(shop.path)} // Add click handler
                >
                  View Shop
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopCards;
