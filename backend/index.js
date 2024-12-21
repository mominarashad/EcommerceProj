const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require('bcryptjs');

require("dotenv").config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Momina0192004.", // Replace with your password
  database: process.env.DB_NAME || "ecommercefinal",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// Dynamic route to get products by brand
app.get('/brands/:brandName', (req, res) => {
  const { brandName } = req.params;

  const query = `
    SELECT p.product_id, p.name, p.price, p.image_path
    FROM product p
    JOIN brand b ON p.brand_id = b.brand_id
    WHERE b.brand_name = ?
  `;

  db.query(query, [brandName], (err, results) => {
    if (err) {
      console.error("Error fetching products for brand:", err);
      return res.status(500).json({ error: "Error fetching brand products" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No products found for this brand" });
    }

    res.json(results); // Return the products of the requested brand
  });
});

// Search products
app.get("/search", (req, res) => {
  const { term } = req.query; // Get the search term from query parameters
  const query = `
    SELECT 
      p.product_id,
      p.name AS product_name,
      p.price,
      p.stock,
      p.image_path,
      b.brand_name
    FROM 
      product p
    LEFT JOIN 
      brand b 
    ON 
      p.brand_id = b.brand_id
    WHERE 
      p.name LIKE ? OR b.brand_name LIKE ?
  `;

  db.query(query, [`%${term}%`, `%${term}%`], (err, results) => {
    if (err) {
      console.error("Error searching products:", err);
      res.status(500).json({ error: "Error searching products" });
    } else {
      res.json(results);
    }
  });
});


// Route to save form data
app.post('/save-settings', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    gender,
    dateOfBirth,
    address,
    contact,
    cnic,
    officeEmail,
    city,
    state,
    country,
  } = req.body;

  const query = `
    INSERT INTO settings (
      first_name, last_name, email, gender, date_of_birth, address, contact, cnic,
      office_email, city, state, country
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    firstName,
    lastName,
    email,
    gender,
    dateOfBirth,
    address,
    contact,
    cnic,
    officeEmail,
    city,
    state,
    country,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error saving data:', err);
      res.status(500).json({ message: 'Failed to save data' });
    } else {
      res.status(200).json({ message: 'Data saved successfully', id: result.insertId });
    }
  });
});
app.get('/api/earnings', (req, res) => {
  const query = `
    SELECT 
      COUNT(*) AS totalOrders,
      SUM(total_cost) AS totalEarnings,
      SUM(total_cost) AS totalPurchases,
      SUM(CASE WHEN total_cost > 0 THEN 1 ELSE 0 END) AS completedOrders,
      SUM(CASE WHEN total_cost = 0 THEN 1 ELSE 0 END) AS cancelledOrders
    FROM checkout
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error fetching data.' });
    }

    const data = results[0];
    res.json({
      totalOrders: data.totalOrders || 0,
      totalEarnings: data.totalEarnings || 0,
      totalPurchases: data.totalPurchases || 0,
      completedOrders: data.completedOrders || 0,
      cancelledOrders: data.cancelledOrders || 0,
    });
  });
});

// Get feedback data (hardcoded example)
app.get('/api/feedback', (req, res) => {
  res.json([
    { name: 'Positive', value: 60 },
    { name: 'Neutral', value: 25 },
    { name: 'Negative', value: 15 },
  ]);
});
// Endpoint to get top-selling products (top 3)
app.get("/api/products/topselling", (req, res) => {
  const query = `
    SELECT 
    p.product_id, 
    p.name, 
    p.image_path,
    COUNT(c.product_id) AS salesCount
  FROM checkout ch
  JOIN cart c ON ch.user_id = c.user_id
  JOIN product p ON c.product_id = p.product_id
  GROUP BY p.product_id
  ORDER BY salesCount DESC
  LIMIT 1 
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Checkout Route
app.post('/checkout', (req, res) => {
  const { userId, firstname, lastname, email, city, postalCode, phoneNumber, address, totalCost } = req.body;

  // Insert checkout information
  const query = `
    INSERT INTO checkout (user_id, email, firstname, lastname, city, postal_code, phone_number, address, total_cost)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [userId, email, firstname, lastname, city, postalCode, phoneNumber, address, totalCost], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({ message: 'Checkout successful', checkoutId: result.insertId, totalCost });
  });
});

// Get Cart Total
app.get('/cart/total/:userId', (req, res) => {
  const userId = req.params.userId;

  // Fetch cart items for the user with product prices
  db.query(`
    SELECT c.quantity, p.price
    FROM cart c
    JOIN product p ON c.product_id = p.product_id
    WHERE c.user_id = ?
  `, [userId], (err, cartItems) => {
    if (err) return res.status(500).json({ error: err.message });

    // Calculate total cost
    let totalCost = 0;
    cartItems.forEach(item => {
      totalCost += item.quantity * item.price;
    });

    res.status(200).json({ totalCost });
  });
});
// Backend: Remove an item from the cart
app.delete('/api/cart/remove/:cart_id', async (req, res) => {
  const { cart_id } = req.params;

  try {
    const sql = 'DELETE FROM cart WHERE cart_id = ?';
    const [result] = await db.promise().query(sql, [cart_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Cart item removed successfully' });
  } catch (err) {
    console.error('Error removing cart item:', err);
    res.status(500).json({ message: 'Error removing cart item', error: err.message });
  }
});

app.put('/api/cart/update/:cart_id', async (req, res) => {
  const { cart_id } = req.params;
  const { quantity } = req.body;

  console.log('Received update for cart_id:', cart_id, 'with quantity:', quantity); // Log the input

  try {
    // Ensure quantity is greater than 0
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    const sql = 'UPDATE cart SET quantity = ? WHERE cart_id = ?';
    const [result] = await db.promise().query(sql, [quantity, cart_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Cart quantity updated successfully' });
  } catch (err) {
    console.error('Error updating cart quantity:', err);
    res.status(500).json({ message: 'Error updating cart quantity', error: err.message });
  }
});

app.post("/api/cart", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    const sql = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
    await db.promise().query(sql, [user_id, product_id, quantity]);

    res.status(200).json({ message: "Product added to cart successfully!" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
});
// Backend: Get all cart products for the logged-in user
app.get('/api/cart/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const sql = `
      SELECT 
        cart.cart_id, 
        cart.product_id, 
        cart.quantity, 
        product.name, 
        product.price, 
        product.description, 
        product.image_path
      FROM cart
      JOIN product ON cart.product_id = product.product_id
      WHERE cart.user_id = ?`;

    const [cartItems] = await db.promise().query(sql, [user_id]);

    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'No items in cart' });
    }

    res.status(200).json(cartItems);
  } catch (err) {
    console.error('Error fetching cart products:', err);
    res.status(500).json({ message: 'Error fetching cart products', error: err.message });
  }
});


app.get("/admin-contact", async (req, res) => {
  try {
    // Use query instead of execute for promise support
    const [rows, fields] = await db.promise().query(
      "SELECT name, email, subject, message, created_at FROM Contact"
    );

    // Check if no rows are returned
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No contact data found" });
    }

    // Send the rows back as JSON
    res.json(rows);
  } catch (error) {
    console.error("Error fetching contact data:", error.message, error.stack);
    res.status(500).json({ error: "Failed to fetch contact data" });
  }
});

app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  const sql = 'INSERT INTO contact (name, email, subject, message) VALUES (?, ?, ?, ?)';

  db.query(sql, [name, email, subject, message], (err, result) => {
    if (err) {
      console.error('Error saving data:', err);
      res.status(500).send('Error saving data.');
    } else {
      res.status(200).send('Message received!');
    }
  });
});
// Delete a product
app.delete("/hello/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM product WHERE product_id = ?";
  db.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting product:", err);
      res.status(500).send("Error deleting product");
    } else {
      res.send("Product deleted successfully");
    }
  });
});
// Fetch a single product by ID
app.get("/hello/products/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT p.*, b.brand_name
    FROM product p
    LEFT JOIN brand b ON p.brand_id = b.brand_id
    WHERE product_id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      res.status(500).send("Error fetching product");
    } else if (results.length === 0) {
      res.status(404).send("Product not found");
    } else {
      res.json(results[0]); // Return the single product
    }
  });
});

// Update a product
app.put("/hello/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, stock, description, brand_id, image_path } = req.body;
  const query = `
    UPDATE product
    SET name = ?, price = ?, stock = ?, description = ?, brand_id = ?, image_path = ?
    WHERE product_id = ?
  `;
  db.query(
    query,
    [name, price, stock, description, brand_id, image_path, id],
    (err) => {
      if (err) {
        console.error("Error updating product:", err);
        res.status(500).send("Error updating product");
      } else {
        res.send("Product updated successfully");
      }
    }
  );
});

// Fetch Brands
app.get("/hello/brands", (req, res) => {
  db.query("SELECT brand_id, brand_name FROM brand", (err, results) => {
    if (err) {
      console.error("Error fetching brands:", err);
      res.status(500).json({ error: "Failed to fetch brands." });
      return;
    }
    res.json(results);
  });
});

// Add Product
app.post("/hello/products", (req, res) => {
  const { name, price, stock, description, brand_id, image_path } = req.body;
  const query = `
    INSERT INTO product (name, price, stock, description, brand_id, image_path)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [name, price, stock, description, brand_id, image_path],
    (err, results) => {
      if (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ error: "Failed to add product." });
        return;
      }
      res.json({ product_id: results.insertId, name, price, stock, description, brand_id, image_path });
    }
  );
});


app.get("/hello/products", (req, res) => {
  const query = `SELECT 
      p.product_id,
      p.name AS product_name,
      p.price,
      p.stock,
      p.image_path,
      b.brand_name
    FROM 
      product p
    LEFT JOIN 
      brand b 
    ON 
      p.brand_id = b.brand_id`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching KFC products:", err);
      res.status(500).json({ error: "Error fetching KFC products" });
    } else {
      res.json(results);
    }
  });
});
app.get("/api/foods/KFC", (req, res) => {
  const query = "SELECT product_id, name, price, image_path FROM product WHERE brand_id = 1";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching KFC products:", err);
      res.status(500).json({ error: "Error fetching KFC products" });
    } else {
      res.json(results);
    }
  });
});


app.get("/api/foods/Macdonald", (req, res) => {
  const query = "SELECT product_id, name, price, image_path FROM product WHERE brand_id = 2";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching Macdonald products:", err);
      res.status(500).json({ error: "Error fetching Macdonald products" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/foods/Jonnys", (req, res) => {
  const query = "SELECT * FROM product WHERE brand_id = 3";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching Jonnys products:", err);
      res.status(500).json({ error: "Error fetching Jonnys products" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/foods/Kababjees", (req, res) => {
  const query = "SELECT * FROM product WHERE brand_id = 4";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching Kababjees products:", err);
      res.status(500).json({ error: "Error fetching Kababjees products" });
    } else {
      res.json(results);
    }
  });
});
app.get("/api/dresses/khaddi", (req, res) => {
  const query = "SELECT * FROM product WHERE brand_id = 5";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching Khaddi products:", err);
      res.status(500).json({ error: "Error fetching Khaddi products" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/dresses/sapphire", (req, res) => {
  const query = "SELECT * FROM product WHERE brand_id = 6";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching sapphire products:", err);
      res.status(500).json({ error: "Error fetching sapphire products" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/dresses/alkaram", (req, res) => {
  const query = "SELECT * FROM product WHERE brand_id = 7";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching alkaram products:", err);
      res.status(500).json({ error: "Error fetching alkaram products" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/dresses/j", (req, res) => {
  const query = "SELECT * FROM product WHERE brand_id = 8";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching j. products:", err);
      res.status(500).json({ error: "Error fetching j. products" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/electronics/samsung", (req, res) => {
  const query = "SELECT * FROM product WHERE brand_id = 9";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching Samsung products:", err);
      res.status(500).json({ error: "Error fetching Samsung products" });
    } else {
      res.json(results);
    }
  });
});
app.get("/api/electronics/apple", (req, res) => {
  const query = "SELECT * FROM product WHERE  brand_id = 10";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching Apple products:", err);
      res.status(500).json({ error: "Error fetching Apple products" });
    } else {
      res.json(results);
    }
  });
});
app.get("/api/electronics/pell", (req, res) => {
  const query = "SELECT * FROM product WHERE brand_id = 11";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching Pell products:", err);
      res.status(500).json({ error: "Error fetching Pell products" });
    } else {
      res.json(results);
    }
  });
});
app.get("/api/electronics/dawlance", (req, res) => {
  const query = "SELECT * FROM product WHERE brand_id = 12";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching Dawlance products:", err);
      res.status(500).json({ error: "Error fetching Dawlance products" });
    } else {
      res.json(results);
    }
  });
});
app.get("/api/groceryandcrockery/euro", (req, res) => {
  const query = "SELECT * FROM product WHERE brand_id = 13";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching Euro Store products:", err);
      res.status(500).json({ error: "Error fetching Euro Store products" });
    } else {
      res.json(results);
    }
  });
});
app.get("/api/groceryandcrockery/alfatah", (req, res) => {
  const query = "SELECT * FROM product WHERE brand_id = 14";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching Alfatah products:", err);
      res.status(500).json({ error: "Error fetching Alfatah products" });
    } else {
      res.json(results);
    }
  });
});
app.get("/api/groceryandcrockery/imtiaz", (req, res) => {
  const query = "SELECT * FROM product WHERE brand_id = 15";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching Imtiaz products:", err);
      res.status(500).json({ error: "Error fetching Imtiaz products" });
    } else {
      res.json(results);
    }
  });
});
app.get("/api/groceryandcrockery/carrefour", (req, res) => {
  const query = "SELECT * FROM product WHERE brand_id = 16";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching Carrefour products:", err);
      res.status(500).json({ error: "Error fetching Carrefour products" });
    } else {
      res.json(results);
    }
  });
});

app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if user already exists
    const checkUser = 'SELECT * FROM Users WHERE Email = ?';
    const [existingUser] = await db.promise().query(checkUser, [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const sql = 'INSERT INTO Users (FirstName, LastName, Email, Password) VALUES (?, ?, ?, ?)';
    await db.promise().query(sql, [firstName, lastName, email, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;

//   console.log('Received email:', email);
//   console.log('Received password:', password);

//   // Check if email and password are present
//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required' });
//   }

//   try {
//     const sql = 'SELECT * FROM users WHERE email = ?';
//     const [result] = await db.promise().query(sql, [email]);

//     if (result.length === 0) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const user = result[0];

//     // Compare the plain-text password with the hashed password in the database
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (isMatch) {
//       return res.status(200).json({ message: 'Login successful' });
//     } else {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (err) {
//     console.error('Database error:', err);
//     return res.status(500).json({ message: 'Database error', error: err.message });
//   }
// });

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [result] = await db.promise().query(sql, [email]);

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result[0];

    // Compare the plain-text password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Determine if the user is an admin
      const role = (email === 'admin@gmail.com') ? 'admin' : 'user';

      // Send the user_id and role to the frontend
      return res.status(200).json({
        message: 'Login successful',
        role: role,    // Send the role
        user_id: user.id  // Send the user ID
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Database error', error: err.message });
  }
});



// const ADMIN_EMAIL = 'admin@gmail.com';  // Specify the admin email

// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if the user exists in the database
//     const checkUser = 'SELECT * FROM Users WHERE Email = ?';
//     const [user] = await db.promise().query(checkUser, [email]);

//     if (user.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Compare the provided password with the stored hashed password
//     const isPasswordValid = await bcrypt.compare(password, user[0].Password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     // Check if the email matches the admin email
//     if (email === ADMIN_EMAIL) {
//       return res.status(200).json({ message: 'Admin login successful', role: 'admin' });
//     }

//     // Regular user login
//     return res.status(200).json({ message: 'User login successful', role: 'user' });

//   } catch (error) {
//     console.error('Error during sign-in:', error);
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });



// Add item to cart
app.post("/api/cart", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  // Check if the product exists and if the quantity is available
  const checkProductQuery = "SELECT * FROM product WHERE product_id = ?";

  db.query(checkProductQuery, [product_id], (err, results) => {
    if (err) {
      console.error("Error checking product:", err);
      return res.status(500).json({ error: "Error checking product" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = results[0];

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    // Add item to cart
    const insertQuery = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
    db.query(insertQuery, [user_id, product_id, quantity], (err, results) => {
      if (err) {
        console.error("Error adding to cart:", err);
        return res.status(500).json({ error: "Error adding to cart" });
      }

      // Update stock
      const updateStockQuery = "UPDATE products SET stock = stock - ? WHERE product_id = ?";
      db.query(updateStockQuery, [quantity, product_id], (err) => {
        if (err) {
          console.error("Error updating stock:", err);
          return res.status(500).json({ error: "Error updating stock" });
        }

        res.status(200).json({ message: "Product added to cart successfully" });
      });
    });
  });
});

// app.get("/api/cart/:user_id", (req, res) => {
//   const { user_id } = req.params;

//   // Fetch cart items for the given user_id along with product details
//   const query = `
//     SELECT cart.cart_id, cart.quantity, products.product_id, products.name, products.price, products.image_path, products.stock
//     FROM cart
//     JOIN products ON cart.product_id = products.product_id
//     WHERE cart.user_id = ?
//   `;

//   db.query(query, [user_id], (err, results) => {
//     if (err) {
//       console.error("Error fetching cart items:", err);
//       return res.status(500).json({ error: "Error fetching cart items" });
//     }
//     res.json(results);
//   });
// });
// Backend route to fetch product details by product_id
app.get("/api/product/:product_id", (req, res) => {
  const { product_id } = req.params;

  const query = "SELECT * FROM product WHERE product_id = ?";
  db.query(query, [product_id], (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ error: "Error fetching product" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(results[0]); // Send back the first product (since product_id is unique)
  });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on http://localhost:${PORT}');
});
