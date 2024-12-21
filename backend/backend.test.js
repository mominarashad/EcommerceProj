const request = require('supertest');
const app = require('./app'); // Assuming your server file is named 'app.js'

describe('Backend API Tests', () => {
  
  // Test for GET /api/foods/KFC route
  describe('GET /api/foods/KFC', () => {
    it('should fetch KFC products', async () => {
      const res = await request(app).get('/api/foods/KFC');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true); // Checking if the response is an array
      expect(res.body.length).toBeGreaterThan(0); // Assuming there are products in the database
    });
  });

  // Test for POST /api/register route
  describe('POST /api/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };
      
      const res = await request(app).post('/api/register').send(newUser);
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
    });

    it('should return error if user already exists', async () => {
      const existingUser = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john.doe@example.com',  // Same email as above
        password: 'password123'
      };
      
      const res = await request(app).post('/api/register').send(existingUser);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });
  });

  // Test for POST /api/login route
  describe('POST /api/login', () => {
    it('should login successfully with correct credentials', async () => {
      const userLogin = {
        email: 'john.doe@example.com',
        password: 'password123'
      };
      
      const res = await request(app).post('/api/login').send(userLogin);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.role).toBe('user'); // Assuming this user is not an admin
    });

    it('should return error for invalid credentials', async () => {
      const invalidLogin = {
        email: 'john.doe@example.com',
        password: 'wrongpassword'
      };

      const res = await request(app).post('/api/login').send(invalidLogin);
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });

  // Test for POST /api/cart route
  describe('POST /api/cart', () => {
    it('should add product to cart', async () => {
      const newItem = {
        user_id: 1, // assuming user_id exists
        product_id: 1, // assuming product_id 1 exists
        quantity: 2
      };
      
      const res = await request(app).post('/api/cart').send(newItem);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product added to cart successfully');
    });

    it('should return error if not enough stock', async () => {
      const newItem = {
        user_id: 1, 
        product_id: 1, 
        quantity: 1000 // Assuming stock is less than 1000
      };
      
      const res = await request(app).post('/api/cart').send(newItem);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Not enough stock');
    });
  });

  // Test for GET /api/cart/:user_id route
  describe('GET /api/cart/:user_id', () => {
    it('should fetch cart items for a user', async () => {
      const user_id = 1; // assuming user_id exists
      const res = await request(app).get(`/api/cart/${user_id}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return empty cart if no items exist', async () => {
      const user_id = 9999; // assuming user_id does not exist or cart is empty
      const res = await request(app).get(`/api/cart/${user_id}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
    });
  });

  // Test for GET /api/products/:product_id route
  describe('GET /api/products/:product_id', () => {
    it('should fetch product details by product_id', async () => {
      const product_id = 1; // assuming product_id exists
      const res = await request(app).get(`/api/products/${product_id}`);
      expect(res.status).toBe(200);
      expect(res.body.product_id).toBe(product_id); // Check if the correct product is returned
    });

    it('should return error if product does not exist', async () => {
      const product_id = 9999; // assuming product_id does not exist
      const res = await request(app).get(`/api/products/${product_id}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Product not found');
    });
  });

});
