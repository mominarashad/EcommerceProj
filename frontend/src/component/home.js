import React, { useState, useEffect } from 'react';
import './Glanding.css'; // Import the CSS for styling

const Home = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // List of images for the carousel
  const images = ['/Images/Gro1.jpg', '/Images/Gro2.jpg', '/Images/Clothing.jpg'];

  // Switch images automatically every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prevImage) => (prevImage + 1) % images.length); 
    }, 2000); // Change every 5 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [images.length]);

  // Handle search action
  const handleSearch = () => {
    alert(`Searching for: ${searchTerm}`);
    // You can perform search action here
  };

  return (
    <div className="landing-page">
      {/* Image carousel */}
      <div className="image-container">
        <img src={images[activeImage]} alt="Landing" className="landing-image" />
      </div>

      {/* Centered content */}
      <div className="content">
        <h1>Welcome to Our Mega Mart</h1>
        <p>Your go-to destination for the best products. Discover unmatched quality and the best deals today!</p>
        
        {/* Search bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
