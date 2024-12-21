import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddProduct.css";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product details
    axios
      .get(`http://localhost:5000/hello/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product:", err));
    
    // Fetch brands for the dropdown
    axios
      .get("http://localhost:5000/hello/brands")
      .then((res) => setBrands(res.data))
      .catch((err) => console.error("Error fetching brands:", err));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/hello/products/${id}`, product)
      .then(() => {
        alert("Product updated successfully!");
        navigate("/products"); // Redirect back to the product list
      })
      .catch((err) => console.error("Error updating product:", err));
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="form-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="product_name"
          value={product.product_name}
          onChange={handleInputChange}
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleInputChange}
          placeholder="Price"
          required
        />
        <input
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleInputChange}
          placeholder="Stock"
        />
        <textarea
          name="description"
          value={product.description}
          onChange={handleInputChange}
          placeholder="Description"
        ></textarea>
        <select
          name="brand_id"
          value={product.brand_id}
          onChange={handleInputChange}
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
          value={product.image_path}
          onChange={handleInputChange}
          placeholder="Image Path"
          required
        />
        <button type="submit">Update Product</button>
        <button type="button" onClick={() => navigate("/products")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
