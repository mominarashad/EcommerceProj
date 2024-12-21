import React, { useEffect, useState } from "react";
import axios from "axios";

const CartPage = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("Please log in to view your cart.");
      return;
    }

    axios
      .get(`http://localhost:5000/api/cart/${userId}`)
      .then((response) => {
        setCartItems(response.data);
        setError(null);
      })
      .catch((err) => {
        setError("Error fetching cart items.");
      });
  }, [userId]);

  return (
    <div className="cart-page">
      {error && <p className="error">{error}</p>}
      {!error && cartItems.length === 0 && <p>Your cart is empty.</p>}
      {cartItems.length > 0 && (
        <div>
          {cartItems.map((item) => (
            <div key={item.cart_id} className="cart-item">
              <img
                src={item.image_path}
                alt={item.name}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <p>{item.name}</p>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total Price: ${item.price * item.quantity}</p>
              {item.stock === 0 ? (
                <p className="out-of-stock">Out of Stock</p>
              ) : (
                <p>In Stock: {item.stock}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
