import React from "react";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card" style={{ border: "1px solid #ccc", padding: "16px", margin: "16px", borderRadius: "8px" }}>
      <img
        src={product.image_path}
        alt={product.name}
        style={{ width: "150px", height: "150px", objectFit: "cover" }} // Limit size and maintain aspect ratio
      />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Stock:</strong> {product.stock}</p>
      <p><strong>Rating:</strong> {product.rating}</p>

      {/* Add to Cart Button */}
      <button
        onClick={() => onAddToCart(product.product_id)}
        style={{
          marginTop: "16px",
          padding: "8px 16px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
