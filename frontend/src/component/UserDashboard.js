import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./UserDashboard.css";
import axios from "axios";

const backgroundImages = [
  "https://cdn.pixabay.com/photo/2017/11/25/17/17/sandwich-2977251_1280.jpg",
  "https://tse2.mm.bing.net/th?id=OIP.xQ7MymkW54eiANcUGi2VXgHaEK&pid=Api&P=0&h=220",
  "https://cdn.pixabay.com/photo/2024/04/11/16/20/business-8690142_640.jpg",
  "https://cdn.pixabay.com/photo/2016/03/02/20/13/grocery-1232944_1280.jpg",
];

const productImages = [
  "https://cdn.shopify.com/s/files/1/0623/6481/1444/files/FW_27-24-CREAM-1_aaf013c9-2c6c-4028-a19e-d8adfef23a37.jpg?v=1727100073",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0g0B60gm0-ik_bV-PjJsTd3kkeuGA8g-ysw&s",
  "https://mcdonalds.com.pk/wp-content/uploads/2022/08/05-Double-Cheese-Burger-178x178.png",
  "https://www.junaidjamshed.com/media/catalog/product/j/s/jst-24-1609s_3_.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=755&width=589&canvas=589:755",
];

function Dashboard() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();  // Initialize useNavigate hook

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/search?term=${encodeURIComponent(searchTerm)}`
      );
      setSearchResults(response.data);
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  };

  const handleBuyNow = (productId) => {
    // Navigate to the checkout page or product detail page
    navigate(`/product/${productId}`);  // Change the path as per your routing setup
  };

  return (
    <div
      className="dashboard"
      style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}
    >
      <Navbar />
      <div className="content">
        <div className="dashboard-header">
          <h1 className="dashboard-heading">Welcome to MegaMart</h1>
        </div>

        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search products..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>🔍</button>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="carousel-section">
        <div className="carousel">
          {/* Placeholder for carousel content if needed */}
        </div>
      </div>

      {/* Search Results Section */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <div className="product-list">
            {searchResults.map((product, idx) => (
              <div key={idx} className="product-item">
                <img
                  src={product.image_path || productImages[idx % productImages.length]}
                  alt={product.product_name}
                  className="product-image"
                />
                <h3>{product.product_name}</h3>
                <p>${product.price}</p>
                <button
                  className="buy-now-button"
                  onClick={() => handleBuyNow(product.product_id)}  // Pass product ID to handleBuyNow
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products Section */}
      <div className="featured-products">
        <h2>Top Selling Products</h2>
        <div className="product-list">
          {productImages.map((image, idx) => (
            <div key={idx} className="product-item">
              <img src={image} alt={`Product ${idx + 1}`} className="product-image" />
              <button
                className="buy-now-button"
                onClick={() => handleBuyNow(idx + 1)}  // Assuming product IDs are sequential
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
