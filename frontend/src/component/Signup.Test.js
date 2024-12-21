// SignUp.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from './component/signup';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('SignUp Component', () => {
  test('renders SignUp form correctly', () => {
    render(<SignUp />);
    
    // Check if the form elements are present
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('displays success message after successful registration', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { message: 'Registration successful! You can now log in.' }
    });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/Sign Up/i));

    await waitFor(() => expect(screen.getByText(/Registration successful!/i)).toBeInTheDocument());
  });

  test('displays error message when registration fails', async () => {
    axios.post.mockResolvedValueOnce({
      status: 400,
      data: { message: 'Signup failed.' }
    });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/Sign Up/i));

    await waitFor(() => expect(screen.getByText(/Signup failed/i)).toBeInTheDocument());
  });
});
