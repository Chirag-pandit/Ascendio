import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import {
  Search,
  Calendar,
  User,
  Clock,
  Tag,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Share2,
  Bookmark,
  Sparkles,
  Star,
  Award,
  Globe,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: number;
  category: string;
  tags: string[];
  image: string;
  views: number;
  likes: number;
  featured: boolean;
}

interface NotificationType {
  message: string;
  type: "success" | "error" | "info";
}

const Blog: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const postsPerPage = 6;

  // Logo-inspired teal gradient theme (same as contact page)
  const theme = {
    primary: "#0E3B34", // deep teal/green (from logo dark edge)
    secondary: "#24B6A6", // vibrant teal (from logo light edge)
    background: "#F7FFFE", // soft off-white with hint of teal
  };

  // SEO basics
  useEffect(() => {
    const title = "Blog | Ascendio Global - Insights & Industry Updates";
    const description = "Stay updated with the latest insights, industry trends, and expert opinions from Ascendio Global. Read our comprehensive blog posts on business, technology, and innovation.";
    document.title = title;

    const ensureMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    ensureMeta("description", description);
    ensureMeta("keywords", "blog, insights, business, technology, innovation, ascendio global");

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, []);

  // Smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Notifications
  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/blogs');
        if (response.ok) {
          const data = await response.json();
          // Map API data to BlogPost interface
          const mappedPosts: BlogPost[] = data.map((post: {
            id: number;
            title: string;
            excerpt: string;
            content?: string;
            author: string;
            date: string;
            readTime?: number;
            category: string;
            tags?: string[];
            image?: string;
            views?: number;
            likes?: number;
            featured?: boolean;
          }) => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content || post.excerpt,
            author: post.author,
            date: post.date,
            readTime: post.readTime || 5,
            category: post.category,
            tags: post.tags || [],
            image: post.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
            views: post.views || 0,
            likes: post.likes || 0,
            featured: post.featured || false,
          }));
          setAllPosts(mappedPosts);
        } else {
          setError('Failed to load blogs. Please try again later.');
        }
      } catch (err) {
        setError('Failed to connect to server. Make sure the server is running.');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const categories = ["All", "Technology", "Business", "Sustainability"];

  // Filter posts
  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const handlePostAction = (action: "like" | "share" | "bookmark") => {
    switch (action) {
      case "like":
        showNotification("Post liked! 💙", "success");
        break;
      case "share":
        navigator.clipboard.writeText(window.location.href);
        showNotification("Link copied to clipboard!", "success");
        break;
      case "bookmark":
        showNotification("Post bookmarked! 📖", "success");
        break;
    }
  };

  const scrollToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <main>
      <section
        id="blog"
        ref={sectionRef}
        className="py-20 relative overflow-hidden min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.secondary}30 40%, ${theme.primary}10 100%)`,
        }}
      >
        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hhhh2.PNG-ZNPrnomxqafuPbE3PtYjskiGBRrvnQ.png"
              alt="Ascendio Global logo"
              className="mx-auto mb-6 w-28 h-auto"
              loading="lazy"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <div
                className="px-6 py-3 text-white text-sm font-semibold rounded-full shadow-lg flex items-center space-x-2"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                }}
              >
                <BookOpen className="w-4 h-4" />
                <span>BLOG</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            >
              Insights &
              <span
                className="bg-clip-text text-transparent ml-2"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Updates
              </span>
            </motion.h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Stay ahead with our latest insights on technology, business innovation, and industry trends.
            </p>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div
              className="rounded-2xl p-6 shadow-lg border max-w-4xl mx-auto"
              style={{ backgroundColor: theme.background, borderColor: `${theme.primary}30` }}
            >
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: theme.primary }} />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm text-gray-800"
                    style={{ borderColor: `${theme.primary}60`, backgroundColor: theme.background }}
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" style={{ color: theme.primary }} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm text-gray-800"
                    style={{ borderColor: `${theme.primary}60`, backgroundColor: theme.background }}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <Loader className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: theme.primary }} />
              <p className="text-gray-600">Loading blogs...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Blogs</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
              >
                Retry
              </button>
            </motion.div>
          )}

          {/* Featured Posts */}
          {!loading && !error && selectedCategory === "All" && searchTerm === "" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center space-x-2">
                <Star className="w-6 h-6" style={{ color: theme.primary }} />
                <span>Featured Articles</span>
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {allPosts.filter(post => post.featured).map((post, index) => (
                  <motion.article
                    key={post.id}
                    className="group cursor-pointer"
                    whileHover={{ y: -8, scale: 1.01 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div
                      className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border relative"
                      style={{ backgroundColor: theme.background, borderColor: `${theme.primary}20` }}
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                        />
                        <div className="absolute top-4 left-4">
                          <span
                            className="px-3 py-1 text-xs font-semibold rounded-full text-white backdrop-blur-sm"
                            style={{ backgroundColor: `${theme.primary}90` }}
                          >
                            <Award className="w-3 h-3 inline mr-1" />
                            Featured
                          </span>
                        </div>
                        <div className="absolute bottom-4 right-4 flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePostAction("like");
                            }}
                            className="w-10 h-10 rounded-full backdrop-blur-sm bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePostAction("share");
                            }}
                            className="w-10 h-10 rounded-full backdrop-blur-sm bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className="px-3 py-1 text-xs font-semibold rounded-full"
                            style={{ backgroundColor: `${theme.secondary}20`, color: theme.primary }}
                          >
                            {post.category}
                          </span>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(post.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.readTime} min</span>
                            </div>
                          </div>

                          <motion.div
                            className="flex items-center space-x-1 text-sm font-semibold group-hover:translate-x-1 transition-transform"
                            style={{ color: theme.primary }}
                          >
                            <span>Read More</span>
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}

          {/* All Posts Grid */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <TrendingUp className="w-6 h-6" style={{ color: theme.primary }} />
                <span>{selectedCategory === "All" ? "Latest Articles" : `${selectedCategory} Articles`}</span>
              </h2>
              <div className="text-sm text-gray-600">
                {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {paginatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    className="group cursor-pointer"
                    whileHover={{ y: -5, scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div
                      className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border relative"
                      style={{ backgroundColor: theme.background, borderColor: `${theme.primary}20` }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span
                            className="px-2 py-1 text-xs font-semibold rounded-lg text-white backdrop-blur-sm"
                            style={{ backgroundColor: `${theme.primary}80` }}
                          >
                            {post.category}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePostAction("bookmark");
                            }}
                            className="w-8 h-8 rounded-full backdrop-blur-sm bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                          >
                            <Bookmark className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-3">{post.excerpt}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs rounded-lg"
                              style={{ backgroundColor: `${theme.secondary}15`, color: theme.primary }}
                            >
                              <Tag className="w-3 h-3 inline mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{post.readTime} min</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{post.views}</span>
                            </div>
                            <motion.div
                              className="flex items-center space-x-1 font-semibold group-hover:translate-x-1 transition-transform"
                              style={{ color: theme.primary }}
                            >
                              <ArrowRight className="w-3 h-3" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <div
                  className="max-w-md mx-auto p-8 rounded-2xl"
                  style={{ backgroundColor: theme.background }}
                >
                  <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: theme.primary }} />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Articles Found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or category filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                      setCurrentPage(1);
                    }}
                    className="px-6 py-2 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                  >
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center space-x-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  borderColor: `${theme.primary}60`,
                  backgroundColor: theme.background,
                  color: theme.primary 
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all font-semibold ${
                    currentPage === page ? "text-white" : ""
                  }`}
                  style={{
                    borderColor: `${theme.primary}60`,
                    backgroundColor: currentPage === page 
                      ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                      : theme.background,
                    color: currentPage === page ? "white" : theme.primary,
                    background: currentPage === page 
                      ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                      : theme.background,
                  }}
                >
                  {page}
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  borderColor: `${theme.primary}60`,
                  backgroundColor: theme.background,
                  color: theme.primary 
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {/* Newsletter Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-20"
          >
            <div
              className="rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
            >
              <div className="text-center relative z-10">
                <Sparkles className="w-12 h-12 mx-auto mb-4 drop-shadow-xl" />
                <h3 className="text-2xl font-bold mb-4 drop-shadow-xl">Stay Updated</h3>
                <p className="text-lg mb-6 drop-shadow-lg max-w-2xl mx-auto">
                  Subscribe to our newsletter and never miss our latest insights, updates, and exclusive content.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-800"
                    style={{ backgroundColor: theme.background }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => showNotification("Thank you for subscribing! 🎉", "success")}
                    className="px-6 py-3 bg-white text-gray-800 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="flex items-center justify-center space-x-6 text-sm mt-6 drop-shadow-lg">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Weekly Updates</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>Expert Insights</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>Exclusive Content</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-2xl z-50 max-w-sm ${
                notification.type === "success"
                  ? "text-white"
                  : notification.type === "error"
                  ? "bg-red-500 text-white"
                  : "text-white"
              }`}
              style={{
                background:
                  notification.type === "error"
                    ? "#ef4444"
                    : `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              }}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center space-x-3">
                {notification.type === "success" && <CheckCircle className="w-5 h-5" />}
                {notification.type === "error" && <AlertCircle className="w-5 h-5" />}
                {notification.type === "info" && <Sparkles className="w-5 h-5" />}
                <span className="font-medium">{notification.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll to Top Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-white z-50 hover:shadow-2xl transition-all"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowRight className="w-5 h-5 -rotate-90" />
        </motion.button>
      </section>
    </main>
  );
};

export default Blog;