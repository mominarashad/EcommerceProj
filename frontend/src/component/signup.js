import React, { useState } from 'react';
import { Container, Row, Col, Alert, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './signup.css'; // Ensure this links to the updated CSS

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setIsSuccess(true);
        setMessage('Registration successful! You can now log in.');
      } else {
        setMessage('Signup failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <Container className="form-container">
        <Row>
          <Col className="signup-section">
            <h2 className="animate-fade-in">Welcome!</h2>
            <p>Create an account by filling in the details below:</p>
            <form onSubmit={handleSubmit} className="signup-form animate-fade-in">
              {message && <Alert variant={isSuccess ? 'success' : 'danger'}>{message}</Alert>}

              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="example@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-3" 
                style={{ backgroundColor: '#66785F', color: '#FFFFFF', border: 'none' }}>
                Create Account
              </Button>
            </form>
            <p className="signin-link mt-3">
              Already have an account? <Link to="/signin">Sign In here</Link>.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignUp;
