import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./ShopCards.css"; // Custom styling

const shops = [
  {
    name: "KFC",
    images: ["/images/k1.jpeg", "/images/k2.jpeg", "/images/k3.jpeg", "/images/k4.jpeg"],
    path: "/foods/KFC", // Add path for routing
  },
  {
    name: "Macdonald",
    images: ["/images/p1.jpeg", "/images/p2.jpeg", "/images/p3.jpeg", "/images/p4.jpeg"],
    path: "/foods/Macdonald", // Add path for routing
  },
  {
    name: "Kababjees",
    images: ["/images/q1.jpeg", "/images/q2.jpeg", "/images/q3.jpeg", "/images/q4.jpeg"],
    path: "/foods/Kababjees", // Add path for routing
  },
  {
    name: "Jonny & Jugnu",
    images: ["/images/j1.jpeg", "/images/j2.jpeg", "/images/j3.jpeg", "/images/j4.jpeg"],
    path: "/foods/Jonnys", // Add path for routing
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
          <h3 className="sidebar-heading">Food Brands</h3>
          <ul>
            {shops.map((shop, index) => (
              <li key={index} className="sidebar-item">
                {shop.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="shop-cards-section">
          <h2 className="section-heading">Explore Food Brands</h2>
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
