import Sidebar from './SlidingBar'; // Import the Sidebar component
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt, FaTrash, FaBox, FaStar, FaExclamationCircle, FaPlus } from "react-icons/fa";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [topSelling, setTopSelling] = useState(null);
  const [leastSelling, setLeastSelling] = useState(null);
  const navigate = useNavigate();

  // Fetch products and calculate stats when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/hello/products")
      .then((res) => {
        setProducts(res.data);

        // Calculate Top Selling and Least Selling products
        if (res.data.length > 0) {
          const sortedProducts = [...res.data].sort((a, b) => b.sales - a.sales); // Sort by sales descending
          setTopSelling(sortedProducts[0]); // Highest selling product
          setLeastSelling(sortedProducts[sortedProducts.length - 1]); // Lowest selling product
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Function to handle editing a product
  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`); // Redirects to the EditProduct component
  };

  // Function to handle deleting a product
  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios
        .delete(`http://localhost:5000/hello/products/${productId}`)
        .then((response) => {
          alert("Product deleted successfully!");
          // Update product list after deletion
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.product_id !== productId)
          );
        })
        .catch((err) => console.error("Error deleting product:", err));
    }
  };

  return (
    <div className="product-list-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-contents">
        {/* Cards Section */}
        <div className="card-section">
          <div className="card green-card">
            <FaBox className="card-icon" />
            <h3>Total Products</h3>
            <p>{products.length}</p>
          </div>
          <div className="card blue-card">
            <FaStar className="card-icon" />
            <h3>Top Selling</h3>
            <p>{topSelling ? topSelling.product_name : "N/A"}</p>
          </div>
          <div className="card red-card">
            <FaExclamationCircle className="card-icon" />
            <h3>Least Selling</h3>
            <p>{leastSelling ? leastSelling.product_name : "N/A"}</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="product-table-container">
          <div className="product-header">
            <button
              onClick={() => navigate("/add-product")}
              className="add-product-button mustard-button"
            >
              <FaPlus style={{ marginRight: "5px" }} /> Add Product
            </button>
          </div>
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Brand</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.product_id}>
                    <td>
                      <img
                        src={product.image_path}
                        alt={product.name}
                        className="product-image"
                      />
                    </td>
                    <td>{product.product_name}</td>
                    <td>€{product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.brand_name || "No Brand"}</td>
                    <td>
                      {/* Edit Button */}
                      <button
                        className="action-button edit-button green-button"
                        onClick={() => handleEdit(product.product_id)}
                      >
                        <FaPencilAlt />
                      </button>
                      {/* Delete Button */}
                      <button
                        className="action-button delete-button red-button"
                        onClick={() => handleDelete(product.product_id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
