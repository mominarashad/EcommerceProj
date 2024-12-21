import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation
import './CartPage.css'; // Import the CSS file

const Loader = () => (
  <div className="loader">
    <div className="spinner"></div>
  </div>
);

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user_id = localStorage.getItem('user_id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user_id) {
      window.location.href = '/login'; // Redirect if user not logged in
      return;
    }

    axios
      .get(`http://localhost:5000/api/cart/${user_id}`)
      .then((response) => {
        setCartItems(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching cart:', err);
        setError('Error fetching cart items');
        setLoading(false);
      });
  }, [user_id]);

  const handleQuantityChange = (cart_id, newQuantity) => {
    if (newQuantity < 1) return;

    axios
      .put(`http://localhost:5000/api/cart/update/${cart_id}`, { quantity: newQuantity })
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.cart_id === cart_id ? { ...item, quantity: newQuantity } : item
          )
        );
      })
      .catch((err) => {
        console.error('Error updating quantity:', err);
      });
  };

  const handleRemoveItem = (cart_id) => {
    axios
      .delete(`http://localhost:5000/api/cart/remove/${cart_id}`)
      .then(() => {
        setCartItems((prevItems) => prevItems.filter((item) => item.cart_id !== cart_id));
      })
      .catch((err) => {
        console.error('Error removing item:', err);
      });
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.cart_id}>
            <img
              src={item.image_path}
              alt={item.name}
              className="cart-item-image"
            />
            <div className="product-details">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: Rs.{item.price}</p>

              <div className="quantity-selector">
                <button
                  onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemoveItem(item.cart_id)}
                className="remove-button"
              >
                Remove from Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <button onClick={handleProceedToCheckout} className="checkout-button">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
