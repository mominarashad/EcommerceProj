import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./ShopCards.css"; // Custom styling

const shops = [
  {
    name: "Apple",
    images: ["/images/APPLE.jpeg", "/images/app2.jpg", "/images/app3.jpeg", "/images/app4.jpeg"],
    path: "/electronics/apple", // Add path for routing
  },
  {
    name: "Samsung",
    images: ["/images/samsung.jpg", "/images/sam2.jpeg", "/images/sam3.jpeg", "/images/sam4.jpeg"],
    path: "/electronics/samsung", // Add path for routing
  },
  {
    name: "Haier",
    images: ["/images/haier.jpeg", "/images/haier2.jpeg", "/images/haier3.jpeg", "/images/haier4.jpeg"],
    path: "/electronics/pell", // Add path for routing
  },
  {
    name: " Dawlance",
    images: ["/images/dawlance.jpg", "/images/d2.jpeg", "/images/d3.jpeg", "/images/dw4.jpeg"],
    path: "/electronics/dawlance", // Add path for routing
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
