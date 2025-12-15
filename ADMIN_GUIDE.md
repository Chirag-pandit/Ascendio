# Admin Panel Guide

## Access Admin Panel

1. **Start the server:**
   ```bash
   npm run server
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

3. **Access Admin Panel:**
   - Go to: `http://localhost:5173/admin`
   - Login Credentials:
     - Username: `admin`
     - Password: `admin123`

## Features

### Dashboard
- View statistics (Blogs, Products, Contacts)
- Quick overview of website content

### Blogs Management
- Create, Edit, Delete blogs
- Publish/Unpublish blogs
- Mark blogs as Featured
- Search and filter blogs

### Products Management
- Create, Edit, Delete products
- Manage product categories
- Add specifications, features, applications
- Upload product images

### Contacts Management
- View all contact form submissions
- Mark contacts as read/unread
- Delete contacts
- Search contacts

## API Endpoints

### Blogs
- `GET /api/blogs` - Get all published blogs (public)
- `GET /api/admin/blogs` - Get all blogs (admin)
- `POST /api/admin/blogs` - Create blog
- `PUT /api/admin/blogs/:id` - Update blog
- `DELETE /api/admin/blogs/:id` - Delete blog

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Contacts
- `POST /api/contact` - Submit contact form (public)
- `GET /api/admin/contacts` - Get all contacts (admin)
- `PUT /api/admin/contacts/:id/read` - Mark as read
- `DELETE /api/admin/contacts/:id` - Delete contact

## Data Storage

All data is stored in JSON files in the `data/` directory:
- `data/blogs.json` - Blog posts
- `data/products.json` - Products
- `data/contacts.json` - Contact submissions

## Important Notes

1. **Change Admin Password:** Update credentials in `server.cjs`:
   ```javascript
   const ADMIN_CREDENTIALS = {
     username: 'admin',
     password: 'your-secure-password'
   };
   ```

2. **Products:** Products component will fetch from API. If API fails, it shows fallback products.

3. **Blogs:** Only published blogs appear on the website.

4. **Server Port:** Backend runs on port 5000 (configured in vite.config.ts proxy)

## Troubleshooting

- **Can't access admin panel:** Make sure server is running (`npm run server`)
- **Products not showing:** Check if products.json exists and has data
- **Blogs not appearing:** Make sure blogs are marked as "Published" in admin panel

