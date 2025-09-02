"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"

type HSL = { h: number; s: number; l: number }

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Blog", href: "#blog" },
  { name: "Services", href: "#services" },
  { name: "Products", href: "#products" },
  { name: "Contact", href: "#contact" },
]

// Helpers: RGB/HSV/HSL utilities
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

function hslToString(hsl: HSL): string {
  // Return as "h s% l%" triple without units for Tailwind HSL var usage "hsl(var(--x))"
  return `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%`
}

function distanceH(h1: number, h2: number) {
  const d = Math.abs(h1 - h2)
  return Math.min(d, 360 - d)
}

// Palette extraction from an image on the client
async function extractPaletteFromImage(src: string): Promise<{ primary: HSL; secondary: HSL } | null> {
  try {
    const url = new URL(src, typeof window !== "undefined" ? window.location.href : "http://localhost")
    const img = new Image()
    if (typeof window !== "undefined" && url.origin !== window.location.origin) {
      img.crossOrigin = "anonymous"
    }
    img.decoding = "async"
    const load = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img)
      img.onerror = reject
    })
    img.src = url.toString()
    const image = await load

    // Draw to a tiny canvas for sampling
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return null

    const W = 64
    const H = Math.max(1, Math.round((image.height / image.width) * W))
    canvas.width = W
    canvas.height = H
    ctx.drawImage(image, 0, 0, W, H)
    const data = ctx.getImageData(0, 0, W, H).data

    const samples: { r: number; g: number; b: number }[] = []
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3]
      if (a < 180) continue // ignore transparent
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      // skip near-white and near-black to avoid background bias
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      if (max < 40 || min > 230) continue
      samples.push({ r, g, b })
    }
    if (samples.length < 10) return null

    // Build a coarse histogram in 4-bit per channel (4096 bins)
    const bins = new Map<number, { count: number; r: number; g: number; b: number }>()
    for (const { r, g, b } of samples) {
      const R = r >> 4
      const G = g >> 4
      const B = b >> 4
      const key = (R << 8) | (G << 4) | B
      const existing = bins.get(key)
      if (existing) {
        existing.count++
        existing.r += r
        existing.g += g
        existing.b += b
      } else {
        bins.set(key, { count: 1, r, g, b })
      }
    }

    const top = [...bins.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)
      .map((v) => ({
        count: v.count,
        r: v.r / v.count,
        g: v.g / v.count,
        b: v.b / v.count,
        hsl: rgbToHsl(v.r / v.count, v.g / v.count, v.b / v.count),
      }))

    if (top.length === 0) return null

    // Choose a vibrant-ish primary (higher saturation, mid lightness)
    let primary = top[0].hsl
    let bestScore = Number.NEGATIVE_INFINITY
    for (const t of top) {
      const s = t.hsl.s
      const l = t.hsl.l
      // favor mid lightness and higher saturation
      const score = s * 1.2 - Math.abs(l - 50) * 0.8 + t.count * 0.01
      if (score > bestScore) {
        bestScore = score
        primary = t.hsl
      }
    }

    // Choose a secondary with distinct hue and complementary lightness
    let secondary = top[0].hsl
    bestScore = Number.NEGATIVE_INFINITY
    for (const t of top) {
      const dHue = distanceH(t.hsl.h, primary.h)
      const lightnessContrast = 100 - Math.abs(t.hsl.l - primary.l)
      const score = dHue * 1.2 + t.hsl.s * 0.3 + lightnessContrast * 0.2
      if (dHue > 18 && score > bestScore) {
        bestScore = score
        secondary = t.hsl
      }
    }

    // Normalize a bit: keep saturation at least 35%, clamp lightness
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

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Brand colors default to emerald/teal; will be replaced by extracted palette
  const [brandPrimary, setBrandPrimary] = useState<string>("160 84% 39%") // emerald-500
  const [brandSecondary, setBrandSecondary] = useState<string>("173 80% 40%") // teal-500

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Extract theme from the logo automatically
  const logoSrc = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hhhh2.PNG-ZNPrnomxqafuPbE3PtYjskiGBRrvnQ.png" // replace with your actual uploaded logo path if different
  useEffect(() => {
    let mounted = true
    extractPaletteFromImage(logoSrc).then((palette) => {
      if (!mounted || !palette) return
      setBrandPrimary(hslToString(palette.primary))
      setBrandSecondary(hslToString(palette.secondary))
    })
    return () => {
      mounted = false
    }
  }, [logoSrc])

  // Provide style variables for brand usage in Tailwind arbitrary values
  const brandStyle = useMemo(
    () =>
      ({
        ["--brand-primary" as any]: brandPrimary,
        ["--brand-secondary" as any]: brandSecondary,
      }) as React.CSSProperties,
    [brandPrimary, brandSecondary],
  )

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/90 backdrop-blur-xl shadow-lg border-b border-border/20" : "bg-transparent"
      }`}
      style={brandStyle}
    >
      {/* Subtle brand gradient underline when scrolled */}
      <div
        aria-hidden
        className={`${
          isScrolled ? "opacity-100" : "opacity-0"
        } pointer-events-none absolute inset-x-0 -bottom-px h-px transition-opacity duration-300`}
        style={{
          background: "linear-gradient(90deg, hsl(var(--brand-primary)) 0%, hsl(var(--brand-secondary)) 100%)",
        }}
      />

      <nav className="container mx-auto px-6 py-4" role="navigation" aria-label="Main">
        <div className="flex items-center justify-between">
          {/* Logo + Brand */}
          <motion.a
            whileHover={{ scale: 1.03 }}
            className="flex items-center space-x-3"
            href="#home"
            aria-label="Go to home"
          >
            <div className="relative">
              <img
                src={logoSrc || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hhhh2.PNG-ZNPrnomxqafuPbE3PtYjskiGBRrvnQ.png"}
                alt="Brand logo"
                className="h-10 w-auto"
                onError={(e) => {
                  const img = e.currentTarget
                  img.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hhhh2.PNG-ZNPrnomxqafuPbE3PtYjskiGBRrvnQ.png"
                }}
              />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]">
              {"Ascendio"}
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -2 }}
                className="text-foreground/85 hover:text-foreground font-medium transition-all duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))] transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center rounded-full px-6 py-2 font-semibold text-white shadow-md transition-[transform,filter] hover:saturate-125 ring-1 ring-white/10 bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]"
            >
              Career
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-lg text-foreground/90 hover:text-foreground transition-colors"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <motion.div animate={isOpen ? { rotate: 180 } : { rotate: 0 }} transition={{ duration: 0.2 }}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          id="mobile-nav"
          initial={false}
          animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="md:hidden overflow-hidden"
        >
          <div className="mt-4 rounded-2xl shadow-xl p-6 border border-border/20 backdrop-blur-md bg-background/80">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, x: -12 }}
                animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                transition={{ delay: index * 0.06 }}
                className="block py-3 text-foreground/90 hover:text-foreground font-medium transition-colors border-b border-border/10 last:border-b-0"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 10 }}
              animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.28 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full inline-flex items-center justify-center rounded-xl py-3 font-semibold text-white transition-[transform,filter] hover:saturate-125 ring-1 ring-white/10 bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]"
              onClick={() => setIsOpen(false)}
            >
              Career
            </motion.a>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  )
}
