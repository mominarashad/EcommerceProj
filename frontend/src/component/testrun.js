import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Static mapping of product IDs to image URLs
const imageLinks = {
  1: 'https://up.yimg.com/ib/th?id=OIP.C6GhXnRJ_T5q75s9AIkWgwHaE8&pid=Api&rs=1&c=1&qlt=95&w=181&h=121', // Image link for product 1 (Burger)
  2: 'https://up.yimg.com/ib/th?id=OIP.H07SGPpx-swRy0WfmnDIdwHaHa&pid=Api&rs=1&c=1&qlt=95&w=121&h=121', // Image link for product 2 (Pizza)
  3: 'https://tse1.mm.bing.net/th?id=OIP.VL4KOk61WlOC62OMHTb5WwHaE8&pid=Api&P=0&h=220', // Image link for product 3 (Sushi)
  // Add more image links as needed
};

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from the backend (Your API endpoint for products)
  useEffect(() => {
    axios
      .get('http://localhost:8081/api/products') // Adjust the URL to your backend API
      .then((response) => {
        setProducts(response.data); // Set the products data from the database
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, []);

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.product_id} className="product-card">
          {/* Dynamically assign image based on product ID */}
          <img 
            src={imageLinks[product.product_id]} // Map image URL using product ID
            alt={product.name} 
            className="product-image"
          />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <p>Rating: {product.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
