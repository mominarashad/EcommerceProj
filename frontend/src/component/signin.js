import React, { useState } from 'react';
import { Field, Form as FormikForm, Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signin.css'; // Import custom CSS file for animations

// Validation schema for sign in
const signInValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Required'),
  password: Yup.string().required('Required'),
});

function SignIn() {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    console.log('Form values:', values);

    try {
      const response = await axios.post('http://localhost:5000/api/login', values);

      if (response.status === 200) {
        const { user_id, role } = response.data;
        localStorage.setItem('user_id', user_id); // Store user_id in localStorage
        alert('Login successful'); // Get the role from the response

        // Redirect based on the role
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (err) {
      console.error('Error during sign in:', err.response?.data || err.message);
      setErrorMessage(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="signin-containers">
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md="6" lg="4">
            {errorMessage && (
              <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible className="fade-alert">
                {errorMessage}
              </Alert>
            )}
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={signInValidationSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <FormikForm className="signin-form border p-4 form-container bg-dark text-white shadow-lg animate__animated animate__fadeIn">
                  <h2 className="text-center text-white">Sign In</h2>
                  <Form.Group className="mb-3">
                    <Form.Label>Email:</Form.Label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="form-control field-transition"
                    />
                    <ErrorMessage name="email" component="div" className="error" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password:</Form.Label>
                    <Field
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="form-control field-transition"
                    />
                    <ErrorMessage name="password" component="div" className="error" />
                  </Form.Group>
                  <div className="text-center mt-4">
                    <Button variant="primary" type="submit" className="btn-hover">
                      Sign In
                    </Button>
                  </div>
                </FormikForm>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignIn;
