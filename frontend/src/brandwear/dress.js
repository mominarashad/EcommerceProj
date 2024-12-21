import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard.js"; // Importing the ProductCard component

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching data from the backend
    axios
      .get("http://localhost:5000/api/dresses")
      .then((response) => {
        setProducts(response.data); // Storing fetched data in state
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
        setError("Error fetching products");
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  if (loading) return <p>Loading products...</p>; // Loading state
  if (error) return <p>{error}</p>; // Error state

  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))
      ) : (
        <p>No products available.</p> // No products state
      )}
    </div>
  );
};

export default App;
