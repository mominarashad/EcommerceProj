import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./ShopCards.css"; // Custom styling

const shops = [
  {
    name: "Euro Store",
    images: ["/images/eu1.jpeg", "/images/eu2.jpeg", "/images/eu3.jpeg", "/images/eu4.jpeg"],
    path: "/groceryandcrockery/euro", // Add path for routing
  },
  {
    name: "Imtiaz Store",
    images: ["/images/im1.jpeg", "/images/im2.jpeg", "/images/im3.jpeg", "/images/im4.jpeg"],
    path: "/groceryandcrockery/imtiaz", // Add path for routing
  },
  {
    name: "Al Fatah International",
    images: ["/images/fatah1.png", "/images/fatah2.jpeg", "/images/fatah3.jpeg", "/images/fatah4.jpeg"],
    path: "/groceryandcrockery/alfatah", // Add path for routing
  },
  {
    name: " Carrefour",
    images: ["/images/carr1.jpeg", "/images/carr2.jpeg", "/images/carr3.jpeg", "/images/carr4.jpeg"],
    path: "/groceryandcrockery/carrefour", // Add path for routing
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
          <h3 className="sidebar-heading">Dresses Brands</h3>
          <ul>
            {shops.map((shop, index) => (
              <li key={index} className="sidebar-item">
                {shop.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="shop-cards-section">
          <h2 className="section-heading">Explore Dresses Brands</h2>
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
                  View Brand
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
