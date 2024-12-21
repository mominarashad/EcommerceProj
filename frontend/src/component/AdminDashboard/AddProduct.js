import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddProduct.css";
import { useNavigate } from "react-router-dom";

const AddProduct = ({ onClose }) => {
  const [brands, setBrands] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    brand_id: "",
    image_path: "",
  });

  // Initialize navigate hook
  const navigate = useNavigate();

  // Fetch Brands for the Dropdown
  useEffect(() => {
    axios
      .get("http://localhost:5000/hello/brands")
      .then((res) => setBrands(res.data))
      .catch((err) => console.error("Error fetching brands:", err));
  }, []);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Submit Form Data
  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/hello/products", newProduct)
      .then(() => {
        alert("Product added successfully!");
        onClose(); // Close the form after submission
      })
      .catch((err) => console.error("Error adding product:", err));
  };

  return (
    <div className="overlay">
      <div className="form-container">
        <h2>Add New Product</h2>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newProduct.description}
            onChange={handleInputChange}
          ></textarea>
          <select
            name="brand_id"
            value={newProduct.brand_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.brand_id} value={brand.brand_id}>
                {brand.brand_name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="image_path"
            placeholder="Image Path"
            value={newProduct.image_path}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Add Product</button>
          {/* Navigate to /products when Cancel is clicked */}
          <button type="button" onClick={() => navigate('/products')}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
