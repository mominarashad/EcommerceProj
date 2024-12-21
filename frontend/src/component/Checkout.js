import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Checkout.css'; // Import CSS file

const Checkout = () => {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    city: '',
    postalCode: '',
    phoneNumber: '',
    address: '',
  });

  const [totalCost, setTotalCost] = useState(0); // To store total cost
  const [message, setMessage] = useState(''); // For success/failure message
  const [messageType, setMessageType] = useState(''); // Success or Error message type

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchCartTotal(storedUserId); // Fetch cart total on load
    } else {
      console.log('User is not logged in');
    }
  }, []);

  const fetchCartTotal = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/cart/total/${userId}`);
      setTotalCost(response.data.totalCost); // Set total cost from response
    } catch (error) {
      console.error('Error fetching cart total:', error.response ? error.response.data : error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setMessage('User ID is required.');
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/checkout', {
        userId,
        ...formData,
        totalCost,
      });

      setMessage('Checkout successful! Thank you for your purchase.');
      setMessageType('success');
    } catch (error) {
      setMessage('Error during checkout. Please try again later.');
      setMessageType('error');
      console.error('Error during checkout:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>
      
      {/* Success/Failure Message */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Postal Code:</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Total Cost: Rs.{totalCost}</label>
        </div>
        <button type="submit" className="submit-button">
          Complete Checkout
        </button>
      </form>
    </div>
  );
};

export default Checkout;
