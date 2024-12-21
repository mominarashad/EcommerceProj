// SignIn.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from './component/signin';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('SignIn Component', () => {
  test('renders SignIn form correctly', () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );
    
    // Check if the form elements are present
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  test('displays error message for invalid credentials', async () => {
    axios.post.mockResolvedValueOnce({ status: 400, data: { message: 'Invalid email or password' } });

    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText(/Sign In/i));

    await waitFor(() => expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument());
  });

  test('successful sign in redirects based on role', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { role: 'admin' }
    });

    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'adminpassword' } });
    fireEvent.click(screen.getByText(/Sign In/i));

    await waitFor(() => expect(window.location.pathname).toBe('/admin-dashboard'));
  });
});
