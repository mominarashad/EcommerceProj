import React, { useState } from 'react';
import axios from 'axios';
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import './ContactForm.css'; // Import CSS for styling

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [responseMessage, setResponseMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null); // Track success or failure

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/contact', formData);
            setResponseMessage(response.data.message);
            setIsSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setResponseMessage('Failed to send message. Please try again.');
            setIsSuccess(false);
        }
    };

    return (
        <div className="contact-page">
            {/* Navbar Component */}
            
            <Navbar />
            <div className="contact-form-container">
                <h2 className="form-title">Contact Us</h2>
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="input-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Subject:</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Message:</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="submit-btn">Submit</button>
                </form>
                {responseMessage && (
                    <p className={`response-message ${isSuccess ? 'success' : 'failure'}`}>
                        {responseMessage}
                    </p>
                )}
            </div>

            {/* Footer Component */}
            <Footer />
        </div>
    );
};

export default ContactForm;
