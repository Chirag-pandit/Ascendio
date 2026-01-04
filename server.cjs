const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();

/* ===================== CONFIG ===================== */

const PORT = process.env.PORT || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://ascendio-production.up.railway.app";

const ADMIN_TOKEN = "admin-auth-token";

/* ===================== MIDDLEWARE ===================== */

// Allow localhost and production URL for CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", FRONTEND_URL],
    credentials: true,
  })
);

app.use(express.json());

/* ===================== DATA FILES ===================== */

const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const BLOG_FILE = path.join(dataDir, "blogs.json");
const PRODUCT_FILE = path.join(dataDir, "products.json");
const CONTACT_FILE = path.join(dataDir, "contacts.json");
const ADMIN_FILE = path.join(dataDir, "admin.json");

const initFile = (file, defaultValue = []) => {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(defaultValue));
};

initFile(BLOG_FILE);
initFile(PRODUCT_FILE);
initFile(CONTACT_FILE);
initFile(ADMIN_FILE, null);

const readData = (file) => {
  try {
    const data = fs.readFileSync(file, "utf8");
    if (!data || data.trim() === "" || data.trim() === "null") return null;
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

const writeData = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

/* ===================== PASSWORD HASHING ===================== */

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const verifyPassword = (password, hash) => {
  return hashPassword(password) === hash;
};

/* ===================== ADMIN CREDENTIALS ===================== */

const getAdminCredentials = () => {
  return readData(ADMIN_FILE);
};

const saveAdminCredentials = (username, password) => {
  const credentials = {
    username,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  writeData(ADMIN_FILE, credentials);
  return credentials;
};

const adminExists = () => {
  const credentials = getAdminCredentials();
  return credentials !== null && credentials.username && credentials.passwordHash;
};

/* ===================== AUTH ===================== */

const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === ADMIN_TOKEN || token === `Bearer ${ADMIN_TOKEN}`) return next();
  return res.status(401).json({ message: "Unauthorized" });
};

/* ===================== HEALTH ===================== */

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/* ===================== ADMIN SETUP & LOGIN ===================== */

// Check if admin exists (for first-time setup)
app.get("/api/admin/check", (req, res) => {
  const exists = adminExists();
  res.json({ exists });
});

// Create admin (first-time setup only)
app.post("/api/admin/setup", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  if (username.length < 3) {
    return res.status(400).json({
      success: false,
      message: "Username must be at least 3 characters",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  // Check if admin already exists
  if (adminExists()) {
    return res.status(403).json({
      success: false,
      message: "Admin already exists. Please login instead.",
    });
  }

  // Create admin
  saveAdminCredentials(username, password);

  res.json({
    success: true,
    message: "Admin account created successfully",
  });
});

// Admin login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  // Check if admin exists
  if (!adminExists()) {
    return res.status(404).json({
      success: false,
      message: "Admin account not found. Please setup first.",
    });
  }

  const credentials = getAdminCredentials();

  // Verify credentials
  if (username === credentials.username && verifyPassword(password, credentials.passwordHash)) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
});

/* ===================== BLOG APIs ===================== */

app.get("/api/blogs", (req, res) => {
  const blogs = readData(BLOG_FILE)
    .filter((b) => b.published)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(blogs);
});

app.get("/api/admin/blogs", requireAdmin, (req, res) => {
  res.json(readData(BLOG_FILE));
});

app.post("/api/admin/blogs", requireAdmin, (req, res) => {
  const blogs = readData(BLOG_FILE);
  const newBlog = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  blogs.push(newBlog);
  writeData(BLOG_FILE, blogs);
  res.status(201).json(newBlog);
});

app.put("/api/admin/blogs/:id", requireAdmin, (req, res) => {
  const blogs = readData(BLOG_FILE);
  const index = blogs.findIndex((b) => b.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });

  blogs[index] = { ...blogs[index], ...req.body, updatedAt: new Date() };
  writeData(BLOG_FILE, blogs);
  res.json(blogs[index]);
});

app.delete("/api/admin/blogs/:id", requireAdmin, (req, res) => {
  const blogs = readData(BLOG_FILE).filter((b) => b.id != req.params.id);
  writeData(BLOG_FILE, blogs);
  res.json({ success: true });
});

/* ===================== PRODUCT APIs ===================== */

app.get("/api/products", (req, res) => {
  res.json(readData(PRODUCT_FILE));
});

app.get("/api/admin/products", requireAdmin, (req, res) => {
  res.json(readData(PRODUCT_FILE));
});

app.post("/api/admin/products", requireAdmin, (req, res) => {
  const products = readData(PRODUCT_FILE);
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  writeData(PRODUCT_FILE, products);
  res.status(201).json(newProduct);
});

app.put("/api/admin/products/:id", requireAdmin, (req, res) => {
  const products = readData(PRODUCT_FILE);
  const index = products.findIndex((p) => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });

  products[index] = { ...products[index], ...req.body };
  writeData(PRODUCT_FILE, products);
  res.json(products[index]);
});

app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  const products = readData(PRODUCT_FILE).filter(
    (p) => p.id != req.params.id
  );
  writeData(PRODUCT_FILE, products);
  res.json({ success: true });
});

/* ===================== CONTACT APIs ===================== */

app.post("/api/contact", async (req, res) => {
  const contacts = readData(CONTACT_FILE);
  const newContact = { id: Date.now(), ...req.body, date: new Date().toISOString(), read: false };
  contacts.push(newContact);
  writeData(CONTACT_FILE, contacts);

  res.json({ success: true });
});

app.get("/api/admin/contacts", requireAdmin, (req, res) => {
  res.json(readData(CONTACT_FILE));
});

app.put("/api/admin/contacts/:id/read", requireAdmin, (req, res) => {
  const contacts = readData(CONTACT_FILE);
  const index = contacts.findIndex((c) => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });

  contacts[index] = { ...contacts[index], read: true };
  writeData(CONTACT_FILE, contacts);
  res.json(contacts[index]);
});

app.delete("/api/admin/contacts/:id", requireAdmin, (req, res) => {
  const contacts = readData(CONTACT_FILE).filter(
    (c) => c.id != req.params.id
  );
  writeData(CONTACT_FILE, contacts);
  res.json({ success: true });
});

/* ===================== START ===================== */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
