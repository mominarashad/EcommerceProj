import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { FaSortUp, FaSortDown, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa"; // Importing React Icons
import "../foodpanda/KFC.css";

const KababjeesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dresses/j")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Kababjees products:", err);
        setError("Error fetching Kababjees products");
        setLoading(false);
      });
  }, []);

  const handleSort = (sortBy) => {
    let sortedProducts = [...products];

    if (sortBy === "price-high-to-low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "price-low-to-high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "A-to-Z") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Z-to-A") {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    setProducts(sortedProducts);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    handleSort(e.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-container">
      <Navbar />

      <div className="main-content">
        <div className="content">
          <div className="sort-container">
            <label htmlFor="filter">Sort By: </label>
            <div className="sort-buttons">
              <button onClick={() => handleSort("price-high-to-low")} title="Price: High to Low">
                <FaSortDown />
              </button>
              <button onClick={() => handleSort("price-low-to-high")} title="Price: Low to High">
                <FaSortUp />
              </button>
              <button onClick={() => handleSort("A-to-Z")} title="Name: A to Z">
                <FaSortAlphaDown />
              </button>
              <button onClick={() => handleSort("Z-to-A")} title="Name: Z to A">
                <FaSortAlphaUp />
              </button>
            </div>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <div className="cardS" key={product.product_id}>
                <img src={product.image_path} alt={product.name} className="card-images" />
                <div className="card-details">
                  <h4>{product.name}</h4>
                  <p>Price: Rs{product.price}</p>
                  <Link to={`/product/${product.product_id}`} className="details-button">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default KababjeesPage;
