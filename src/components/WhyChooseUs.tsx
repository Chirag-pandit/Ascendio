"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Brain, Rocket, Handshake, TrendingUp, CheckCircle, Star, Sparkles } from "lucide-react"

type HSL = { h: number; s: number; l: number }

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Color utils and palette extraction
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
function distanceH(h1: number, h2: number) {
  const d = Math.abs(h1 - h2)
  return Math.min(d, 360 - d)
}
async function extractPaletteFromImage(src: string): Promise<{ primary: HSL; secondary: HSL } | null> {
  try {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.decoding = "async"
    const loaded = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img)
      img.onerror = reject
    })
    img.src = src
    const image = await loaded

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

type Props = { logoSrc?: string }

export default function WhyChooseAscedio({ logoSrc = "/AAAAAA.PNG" }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)

  // Brand fallback values (emerald/teal)
  const [brandPrimary, setBrandPrimary] = useState<string>("160 84% 39%")
  const [brandSecondary, setBrandSecondary] = useState<string>("173 80% 40%")

  // Extract palette from logo
  useEffect(() => {
    let mounted = true
    extractPaletteFromImage(logoSrc).then((pal) => {
      if (!mounted || !pal) return
      setBrandPrimary(hslToString(pal.primary))
      setBrandSecondary(hslToString(pal.secondary))
    })
    return () => {
      mounted = false
    }
  }, [logoSrc])

  const brandStyle = useMemo(
    () =>
      ({
        "--brand-primary": brandPrimary,
        "--brand-secondary": brandSecondary,
      }) as React.CSSProperties,
    [brandPrimary, brandSecondary],
  )

  // Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".why-card",
        { y: 80, opacity: 0, rotationY: 15 },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse",
          },
        },
      )
      gsap.fromTo(
        ".stat-number",
        { textContent: 0 as unknown as any },
        {
          textContent: (_i, target: any) => target.getAttribute("data-value"),
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: { trigger: ".stats-section", start: "top 80%" },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const reasons = [
    {
      icon: Brain,
      title: "Deep Technical Know-how",
      description: "Years of industry experience and technical expertise across multiple engineering domains.",
      features: ["Expert Engineers", "Industry Knowledge", "Technical Innovation"],
    },
    {
      icon: Rocket,
      title: "Strong Execution Capabilities",
      description: "Proven track record of delivering complex industrial projects on time and within budget.",
      features: ["Timely Delivery", "Quality Assurance", "Project Management"],
    },
    {
      icon: Handshake,
      title: "Partnership Mindset",
      description: "Long-term collaboration approach focused on building lasting relationships with clients.",
      features: ["Client Relations", "Ongoing Support", "Collaborative Approach"],
    },
    {
      icon: TrendingUp,
      title: "Sustainable Growth Focus",
      description: "Committed to quality, compliance, and sustainable business practices for long-term success.",
      features: ["Quality Standards", "Compliance", "Sustainability"],
    },
  ]

  const stats = [
    { value: 2, label: "kV Projects", suffix: "" },
    { value: 2, label: "Satisfied Clients", suffix: "+" },
    { value: 2020, label: "Established", suffix: "" },
    { value: 50, label: "Product Categories", suffix: "+" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      className="py-20 relative overflow-hidden text-gray-800"
      style={{
        ...brandStyle,
        background: "#ffffff",
      }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="mr-4"
            >
              <Sparkles className="h-8 w-8" style={{ color: "hsl(var(--brand-primary))" }} />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">{"Why Choose Ascendio?"}</h2>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="ml-4"
            >
              <Sparkles className="h-8 w-8" style={{ color: "hsl(var(--brand-primary))" }} />
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-700"
          >
            {
              "Experience the difference with our comprehensive approach to engineering excellence and client satisfaction."
            }
          </motion.p>
        </div>

        {/* Statistics Section (kept white text on brand gradient) */}
        <div className="stats-section mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(135deg, hsl(var(--brand-primary)) 0%, hsl(var(--brand-secondary)) 100%)",
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group relative"
                >
                  <motion.div
                    className="text-4xl md:text-5xl font-bold mb-2 text-white"
                    whileHover={{ textShadow: "0 0 20px rgba(255, 255, 255, 0.8)" }}
                  >
                    <span className="stat-number drop-shadow-2xl" data-value={stat.value}>
                      {"0"}
                    </span>
                    <span>{stat.suffix}</span>
                  </motion.div>
                  <div className="font-medium drop-shadow-xl text-white">{stat.label}</div>
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ backgroundColor: "#FFFFFF" }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Star className="h-12 w-12" style={{ color: "hsl(var(--brand-secondary))" }} />
              </motion.div>
            </div>
            <div className="absolute bottom-4 left-4 opacity-20">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Star className="h-8 w-8" style={{ color: "hsl(var(--brand-secondary))" }} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Reasons Grid (dark text on white cards) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="why-card group"
                whileHover={{ y: -15, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div
                  className="rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 relative overflow-hidden bg-white"
                  style={{ borderColor: "transparent" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "hsl(var(--brand-secondary))"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "transparent"
                  }}
                >
                  <div className="flex items-start space-x-6 relative z-10">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: "hsl(var(--brand-primary))" }}
                      whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--brand-secondary))", rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="h-8 w-8" style={{ color: "#FFFFFF" }} />
                    </motion.div>
                    <div className="flex-1">
                      <motion.h3 className="text-2xl font-bold mb-4 text-gray-900" whileHover={{ scale: 1.02 }}>
                        {reason.title}
                      </motion.h3>
                      <p className="mb-6 leading-relaxed text-gray-700">{reason.description}</p>
                      <ul className="space-y-3">
                        {reason.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            className="flex items-center"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ x: 5 }}
                          >
                            <CheckCircle
                              className="h-4 w-4 mr-3 flex-shrink-0"
                              style={{ color: "hsl(var(--brand-secondary))" }}
                            />
                            <span className="text-sm font-medium text-gray-800">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ backgroundColor: "hsl(var(--brand-primary))" }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Call to Action (keep white text on gradient) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center rounded-3xl p-12 relative overflow-hidden shadow-2xl text-white"
          style={{
            background: "linear-gradient(135deg, hsl(var(--brand-primary)) 0%, hsl(var(--brand-secondary)) 100%)",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="relative z-10"
          >
            <Star className="h-16 w-16 mx-auto mb-6 drop-shadow-2xl" style={{ color: "hsl(var(--brand-secondary))" }} />
          </motion.div>
          <h3 className="text-3xl font-bold mb-6 relative z-10 drop-shadow-xl text-white">
            {"Ready to Ascend Together?"}
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto relative z-10 drop-shadow-lg text-white">
            {
              "Join industries, clients, and collaborators in building future-ready infrastructure with innovation, safety, and excellence at the core."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-xl text-white"
              style={{ background: "linear-gradient(90deg, hsl(var(--brand-primary)), hsl(var(--brand-secondary)))" }}
            >
              {"Start Your Project"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg text-white"
              style={{
                borderColor: "hsl(var(--brand-secondary))",
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
            >
              {"Learn More"}
            </motion.button>
          </div>

          <div className="absolute top-8 left-8 opacity-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sparkles className="h-8 w-8" style={{ color: "hsl(var(--brand-secondary))" }} />
            </motion.div>
          </div>
          <div className="absolute bottom-8 right-8 opacity-10">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6" style={{ color: "hsl(var(--brand-secondary))" }} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
