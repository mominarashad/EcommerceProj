import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'phosphor-react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MegaMart</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/user-dashboard">Home</Link></li>
        <li><Link to="/user-products">Products</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/cart"><ShoppingCart size={24} /></Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
