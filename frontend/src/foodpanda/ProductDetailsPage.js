import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../component/Navbar"; // Import Navbar component
import Footer from "../component/Footer"; // Import Footer component
import "./ProductDetailsPage.css"; // Import CSS for styling

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the useParams hook to get the productId from the URL
  const { productId } = useParams();

  useEffect(() => {
    // Fetch product details using the productId from the URL
    axios
      .get(`http://localhost:5000/api/product/${productId}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
        setError("Error fetching product details");
        setLoading(false);
      });
  }, [productId]); // Re-run the effect when productId changes

  // Add to Cart Functionality
  const handleAddToCart = async () => {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      alert("Please log in to add products to your cart.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/cart", {
        user_id,
        product_id: product.product_id,
        quantity: 1,
      });
      alert(response.data.message || "Product added to cart successfully!");
    } catch (err) {
      console.error("Error adding product to cart:", err);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-details-page">
      <Navbar /> {/* Navbar at the top */}

      <div className="product-containers">
        <div className="product-cards">
          <img src={product.image_path} alt={product.name} className="product-images" />
          <div className="product-info">
            <h2>{product.name}</h2>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Rating:</strong> {product.rating}</p>
            <button onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>

      <Footer /> {/* Footer at the bottom */}
    </div>
  );
};

export default ProductDetailsPage;
