"use client"
import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "@studio-freight/lenis"
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
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({})
  const lenisRef = useRef<Lenis | null>(null)
  const animationRef = useRef<number>()

  // Color theme from the provided palette
  const theme = {
    primary: "#1EB2A6",   // Main accent: teal (buttons, headers)
    secondary: "#D4F8E8", // Light secondary: backgrounds, subtle panels
    accent: "#FFA34D",    // Action/highlight: CTA buttons, highlights
    background: "#FFFFFF" // Use white for clean contrast
  }
  
  
  

  // Initialize particles with theme colors
  const initParticles = useCallback(() => {
    const colors = [theme.primary, theme.secondary, theme.accent]
    const newParticles: Particle[] = []
    for (let i = 0; i < 40; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    setParticles(newParticles)
  }, [theme.primary, theme.secondary, theme.accent])

  // Animate particles
  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    setParticles((prevParticles) =>
      prevParticles.map((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`
        ctx.fill()

        return particle
      }),
    )

    animationRef.current = requestAnimationFrame(animateParticles)
  }, [])

  // Show notification
  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  // Handle contact actions
  const handleContactAction = (type: "email" | "phone" | "address" | "copy", value: string) => {
    switch (type) {
      case "email":
        window.open(`mailto:${value}`)
        showNotification("Opening email client...", "info")
        break
      case "phone":
        window.open(`tel:${value}`)
        showNotification("Opening phone dialer...", "info")
        break
      case "address":
        window.open(`https://maps.google.com/?q=${encodeURIComponent(value)}`)
        showNotification("Opening in Google Maps...", "info")
        break
      case "copy":
        navigator.clipboard.writeText(value)
        showNotification("Copied to clipboard!", "success")
        break
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {}

    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }
    if (!formData.message.trim()) errors.message = "Message is required"
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = "Phone number is invalid"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showNotification("Please fix the errors in the form", "error")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      showNotification("Message sent successfully! We'll get back to you soon.", "success")
      setFormData({ name: "", email: "", phone: "", company: "", message: "" })
    } catch {
      showNotification("Failed to send message. Please try again.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle input change
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  useEffect(() => {
    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Connect Lenis with GSAP ScrollTrigger
    lenisRef.current.on("scroll", ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenisRef.current?.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Initialize particles
    initParticles()
    animateParticles()

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-card",
        {
          y: 60,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Floating elements animation
      gsap.to(".floating-element", {
        y: -15,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.4,
      })
    }, sectionRef)

    return () => {
      ctx.revert()
      lenisRef.current?.destroy()
      gsap.ticker.remove((time) => {
        lenisRef.current?.raf(time * 1000)
      })
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initParticles, animateParticles])

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
      title: "Phone",
      info: "+91 9999113792",
      description: "Call us for immediate support",
      action: () => handleContactAction("phone", "+91 9999113792"),
      copyAction: () => handleContactAction("copy", "+91 9999113792"),
    },
    {
      icon: MapPin,
      title: "Location",
      info: "Greater Noida West",
      description: "Gautam Buddha Nagar, UP - 201301",
      action: () => handleContactAction("address", "Greater Noida West, Gautam Buddha Nagar, UP - 201301"),
      copyAction: () => handleContactAction("copy", "Greater Noida West, Gautam Buddha Nagar, UP - 201301"),
    },
    {
      icon: Building2,
      title: "Company",
      info: "CIN: U52599UP2020PTC136596",
      description: "Registered Private Limited",
      action: () => showNotification("Company registration details", "info"),
      copyAction: () => handleContactAction("copy", "U52599UP2020PTC136596"),
    },
  ]

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 relative overflow-hidden min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.accent} 50%, ${theme.secondary} 100%)`,
      }}
    >
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" style={{ opacity: 0.3 }} />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="floating-element absolute top-20 left-10 w-4 h-4 rounded-full opacity-30"
          style={{ backgroundColor: theme.primary }}
        ></div>
        <div
          className="floating-element absolute top-40 right-20 w-6 h-6 rounded-full opacity-25"
          style={{ backgroundColor: theme.secondary }}
        ></div>
        <div
          className="floating-element absolute bottom-40 left-20 w-3 h-3 rounded-full opacity-35"
          style={{ backgroundColor: theme.primary }}
        ></div>
        <div
          className="floating-element absolute bottom-20 right-10 w-5 h-5 rounded-full opacity-20"
          style={{ backgroundColor: theme.secondary }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="inline-block mb-6"
          >
            <span
              className="px-6 py-3 text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center space-x-2"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
              onClick={() => showNotification("Let's connect and build something amazing together!")}
            >
              <Sparkles className="w-4 h-4" />
              <span>Contact Us</span>
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          >
            Get In{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Touch
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
          >
            Ready to start your next project? Let's discuss how we can help you achieve your engineering goals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center space-x-2">
              <Globe className="w-6 h-6" style={{ color: theme.primary }} />
              <span>Contact Information</span>
            </h3>

            {contactInfo.map((item, index) => {
              const Icon = item.icon
              const isHovered = hoveredCard === index
              return (
                <motion.div
                  key={index}
                  className="contact-card group cursor-pointer"
                  whileHover={{ x: 10, scale: 1.02 }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  onClick={item.action}
                >
                  <div
                    className="flex items-center space-x-6 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border relative overflow-hidden"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: `${theme.primary}30`,
                    }}
                  >
                    {/* Background gradient on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                    />

                    <motion.div
                      className="w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10"
                      style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                      whileHover={{ rotate: 5 }}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </motion.div>

                    <div className="flex-1 relative z-10">
                      <h4 className="font-bold text-gray-800 text-lg mb-1">{item.title}</h4>
                      <p className="font-semibold mb-1" style={{ color: theme.primary }}>
                        {item.info}
                      </p>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex space-x-2 relative z-10">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          item.copyAction()
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: `${theme.accent}80`,
                          opacity: isHovered ? 1 : 0,
                        }}
                      >
                        <Copy className="w-4 h-4" style={{ color: theme.primary }} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: `${theme.primary}20`,
                          opacity: isHovered ? 1 : 0,
                        }}
                      >
                        <ExternalLink className="w-4 h-4" style={{ color: theme.primary }} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Business Hours */}
            <motion.div className="contact-card" whileHover={{ scale: 1.02 }}>
              <div
                className="p-8 rounded-2xl text-white relative overflow-hidden shadow-xl"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 opacity-20">
                  <img
                    src="https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                    alt="Business Hours"
                    className="w-full h-full object-cover brightness-40"
                  />
                </div>

                {/* Dark overlay for better text contrast */}
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}B0, ${theme.secondary}B0)` }}
                ></div>

                <div className="flex items-center space-x-4 mb-4 relative z-10">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Clock className="h-8 w-8 drop-shadow-xl" />
                  </motion.div>
                  <h4 className="font-bold text-xl drop-shadow-xl">Business Hours</h4>
                </div>

                <div className="space-y-2 text-white relative z-10 drop-shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <p>Saturday: 9:00 AM - 2:00 PM</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <p>Sunday: Closed</p>
                  </div>
                </div>

                {/* Quality badges */}
                <div className="flex items-center space-x-4 mt-6 relative z-10">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">ISO Certified</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            className="contact-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="rounded-3xl p-8 shadow-xl border"
              style={{
                backgroundColor: theme.background,
                borderColor: `${theme.primary}30`,
              }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <MessageSquare className="w-6 h-6" style={{ color: theme.primary }} />
                <span>Send us a Message</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                      style={{ color: theme.primary }}
                    />
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm text-gray-800 ${
                        formErrors.name ? "border-red-400 focus:ring-red-500" : "focus:ring-opacity-50"
                      }`}
                      style={{
                        borderColor: formErrors.name ? "#f87171" : `${theme.primary}60`,
                        focusRingColor: theme.primary,
                        backgroundColor: theme.background,
                      }}
                      required
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{formErrors.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                      style={{ color: theme.primary }}
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm text-gray-800 ${
                        formErrors.email ? "border-red-400 focus:ring-red-500" : "focus:ring-opacity-50"
                      }`}
                      style={{
                        borderColor: formErrors.email ? "#f87171" : `${theme.primary}60`,
                        focusRingColor: theme.primary,
                        backgroundColor: theme.background,
                      }}
                      required
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{formErrors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                    style={{ color: theme.primary }}
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm text-gray-800 ${
                      formErrors.phone ? "border-red-400 focus:ring-red-500" : "focus:ring-opacity-50"
                    }`}
                    style={{
                      borderColor: formErrors.phone ? "#f87171" : `${theme.primary}60`,
                      focusRingColor: theme.primary,
                      backgroundColor: theme.background,
                    }}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{formErrors.phone}</span>
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Building2 className="absolute left-3 top-4 h-5 w-5" style={{ color: theme.primary }} />
                  <input
                    type="text"
                    placeholder="Company Name (Optional)"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm text-gray-800"
                    style={{
                      borderColor: `${theme.primary}60`,
                      focusRingColor: theme.primary,
                      backgroundColor: theme.background,
                    }}
                  />
                </div>

                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 h-5 w-5" style={{ color: theme.primary }} />
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none shadow-sm text-gray-800 ${
                      formErrors.message ? "border-red-400 focus:ring-red-500" : "focus:ring-opacity-50"
                    }`}
                    style={{
                      borderColor: formErrors.message ? "#f87171" : `${theme.primary}60`,
                      focusRingColor: theme.primary,
                      backgroundColor: theme.background,
                    }}
                    required
                  />
                  {formErrors.message && (
                    <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{formErrors.message}</span>
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full text-white py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </motion.button>

                {/* Form stats */}
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 pt-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>24h Response</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" style={{ color: theme.primary }} />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
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
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
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
    </section>
  )
}

export default Contact