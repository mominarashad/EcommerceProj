import React, { useState, useEffect } from 'react';

function App() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8081/product')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Log fetched data
        setProduct(data);
      })
      .catch(error => console.error('Error fetching product:', error));
  }, []);
  
  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>{product.product_name}</h1>
      <p>Price: ${product.price}</p>
      <p>Quantity: {product.quantity}</p>
      
      {/* Display product image */}
      <img 
        src={product.image_url} 
        alt={product.product_name} 
        style={{ maxWidth: '100%', height: 'auto' }} 
      />

      {/* Test image with corrected direct link */}
      {/* <img 
        src="https://ichef.bbci.co.uk/news/999/cpsprodpb/15951/production/_117310488_16.jpg" 
        alt="Test Image" 
        style={{ maxWidth: '100%', height: 'auto' }} 
      /> */}
    </div>
  );
}

export default App;
