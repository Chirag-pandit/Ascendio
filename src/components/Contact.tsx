import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import { API_BASE_URL } from "../utils/api";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Clock,
  Send,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  Star,
  Sparkles,
  Globe,
  Calendar,
  Award,
  Shield,
  MessageCircle,
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const lenisRef = useRef<Lenis | null>(null);

  // Logo-inspired teal gradient theme
  const theme = {
    primary: "#0E3B34", // deep teal/green (from logo dark edge)
    secondary: "#24B6A6", // vibrant teal (from logo light edge)
    background: "#F7FFFE", // soft off-white with hint of teal
  };

  // SEO basics
  useEffect(() => {
    const title = "Contact | Ascendio Global";
    const description = "Get in touch with Ascendio Global – fast response, secure communication, expert support.";
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

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, []);

  // Smooth scrolling with Lenis (smart scrolling)
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

  const scrollToForm = useCallback(() => {
    const node = document.getElementById("contact-form");
    if (node) {
      if (lenisRef.current) lenisRef.current.scrollTo(node, { offset: -20 });
      else node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Notifications
  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Contact actions
  const handleContactAction = (type: "email" | "phone" | "whatsapp" | "address" | "copy", value: string) => {
    switch (type) {
      case "email":
        window.open(`mailto:${value}`);
        showNotification("Opening email client...", "info");
        break;
      case "phone":
        window.open(`tel:${value}`);
        showNotification("Opening phone dialer...", "info");
        break;
      case "whatsapp":
        const whatsappUrl = `https://wa.me/${value.replace(/\D/g, '')}`;
        window.open(whatsappUrl, '_blank');
        showNotification("Opening WhatsApp...", "info");
        break;
      case "address":
        window.open(`https://maps.google.com/?q=${encodeURIComponent(value)}`);
        showNotification("Opening in Google Maps...", "info");
        break;
      case "copy":
        navigator.clipboard.writeText(value);
        showNotification("Copied to clipboard!", "success");
        break;
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.message.trim()) errors.message = "Message is required";
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = "Phone number is invalid";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showNotification("Please fix the errors in the form", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showNotification("Message sent successfully! We'll get back to you soon.", "success");
        setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      } else {
        showNotification("Failed to send message. Please try again.", "error");
      }
    } catch (error) {
      showNotification("Failed to send message. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      info: "ascendio.global@gmail.com",
      description: "Send us your inquiries",
      action: () => handleContactAction("email", "ascendio.global@gmail.com"),
      copyAction: () => handleContactAction("copy", "ascendio.global@gmail.com"),
    },
    {
      icon: Phone,
      title: "Phone & WhatsApp",
      info: "+91 9999113792",
      description: "Call us or message on WhatsApp",
      action: () => handleContactAction("phone", "+91 9999113792"),
      whatsappAction: () => handleContactAction("whatsapp", "+919999113792"),
      copyAction: () => handleContactAction("copy", "+91 9999113792"),
    },
    {
      icon: MapPin,
      title: "Location",
      info: "Greater Noida West",
      description: "Gautam Buddha Nagar, UP - 201301",
      action: () =>
        handleContactAction(
          "address",
          "Greater Noida West, Gautam Buddha Nagar, UP - 201301"
        ),
      copyAction: () =>
        handleContactAction(
          "copy",
          "Greater Noida West, Gautam Buddha Nagar, UP - 201301"
        ),
    },
    {
      icon: Building2,
      title: "Company",
      info: "CIN: U52599UP2020PTC136596",
      description: "Registered Private Limited",
      action: () => showNotification("Company registration details", "info"),
      copyAction: () => handleContactAction("copy", "U52599UP2020PTC136596"),
    },
  ];

  return (
    <main>
      <section
        id="contact"
        ref={sectionRef}
        className="py-20 relative overflow-hidden min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.secondary}30 40%, ${theme.primary}10 100%)`,
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hhhh2.PNG-ZNPrnomxqafuPbE3PtYjskiGBRrvnQ.png"
              alt="Ascendio Global logo"
              className="mx-auto mb-6 w-24 sm:w-28 h-auto"
              loading="lazy"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <button
                onClick={scrollToForm}
                className="px-6 py-3 text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                }}
                aria-label="Scroll to contact form"
              >
                <Sparkles className="w-4 h-4" />
                <span>CONTACT</span>
              </button>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            >
              Contact
              <span
                className="bg-clip-text text-transparent ml-2"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ascendio Global
              </span>
            </motion.h1>
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto px-4">
              Let's discuss how we can help you achieve your goals. We typically reply within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.primary }} />
                <span>Contact Information</span>
              </h2>

              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                const isHovered = hoveredCard === index;
                const isPhoneItem = item.title === "Phone & WhatsApp";
                
                return (
                  <motion.div
                    key={index}
                    className="group cursor-pointer"
                    whileHover={{ x: 4, scale: 1.01 }}
                    onHoverStart={() => setHoveredCard(index)}
                    onHoverEnd={() => setHoveredCard(null)}
                    onClick={item.action}
                  >
                    <div
                      className="flex items-start sm:items-center space-x-4 sm:space-x-6 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border relative overflow-hidden"
                      style={{ backgroundColor: theme.background, borderColor: `${theme.primary}30` }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                      />

                      <motion.div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10 flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                        whileHover={{ rotate: 3 }}
                      >
                        <Icon className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                      </motion.div>

                      <div className="flex-1 relative z-10 min-w-0">
                        <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1 truncate">{item.title}</h3>
                        <p className="font-semibold mb-1 text-sm sm:text-base" style={{ color: theme.primary }}>
                          {item.info}
                        </p>
                        <p className="text-gray-600 text-xs sm:text-sm">{item.description}</p>
                      </div>

                      <div className="flex space-x-1 sm:space-x-2 relative z-10 flex-shrink-0">
                        {isPhoneItem && (
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              item.whatsappAction!();
                            }}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-500 hover:bg-green-600"
                            style={{ opacity: isHovered ? 1 : 0.9 }}
                            aria-label="WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </motion.button>
                        )}
                        
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            item.copyAction();
                          }}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300"
                          style={{ backgroundColor: `${theme.secondary}80`, opacity: isHovered ? 1 : 0 }}
                          aria-label="Copy"
                        >
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: theme.primary }} />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300"
                          style={{ backgroundColor: `${theme.primary}20`, opacity: isHovered ? 1 : 0 }}
                          aria-label="Open"
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: theme.primary }} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Business Hours */}
              <div
                className="p-6 sm:p-8 rounded-2xl text-white relative overflow-hidden shadow-xl"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
              >
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 relative z-10">
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 drop-shadow-xl" />
                  <h3 className="font-bold text-lg sm:text-xl drop-shadow-xl">Business Hours</h3>
                </div>
                <div className="space-y-2 text-white relative z-10 drop-shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <p className="text-sm sm:text-base">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <p className="text-sm sm:text-base">Saturday: 9:00 AM - 2:00 PM</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <p className="text-sm sm:text-base">Sunday: Closed</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-4 sm:mt-6 relative z-10 flex-wrap gap-2">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">ISO Certified</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 12 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div
                id="contact-form"
                className="rounded-3xl p-6 sm:p-8 shadow-xl border w-full"
                style={{ backgroundColor: theme.background, borderColor: `${theme.primary}30` }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.primary }} />
                  <span>Send us a Message</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5" style={{ color: theme.primary }} />
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm text-gray-800 text-sm sm:text-base ${
                          formErrors.name ? "border-red-400 focus:ring-red-500" : "focus:ring-opacity-50"
                        }`}
                        style={{ borderColor: formErrors.name ? "#f87171" : `${theme.primary}60`, backgroundColor: theme.background }}
                        required
                        aria-invalid={!!formErrors.name}
                        aria-describedby={formErrors.name ? "name-error" : undefined}
                      />
                      {formErrors.name && (
                        <p id="name-error" className="text-red-500 text-xs sm:text-sm mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{formErrors.name}</span>
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5" style={{ color: theme.primary }} />
                      <input
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm text-gray-800 text-sm sm:text-base ${
                          formErrors.email ? "border-red-400 focus:ring-red-500" : "focus:ring-opacity-50"
                        }`}
                        style={{ borderColor: formErrors.email ? "#f87171" : `${theme.primary}60`, backgroundColor: theme.background }}
                        required
                        aria-invalid={!!formErrors.email}
                        aria-describedby={formErrors.email ? "email-error" : undefined}
                      />
                      {formErrors.email && (
                        <p id="email-error" className="text-red-500 text-xs sm:text-sm mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{formErrors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5" style={{ color: theme.primary }} />
                    <input
                      type="tel"
                      placeholder="Your Phone (Optional)"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm text-gray-800 text-sm sm:text-base ${
                        formErrors.phone ? "border-red-400 focus:ring-red-500" : "focus:ring-opacity-50"
                      }`}
                      style={{ borderColor: formErrors.phone ? "#f87171" : `${theme.primary}60`, backgroundColor: theme.background }}
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 sm:top-4 h-4 w-4 sm:h-5 sm:w-5" style={{ color: theme.primary }} />
                    <input
                      type="text"
                      placeholder="Company Name (Optional)"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm text-gray-800 text-sm sm:text-base"
                      style={{ borderColor: `${theme.primary}60`, backgroundColor: theme.background }}
                    />
                  </div>

                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 sm:top-4 h-4 w-4 sm:h-5 sm:w-5" style={{ color: theme.primary }} />
                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none shadow-sm text-gray-800 text-sm sm:text-base ${
                        formErrors.message ? "border-red-400 focus:ring-red-500" : "focus:ring-opacity-50"
                      }`}
                      style={{ borderColor: formErrors.message ? "#f87171" : `${theme.primary}60`, backgroundColor: theme.background }}
                      required
                      aria-invalid={!!formErrors.message}
                      aria-describedby={formErrors.message ? "message-error" : undefined}
                    />
                    {formErrors.message && (
                      <p id="message-error" className="text-red-500 text-xs sm:text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{formErrors.message}</span>
                      </p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full text-white py-3 sm:py-4 px-8 rounded-xl font-semibold text-base sm:text-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                      </>
                    )}
                  </motion.button>

                  <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-600 pt-4 flex-wrap gap-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      <span>24h Response</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: theme.primary }} />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      <span>Free Consultation</span>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-2xl z-50 max-w-xs sm:max-w-sm ${
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
              <div className="flex items-center space-x-2 sm:space-x-3">
                {notification.type === "success" && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                {notification.type === "error" && <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                {notification.type === "info" && <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />}
                <span className="font-medium text-sm sm:text-base">{notification.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
};

export default Contact;