"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  Search,
  LogOut,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Loader,
  Package,
  Mail,
  LayoutDashboard,
} from "lucide-react"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: number
  category: string
  tags: string[]
  image: string
  views: number
  likes: number
  featured: boolean
  published: boolean
}

interface Product {
  id: number
  category: string
  title: string
  brands: string[]
  description: string
  detailedDescription: string
  rating: number
  image: string
  specifications?: string[]
  features?: string[]
  applications?: string[]
}

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company: string
  message: string
  date: string
  read: boolean
}

type TabType = "dashboard" | "blogs" | "products" | "contacts"

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Data states
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])

  // Blog states
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [isCreatingBlog, setIsCreatingBlog] = useState(false)
  const [blogSearchTerm, setBlogSearchTerm] = useState("")

  // Product states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreatingProduct, setIsCreatingProduct] = useState(false)
  const [productSearchTerm, setProductSearchTerm] = useState("")

  // Contact states
  const [contactSearchTerm, setContactSearchTerm] = useState("")

  // Stats
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    totalProducts: 0,
    totalContacts: 0,
    unreadContacts: 0,
  })

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        fetchAllData()
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch {
      setError("Failed to connect to server. Make sure server is running.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([fetchBlogs(), fetchProducts(), fetchContacts()])
    } finally {
      setLoading(false)
    }
  }

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/admin/blogs")
      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      }
    } catch {
      console.error("Error fetching blogs")
    }
  }

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch {
      console.error("Error fetching products")
    }
  }

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/admin/contacts")
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch {
      console.error("Error fetching contacts")
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      const newStats = {
        totalBlogs: blogs.length,
        publishedBlogs: blogs.filter((b) => b.published).length,
        totalProducts: products.length,
        totalContacts: contacts.length,
        unreadContacts: contacts.filter((c) => !c.read).length,
      }
      setStats(newStats)
    }
  }, [blogs, products, contacts, isAuthenticated])

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <LayoutDashboard className="w-16 h-16 mx-auto mb-4 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Login to manage your website</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </motion.button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p className="font-semibold mb-1">Default Credentials:</p>
            <p>Username: admin</p>
            <p>Password: admin123</p>
          </div>
        </motion.div>
      </div>
    )
  }

  // Main admin panel
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm">Manage your website content</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAuthenticated(false)}
              className="px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
              { id: "blogs" as TabType, label: "Blogs", icon: BookOpen },
              { id: "products" as TabType, label: "Products", icon: Package },
              { id: "contacts" as TabType, label: "Contacts", icon: Mail },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 flex items-center justify-center space-x-2 font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center space-x-2"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
              <button onClick={() => setError("")} className="ml-auto">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
              <button onClick={() => setSuccess("")} className="ml-auto">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Content */}
        {activeTab === "dashboard" && <DashboardTab stats={stats} />}
        {activeTab === "blogs" && (
          <BlogsTab
            blogs={blogs}
            editingBlog={editingBlog}
            isCreatingBlog={isCreatingBlog}
            searchTerm={blogSearchTerm}
            setSearchTerm={setBlogSearchTerm}
            setEditingBlog={setEditingBlog}
            setIsCreatingBlog={setIsCreatingBlog}
            onFetch={fetchBlogs}
            onSuccess={(msg) => {
              setSuccess(msg)
              setTimeout(() => setSuccess(""), 3000)
            }}
            onError={(msg) => {
              setError(msg)
              setTimeout(() => setError(""), 5000)
            }}
            loading={loading}
          />
        )}
        {activeTab === "products" && (
          <ProductsTab
            products={products}
            editingProduct={editingProduct}
            isCreatingProduct={isCreatingProduct}
            searchTerm={productSearchTerm}
            setSearchTerm={setProductSearchTerm}
            setEditingProduct={setEditingProduct}
            setIsCreatingProduct={setIsCreatingProduct}
            onFetch={fetchProducts}
            onSuccess={(msg) => {
              setSuccess(msg)
              setTimeout(() => setSuccess(""), 3000)
            }}
            onError={(msg) => {
              setError(msg)
              setTimeout(() => setError(""), 5000)
            }}
            loading={loading}
          />
        )}
        {activeTab === "contacts" && (
          <ContactsTab
            contacts={contacts}
            searchTerm={contactSearchTerm}
            setSearchTerm={setContactSearchTerm}
            onFetch={fetchContacts}
            onSuccess={(msg) => {
              setSuccess(msg)
              setTimeout(() => setSuccess(""), 3000)
            }}
            onError={(msg) => {
              setError(msg)
              setTimeout(() => setError(""), 5000)
            }}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}

// Dashboard Tab Component
const DashboardTab: React.FC<{
  stats: {
    totalBlogs: number
    publishedBlogs: number
    totalProducts: number
    totalContacts: number
    unreadContacts: number
  }
}> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-1">Total Blogs</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalBlogs}</p>
            <p className="text-sm text-gray-500 mt-1">{stats.publishedBlogs} published</p>
          </div>
          <BookOpen className="w-12 h-12 text-teal-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-1">Total Products</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
          </div>
          <Package className="w-12 h-12 text-emerald-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-1">Total Contacts</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalContacts}</p>
            <p className="text-sm text-red-500 mt-1">{stats.unreadContacts} unread</p>
          </div>
          <Mail className="w-12 h-12 text-blue-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-1">Website Status</p>
            <p className="text-3xl font-bold text-green-600">Active</p>
          </div>
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </motion.div>
    </div>
  )
}

// Import existing blog components (will be added in next part due to length)
// For now, I'll create simplified versions

// Blogs Tab - using existing blog management code
const BlogsTab: React.FC<{
  blogs: BlogPost[]
  editingBlog: BlogPost | null
  isCreatingBlog: boolean
  searchTerm: string
  setSearchTerm: (term: string) => void
  setEditingBlog: (blog: BlogPost | null) => void
  setIsCreatingBlog: (creating: boolean) => void
  onFetch: () => void
  onSuccess: (msg: string) => void
  onError: (msg: string) => void
  loading: boolean
}> = ({
  blogs,
  editingBlog,
  isCreatingBlog,
  searchTerm,
  setSearchTerm,
  setEditingBlog,
  setIsCreatingBlog,
  onFetch,
  onSuccess,
  onError,
  loading,
}) => {
  const handleCreate = () => {
    const newBlog: BlogPost = {
      id: 0,
      title: "",
      excerpt: "",
      content: "",
      author: "Ascendio Team",
      date: new Date().toISOString().split("T")[0],
      readTime: 5,
      category: "Technology",
      tags: [],
      image: "",
      views: 0,
      likes: 0,
      featured: false,
      published: false,
    }
    setEditingBlog(newBlog)
    setIsCreatingBlog(true)
  }

  const handleSave = async () => {
    if (!editingBlog) return

    try {
      const url = isCreatingBlog ? "/api/admin/blogs" : `/api/admin/blogs/${editingBlog.id}`
      const method = isCreatingBlog ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBlog),
      })

      if (response.ok) {
        onSuccess(isCreatingBlog ? "Blog created!" : "Blog updated!")
        setEditingBlog(null)
        setIsCreatingBlog(false)
        onFetch()
      } else {
        onError("Failed to save blog")
      }
    } catch {
      onError("Failed to save blog")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this blog?")) return

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" })
      if (response.ok) {
        onSuccess("Blog deleted!")
        onFetch()
      } else {
        onError("Failed to delete")
      }
    } catch {
      onError("Failed to delete")
    }
  }

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (editingBlog) {
    return (
      <BlogEditor
        blog={editingBlog}
        isCreating={isCreatingBlog}
        onSave={handleSave}
        onCancel={() => {
          setEditingBlog(null)
          setIsCreatingBlog(false)
        }}
        onChange={setEditingBlog}
        loading={loading}
      />
    )
  }

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Blog</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            onEdit={() => {
              setEditingBlog({ ...blog })
              setIsCreatingBlog(false)
            }}
            onDelete={handleDelete}
            onTogglePublish={async () => {
              try {
                const response = await fetch(`/api/admin/blogs/${blog.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...blog, published: !blog.published }),
                })
                if (response.ok) {
                  onSuccess(`Blog ${!blog.published ? "published" : "unpublished"}!`)
                  onFetch()
                }
              } catch {
                onError("Failed to update")
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Products Tab Component
const ProductsTab: React.FC<{
  products: Product[]
  editingProduct: Product | null
  isCreatingProduct: boolean
  searchTerm: string
  setSearchTerm: (term: string) => void
  setEditingProduct: (product: Product | null) => void
  setIsCreatingProduct: (creating: boolean) => void
  onFetch: () => void
  onSuccess: (msg: string) => void
  onError: (msg: string) => void
  loading: boolean
}> = ({
  products,
  editingProduct,
  isCreatingProduct,
  searchTerm,
  setSearchTerm,
  setEditingProduct,
  setIsCreatingProduct,
  onFetch,
  onSuccess,
  onError,
  loading,
}) => {
  const handleCreate = () => {
    const newProduct: Product = {
      id: 0,
      category: "FLANGES",
      title: "",
      brands: [],
      description: "",
      detailedDescription: "",
      rating: 4.5,
      image: "",
    }
    setEditingProduct(newProduct)
    setIsCreatingProduct(true)
  }

  const handleSave = async () => {
    if (!editingProduct) return

    try {
      const url = isCreatingProduct ? "/api/admin/products" : `/api/admin/products/${editingProduct.id}`
      const method = isCreatingProduct ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      })

      if (response.ok) {
        onSuccess(isCreatingProduct ? "Product created!" : "Product updated!")
        setEditingProduct(null)
        setIsCreatingProduct(false)
        onFetch()
      } else {
        onError("Failed to save product")
      }
    } catch {
      onError("Failed to save product")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
      if (response.ok) {
        onSuccess("Product deleted!")
        onFetch()
      } else {
        onError("Failed to delete")
      }
    } catch {
      onError("Failed to delete")
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (editingProduct) {
    return (
      <ProductEditor
        product={editingProduct}
        isCreating={isCreatingProduct}
        onSave={handleSave}
        onCancel={() => {
          setEditingProduct(null)
          setIsCreatingProduct(false)
        }}
        onChange={setEditingProduct}
        loading={loading}
      />
    )
  }

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Product</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={() => {
              setEditingProduct({ ...product })
              setIsCreatingProduct(false)
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}

// Contacts Tab Component
const ContactsTab: React.FC<{
  contacts: Contact[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  onFetch: () => void
  onSuccess: (msg: string) => void
  onError: (msg: string) => void
  loading: boolean
}> = ({ contacts, searchTerm, setSearchTerm, onFetch, onSuccess, onError }) => {
  const handleMarkRead = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}/read`, { method: "PUT" })
      if (response.ok) {
        onSuccess("Marked as read!")
        onFetch()
      }
    } catch {
      onError("Failed to update")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this contact?")) return

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" })
      if (response.ok) {
        onSuccess("Contact deleted!")
        onFetch()
      }
    } catch {
      onError("Failed to delete")
    }
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredContacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onMarkRead={handleMarkRead}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}

// Card Components (simplified versions - full implementations would be similar to existing)
const BlogCard: React.FC<{
  blog: BlogPost
  onEdit: () => void
  onDelete: (id: number) => void
  onTogglePublish: () => void
}> = ({ blog, onEdit, onDelete, onTogglePublish }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={blog.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop"}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              blog.published ? "bg-green-500 text-white" : "bg-gray-500 text-white"
            }`}
          >
            {blog.published ? "Published" : "Draft"}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{blog.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all"
          >
            Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTogglePublish}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              blog.published
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {blog.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(blog.id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

const ProductCard: React.FC<{
  product: Product
  onEdit: () => void
  onDelete: (id: number) => void
}> = ({ product, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-gray-100 p-6"
    >
      <div className="relative h-48 overflow-hidden rounded-xl mb-4">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
      <p className="text-gray-600 text-sm mb-2">{product.category}</p>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all"
        >
          Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(product.id)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

const ContactCard: React.FC<{
  contact: Contact
  onMarkRead: (id: number) => void
  onDelete: (id: number) => void
}> = ({ contact, onMarkRead, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-lg p-6 border-2 ${
        contact.read ? "border-gray-200" : "border-blue-300 bg-blue-50"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-bold text-gray-800">{contact.name}</h3>
            {!contact.read && (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">
                New
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm">{contact.email}</p>
          {contact.phone && <p className="text-gray-600 text-sm">{contact.phone}</p>}
          {contact.company && <p className="text-gray-600 text-sm">{contact.company}</p>}
        </div>
        <div className="text-xs text-gray-500">{new Date(contact.date).toLocaleDateString()}</div>
      </div>
      <p className="text-gray-700 mb-4">{contact.message}</p>
      <div className="flex items-center space-x-2">
        {!contact.read && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMarkRead(contact.id)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
          >
            Mark Read
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(contact.id)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

// Editor Components (simplified - full versions would have all fields)
const BlogEditor: React.FC<{
  blog: BlogPost
  isCreating: boolean
  onSave: () => void
  onCancel: () => void
  onChange: (blog: BlogPost) => void
  loading: boolean
}> = ({ blog, isCreating, onSave, onCancel, onChange, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isCreating ? "Create Blog" : "Edit Blog"}
        </h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            value={blog.title}
            onChange={(e) => onChange({ ...blog, title: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
          <textarea
            value={blog.excerpt}
            onChange={(e) => onChange({ ...blog, excerpt: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
          <textarea
            value={blog.content}
            onChange={(e) => onChange({ ...blog, content: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={10}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
            <input
              type="text"
              value={blog.author}
              onChange={(e) => onChange({ ...blog, author: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={blog.category}
              onChange={(e) => onChange({ ...blog, category: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Sustainability">Sustainability</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            type="url"
            value={blog.image}
            onChange={(e) => onChange({ ...blog, image: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={blog.featured}
              onChange={(e) => onChange({ ...blog, featured: e.target.checked })}
              className="w-5 h-5 text-teal-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={blog.published}
              onChange={(e) => onChange({ ...blog, published: e.target.checked })}
              className="w-5 h-5 text-teal-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>
        </div>
        <div className="flex items-center space-x-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSave}
            disabled={loading || !blog.title || !blog.excerpt || !blog.content}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>Save</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
          >
            Cancel
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

const ProductEditor: React.FC<{
  product: Product
  isCreating: boolean
  onSave: () => void
  onCancel: () => void
  onChange: (product: Product) => void
  loading: boolean
}> = ({ product, isCreating, onSave, onCancel, onChange, loading }) => {
  const [brandsInput, setBrandsInput] = useState(product.brands.join(", "))
  const [specsInput, setSpecsInput] = useState(product.specifications?.join("\n") || "")
  const [featuresInput, setFeaturesInput] = useState(product.features?.join("\n") || "")
  const [appsInput, setAppsInput] = useState(product.applications?.join("\n") || "")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isCreating ? "Create Product" : "Edit Product"}
        </h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            value={product.title}
            onChange={(e) => onChange({ ...product, title: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <input
            type="text"
            value={product.category}
            onChange={(e) => onChange({ ...product, category: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            value={product.description}
            onChange={(e) => onChange({ ...product, description: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
          <textarea
            value={product.detailedDescription}
            onChange={(e) => onChange({ ...product, detailedDescription: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={5}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brands (comma separated)</label>
          <input
            type="text"
            value={brandsInput}
            onChange={(e) => {
              setBrandsInput(e.target.value)
              const brands = e.target.value.split(",").map((b) => b.trim()).filter((b) => b)
              onChange({ ...product, brands })
            }}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Brand1, Brand2, Brand3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            type="url"
            value={product.image}
            onChange={(e) => onChange({ ...product, image: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={product.rating}
            onChange={(e) => onChange({ ...product, rating: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Specifications (one per line)</label>
          <textarea
            value={specsInput}
            onChange={(e) => {
              setSpecsInput(e.target.value)
              const specs = e.target.value.split("\n").filter((s) => s.trim())
              onChange({ ...product, specifications: specs })
            }}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
          <textarea
            value={featuresInput}
            onChange={(e) => {
              setFeaturesInput(e.target.value)
              const features = e.target.value.split("\n").filter((f) => f.trim())
              onChange({ ...product, features })
            }}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Applications (one per line)</label>
          <textarea
            value={appsInput}
            onChange={(e) => {
              setAppsInput(e.target.value)
              const apps = e.target.value.split("\n").filter((a) => a.trim())
              onChange({ ...product, applications: apps })
            }}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={4}
          />
        </div>
        <div className="flex items-center space-x-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSave}
            disabled={loading || !product.title || !product.description}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>Save</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
          >
            Cancel
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminPanel
