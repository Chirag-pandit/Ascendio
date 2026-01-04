"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { API_BASE_URL } from "../utils/api"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "@studio-freight/lenis"
import {
  Lightbulb,
  Shield,
  Sun,
  Filter,
  Search,
  Zap,
  Settings,
  Star,
  ShoppingCart,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Award,
  Factory,
  Wrench,
  Bolt,
  BatteryCharging,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

type HSL = { h: number; s: number; l: number }
type Product = {
  id?: number
  category: string
  icon?: LucideIcon | string
  title: string
  brands: string[]
  description: string
  detailedDescription: string
  rating: number
  image: string
  color?: string
  specifications?: string[]
  features?: string[]
  applications?: string[]
}

const LOGO_SRC = "/AAAAAA.PNG"

// ----- Color utils & palette extraction -----
function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToString(hsl: HSL) {
  return `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%`
}

function hslToRgb({ h, s, l }: HSL) {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) }
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
}

function distanceH(h1: number, h2: number) {
  const d = Math.abs(h1 - h2)
  return Math.min(d, 360 - d)
}

async function extractPaletteFromImage(src: string): Promise<{ primary: HSL; secondary: HSL } | null> {
  try {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.decoding = "async"
    img.referrerPolicy = "no-referrer"

    const p = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img)
      img.onerror = reject
    })

    img.src = src
    const image = await p

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return null

    const W = 64
    const H = Math.max(1, Math.round((image.height / image.width) * W))
    canvas.width = W
    canvas.height = H

    ctx.drawImage(image, 0, 0, W, H)
    const data = ctx.getImageData(0, 0, W, H).data

    const bins = new Map<number, { count: number; r: number; g: number; b: number }>()

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3]
      if (a < 180) continue

      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      if (max < 40 || min > 230) continue

      const R = r >> 4
      const G = g >> 4
      const B = b >> 4
      const key = (R << 8) | (G << 4) | B

      const ex = bins.get(key)
      if (ex) {
        ex.count++
        ex.r += r
        ex.g += g
        ex.b += b
      } else {
        bins.set(key, { count: 1, r, g, b })
      }
    }

    if (!bins.size) return null

    const top = [...bins.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)
      .map((v) => {
        const r = v.r / v.count
        const g = v.g / v.count
        const b = v.b / v.count
        return { count: v.count, hsl: rgbToHsl(r, g, b) }
      })

    // primary: vibrant, mid-lightness
    let primary = top[0].hsl
    let best = Number.NEGATIVE_INFINITY
    for (const t of top) {
      const s = t.hsl.s
      const l = t.hsl.l
      const score = s * 1.2 - Math.abs(l - 50) * 0.8 + t.count * 0.02
      if (score > best) {
        best = score
        primary = t.hsl
      }
    }

    // secondary: hue-separated
    let secondary = top[0].hsl
    best = Number.NEGATIVE_INFINITY
    for (const t of top) {
      const dH = distanceH(t.hsl.h, primary.h)
      const lC = 100 - Math.abs(t.hsl.l - primary.l)
      const score = dH * 1.2 + t.hsl.s * 0.3 + lC * 0.2
      if (dH > 18 && score > best) {
        best = score
        secondary = t.hsl
      }
    }

    const normalize = (c: HSL): HSL => ({
      h: (c.h + 360) % 360,
      s: Math.max(35, Math.min(90, c.s)),
      l: Math.max(28, Math.min(72, c.l)),
    })

    return { primary: normalize(primary), secondary: normalize(secondary) }
  } catch {
    return null
  }
}

export default function Products() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const tickerFnRef = useRef<((t: number) => void) | null>(null)

  // Brand (fallback emerald/teal)
  const [brandPrimaryHsl, setBrandPrimaryHsl] = useState<HSL>({ h: 160, s: 84, l: 39 })
  const [brandSecondaryHsl, setBrandSecondaryHsl] = useState<HSL>({ h: 173, s: 80, l: 40 })

  const brandPrimary = useMemo(() => hslToString(brandPrimaryHsl), [brandPrimaryHsl])
  const brandSecondary = useMemo(() => hslToString(brandSecondaryHsl), [brandSecondaryHsl])
  const brandPrimaryHex = useMemo(() => {
    const { r, g, b } = hslToRgb(brandPrimaryHsl)
    return rgbToHex(r, g, b)
  }, [brandPrimaryHsl])

  // Extract palette from logo
  useEffect(() => {
    let mounted = true
    extractPaletteFromImage(LOGO_SRC).then((pal) => {
      if (!mounted || !pal) return
      setBrandPrimaryHsl(pal.primary)
      setBrandSecondaryHsl(pal.secondary)
    })
    return () => {
      mounted = false
    }
  }, [])

  // Smooth scrolling + scroll animations
  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current.on("scroll", ScrollTrigger.update)

    const tickerFn = (time: number) => lenisRef.current?.raf(time * 1000)
    tickerFnRef.current = tickerFn
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".product-card",
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )

      gsap.fromTo(
        ".filter-button",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: ".filter-section", start: "top 85%", toggleActions: "play none none reverse" },
        },
      )
    }, sectionRef)

    return () => {
      ctx.revert()
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current)
      lenisRef.current?.destroy()
    }
  }, [])

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  
  // Handle Get Quote - scroll to contact section
  const handleGetQuote = (productTitle?: string) => {
    closeDetails()
    setTimeout(() => {
      const contactSection = document.getElementById("contact")
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" })
        // Pre-fill product name in URL or use a query param
        if (productTitle) {
          window.history.pushState({}, "", `/#contact?product=${encodeURIComponent(productTitle)}`)
        }
      } else {
        // If contact section not on same page, navigate to home page contact
        window.location.href = "/#contact"
      }
    }, 300)
  }

  // Icon mapping function
  const getIconForCategory = (category: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      "POLES & LIGHTING MASTS": Lightbulb,
      "NUTS & BOLTS": Wrench,
      "FABRICATING ITEMS": Factory,
      "EARTHING MATERIAL": Bolt,
      "INSULATOR": Zap,
      "INSULATORS": Zap,
      "ELECTRICAL ACCESSORIES": Settings,
      "TOOLS & TACKLES": Wrench,
      "SAFETY ITEMS": Shield,
      "LED LIGHTINGS": Lightbulb,
      "SOLAR": Sun,
      "FITTING": Wrench,
      "FLANGES": Settings,
      "LITHIUM BATTERIES": BatteryCharging,
      "WASTE MANAGEMENT": Trash2,
      "BATTERIES": BatteryCharging,
      "PIPE FITTINGS": Settings,
    }
    return iconMap[category.toUpperCase()] || Boxes
  }

  // Extract categories dynamically from products
  const getCategoriesFromProducts = useMemo(() => {
    const uniqueCategories = new Set<string>()
    products.forEach((p) => {
      if (p.category && p.category.trim()) {
        uniqueCategories.add(p.category.trim())
      }
    })
    return Array.from(uniqueCategories).sort()
  }, [products])

  // Categories with icons - dynamically generated from products
  type CategoryDef = { label: string; icon: LucideIcon }
  const categoryDefs: CategoryDef[] = useMemo(() => {
    const categoryIconMap: Record<string, LucideIcon> = {
      "POLES & LIGHTING MASTS": Lightbulb,
      "NUTS & BOLTS": Wrench,
      "FABRICATING ITEMS": Factory,
      "EARTHING MATERIAL": Bolt,
      "INSULATOR": Zap,
      "INSULATORS": Zap,
      "ELECTRICAL ACCESSORIES": Settings,
      "TOOLS & TACKLES": Wrench,
      "SAFETY ITEMS": Shield,
      "LED LIGHTINGS": Lightbulb,
      "SOLAR": Sun,
      "FITTING": Wrench,
      "FLANGES": Settings,
      "LITHIUM BATTERIES": BatteryCharging,
      "WASTE MANAGEMENT": Trash2,
      "BATTERIES": BatteryCharging,
      "PIPE FITTINGS": Settings,
    }
    
    return getCategoriesFromProducts.map((cat) => ({
      label: cat,
      icon: categoryIconMap[cat.toUpperCase()] || getIconForCategory(cat),
    }))
  }, [getCategoriesFromProducts])

  const categories = ["All", ...categoryDefs.map((c) => c.label)]
  const [activeFilter, setActiveFilter] = useState<string>("All")
  const [searchTerm, setSearchTerm] = useState<string>("")

  const catScrollRef = useRef<HTMLDivElement>(null)
  const catItemRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    const el = catItemRefs.current[activeFilter]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [activeFilter])

  const scrollCats = (dir: "left" | "right") => {
    const el = catScrollRef.current
    if (!el) return
    const delta = Math.round(el.clientWidth * 0.8) * (dir === "left" ? -1 : 1)
    el.scrollBy({ left: delta, behavior: "smooth" })
  }

  const onCatsKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault()
      const idx = categories.findIndex((c) => c === activeFilter)
      const next = e.key === "ArrowRight" ? Math.min(idx + 1, categories.length - 1) : Math.max(idx - 1, 0)
      setActiveFilter(categories[next])
    }
  }

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`)
        if (response.ok) {
          const data = await response.json()
          // Map API data to Product interface and add icons
          const mappedProducts: Product[] = data.map((product: {
            id?: number
            category: string
            title: string
            brands?: string[]
            description: string
            detailedDescription: string
            rating: number
            image: string
            icon?: string
            specifications?: string[]
            features?: string[]
            applications?: string[]
          }) => ({
            ...product,
            icon: typeof product.icon === "string" ? getIconForCategory(product.category) : (product.icon || getIconForCategory(product.category)),
            brands: product.brands || [],
            specifications: product.specifications || [],
            features: product.features || [],
            applications: product.applications || [],
          }))
          setProducts(mappedProducts)
        }
        // If API fails, fallback products will be used automatically
      } catch (err) {
        console.error("Error fetching products:", err)
        // Keep empty array on error - fallback products will be used
      } finally {
        setProductsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Fallback products (only used if API fails and we want to show something)
  const fallbackProducts: Product[] = [

  ]

  // Use products from state (fetched from API or fallback)
  const displayProducts = products.length > 0 ? products : fallbackProducts

  const filteredProducts = displayProducts.filter((p) => {
    const matchesFilter = activeFilter === "All" || p.category === activeFilter
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brands?.some((b) => b.toLowerCase().includes(searchTerm.toLowerCase())) ?? false)
    return matchesFilter && matchesSearch
  })

  const openDetails = (product: Product) => {
    setSelectedProduct(product)
    setShowDetails(true)
    document.body.style.overflow = "hidden"
  }

  const closeDetails = () => {
    setShowDetails(false)
    setSelectedProduct(null)
    document.body.style.overflow = "unset"
  }

  return (
    <>
      <section
        id="products"
        ref={sectionRef}
        className="py-20 relative overflow-hidden"
        style={
          {
            ["--brand-primary"]: brandPrimary,
            ["--brand-secondary"]: brandSecondary,
            background: `linear-gradient(135deg, hsl(${brandPrimary} / 0.06) 0%, hsl(${brandSecondary} / 0.12) 100%)`,
          } as React.CSSProperties
        }
      >
        {/* Static brand blobs + grid pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl bg-[hsl(var(--brand-primary))]" />
          <div className="absolute top-40 right-20 w-48 h-48 rounded-full blur-3xl bg-[hsl(var(--brand-secondary))]" />
          <div className="absolute bottom-20 left-1/3 w-40 h-40 rounded-full blur-3xl bg-[hsl(var(--brand-primary))]" />
          <div className="absolute bottom-40 right-10 w-36 h-36 rounded-full blur-3xl bg-[hsl(var(--brand-secondary))]" />
        </div>
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${brandPrimaryHex.replace(
              "#",
              "%23",
            )}' fillOpacity='0.25'%3E%3Cpath d='M0 0h100v1H0zM0 0v100h1V0z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-6">
          <div className="text-center mb-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.35 }}
              className="inline-block mb-6"
            >
              <span className="px-6 py-3 text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]">
                {"Our Product Range"}
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
            >
              {"Our Products"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8"
            >
              {
                "Premium products across power, infrastructure, safety, solar, and more — curated and engineered for performance."
              }
            </motion.p>

            <div className="filter-section sticky top-4 z-20">
              <div className="rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur-xl shadow-sm">
                <div className="flex items-center gap-2 p-3 md:p-4">
                  {/* Desktop scroll controls */}
                  <button
                    type="button"
                    aria-label="Scroll categories left"
                    className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    onClick={() => scrollCats("left")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Chips rail */}
                  <div
                    ref={catScrollRef}
                    className="relative -mx-1 flex-1 overflow-x-auto no-scrollbar"
                    onKeyDown={onCatsKeyDown}
                    role="tablist"
                    aria-label="Product categories"
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-2 md:gap-3 px-1 py-1 min-w-max">
                      {/* All button */}
                      <motion.button
                        ref={(el) => (catItemRefs.current["All"] = el)}
                        onClick={() => setActiveFilter("All")}
                        whileHover={{ y: -1, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="filter-button relative"
                        role="tab"
                        aria-selected={activeFilter === "All"}
                      >
                        {activeFilter === "All" && (
                          <motion.div
                            layoutId="active-pill"
                            className="absolute inset-0 rounded-full shadow-md"
                            style={{
                              background: "linear-gradient(90deg, hsl(var(--brand-primary)), hsl(var(--brand-secondary)))",
                            }}
                          />
                        )}
                        <div
                          className={
                            "relative flex items-center gap-2 md:gap-2.5 px-3.5 md:px-4 py-2 rounded-full border transition-colors " +
                            (activeFilter === "All"
                              ? "text-white border-transparent"
                              : "text-gray-700 border-gray-200 bg-white hover:bg-gray-50")
                          }
                        >
                          <Boxes className={activeFilter === "All" ? "h-4 w-4 text-white" : "h-4 w-4 text-gray-500"} />
                          <span className="text-sm font-semibold whitespace-nowrap">All</span>
                        </div>
                      </motion.button>
                      
                      {categoryDefs.map(({ label, icon: Icon }) => {
                        const active = activeFilter === label
                        return (
                          <motion.button
                            key={label}
                            ref={(el) => (catItemRefs.current[label] = el)}
                            onClick={() => setActiveFilter(label)}
                            whileHover={{ y: -1, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="filter-button relative"
                            role="tab"
                            aria-selected={active}
                          >
                            {/* Active background pill */}
                            {active && (
                              <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 rounded-full shadow-md"
                                style={{
                                  background:
                                    "linear-gradient(90deg, hsl(var(--brand-primary)), hsl(var(--brand-secondary)))",
                                }}
                              />
                            )}
                            <div
                              className={
                                "relative flex items-center gap-2 md:gap-2.5 px-3.5 md:px-4 py-2 rounded-full border transition-colors " +
                                (active
                                  ? "text-white border-transparent"
                                  : "text-gray-700 border-gray-200 bg-white hover:bg-gray-50")
                              }
                            >
                              <Icon className={active ? "h-4 w-4 text-white" : "h-4 w-4 text-gray-500"} />
                              <span className={"text-sm font-semibold whitespace-nowrap"}>{label}</span>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Desktop scroll controls */}
                  <button
                    type="button"
                    aria-label="Scroll categories right"
                    className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    onClick={() => scrollCats("right")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* Search (desktop) */}
                  <div className="hidden md:flex relative ml-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search products or brands..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-2 h-9 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-primary))]/50 text-sm text-gray-700 w-[220px]"
                    />
                  </div>
                </div>

                {/* Search (mobile) */}
                <div className="md:hidden px-3 pb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search products or brands..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-2 h-10 w-full rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-primary))]/50 text-sm text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + searchTerm}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
            >
              {productsLoading && products.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-[hsl(var(--brand-primary))]"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600">{"No products found matching your criteria."}</p>
                  <p className="text-gray-500 mt-2">{"Try adjusting your search or filter options."}</p>
                </div>
              ) : (
                filteredProducts.map((product, index) => {
                  const Icon = typeof product.icon === "string" ? getIconForCategory(product.category) : (product.icon || getIconForCategory(product.category))
                  return (
                  <motion.div
                    key={index}
                    className="product-card group"
                    whileHover={{ y: -12, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-gray-200 hover:border-[hsl(var(--brand-secondary))]">
                      {/* Product Image */}
                      <div className="relative h-56 overflow-hidden rounded-t-2xl">
                        <img
                          src={product.image || "/placeholder.svg?height=224&width=448&query=product%20image"}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                        />
                        {/* Lighter overlay for clarity */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(0deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.00) 60%)`,
                          }}
                        />
                        {/* Shine on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -skew-x-12 translate-x-full group-hover:-translate-x-1/2" />

                        {/* Icon + Price */}
                        <div className="absolute top-4 left-4">
                          <motion.div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm bg-white/90 ring-1 ring-white/30"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.25 }}
                          >
                            <Icon className="h-6 w-6 text-[hsl(var(--brand-primary))] transition-colors group-hover:text-[hsl(var(--brand-secondary))]" />
                          </motion.div>
                        </div>
                       

                        {/* Rating */}
                        <div className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openDetails(product)}
                            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                          >
                            <Eye className="h-5 w-5 text-gray-700" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleGetQuote(product.title)}
                            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-secondary))]"
                          >
                            <ShoppingCart className="h-5 w-5 text-white" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-700 transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-3">{product.description}</p>

                        {/* Brands */}
                        {!!product.brands?.length && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-700 mb-3 text-sm">Available Brands:</h4>
                            <div className="flex flex-wrap gap-2">
                              {product.brands.slice(0, 3).map((brand, idx) => (
                                <motion.span
                                  key={idx}
                                  className="px-3 py-1 text-xs rounded-full font-medium border bg-[hsl(var(--brand-secondary))]/10 border-[hsl(var(--brand-secondary))]/40 text-gray-700"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {brand}
                                </motion.span>
                              ))}
                              {product.brands.length > 3 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                  +{product.brands.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleGetQuote(product.title)}
                            className="flex-1 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transition-all bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]"
                          >
                            Get Quote
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openDetails(product)}
                            className="px-4 py-3 border-2 rounded-xl font-semibold text-sm transition-all border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))]/10"
                          >
                            Details
                          </motion.button>
                        </div>
                      </div>

                      {/* Subtle glow */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))] pointer-events-none" />
                    </div>
                  </motion.div>
                  )
                })
              )}
            </motion.div>
          </AnimatePresence>

          {/* Featured banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-20 relative overflow-hidden rounded-3xl shadow-2xl"
          >
            <div className="absolute inset-0">
              <img
                src="/placeholder.svg?height=420&width=1200"
                alt="Industrial Background"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, hsl(${brandPrimary} / 0.65), hsl(${brandSecondary} / 0.65))`,
                }}
              />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
              />
            </div>
            <div className="relative z-10 text-center py-16 px-8 text-white">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                {"Need Custom Solutions?"}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto"
              >
                {"We deliver tailored engineering, fabrication, and supply solutions for your specific requirements."}
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg text-lg"
              >
                {"Contact Our Engineers"}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showDetails && selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={closeDetails}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ type: "spring", damping: 24, stiffness: 280 }}
                className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Scrollable content wrapper */}
                <div className="overflow-y-auto flex-1" style={{ scrollBehavior: "smooth" }}>
                {/* Header image */}
                <div className="relative">
                  <div className="h-64 overflow-hidden rounded-t-3xl">
                    <img
                      src={selectedProduct.image || "/placeholder.svg?height=256&width=1024&query=product%20hero"}
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(0deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.10) 60%)` }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(90deg, hsl(${brandPrimary} / 0.25), transparent, hsl(${brandSecondary} / 0.25))`,
                        opacity: 1,
                      }}
                    />
                  </div>

                  {/* Close */}
                  <motion.button
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeDetails}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white"
                  >
                    <X className="h-5 w-5 text-gray-700" />
                  </motion.button>

                  {/* Icon */}
                  <div className="absolute top-4 left-4">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm bg-white/90 ring-1 ring-white/30">
                      {(() => {
                        const Icon = typeof selectedProduct.icon === "string" 
                          ? getIconForCategory(selectedProduct.category) 
                          : (selectedProduct.icon || getIconForCategory(selectedProduct.category))
                        return <Icon className="h-8 w-8 text-[hsl(var(--brand-primary))]" />
                      })()}
                    </div>
                  </div>

                  {/* Title/Rating */}
                  <div className="absolute bottom-4 left-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                    <h2 className="text-3xl font-bold mb-2">{selectedProduct.title}</h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-semibold">{selectedProduct.rating}</span>
                      </div>
                      
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{"Product Description"}</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">{selectedProduct.detailedDescription}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Specifications */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-[hsl(var(--brand-primary))]" />
                        {"Specifications"}
                      </h4>
                      <ul className="space-y-3">
                        {selectedProduct.specifications?.map((spec, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-[hsl(var(--brand-primary))]" />
                            <span className="text-gray-700 text-sm">{spec}</span>
                          </li>
                        )) || <span className="text-sm text-gray-500">{"Details on request."}</span>}
                      </ul>
                    </div>

                    {/* Features */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-[hsl(var(--brand-primary))]" />
                        {"Key Features"}
                      </h4>
                      <ul className="space-y-3">
                        {selectedProduct.features?.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-[hsl(var(--brand-primary))]" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        )) || <span className="text-sm text-gray-500">{"Highlights on request."}</span>}
                      </ul>
                    </div>
                  </div>

                  {/* Applications */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-[hsl(var(--brand-primary))]" />
                      {"Applications"}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedProduct.applications?.map((app, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-2 rounded-lg border bg-[hsl(var(--brand-secondary))]/10 border-[hsl(var(--brand-secondary))]/40"
                        >
                          <span className="text-gray-700 text-sm font-medium">{app}</span>
                        </div>
                      )) || <span className="text-sm text-gray-500">{"Use cases on request."}</span>}
                    </div>
                  </div>

                  {/* Brands */}
                  {!!selectedProduct.brands?.length && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
                      <h4 className="text-xl font-bold text-gray-800 mb-4">{"Available Brands"}</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedProduct.brands.map((brand, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 text-white text-sm rounded-full font-medium shadow-lg bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact */}
                  <div className="rounded-2xl p-6 text-white bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]">
                    <h4 className="text-xl font-bold mb-4">{"Get in Touch"}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-3" />
                        <span className="text-sm">{"+91 9999113792"}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-3" />
                        <span className="text-sm">{"Ascendio.global@gmail.com"}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-3" />
                        <span className="text-sm">{"Greater Noida West"}</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGetQuote(selectedProduct.title)}
                        className="flex-1 bg-white text-gray-900 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                      >
                        {"Request Quote"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const whatsappUrl = `https://wa.me/919999113792?text=Hi, I'm interested in ${encodeURIComponent(selectedProduct.title)}. Please share the catalog.`
                          window.open(whatsappUrl, "_blank")
                        }}
                        className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30"
                      >
                        {"Download Catalog"}
                      </motion.button>
                    </div>
                  </div>
                </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
        .line-clamp-3 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
      `}</style>
    </>
  )
}