const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// CORS configuration - Railway pe deploy ke liye
const corsOptions = {
  origin: function (origin, callback) {
    // Development mein localhost allow karein
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
      return;
    }
    // Production mein Vercel domain allow karein
    // Apna Vercel URL yahan add karein
    const allowedOrigins = [
      'https://your-app.vercel.app',
      'https://*.vercel.app', // All Vercel subdomains
      process.env.FRONTEND_URL, // Environment variable se
    ].filter(Boolean);
    
    if (allowedOrigins.some(allowed => origin.includes(allowed.replace('*.', '')))) {
      callback(null, true);
    } else {
      callback(null, true); // Temporary - sabko allow (production mein specific karein)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Data file paths
const BLOG_DATA_FILE = path.join(__dirname, 'data', 'blogs.json');
const PRODUCT_DATA_FILE = path.join(__dirname, 'data', 'products.json');
const CONTACT_DATA_FILE = path.join(__dirname, 'data', 'contacts.json');
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123' // Change this in production!
};

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data files if they don't exist
if (!fs.existsSync(BLOG_DATA_FILE)) {
  fs.writeFileSync(BLOG_DATA_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(PRODUCT_DATA_FILE)) {
  fs.writeFileSync(PRODUCT_DATA_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(CONTACT_DATA_FILE)) {
  fs.writeFileSync(CONTACT_DATA_FILE, JSON.stringify([], null, 2));
}

// Helper function to read blogs
const readBlogs = () => {
  try {
    const data = fs.readFileSync(BLOG_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading blogs:', error);
    return [];
  }
};

// Helper function to write blogs
const writeBlogs = (blogs) => {
  try {
    fs.writeFileSync(BLOG_DATA_FILE, JSON.stringify(blogs, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing blogs:', error);
    return false;
  }
};

// Helper functions for Products
const readProducts = () => {
  try {
    const data = fs.readFileSync(PRODUCT_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

const writeProducts = (products) => {
  try {
    fs.writeFileSync(PRODUCT_DATA_FILE, JSON.stringify(products, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing products:', error);
    return false;
  }
};

// Helper functions for Contacts
const readContacts = () => {
  try {
    const data = fs.readFileSync(CONTACT_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contacts:', error);
    return [];
  }
};

const writeContacts = (contacts) => {
  try {
    fs.writeFileSync(CONTACT_DATA_FILE, JSON.stringify(contacts, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing contacts:', error);
    return false;
  }
};

// Simple authentication middleware
const authenticateAdmin = (req, res, next) => {
  const { username, password } = req.body;
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    req.isAuthenticated = true;
    next();
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// ==================== BLOG API ENDPOINTS ====================

// Get all blogs (public)
app.get('/api/blogs', (req, res) => {
  try {
    const blogs = readBlogs();
    // Sort by date (newest first) and filter published
    const publishedBlogs = blogs
      .filter(blog => blog.published)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(publishedBlogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

// Get single blog by ID (public)
app.get('/api/blogs/:id', (req, res) => {
  try {
    const blogs = readBlogs();
    const blog = blogs.find(b => b.id === parseInt(req.params.id));
    if (!blog || !blog.published) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
});

// Admin login
app.post('/api/admin/login', authenticateAdmin, (req, res) => {
  res.json({ message: 'Login successful', authenticated: true });
});

// Get all blogs (admin - includes unpublished)
app.get('/api/admin/blogs', (req, res) => {
  try {
    const blogs = readBlogs();
    // Sort by date (newest first)
    const sortedBlogs = blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sortedBlogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

// Create new blog (admin)
app.post('/api/admin/blogs', (req, res) => {
  try {
    const blogs = readBlogs();
    const newBlog = {
      id: blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1,
      ...req.body,
      date: req.body.date || new Date().toISOString().split('T')[0],
      views: req.body.views || 0,
      likes: req.body.likes || 0,
      published: req.body.published !== undefined ? req.body.published : false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    blogs.push(newBlog);
    if (writeBlogs(blogs)) {
      res.status(201).json(newBlog);
    } else {
      res.status(500).json({ message: 'Error saving blog' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
});

// Update blog (admin)
app.put('/api/admin/blogs/:id', (req, res) => {
  try {
    const blogs = readBlogs();
    const index = blogs.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    blogs[index] = {
      ...blogs[index],
      ...req.body,
      id: parseInt(req.params.id), // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };
    if (writeBlogs(blogs)) {
      res.json(blogs[index]);
    } else {
      res.status(500).json({ message: 'Error updating blog' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
});

// Delete blog (admin)
app.delete('/api/admin/blogs/:id', (req, res) => {
  try {
    const blogs = readBlogs();
    const filteredBlogs = blogs.filter(b => b.id !== parseInt(req.params.id));
    if (blogs.length === filteredBlogs.length) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (writeBlogs(filteredBlogs)) {
      res.json({ message: 'Blog deleted successfully' });
    } else {
      res.status(500).json({ message: 'Error deleting blog' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
});

// ==================== PRODUCTS API ENDPOINTS ====================

// Get all products (public)
app.get('/api/products', (req, res) => {
  try {
    const products = readProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get single product by ID (public)
app.get('/api/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Get all products (admin)
app.get('/api/admin/products', (req, res) => {
  try {
    const products = readProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Create new product (admin)
app.post('/api/admin/products', (req, res) => {
  try {
    const products = readProducts();
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.push(newProduct);
    if (writeProducts(products)) {
      res.status(201).json(newProduct);
    } else {
      res.status(500).json({ message: 'Error saving product' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Update product (admin)
app.put('/api/admin/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    products[index] = {
      ...products[index],
      ...req.body,
      id: parseInt(req.params.id),
      updatedAt: new Date().toISOString(),
    };
    if (writeProducts(products)) {
      res.json(products[index]);
    } else {
      res.status(500).json({ message: 'Error updating product' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product (admin)
app.delete('/api/admin/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const filteredProducts = products.filter(p => p.id !== parseInt(req.params.id));
    if (products.length === filteredProducts.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (writeProducts(filteredProducts)) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(500).json({ message: 'Error deleting product' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// ==================== CONTACT API ====================

// Save contact submission
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, company, message } = req.body;

  try {
    // Save to file
    const contacts = readContacts();
    const newContact = {
      id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
      name,
      email,
      phone: phone || '',
      company: company || '',
      message,
      date: new Date().toISOString(),
      read: false,
    };
    contacts.push(newContact);
    writeContacts(contacts);

    // Send email (optional)
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'octane428@gmail.com',
          pass: 'supersuper',
        },
      });

      const mailOptions = {
        from: email,
        to: 'ascendio.global@gmail.com',
        subject: `New Contact Form Submission from ${name}`,
        text: `
          Name: ${name}
          Email: ${email}
          Phone: ${phone || 'Not provided'}
          Company: ${company || 'Not provided'}
          Message: ${message}
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({ message: 'Message sent successfully!', id: newContact.id });
  } catch (error) {
    console.error('Contact save error:', error);
    res.status(500).json({ message: 'Failed to save message.', error: error.message });
  }
});

// Get all contact submissions (admin)
app.get('/api/admin/contacts', (req, res) => {
  try {
    const contacts = readContacts();
    // Sort by date (newest first)
    const sortedContacts = contacts.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sortedContacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
});

// Mark contact as read (admin)
app.put('/api/admin/contacts/:id/read', (req, res) => {
  try {
    const contacts = readContacts();
    const index = contacts.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    contacts[index].read = true;
    if (writeContacts(contacts)) {
      res.json(contacts[index]);
    } else {
      res.status(500).json({ message: 'Error updating contact' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact', error: error.message });
  }
});

// Delete contact (admin)
app.delete('/api/admin/contacts/:id', (req, res) => {
  try {
    const contacts = readContacts();
    const filteredContacts = contacts.filter(c => c.id !== parseInt(req.params.id));
    if (contacts.length === filteredContacts.length) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    if (writeContacts(filteredContacts)) {
      res.json({ message: 'Contact deleted successfully' });
    } else {
      res.status(500).json({ message: 'Error deleting contact' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
});

// Railway pe PORT environment variable use hoga, local mein 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));