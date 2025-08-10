"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Zap, Cog, Droplets, Factory, Wheat, Fuel, ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

type HSL = { h: number; s: number; l: number }

// --------- Color helpers ----------
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

// Extract primary/secondary colors from the logo for theming
async function extractPaletteFromImage(src: string): Promise<{ primary: HSL; secondary: HSL } | null> {
  try {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.decoding = "async"
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
      if (max < 40 || min > 230) continue // ignore near-black/near-white
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
    if (bins.size === 0) return null

    const top = [...bins.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)
      .map((v) => {
        const r = v.r / v.count
        const g = v.g / v.count
        const b = v.b / v.count
        return { count: v.count, r, g, b, hsl: rgbToHsl(r, g, b) }
      })

    // Pick a vibrant-ish primary
    let primary = top[0].hsl
    let best = Number.NEGATIVE_INFINITY
    for (const t of top) {
      const s = t.hsl.s
      const l = t.hsl.l
      const score = s * 1.2 - Math.abs(l - 50) * 0.8 + t.count * 0.01
      if (score > best) {
        best = score
        primary = t.hsl
      }
    }
    // Pick a secondary distinct in hue
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

const LOGO_SRC = "/AAAAAA.PNG" // replace if your logo path differs

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // Brand HSL numeric for data-URI, and CSS var strings for Tailwind arbitrary hsl(var(--x))
  const [brandPrimaryHsl, setBrandPrimaryHsl] = useState<HSL>({ h: 160, s: 84, l: 39 }) // emerald-ish fallback
  const [brandSecondaryHsl, setBrandSecondaryHsl] = useState<HSL>({ h: 173, s: 80, l: 40 }) // teal-ish fallback

  const brandPrimaryVar = useMemo(() => hslToString(brandPrimaryHsl), [brandPrimaryHsl])
  const brandSecondaryVar = useMemo(() => hslToString(brandSecondaryHsl), [brandSecondaryHsl])

  // Hex for SVG pattern fill (data URI needs a concrete color)
  const brandPrimaryHex = useMemo(() => {
    const { r, g, b } = hslToRgb(brandPrimaryHsl)
    return rgbToHex(r, g, b)
  }, [brandPrimaryHsl])

  // Extract palette from logo once
  useEffect(() => {
    let mounted = true
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.decoding = "async"
    img.onload = async () => {
      const pal = await extractPaletteFromImage(LOGO_SRC)
      if (mounted && pal) {
        setBrandPrimaryHsl(pal.primary)
        setBrandSecondaryHsl(pal.secondary)
      }
    }
    img.onerror = () => {
      // keep fallbacks
    }
    img.src = LOGO_SRC
    return () => {
      mounted = false
    }
  }, [])

  // Animate service cards on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-card",
        { y: 100, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const services = [
    {
      icon: Zap,
      title: "Electrical",
      description: "Power distribution, components, and turnkey electrical solutions for industrial applications.",
      features: ["Power Distribution", "Control Systems", "Electrical Components", "Installation Services"],
      color: "from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))]",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/32014ace-a09d-4132-7913-08d9aeb6e494-Yy49UgA0fvux125Q6p8j8b9LtTrwYp.jpeg",
      count: "500+",
      metric: "Projects",
    },
    {
      icon: Cog,
      title: "Mechanical",
      description: "Comprehensive mechanical systems installation, repairs, fabrication, and maintenance services.",
      features: ["System Installation", "Mechanical Repairs", "Custom Fabrication", "Maintenance"],
      color: "from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))]",
      image:
        "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      count: "1000+",
      metric: "Repairs",
    },
    {
      icon: Fuel,
      title: "Oil & Gas",
      description: "Complete services and supply solutions for upstream to downstream oil & gas operations.",
      features: ["Upstream Services", "Downstream Solutions", "Pipeline Systems", "Safety Equipment"],
      color: "from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))]",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/oil-and-gas-TkEfiJt8oAXwpW6OOw2GnedbaG6Qh1.png",
      count: "200+",
      metric: "Pipelines",
    },
    {
      icon: Factory,
      title: "Industrial Infrastructure",
      description: "Manufacturing development and system integration for comprehensive industrial solutions.",
      features: ["Manufacturing Setup", "System Integration", "Quality Control", "Process Optimization"],
      color: "from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))]",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/drives-frontpage-segment-oilgas.jpg-T1GqBcB9LhBsVro2hf4SGqEgypXJb6.jpeg",
      count: "150+",
      metric: "Facilities",
    },
    {
      icon: Droplets,
      title: "Water & Sewerage",
      description: "Water treatment solutions including pumps, pipes, STP/ETP systems, and infrastructure.",
      features: ["Water Treatment", "Sewage Systems", "Pump Installation", "Pipeline Networks"],
      color: "from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))]",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/industrial-waste-waer-treatment-plant.jpg-kbEtRsGVNn3gMGVW9DpV7d8b0EeP5r.jpeg",
      count: "300+",
      metric: "Systems",
    },
    {
      icon: Wheat,
      title: "Agriculture & EPC",
      description: "Agricultural infrastructure and EPC projects for sustainable farming solutions.",
      features: ["Agricultural Systems", "EPC Projects", "Irrigation Solutions", "Farm Infrastructure"],
      color: "from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))]",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agriculture---epc-real-life-image-6Zt6I2gaqaGuabq7u7w26uJg3AonmZ.png",
      count: "400+",
      metric: "Farms",
    },
  ]

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
      style={
        {
          ["--brand-primary"]: brandPrimaryVar,
          ["--brand-secondary"]: brandSecondaryVar,
          // Background uses soft tints of the brand colors
          background: `linear-gradient(135deg, hsl(${brandPrimaryVar} / 0.06) 0%, hsl(${brandSecondaryVar} / 0.12) 100%)`,
        } as React.CSSProperties
      }
    >
      {/* Attach CSS variables to the section */}

      {/* Decorative brand blobs */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl bg-[hsl(var(--brand-primary))]" />
        <div className="absolute top-40 right-20 w-48 h-48 rounded-full blur-3xl bg-[hsl(var(--brand-secondary))]" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 rounded-full blur-3xl bg-[hsl(var(--brand-primary))]" />
        <div className="absolute bottom-40 right-10 w-36 h-36 rounded-full blur-3xl bg-[hsl(var(--brand-secondary))]" />
      </div>

      {/* Subtle grid pattern with brand color */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='${brandPrimaryHex.replace("#", "%23")}' fillOpacity='0.25'%3E%3Cpath d='M0 0h100v1H0zM0 0v100h1V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <span className="px-6 py-2 text-white text-sm font-semibold rounded-full shadow-lg bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]">
              {"Our Expertise"}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
          >
            {"Our Services"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
          >
            {
              "Comprehensive solutions across multiple industrial domains with expertise, innovation, and reliability that transforms your vision into reality."
            }
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {services.map((service, index) => {
            const Icon = service.icon
            const isHovered = hoveredCard === index
            return (
              <motion.div
                key={index}
                className="service-card group relative"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-[hsl(var(--brand-secondary))] hover:border-[hsl(var(--brand-primary))]">
                  {/* Service Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image || "/placeholder.svg?height=192&width=384&query=service-image"}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-105"
                    />
                    {/* readability overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    {/* shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 translate-x-full group-hover:-translate-x-1/2" />
                    {/* Icon */}
                    <motion.div
                      className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm bg-white/90 ring-1 ring-white/20"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="h-6 w-6 text-[hsl(var(--brand-primary))] transition-colors group-hover:text-[hsl(var(--brand-secondary))]" />
                    </motion.div>
                    {/* Stats */}
                    <div className="absolute top-4 right-4 text-right">
                      <motion.div
                        className="text-2xl font-bold text-white drop-shadow-lg"
                        animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {service.count}
                      </motion.div>
                      <div className="text-sm text-white/90 font-medium drop-shadow">{service.metric}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed text-sm">{service.description}</p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-center text-sm text-gray-700 font-medium"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + idx * 0.05 }}
                        >
                          <motion.div
                            className={`w-2 h-2 rounded-full mr-3 bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]`}
                            animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                          />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                    <motion.button
                      className="flex items-center font-semibold text-[hsl(var(--brand-primary))] hover:text-[hsl(var(--brand-secondary))] transition-all duration-300 group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="mr-2">{"Learn More"}</span>
                      <motion.div whileHover={{ x: 3 }}>
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </motion.button>
                  </div>

                  {/* Border glow */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]" />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-20 relative overflow-hidden rounded-3xl shadow-2xl"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TAZIZ-Industrial-Chemical-Zone-1200x628.jpg-givYt5Y4KO4y5sF5UVg2wahEQKavTK.jpeg"
              alt="Industrial Background"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, hsl(${brandPrimaryVar} / 0.70), hsl(${brandSecondaryVar} / 0.70))`,
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

          {/* Content */}
          <div className="relative z-10 text-center py-16 px-8 text-white">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              {"Ready to Transform Your Industrial Operations?"}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto"
            >
              {
                "Partner with Ascendio for comprehensive engineering solutions that drive efficiency, innovation, and sustainable growth across all industrial sectors."
              }
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="px-8 py-4 rounded-full font-semibold transition-colors shadow-lg text-lg text-white bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]"
              >
                {"Get Started Today"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="border-2 text-white px-8 py-4 rounded-full font-semibold transition-colors shadow-lg text-lg border-white hover:bg-white hover:text-[hsl(var(--brand-primary))]"
              >
                {"View Our Portfolio"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
