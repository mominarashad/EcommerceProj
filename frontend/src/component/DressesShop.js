import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./ShopCards.css"; // Custom styling

const shops = [
  {
    name: "Khaadi",
    images: ["/images/khaadi1.jpeg", "/images/khaadi2.jpeg", "/images/khaadi3.jpeg", "/images/khaadi4.jpeg"],
    path: "/dresses/khaddi", // Add path for routing
  },
  {
    name: "Sapphire",
    images: ["/images/sapp1.jpeg", "/images/sapp2.jpeg", "/images/sapp3.jpeg", "/images/sapp4.jpeg"],
    path: "/dresses/sapphire", // Add path for routing
  },
  {
    name: "J.",
    images: ["/images/j.1.png", "/images/j.2.png", "/images/j.3.png", "/images/j.4.png"],
    path: "/dresses/j", // Add path for routing
  },
  {
    name: " Alkaram",
    images: ["/images/al1.jpeg", "/images/al2.jpeg", "/images/al3.jpeg", "/images/al4.jpeg"],
    path: "/dresses/alkaram", // Add path for routing
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
