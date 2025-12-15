const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

/* ===================== CONFIG ===================== */

const PORT = process.env.PORT || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://ascendio-nine.vercel.app";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const ADMIN_TOKEN = "admin-auth-token";

/* ===================== MIDDLEWARE ===================== */

app.use(
  cors({
    origin: FRONTEND_URL,
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

const initFile = (file) => {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([]));
};

initFile(BLOG_FILE);
initFile(PRODUCT_FILE);
initFile(CONTACT_FILE);

const readData = (file) => JSON.parse(fs.readFileSync(file));
const writeData = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

/* ===================== AUTH ===================== */

const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === ADMIN_TOKEN) return next();
  return res.status(401).json({ message: "Unauthorized" });
};

/* ===================== HEALTH ===================== */

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/* ===================== ADMIN LOGIN ===================== */

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
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
  const newContact = { id: Date.now(), ...req.body, date: new Date() };
  contacts.push(newContact);
  writeData(CONTACT_FILE, contacts);

  res.json({ success: true });
});

app.get("/api/admin/contacts", requireAdmin, (req, res) => {
  res.json(readData(CONTACT_FILE));
});

/* ===================== START ===================== */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
