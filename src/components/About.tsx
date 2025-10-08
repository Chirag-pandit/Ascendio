"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "@studio-freight/lenis"
import { Target, Users, Lightbulb, Heart, Award, Globe, Zap, CheckCircle, Building, Calendar, Shield } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

type HSL = { h: number; s: number; l: number }

// ---- Color helpers ----
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

// Extract two main colors from the logo
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
        return { count: v.count, hsl: rgbToHsl(r, g, b) }
      })

    // vibrant-ish primary
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
    // distinct secondary
    const distanceH = (h1: number, h2: number) => {
      const d = Math.abs(h1 - h2)
      return Math.min(d, 360 - d)
    }
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

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const tickerFnRef = useRef<((time: number) => void) | null>(null)

  // Brand color state (fallback emerald/teal)
  const [brandPrimary, setBrandPrimary] = useState<string>("160 84% 39%")
  const [brandSecondary, setBrandSecondary] = useState<string>("173 80% 40%")

  // Extract palette from logo
  useEffect(() => {
    let mounted = true
    extractPaletteFromImage(LOGO_SRC).then((pal) => {
      if (!mounted || !pal) return
      setBrandPrimary(hslToString(pal.primary))
      setBrandSecondary(hslToString(pal.secondary))
    })
    return () => {
      mounted = false
    }
  }, [])

  // Initialize Lenis + GSAP triggers
  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current.on("scroll", ScrollTrigger.update)

    const tickerFn = (time: number) => {
      lenisRef.current?.raf(time * 1000)
    }
    tickerFnRef.current = tickerFn
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      // cards
      gsap.fromTo(
        ".about-card",
        { y: 120, opacity: 0, scale: 0.8, rotationY: 25 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".values-grid",
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        },
      )
      // stats
      gsap.fromTo(
        ".stat-card",
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".stats-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
      // mission/intro
      gsap.fromTo(
        ".mission-content",
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".mission-section", start: "top 75%", toggleActions: "play none none reverse" },
        },
      )
      gsap.fromTo(
        ".company-info",
        { x: 80, opacity: 0, scale: 0.9, rotationY: -15 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".mission-section", start: "top 75%", toggleActions: "play none none reverse" },
        },
      )
      gsap.fromTo(
        ".achievement-item",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".achievements-list", start: "top 80%", toggleActions: "play none none reverse" },
        },
      )
      gsap.fromTo(
        ".stat-number",
        { textContent: 0 },
        {
          textContent: (i, target: any) => target.getAttribute("data-value"),
          duration: 2.5,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: { trigger: ".stats-section", start: "top 70%", toggleActions: "play none none none" },
        },
      )
    }, sectionRef)

    return () => {
      ctx.revert()
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current)
      lenisRef.current?.destroy()
    }
  }, [])

  const brandStyle = useMemo(
    () =>
      ({
        ["--brand-primary" as any]: brandPrimary,
        ["--brand-secondary" as any]: brandSecondary,
      }) as React.CSSProperties,
    [brandPrimary, brandSecondary],
  )

  const values = [
    {
      icon: Target,
      title: "Expertise",
      description: "A team of experienced professionals ensures delivery of high-quality, industry-specific solutions.",
      color: "from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))]",
      bgColor: "bg-white",
      image:
        "https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
    {
      icon: Users,
      title: "Reliability",
      description: "Known for timely execution and precise solutions that meet and exceed client expectations.",
      color: "from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))]",
      bgColor: "bg-white",
      image:
        "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly evolving with cutting-edge technology to provide future-ready solutions.",
      color: "from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))]",
      bgColor: "bg-white",
      image:
        "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
    {
      icon: Heart,
      title: "Customer-Centric",
      description: "Focused on understanding and adapting to each client's unique needs and requirements.",
      color: "from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))]",
      bgColor: "bg-white",
      image:
        "https://images.pexels.com/photos/236722/pexels-photo-236722.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
  ]

  const stats = [
    { number: 2, label: "Projects Completed", suffix: "+", icon: Building },
    { number: 20, label: "Expert Team Members", suffix: "+", icon: Users },
    { number: 5, label: "Years of Excellence", suffix: "", icon: Calendar },
    { number: 2, label: "Client Satisfaction", suffix: "%", icon: Award },
  ]

  const achievements = [
    "Turnkey EPC Projects up to 400kV",
    "Full project lifecycle support",
    "Quality compliance & sustainable growth",
    "ISO certified processes",
    "24/7 technical support",
    "Pan-India service network",
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
      style={{
        ...brandStyle,
        // Softer brand-tinted background for better content contrast
        background: `linear-gradient(135deg, hsl(${brandPrimary} / 0.06) 0%, hsl(${brandSecondary} / 0.12) 100%)`,
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="inline-block mb-6"
          >
            <span className="px-6 py-3 text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]">
              {"About Our Company"}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-gray-800 mb-8"
          >
            {"About Ascendio"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
          >
            {
              "Ascendio Private Limited is a dynamic and future-focused company that delivers premium engineering, supply, and project solutions across multiple industrial domains."
            }
          </motion.p>
        </div>

        {/* Hero Image Section - clearer image, lighter overlay */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop"
              alt="Engineering Background"
              className="w-full h-full object-cover"
            />
            {/* Reduce overlay opacity for clarity */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, hsl(${brandPrimary} / 0.18), hsl(${brandSecondary} / 0.18))`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center text-white"
              >
                <h3 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
                  {"Engineering Excellence"}
                </h3>
                <p className="text-lg md:text-xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                  {"Delivering innovative solutions across industries"}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="stats-section mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={index}
                  className="stat-card text-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-[hsl(var(--brand-secondary))]/50 group hover:bg-[hsl(var(--brand-secondary))]/20">
                    <motion.div
                      className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="text-4xl font-bold text-gray-800 mb-2">
                      <span className="stat-number" data-value={stat.number}>
                        {"0"}
                      </span>
                      {stat.suffix}
                    </div>
                    <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Values Section with Images - clearer imagery */}
        <div className="values-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {values.map((value, index) => {
            const Icon = value.icon
            const isHovered = hoveredCard === index
            return (
              <motion.div
                key={index}
                className="about-card group relative"
                whileHover={{ y: -12, rotateY: 4 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                style={{ perspective: 1000 }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-700 border border-[hsl(var(--brand-secondary))]/60 hover:border-[hsl(var(--brand-primary))]">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={value.image || "/placeholder.svg?height=192&width=384&query=value-image"}
                      alt={value.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Lighter overlay for better clarity */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(0deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.0) 60%)`,
                      }}
                    />
                    {/* Icon overlay on image */}
                    <motion.div
                      className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-r ${value.color} flex items-center justify-center shadow-lg backdrop-blur-sm`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                    <p className="text-gray-700 leading-relaxed text-sm">{value.description}</p>
                  </div>
                  {/* Hover Border Effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Mission Section */}
        <div className="mission-section bg-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-[hsl(var(--brand-secondary))]/60">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Mission Content */}
            <div className="mission-content">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <span className="inline-flex items-center px-4 py-2 text-white rounded-full text-sm font-semibold mb-4 bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]">
                  <Award className="w-4 h-4 mr-2" />
                  {"Our Mission & Vision"}
                </span>
              </motion.div>
              
              <motion.h3
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight"
              >
                {"Driving Excellence Through Innovation & Quality"}
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg text-gray-700 mb-8 leading-relaxed border-l-4 border-[hsl(var(--brand-primary))] pl-4 py-2 bg-[hsl(var(--brand-primary))]/5 rounded-r-lg"
              >
                {
                  "To be the premier engineering solutions provider, setting new benchmarks in quality and performance through cutting-edge innovation, unwavering reliability, and exceptional customer satisfaction across all industrial domains."
                }
              </motion.p>

              {/* Core Focus Areas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-8"
              >
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-[hsl(var(--brand-primary))]" />
                  Core Focus Areas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 p-3 bg-[hsl(var(--brand-primary))]/5 rounded-lg">
                    <Zap className="w-4 h-4 text-[hsl(var(--brand-primary))] mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Electrical & Power Systems</span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-[hsl(var(--brand-primary))]/5 rounded-lg">
                    <Building className="w-4 h-4 text-[hsl(var(--brand-primary))] mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Mechanical Engineering</span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-[hsl(var(--brand-primary))]/5 rounded-lg">
                    <Globe className="w-4 h-4 text-[hsl(var(--brand-primary))] mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Oil & Gas Infrastructure</span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-[hsl(var(--brand-primary))]/5 rounded-lg">
                    <Users className="w-4 h-4 text-[hsl(var(--brand-primary))] mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Industrial Projects</span>
                  </div>
                </div>
              </motion.div>

              {/* Key Differentiators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-8"
              >
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-[hsl(var(--brand-primary))]" />
                  Why Choose Ascendio?
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-white to-[hsl(var(--brand-primary))]/5 rounded-lg border border-[hsl(var(--brand-primary))]/10">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--brand-primary))] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">ISO Certified Quality Processes</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-white to-[hsl(var(--brand-primary))]/5 rounded-lg border border-[hsl(var(--brand-primary))]/10">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--brand-primary))] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">End-to-End Project Lifecycle Support</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-white to-[hsl(var(--brand-primary))]/5 rounded-lg border border-[hsl(var(--brand-primary))]/10">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--brand-primary))] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">24/7 Technical Support & Maintenance</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Company Info Card */}
            <div className="company-info">
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative h-96">
                  <img
                    src="https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
                    alt="Industrial Excellence"
                    className="w-full h-full object-cover"
                  />
                  {/* Professional overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(0deg, hsl(${brandPrimary} / 0.75) 0%, hsl(${brandPrimary} / 0.45) 50%, transparent 100%)`,
                    }}
                  />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm self-center ring-2 ring-white/30"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Award className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <div className="text-center">
                      <motion.h4
                        className="text-2xl font-bold mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        Engineering Excellence Since 2020
                      </motion.h4>
                      
                      <motion.div
                        className="text-lg mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        Trusted Partner in Industrial Solutions
                      </motion.div>
                      
                      <motion.div
                        className="space-y-4 text-sm bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Building className="w-4 h-4 text-[hsl(var(--brand-secondary))]" />
                          <span className="font-semibold">CIN: U52599UP2020PTC136596</span>
                        </div>
                        <div className="border-t border-white/30 pt-3 text-center">
                          <p className="font-medium">Greater Noida West</p>
                          <p>Gautam Buddha Nagar, Uttar Pradesh – 201301</p>
                        </div>
                        <div className="flex justify-center space-x-4 pt-2">
                          <div className="flex items-center space-x-1">
                            <Shield className="w-3 h-3 text-green-300" />
                            <span className="text-xs">ISO Certified</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3 text-blue-300" />
                            <span className="text-xs">Expert Team</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Professional accents */}
                <motion.div
                  className="absolute top-6 right-6 w-3 h-3 rounded-full bg-white/80"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.div
                  className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-[hsl(var(--brand-secondary))]"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0.9, 0.6] }}
                  transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                />
              </motion.div>

              {/* Additional Mission Highlights */}
              <motion.div
                className="mt-6 grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="bg-white rounded-xl p-4 text-center shadow-lg border border-[hsl(var(--brand-primary))]/20">
                  <Target className="w-6 h-6 mx-auto mb-2 text-[hsl(var(--brand-primary))]" />
                  <div className="text-sm font-semibold text-gray-800">Quality Focus</div>
                  <div className="text-xs text-gray-600">ISO Standards</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-lg border border-[hsl(var(--brand-primary))]/20">
                  <Lightbulb className="w-6 h-6 mx-auto mb-2 text-[hsl(var(--brand-primary))]" />
                  <div className="text-sm font-semibold text-gray-800">Innovation</div>
                  <div className="text-xs text-gray-600">Cutting-edge Solutions</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}