// "use client"

// import type React from "react"
// import { useEffect, useMemo, useRef, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { gsap } from "gsap"
// import { ScrollTrigger } from "gsap/ScrollTrigger"
// import Lenis from "@studio-freight/lenis"
// import {
//   Lightbulb,
//   Shield,
//   Sun,
//   Filter,
//   Search,
//   Zap,
//   Settings,
//   Star,
//   ShoppingCart,
//   Eye,
//   X,
//   Phone,
//   Mail,
//   MapPin,
//   CheckCircle,
//   Award,
//   Factory,
//   Wrench,
//   Bolt,
//   BatteryCharging,
//   Boxes,
//   ChevronLeft,
//   ChevronRight,
//   Trash2,
//   Heart,
//   Smartphone,
// } from "lucide-react"
// import type { LucideIcon } from "lucide-react"

// gsap.registerPlugin(ScrollTrigger)

// type HSL = { h: number; s: number; l: number }
// type Product = {
//   category: string
//   icon: any
//   title: string
//   brands: string[]
//   description: string
//   detailedDescription: string
//   rating: number
//   image: string
//   color?: string
//   specifications?: string[]
//   features?: string[]
//   applications?: string[]
// }

// const LOGO_SRC = "/AAAAAA.PNG"

// // ----- Color utils & palette extraction -----
// function rgbToHsl(r: number, g: number, b: number): HSL {
//   r /= 255
//   g /= 255
//   b /= 255
//   const max = Math.max(r, g, b)
//   const min = Math.min(r, g, b)
//   let h = 0
//   let s = 0
//   const l = (max + min) / 2

//   if (max !== min) {
//     const d = max - min
//     s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
//     switch (max) {
//       case r:
//         h = (g - b) / d + (g < b ? 6 : 0)
//         break
//       case g:
//         h = (b - r) / d + 2
//         break
//       default:
//         h = (r - g) / d + 4
//     }
//     h /= 6
//   }

//   return { h: h * 360, s: s * 100, l: l * 100 }
// }

// function hslToString(hsl: HSL) {
//   return `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%`
// }

// function hslToRgb({ h, s, l }: HSL) {
//   s /= 100
//   l /= 100
//   const k = (n: number) => (n + h / 30) % 12
//   const a = s * Math.min(l, 1 - l)
//   const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
//   return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) }
// }

// function rgbToHex(r: number, g: number, b: number) {
//   return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
// }

// function distanceH(h1: number, h2: number) {
//   const d = Math.abs(h1 - h2)
//   return Math.min(d, 360 - d)
// }

// async function extractPaletteFromImage(src: string): Promise<{ primary: HSL; secondary: HSL } | null> {
//   try {
//     const img = new Image()
//     img.crossOrigin = "anonymous"
//     img.decoding = "async"
//     img.referrerPolicy = "no-referrer"

//     const p = new Promise<HTMLImageElement>((resolve, reject) => {
//       img.onload = () => resolve(img)
//       img.onerror = reject
//     })

//     img.src = src
//     const image = await p

//     const canvas = document.createElement("canvas")
//     const ctx = canvas.getContext("2d", { willReadFrequently: true })
//     if (!ctx) return null

//     const W = 64
//     const H = Math.max(1, Math.round((image.height / image.width) * W))
//     canvas.width = W
//     canvas.height = H

//     ctx.drawImage(image, 0, 0, W, H)
//     const data = ctx.getImageData(0, 0, W, H).data

//     const bins = new Map<number, { count: number; r: number; g: number; b: number }>()

//     for (let i = 0; i < data.length; i += 4) {
//       const a = data[i + 3]
//       if (a < 180) continue

//       const r = data[i]
//       const g = data[i + 1]
//       const b = data[i + 2]

//       const max = Math.max(r, g, b)
//       const min = Math.min(r, g, b)
//       if (max < 40 || min > 230) continue

//       const R = r >> 4
//       const G = g >> 4
//       const B = b >> 4
//       const key = (R << 8) | (G << 4) | B

//       const ex = bins.get(key)
//       if (ex) {
//         ex.count++
//         ex.r += r
//         ex.g += g
//         ex.b += b
//       } else {
//         bins.set(key, { count: 1, r, g, b })
//       }
//     }

//     if (!bins.size) return null

//     const top = [...bins.values()]
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 12)
//       .map((v) => {
//         const r = v.r / v.count
//         const g = v.g / v.count
//         const b = v.b / v.count
//         return { count: v.count, hsl: rgbToHsl(r, g, b) }
//       })

//     // primary: vibrant, mid-lightness
//     let primary = top[0].hsl
//     let best = Number.NEGATIVE_INFINITY
//     for (const t of top) {
//       const s = t.hsl.s
//       const l = t.hsl.l
//       const score = s * 1.2 - Math.abs(l - 50) * 0.8 + t.count * 0.02
//       if (score > best) {
//         best = score
//         primary = t.hsl
//       }
//     }

//     // secondary: hue-separated
//     let secondary = top[0].hsl
//     best = Number.NEGATIVE_INFINITY
//     for (const t of top) {
//       const dH = distanceH(t.hsl.h, primary.h)
//       const lC = 100 - Math.abs(t.hsl.l - primary.l)
//       const score = dH * 1.2 + t.hsl.s * 0.3 + lC * 0.2
//       if (dH > 18 && score > best) {
//         best = score
//         secondary = t.hsl
//       }
//     }

//     const normalize = (c: HSL): HSL => ({
//       h: (c.h + 360) % 360,
//       s: Math.max(35, Math.min(90, c.s)),
//       l: Math.max(28, Math.min(72, c.l)),
//     })

//     return { primary: normalize(primary), secondary: normalize(secondary) }
//   } catch {
//     return null
//   }
// }

// export default function Products() {
//   const sectionRef = useRef<HTMLDivElement>(null)
//   const lenisRef = useRef<Lenis | null>(null)
//   const tickerFnRef = useRef<((t: number) => void) | null>(null)

//   // Brand (fallback emerald/teal)
//   const [brandPrimaryHsl, setBrandPrimaryHsl] = useState<HSL>({ h: 160, s: 84, l: 39 })
//   const [brandSecondaryHsl, setBrandSecondaryHsl] = useState<HSL>({ h: 173, s: 80, l: 40 })

//   const brandPrimary = useMemo(() => hslToString(brandPrimaryHsl), [brandPrimaryHsl])
//   const brandSecondary = useMemo(() => hslToString(brandSecondaryHsl), [brandSecondaryHsl])
//   const brandPrimaryHex = useMemo(() => {
//     const { r, g, b } = hslToRgb(brandPrimaryHsl)
//     return rgbToHex(r, g, b)
//   }, [brandPrimaryHsl])

//   // Extract palette from logo
//   useEffect(() => {
//     let mounted = true
//     extractPaletteFromImage(LOGO_SRC).then((pal) => {
//       if (!mounted || !pal) return
//       setBrandPrimaryHsl(pal.primary)
//       setBrandSecondaryHsl(pal.secondary)
//     })
//     return () => {
//       mounted = false
//     }
//   }, [])

//   // Smooth scrolling + scroll animations
//   useEffect(() => {
//     lenisRef.current = new Lenis({
//       duration: 1.2,
//       easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//       smoothWheel: true,
//     })

//     lenisRef.current.on("scroll", ScrollTrigger.update)

//     const tickerFn = (time: number) => lenisRef.current?.raf(time * 1000)
//     tickerFnRef.current = tickerFn
//     gsap.ticker.add(tickerFn)
//     gsap.ticker.lagSmoothing(0)

//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         ".product-card",
//         { y: 80, opacity: 0, scale: 0.9 },
//         {
//           y: 0,
//           opacity: 1,
//           scale: 1,
//           duration: 1,
//           stagger: 0.15,
//           ease: "power3.out",
//           scrollTrigger: {
//             trigger: sectionRef.current,
//             start: "top 80%",
//             end: "bottom 20%",
//             toggleActions: "play none none reverse",
//           },
//         },
//       )

//       gsap.fromTo(
//         ".filter-button",
//         { y: 30, opacity: 0 },
//         {
//           y: 0,
//           opacity: 1,
//           duration: 0.8,
//           stagger: 0.08,
//           ease: "power2.out",
//           scrollTrigger: { trigger: ".filter-section", start: "top 85%", toggleActions: "play none none reverse" },
//         },
//       )
//     }, sectionRef)

//     return () => {
//       ctx.revert()
//       if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current)
//       lenisRef.current?.destroy()
//     }
//   }, [])

//   // Categories (as requested)
//   type CategoryDef = { label: string; icon: LucideIcon }
//   const categoryDefs: CategoryDef[] = [
//     { label: "All", icon: Boxes },
//     { label: "POLES & LIGHTING MASTS", icon: Lightbulb },
//     { label: "NUTS & BOLTS", icon: Wrench },
//     { label: "FABRICATING ITEMS", icon: Factory },
//     { label: "EARTHING MATERIAL", icon: Bolt },
//     { label: "INSULATOR", icon: Zap },
//     { label: "ELECTRICAL ACCESSORIES", icon: Settings },
//     { label: "TOOLS & TACKLES", icon: Wrench },
//     { label: "SAFETY ITEMS", icon: Shield },
//     { label: "LED LIGHTINGS", icon: Lightbulb },
//     { label: "SOLAR", icon: Sun },
//     { label: "FITTING", icon: Wrench },
//     { label: "FLANGES", icon: Settings },
//     { label: "LITHIUM BATTERIES", icon: BatteryCharging },
//     { label: "WASTE MANAGEMENT", icon: Trash2 },
//     { label: "BATTERIES", icon: BatteryCharging },
//     { label: "INSULATORS", icon: Zap },
//     { label: "PIPE FITTINGS", icon: Settings },
//   ]

//   const categories = categoryDefs.map((c) => c.label)
//   const [activeFilter, setActiveFilter] = useState<string>("All")
//   const [searchTerm, setSearchTerm] = useState<string>("")

//   const catScrollRef = useRef<HTMLDivElement>(null)
//   const catItemRefs = useRef<Record<string, HTMLButtonElement | null>>({})

//   useEffect(() => {
//     const el = catItemRefs.current[activeFilter]
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
//     }
//   }, [activeFilter])

//   const scrollCats = (dir: "left" | "right") => {
//     const el = catScrollRef.current
//     if (!el) return
//     const delta = Math.round(el.clientWidth * 0.8) * (dir === "left" ? -1 : 1)
//     el.scrollBy({ left: delta, behavior: "smooth" })
//   }

//   const onCatsKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
//     if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
//       e.preventDefault()
//       const idx = categories.findIndex((c) => c === activeFilter)
//       const next = e.key === "ArrowRight" ? Math.min(idx + 1, categories.length - 1) : Math.max(idx - 1, 0)
//       setActiveFilter(categories[next])
//     }
//   }

//   const [hoveredCard, setHoveredCard] = useState<number | null>(null)
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
//   const [showDetails, setShowDetails] = useState(false)

//   // Comprehensive products from your specifications
//   const products: Product[] = [
//     // FLANGES
//     {
//       category: "FLANGES",
//       icon: Settings,
//       title: "Weld Neck Flange (WN)",
//       brands: ["Ratnamani", "Neo Impex", "Citizen", "Penn Machine", "Sandvik"],
//       description: "A flange with a tapered neck that is welded to the pipe for high-pressure applications.",
//       detailedDescription:
//         "Weld neck flanges provide excellent structural integrity and are ideal for high-pressure, high-temperature applications. The tapered neck reduces stress concentration.",
//       rating: 4.8,
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/weld-neck-flange--wn--make-this-product-more-reali-oeeHSw15WWQWUIsXG8e19Vn3qfRapP.png",
//       specifications: ['Size: 1/2" to 48"', "Pressure: 150# to 2500#", "Face: RF/FF/RTJ", "Material: CS/SS"],
//       features: ["High pressure rating", "Excellent structural integrity", "Stress reduction", "Welded connection"],
//       applications: ["High-pressure systems", "Chemical processing", "Oil & gas pipelines", "Power plants"],
//     },
//     {
//       category: "FLANGES",
//       icon: Settings,
//       title: "Slip-On Flange (SO)",
//       brands: ["Ratnamani", "Neo Impex", "Citizen", "Penn Machine"],
//       description: "A flange that slides over the pipe and is then welded for easy installation.",
//       detailedDescription:
//         "Slip-on flanges are cost-effective and easy to install, making them popular for low-pressure applications where alignment is not critical.",
//       rating: 4.6,
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/slip-on-flange--so--make-this-product-more-realist-kjpyTvpwNr6y0y14bgIPUsHIVDxjoV.png",
//       specifications: ['Size: 1/2" to 24"', "Pressure: 150# to 600#", "Face: RF/FF", "Material: CS/SS"],
//       features: ["Easy installation", "Cost-effective", "Good for alignment", "Welded connection"],
//       applications: ["Low-pressure systems", "Water lines", "HVAC systems", "General piping"],
//     },
//     {
//       category: "FLANGES",
//       icon: Settings,
//       title: "Blind Flange (BL)",
//       brands: ["Ratnamani", "Neo Impex", "Penn Machine", "Sandvik"],
//       description: "A flange used to close the end of a piping system for maintenance or testing.",
//       detailedDescription:
//         "Blind flanges are solid flanges without a center hole, used to close pipe ends, test systems, or provide access points for future connections.",
//       rating: 4.7,
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blind-flange--bl--make-this-product-more-realistic-ikaGWmktoR90jV5I1WvAlbhl99MiMr.png",
//       specifications: ['Size: 1/2" to 48"', "Pressure: 150# to 2500#", "Face: RF/FF/RTJ", "Material: CS/SS"],
//       features: ["System closure", "Test point access", "Maintenance friendly", "High pressure capability"],
//       applications: ["System testing", "Pipe end closure", "Maintenance access", "Future connections"],
//     },
//     {
//       category: "FLANGES",
//       icon: Settings,
//       title: "Ring-Type Joint (RTJ) Flange",
//       brands: ["Ratnamani", "Penn Machine", "Sandvik", "Neo Impex"],
//       description: "High-pressure flanges with groove and metal ring for superior sealing.",
//       detailedDescription:
//         "RTJ flanges feature a groove and metal ring design that provides excellent sealing for high-pressure, high-temperature applications in critical services.",
//       rating: 4.9,
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ring-type-joint--rtj--flange-make-this-product-mor-My9FTKGJeWKJ6ruqLlTwYG3Y1uNfgo.png",
//       specifications: ['Size: 1" to 48"', "Pressure: 600# to 2500#", "Ring: R/RX/BX", "Material: CS/SS/Alloy"],
//       features: ["Superior sealing", "High pressure rating", "Metal-to-metal seal", "Critical service"],
//       applications: ["High-pressure systems", "Oil & gas", "Refineries", "Chemical plants"],
//     },

//     // INSULATORS
//     {
//       category: "INSULATORS",
//       icon: Zap,
//       title: "Disc Insulator",
//       brands: ["Lapp Insulators", "NGK", "Hubbell", "Seves", "MacLean"],
//       description:
//         "Used in high-voltage transmission lines to support conductors and prevent contact with tower structure.",
//       detailedDescription:
//         "Disc insulators are designed to support conductors in high-voltage transmission systems while providing electrical insulation and mechanical strength.",
//       rating: 4.7,
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lightning-insulator-make-this-product-more-realist-vJwO4Ey6rSNQS0BrlpKhooBSwbYQFq.png",
//       specifications: [
//         "Voltage: 11kV to 765kV",
//         "Type: Suspension/Strain",
//         "Material: Porcelain/Glass",
//         "Creepage: High",
//       ],
//       features: ["High dielectric strength", "Weather resistant", "Mechanical strength", "Low leakage current"],
//       applications: ["Transmission lines", "Distribution lines", "Substations", "Switchgear"],
//     },
//     {
//       category: "INSULATORS",
//       icon: Zap,
//       title: "Pin Insulator",
//       brands: ["Lapp Insulators", "NGK", "Hubbell", "Seves"],
//       description: "Used for supporting conductors in medium and low-voltage power lines.",
//       detailedDescription:
//         "Pin insulators are mounted on crossarms of poles and towers to support overhead conductors in medium voltage distribution systems.",
//       rating: 4.5,
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pin-insulator-make-this-product-more-realistics-re-qVyF65lI7Ie4A0OjZmWBPKkT41Sjm1.png",
//       specifications: ["Voltage: 11kV to 33kV", "Type: Pin type", "Material: Porcelain", "Mounting: Threaded"],
//       features: ["Simple design", "Cost effective", "Easy installation", "Reliable performance"],
//       applications: ["Distribution lines", "Rural electrification", "Medium voltage systems", "Overhead lines"],
//     },
//     {
//       category: "INSULATORS",
//       icon: Zap,
//       title: "Guy Insulator",
//       brands: ["Lapp Insulators", "NGK", "Hubbell"],
//       description: "Designed to prevent electrical current from passing through the supporting guy wires.",
//       detailedDescription:
//         "Guy insulators are installed in guy wires to provide electrical isolation while maintaining mechanical support for poles and towers.",
//       rating: 4.4,
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guy-insulator-make-this-product-more-realistics-re-JeBNBZGnfiklLbXub4Fjs96fgNRbQm.png",
//       specifications: ["Voltage: Up to 33kV", "Type: Guy wire", "Material: Porcelain", "Load: High tensile"],
//       features: ["Electrical isolation", "High tensile strength", "Weather resistant", "Compact design"],
//       applications: ["Guy wire systems", "Pole support", "Tower anchoring", "Mechanical support"],
//     },
//     {
//       category: "INSULATORS",
//       icon: Zap,
//       title: "Ceramic Insulator",
//       brands: ["Lapp Insulators", "NGK", "Seves", "MacLean"],
//       description: "Traditional, durable insulators made from ceramic materials for power transmission.",
//       detailedDescription:
//         "Ceramic insulators offer excellent electrical properties and durability, commonly used in power transmission and high-voltage applications.",
//       rating: 4.6,
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ceramic-insulator-make-this-product-more-realistic-d54Ze4jIadxkl0Izy40ftzdg1CHQxE.png",
//       specifications: ["Voltage: 11kV to 400kV", "Material: Ceramic/Porcelain", "Type: Various", "Finish: Glazed"],
//       features: ["High dielectric strength", "Thermal stability", "Chemical resistance", "Long service life"],
//       applications: ["Power transmission", "High voltage lines", "Substations", "Industrial applications"],
//     },
//     {
//       category: "INSULATORS",
//       icon: Zap,
//       title: "Glass Insulator",
//       brands: ["NGK", "Seves", "MacLean", "Hubbell"],
//       description: "Strong and transparent insulators made of glass, used in medium to high voltage systems.",
//       detailedDescription:
//         "Glass insulators provide excellent visibility for inspection and offer superior mechanical and electrical properties for overhead power systems.",
//       rating: 4.5,
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/glass-insulator-make-this-product-more-realistics--TltbgPJjxtD6rPZzCnTpMS8eLeLA92.png",
//       specifications: [
//         "Voltage: 11kV to 220kV",
//         "Material: Toughened glass",
//         "Type: Suspension/Pin",
//         "Visibility: Transparent",
//       ],
//       features: ["Visual inspection", "High strength", "Weather resistant", "Self-cleaning"],
//       applications: ["Distribution systems", "Transmission lines", "Coastal areas", "Polluted environments"],
//     },
//     {
//       category: "INSULATORS",
//       icon: Zap,
//       title: "Lightning Arrestor",
//       brands: ["ABB", "Siemens", "Schneider", "Hubbell", "Cooper"],
//       description: "Used to protect electrical equipment from lightning strikes by diverting the current.",
//       detailedDescription:
//         "Lightning arrestors protect electrical systems and equipment from voltage surges caused by lightning strikes or switching operations.",
//       rating: 4.8,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Voltage: 3kV to 800kV", "Type: Gapless/Gapped", "Material: Metal oxide", "Duty: Heavy/Normal"],
//       features: ["Surge protection", "Fast response", "High energy absorption", "Reliable operation"],
//       applications: ["Substations", "Transmission lines", "Industrial plants", "Distribution systems"],
//     },

//     // EARTHING
//     {
//       category: "EARTHING MATERIAL",
//       icon: Bolt,
//       title: "GI (Galvanized Iron) Earthing Rods",
//       brands: ["Erico", "Furse", "Kopel", "Kingsmill", "Lightning"],
//       description: "Galvanized iron rods for electrical earthing systems with corrosion protection.",
//       detailedDescription:
//         "GI earthing rods provide reliable grounding with zinc coating for corrosion protection, suitable for most soil conditions and electrical installations.",
//       rating: 4.5,
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gi--galvanized-iron--earthing-rods-make-this-produ-ESzDsaLnH2dUZBiAeGAw4XHGKv7SUb.png",
//       specifications: [
//         "Material: Galvanized iron",
//         "Diameter: 12mm to 25mm",
//         "Length: 1m to 3m",
//         "Coating: Hot dip galvanized",
//       ],
//       features: ["Corrosion resistant", "Cost effective", "Easy installation", "Standard compliance"],
//       applications: ["Residential earthing", "Commercial buildings", "Industrial earthing", "Distribution systems"],
//     },
//     {
//       category: "EARTHING MATERIAL",
//       icon: Bolt,
//       title: "CU (Copper) Earthing Rods",
//       brands: ["Erico", "Furse", "Kopel", "Kingsmill"],
//       description: "High-conductivity copper rods for superior electrical earthing performance.",
//       detailedDescription:
//         "Pure copper earthing rods offer the highest conductivity and corrosion resistance for critical earthing applications requiring low resistance values.",
//       rating: 4.7,
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/-cu--copper--earthing-rods--make-this-product-imag-D7WJqOjOcLmqDX3KpGhe1vpgxAdxph.png",
//       specifications: ["Material: 99.9% pure copper", "Diameter: 12mm to 25mm", "Length: 1m to 3m", "Resistance: <1 ohm"],
//       features: ["Highest conductivity", "Excellent corrosion resistance", "Low resistance", "Long lasting"],
//       applications: ["Critical earthing", "Lightning protection", "Substations", "Sensitive equipment"],
//     },
//     {
//       category: "EARTHING MATERIAL",
//       icon: Wrench,
//       title: "Earthing Clamps",
//       brands: ["Erico", "Furse", "Kopel", "Lightning"],
//       description: "Clamps for connecting earthing conductors to rods and structures.",
//       detailedDescription:
//         "Earthing clamps provide secure mechanical and electrical connections between earthing conductors and electrodes in grounding systems.",
//       rating: 4.6,
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/-earthing-clamps--make-this-product-image-more-rea-Y48diMvBNFq2GJJgcMiTtKnfcHiakz.png",
//       specifications: ["Material: Copper/Brass", "Size: 12mm to 50mm", "Type: Bolt/Compression", "Current: Up to 1000A"],
//       features: ["Secure connection", "Corrosion resistant", "Easy installation", "High current capacity"],
//       applications: ["Earthing connections", "Grounding systems", "Lightning protection", "Electrical installations"],
//     },
//     {
//       category: "EARTHING MATERIAL",
//       icon: Settings,
//       title: "Earthing Wire & Strips",
//       brands: ["Erico", "Furse", "Kopel", "Kingsmill"],
//       description: "Copper conductors for earthing networks and equipotential bonding.",
//       detailedDescription:
//         "Earthing wires and strips form the conductor network in grounding systems, providing low-resistance paths for fault currents and lightning protection.",
//       rating: 4.5,
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/-earthing-wire---strips--make-this-product-image-m-3q1KpwYxDcvjJLhdeIj4wM48a22XTu.png",
//       specifications: ["Material: Copper", "Size: 25mm² to 120mm²", "Type: Wire/Strip", "Purity: 99.9%"],
//       features: ["High conductivity", "Flexible installation", "Corrosion resistant", "Various sizes"],
//       applications: ["Earthing networks", "Equipotential bonding", "Lightning protection", "Grounding grids"],
//     },

//      // PIPE FITTINGS
//   {
//     category: "PIPE FITTINGS",
//     icon: Settings,
//     title: "Buttweld Fittings",
//     brands: ["Ratnamani", "Sandvik", "Penn Machine", "Neo Impex", "Petromet"],
//     description: "Seamless pipe fittings for welded piping systems in high-pressure applications.",
//     detailedDescription:
//       "Buttweld fittings provide smooth bore and excellent flow characteristics for welded piping systems in oil & gas, chemical, and power industries.",
//     rating: 4.7,
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/-buttweld-fittings--make-this-product-image-more-r-fSVRuipt0NvFNvryIptGv2bbY8kGAA.png",
//     specifications: ['Size: 1/2" to 48"', "Material: SS/CS", "Standard: ASME B16.9", "Schedule: 10S to XXS"],
//     features: ["Smooth bore", "High pressure rating", "Welded construction", "Standard dimensions"],
//     applications: ["Oil & gas pipelines", "Chemical processing", "Power plants", "Refineries"],
//   },
//   {
//     category: "PIPE FITTINGS",
//     icon: Wrench,
//     title: "Forged Fittings",
//     brands: ["Penn Machine", "Neo Impex", "Citizen", "Petromet", "Ratnamani"],
//     description: "High-pressure forged fittings for threaded and socket weld connections.",
//     detailedDescription:
//       "Forged steel fittings for high-pressure applications with threaded and socket weld end connections, ideal for small bore piping.",
//     rating: 4.6,
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/-forged-fittings-make-this-product-image-more-real-i3kxJwBCaTFG2LGJHrU8fb5N9wc0KQ.png",
//     specifications: ['Size: 1/8" to 4"', "Pressure: 2000# to 9000#", "End: NPT/SW", "Material: A105/SS316"],
//     features: ["High pressure capability", "Compact design", "Threaded/SW ends", "Forged construction"],
//     applications: ["Instrumentation", "Small bore piping", "High pressure systems", "Process connections"],
//   },

//   // FABRICATING ITEMS
//   {
//     category: "FABRICATING ITEMS",
//     icon: Factory,
//     title: "Transmission Line Tower Accessories",
//     brands: ["Kalpataru", "KEC", "Skipper", "Sterling & Wilson"],
//     description: "Accessories used in construction and maintenance of transmission line towers.",
//     detailedDescription:
//       "Complete range of tower accessories including brackets, bolts, nuts, and components for transmission line tower construction and maintenance.",
//     rating: 4.6,
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/-transmission-line-tower-accessories--make-this-pr-bdjnqqWINGS98uGzFxk0Dxuw1f0ITg.png",
//     specifications: [
//       "Material: Galvanized steel",
//       "Type: Various accessories",
//       "Standard: IS/IEC",
//       "Coating: Hot dip galvanized",
//     ],
//     features: ["Corrosion resistant", "High strength", "Standard compliance", "Easy installation"],
//     applications: ["Transmission towers", "Distribution structures", "Substation equipment", "Line construction"],
//   },
//   {
//     category: "FABRICATING ITEMS",
//     icon: Zap,
//     title: "Conductor Accessories",
//     brands: ["Preformed Line Products", "AFL", "Hubbell", "Tyco"],
//     description: "Items like conductor clamps, splices, and connectors for maintaining electrical conductor integrity.",
//     detailedDescription:
//       "Conductor accessories ensure proper connection and support of overhead conductors in transmission and distribution systems.",
//     rating: 4.5,
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/-conductor-accessories--make-this-product-image-mo-WRHXb0vMzcr59WPADtBaLOJKW2ASOm.png",
//     specifications: ["Material: Aluminum/Copper", "Type: Clamps/Splices", "Current: Up to 2000A", "Standard: IEC/ASTM"],
//     features: ["Low resistance", "Weather resistant", "Easy installation", "High current capacity"],
//     applications: ["Overhead lines", "Conductor connections", "Line maintenance", "Power transmission"],
//   },
//   {
//     category: "FABRICATING ITEMS",
//     icon: Settings,
//     title: "Cable Accessories",
//     brands: ["3M", "Raychem", "Prysmian", "Nexans"],
//     description: "Cable glands, cable lugs, cable trays, and cable ties for routing and terminating electrical cables.",
//     detailedDescription:
//       "Complete range of cable accessories for proper routing, securing, and termination of electrical cables in various applications.",
//     rating: 4.4,
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/-cable-accessories--make-this-product-image-more-r-5uq8MKcjgvI6xSIXFi9b8vpjBj91Mr.png",
//     specifications: ["Material: Brass/SS/Plastic", "Size: Various", "Type: Glands/Lugs/Trays", "IP rating: IP65/IP68"],
//     features: ["Weather proof", "Easy installation", "Multiple sizes", "Secure connection"],
//     applications: ["Cable installations", "Panel connections", "Industrial wiring", "Control systems"],
//   },
//   {
//     category: "FABRICATING ITEMS",
//     icon: Wrench,
//     title: "Electrical Connectors",
//     brands: ["Burndy", "Panduit", "3M", "Hubbell"],
//     description: "Devices for joining electrical cables or wires together, ensuring secure electrical connection.",
//     detailedDescription:
//       "Electrical connectors provide reliable connections between conductors, ensuring proper electrical continuity and mechanical strength.",
//     rating: 4.5,
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/-electrical-connectors--make-this-product-image-mo-MVDTt0U3AeWHg68vS70EepcRV0aKp0.png",
//     specifications: ["Material: Copper/Aluminum", "Type: Various", "Current: 10A to 1000A", "Voltage: Up to 35kV"],
//     features: ["Reliable connection", "Easy installation", "Multiple types", "High current capacity"],
//     applications: ["Electrical connections", "Panel wiring", "Motor connections", "Distribution systems"],
//   },

//     // BATTERIES
//     {
//       category: "BATTERIES",
//       icon: BatteryCharging,
//       title: "Car Batteries (Electric Vehicles - EVs)",
//       brands: ["Exide", "Amaron", "Livguard", "Okaya", "Base"],
//       description:
//         "High-performance batteries for electric vehicles with longer range, faster charging, and eco-friendly operation.",
//       detailedDescription:
//         "Advanced lithium-ion batteries for electric cars providing superior performance, longer range, and faster charging compared to traditional batteries. Examples include Tesla, Nissan Leaf, BMW i3.",
//       rating: 4.5,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "Capacity: 40Ah to 200Ah",
//         "Voltage: 12V/48V/72V",
//         "Chemistry: LiFePO4",
//         "Cycle life: 2000+ cycles",
//       ],
//       features: ["Longer range", "Faster charging", "Lighter weight", "Eco-friendly"],
//       applications: ["Electric cars", "Electric buses", "Commercial EVs", "Two-wheelers"],
//     },
//     {
//       category: "BATTERIES",
//       icon: BatteryCharging,
//       title: "Auto Rickshaw Batteries",
//       brands: ["Exide", "Amaron", "Livguard", "Okaya"],
//       description: "Specialized batteries for electric auto rickshaws with lower operating costs and zero emissions.",
//       detailedDescription:
//         "Electric auto rickshaw batteries provide cost-effective operation with zero emissions and reduced noise, ideal for urban transportation in India.",
//       rating: 4.4,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "Capacity: 80Ah to 150Ah",
//         "Voltage: 48V/60V",
//         "Type: Lead acid/Lithium",
//         "Cycle life: 800-2000 cycles",
//       ],
//       features: ["Lower operating costs", "Zero emissions", "Reduced noise", "Reliable performance"],
//       applications: ["Electric auto rickshaws", "Three-wheelers", "Commercial transport", "Urban mobility"],
//     },
//     {
//       category: "BATTERIES",
//       icon: BatteryCharging,
//       title: "Bike Batteries (E-Bikes)",
//       brands: ["Okaya", "Livguard", "Exide", "Amaron", "Microtek"],
//       description:
//         "Lightweight batteries for electric bikes with longer battery life, faster charging, and high performance.",
//       detailedDescription:
//         "Compact and lightweight lithium batteries designed for electric bikes and scooters, popular with e-bike brands like Rad Power Bikes, offering excellent performance and durability.",
//       rating: 4.4,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Capacity: 20Ah to 60Ah", "Voltage: 24V/36V/48V", "Weight: 2-6 kg", "Charging time: 4-6 hours"],
//       features: ["Lightweight", "Longer battery life", "Faster charging", "High performance"],
//       applications: ["Electric bikes", "Electric scooters", "E-rickshaws", "Personal mobility"],
//     },
//     {
//       category: "BATTERIES",
//       icon: BatteryCharging,
//       title: "Solar Batteries",
//       brands: ["Luminous", "Exide", "Amaron", "Su-Kam", "Okaya"],
//       description:
//         "Energy storage batteries with efficient storage, long lifespan, faster charging, and compact design.",
//       detailedDescription:
//         "Solar batteries designed for energy storage applications with deep cycle capability and long service life. Examples include Tesla Powerwall, LG Chem RESU for residential and commercial use.",
//       rating: 4.3,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Capacity: 50Ah to 300Ah", "Voltage: 12V/24V/48V", "DOD: 90%+", "Cycle life: 3000+ cycles"],
//       features: ["Efficient energy storage", "Long lifespan", "Faster charging", "Compact design"],
//       applications: ["Solar power systems", "Off-grid installations", "Backup power", "Energy storage"],
//     },

//     // NUTS & BOLTS
//     {
//       category: "NUTS & BOLTS",
//       icon: Bolt,
//       title: "Hot Dip Galvanized Nuts & Bolts",
//       brands: ["Sundram Fasteners", "Unbrako", "Precision", "LISI", "Ramdev"],
//       description:
//         "Steel fasteners coated with zinc to protect from corrosion, common in outdoor and marine environments.",
//       detailedDescription:
//         "Hot dip galvanized nuts and bolts provide superior corrosion protection for outdoor installations, marine environments, and industrial applications where rust resistance is crucial.",
//       rating: 4.6,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Size: M6 to M64", "Length: 10mm to 500mm", "Coating: Hot dip galvanized", "Grade: 4.6, 8.8"],
//       features: ["Corrosion resistant", "Long lasting", "High strength", "Weather proof"],
//       applications: ["Outdoor structures", "Marine installations", "Transmission towers", "Infrastructure"],
//     },
//     {
//       category: "NUTS & BOLTS",
//       icon: Wrench,
//       title: "MS Nuts & Bolts (Mild Steel)",
//       brands: ["Sundram Fasteners", "Unbrako", "Precision", "LISI"],
//       description:
//         "Mild steel fasteners used in low to medium-strength applications, cheaper but may rust if exposed to moisture.",
//       detailedDescription:
//         "Mild steel nuts and bolts are cost-effective fasteners for general applications where high strength is not critical, but require protection from moisture to prevent rusting.",
//       rating: 4.3,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Size: M3 to M48", "Grade: 4.6, 5.6", "Finish: Plain/Zinc plated", "Standard: IS/DIN"],
//       features: ["Cost effective", "General purpose", "Easy machining", "Standard sizes"],
//       applications: ["General construction", "Furniture", "Light machinery", "Indoor applications"],
//     },
//     {
//       category: "NUTS & BOLTS",
//       icon: Bolt,
//       title: "SS Nuts & Bolts (Stainless Steel)",
//       brands: ["Unbrako", "Precision", "Super Bolts", "Neo Impex", "Citizen"],
//       description:
//         "Made from stainless steel for improved corrosion resistance, commonly used where durability is necessary.",
//       detailedDescription:
//         "High-grade stainless steel bolts (SS304/SS316) offering excellent corrosion resistance for critical applications in chemical, food processing, and marine environments.",
//       rating: 4.7,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Material: SS304/SS316", "Size: M3 to M48", "Finish: Plain/Polished", "Grade: A2, A4"],
//       features: ["Excellent corrosion resistance", "Food grade", "High temperature resistance", "Non-magnetic"],
//       applications: ["Chemical plants", "Food processing", "Pharmaceutical", "Marine equipment"],
//     },
//     {
//       category: "NUTS & BOLTS",
//       icon: Settings,
//       title: "EP Nuts & Bolts (Electroplated)",
//       brands: ["Sundram Fasteners", "Unbrako", "Precision"],
//       description:
//         "Electroplated with zinc or other metals to prevent rust and corrosion, suitable for indoor or moderately corrosive environments.",
//       detailedDescription:
//         "Electroplated nuts and bolts with a thin layer of zinc or other metals provide rust protection for indoor or moderately corrosive environments at an economical cost.",
//       rating: 4.4,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Coating: Zinc/Nickel", "Thickness: 5-25 microns", "Size: M3 to M36", "Grade: 4.6, 8.8"],
//       features: ["Rust prevention", "Cost effective", "Good appearance", "Indoor suitable"],
//       applications: ["Indoor applications", "Light machinery", "Electrical panels", "Moderate environments"],
//     },
//     {
//       category: "NUTS & BOLTS",
//       icon: Wrench,
//       title: "U Bolts & U Clamps",
//       brands: ["Sundram Fasteners", "Unbrako", "Precision", "LISI"],
//       description: "U-shaped bolts and clamps used for securing pipes, rods, or structural components to surfaces.",
//       detailedDescription:
//         "U-bolts and U-clamps are designed for securing pipes, cables, and structural components to surfaces with reliable clamping force and easy installation.",
//       rating: 4.5,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "Size: M6 to M24",
//         "Pipe dia: 10mm to 200mm",
//         "Material: MS/SS/Galvanized",
//         "Thread: Metric/BSW",
//       ],
//       features: ["Secure clamping", "Multiple sizes", "Corrosion protection", "Easy installation"],
//       applications: ["Pipe supports", "Cable management", "Structural mounting", "Automotive"],
//     },

//     // WASTE MANAGEMENT
//     {
//       category: "WASTE MANAGEMENT",
//       icon: Trash2,
//       title: "Municipal Solid Waste (MSW) Management",
//       brands: ["Ramky Enviro", "IL&FS", "Antony Waste", "BEIL"],
//       description: "Household garbage, packaging, and food scraps collection and processing systems.",
//       detailedDescription:
//         "Comprehensive municipal solid waste management solutions including collection, segregation, processing, and disposal of household garbage, packaging materials, and organic waste.",
//       rating: 4.3,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "Capacity: 1-50 tons/day",
//         "Type: Collection/Processing",
//         "Technology: Various",
//         "Automation: Available",
//       ],
//       features: [
//         "Systematic collection",
//         "Segregation capability",
//         "Processing efficiency",
//         "Environmental compliance",
//       ],
//       applications: ["Cities and towns", "Residential areas", "Commercial zones", "Public spaces"],
//     },
//     {
//       category: "WASTE MANAGEMENT",
//       icon: Factory,
//       title: "Industrial Waste Management",
//       brands: ["Ramky Enviro", "IL&FS", "Clean Science", "BEIL"],
//       description: "Manufacturing residues, scrap metal, and chemical waste treatment and disposal systems.",
//       detailedDescription:
//         "Specialized industrial waste management for manufacturing residues, scrap metal, chemicals, and other industrial byproducts with proper treatment and disposal methods.",
//       rating: 4.4,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "Capacity: 5-200 tons/day",
//         "Type: Treatment/Disposal",
//         "Compliance: Pollution board",
//         "Technology: Advanced",
//       ],
//       features: ["Specialized treatment", "Regulatory compliance", "Resource recovery", "Environmental protection"],
//       applications: ["Manufacturing plants", "Chemical industries", "Metal processing", "Pharmaceutical units"],
//     },
//     {
//       category: "WASTE MANAGEMENT",
//       icon: Shield,
//       title: "Hazardous Waste Management",
//       brands: ["Ramky Enviro", "Clean Science", "TSDF", "Gujarat Enviro"],
//       description: "Safe handling and disposal of paints, pesticides, batteries, and medical sharps.",
//       detailedDescription:
//         "Specialized hazardous waste management for dangerous materials including paints, pesticides, batteries, medical sharps, and other toxic substances requiring special handling.",
//       rating: 4.6,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Type: TSDF facility", "Capacity: Various", "Safety: High level", "Compliance: CPCB/SPCB"],
//       features: ["Safe handling", "Specialized treatment", "Regulatory compliance", "Environmental safety"],
//       applications: ["Hospitals", "Laboratories", "Chemical plants", "Research facilities"],
//     },
//     {
//       category: "WASTE MANAGEMENT",
//       icon: Heart,
//       title: "Biomedical Waste Management",
//       brands: ["Ramky Enviro", "Antony Waste", "BEIL", "Synergy Waste"],
//       description: "Specialized disposal of hospital disposables, syringes, and human tissue waste.",
//       detailedDescription:
//         "Comprehensive biomedical waste management for hospitals, clinics, and healthcare facilities including safe collection, treatment, and disposal of medical waste.",
//       rating: 4.5,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "Type: Autoclave/Incineration",
//         "Capacity: 10-500 kg/day",
//         "Safety: Bio-safety level",
//         "Compliance: BMW rules",
//       ],
//       features: ["Safe collection", "Proper segregation", "Sterilization treatment", "Regulatory compliance"],
//       applications: ["Hospitals", "Clinics", "Diagnostic centers", "Research labs"],
//     },
//     {
//       category: "WASTE MANAGEMENT",
//       icon: Smartphone,
//       title: "E-waste Management",
//       brands: ["Attero Recycling", "E-Parisaraa", "Ramky Enviro", "BEIL"],
//       description: "Recycling and disposal of old computers, phones, and electronic appliances.",
//       detailedDescription:
//         "Electronic waste management and recycling services for computers, mobile phones, appliances, and other electronic devices with resource recovery and safe disposal.",
//       rating: 4.2,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "Type: Dismantling/Recovery",
//         "Capacity: 100-5000 units/day",
//         "Recovery: Metals/Plastics",
//         "Compliance: E-waste rules",
//       ],
//       features: ["Resource recovery", "Data destruction", "Environmental safety", "Certified disposal"],
//       applications: ["IT companies", "Electronics manufacturers", "Government offices", "Educational institutions"],
//     },

//     // POLES & LIGHTING MASTS
//     {
//       category: "POLES & LIGHTING MASTS",
//       icon: Lightbulb,
//       title: "PCC Pole (Precast Concrete)",
//       brands: ["Supreme", "RCC Poles", "Anchor Poles", "Bajaj Electricals"],
//       description:
//         "Durable and cost-effective poles for lighting and power distribution, common in rural and suburban areas.",
//       detailedDescription:
//         "PCC poles are precast to ensure consistency and strength. Widely used for street lighting, telecom towers, and distribution networks thanks to durability and lower lifecycle cost.",
//       rating: 4.6,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Material: Precast concrete", "Height: 3m to 12m", "Load: Up to 150kg", "Foundation: Bolt type"],
//       features: ["Cost-effective", "Durable", "Weather resistant", "Easy installation"],
//       applications: ["Street lighting", "Distribution networks", "Telecom support", "Rural electrification"],
//     },
//     {
//       category: "POLES & LIGHTING MASTS",
//       icon: Factory,
//       title: "Steel Tubular Pole",
//       brands: ["Bajaj Electricals", "AE&E", "Supreme", "Anchor"],
//       description: "High-strength tubular steel poles for high-voltage transmission lines and large-scale lighting.",
//       detailedDescription:
//         "Steel tubular poles deliver higher load capacity and durability than concrete for demanding applications including highways and high-mast lighting.",
//       rating: 4.7,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "Material: Galvanized steel",
//         "Height: 6m to 40m",
//         "Wind load: 150 km/hr",
//         "Coating: Hot dip galvanized",
//       ],
//       features: ["High load capacity", "Corrosion resistant", "Long life", "Customizable height"],
//       applications: ["Transmission lines", "Highway lighting", "Stadium lighting", "Industrial complexes"],
//     },
//     {
//       category: "POLES & LIGHTING MASTS",
//       icon: Lightbulb,
//       title: "High Mast Lighting",
//       brands: ["Philips", "Bajaj", "Halonix", "Syska"],
//       description: "Tall structures for lighting large outdoor areas like stadiums, airports, and highways.",
//       detailedDescription:
//         "High mast lighting systems provide uniform illumination over large areas with multiple light fixtures mounted on tall poles.",
//       rating: 4.8,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "Height: 15m to 40m",
//         "Luminaires: 4 to 12",
//         "Wind load: 200 km/hr",
//         "Lowering system: Manual/Electric",
//       ],
//       features: ["Wide area coverage", "Lowering mechanism", "Multiple luminaires", "Remote control"],
//       applications: ["Stadiums", "Airports", "Highways", "Large industrial areas"],
//     },

//     // LED LIGHTINGS
//     {
//       category: "LED LIGHTINGS",
//       icon: Lightbulb,
//       title: "Industrial LED Lights",
//       brands: ["Bajaj", "Philips", "Surya", "Anchor", "Crompton", "Osram", "Havells"],
//       description: "High-output LED lights for factories, warehouses, and industrial facilities.",
//       detailedDescription:
//         "Industrial LED lights provide exceptional brightness and energy efficiency for manufacturing facilities, warehouses, and industrial spaces.",
//       rating: 4.6,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "Power: 50W to 200W",
//         "Lumen output: 5000-25000 lm",
//         "IP rating: IP65",
//         "Lifespan: 50,000 hours",
//       ],
//       features: ["Energy efficient", "High brightness", "Long lasting", "Weather proof"],
//       applications: ["Factories", "Warehouses", "Manufacturing units", "Industrial yards"],
//     },
//     {
//       category: "LED LIGHTINGS",
//       icon: Lightbulb,
//       title: "Street LED Lights",
//       brands: ["Bajaj", "Philips", "Havells", "Orient", "Anchor"],
//       description: "Energy-efficient street lighting solutions for roads and public areas.",
//       detailedDescription:
//         "Street LED lights designed for roadway illumination with optimal light distribution and energy savings.",
//       rating: 4.5,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Power: 30W to 150W", "IP rating: IP66", "Color temp: 4000K-6500K", "Optical: Type II/III/IV"],
//       features: ["Uniform light distribution", "Energy saving", "Long life", "Low maintenance"],
//       applications: ["Street lighting", "Highway lighting", "Parking areas", "Public spaces"],
//     },
//     {
//       category: "LED LIGHTINGS",
//       icon: Lightbulb,
//       title: "Home LED Lights",
//       brands: ["Bajaj", "Philips", "Havells", "Orient", "Syska", "Wipro"],
//       description: "Residential LED lighting solutions for homes and apartments.",
//       detailedDescription:
//         "Complete range of LED lights for residential applications including bulbs, tubes, panels, and decorative lighting.",
//       rating: 4.4,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Power: 3W to 50W", "Base: B22/E27/GU10", "Color temp: 2700K-6500K", "Dimmable: Available"],
//       features: ["Energy saving", "Long life", "Multiple designs", "Instant on"],
//       applications: ["Home lighting", "Office lighting", "Decorative lighting", "Task lighting"],
//     },

//     // ELECTRICAL ACCESSORIES
//     {
//       category: "ELECTRICAL ACCESSORIES",
//       icon: Zap,
//       title: "MCB (Miniature Circuit Breaker)",
//       brands: ["Schneider Electric", "ABB", "Siemens", "L&T", "Legrand", "Havells"],
//       description: "Automatic switches for overload and short circuit protection in electrical installations.",
//       detailedDescription:
//         "MCBs provide protection against overload and short circuit faults in electrical circuits, commonly used in residential and commercial applications.",
//       rating: 4.8,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "Current: 6A to 63A",
//         "Breaking capacity: 6kA to 10kA",
//         "Poles: 1P, 2P, 3P, 4P",
//         "Curve: B, C, D",
//       ],
//       features: ["Trip-free mechanism", "High breaking capacity", "Compact design", "Easy installation"],
//       applications: ["Residential wiring", "Commercial buildings", "Distribution boards", "Motor protection"],
//     },
//     {
//       category: "ELECTRICAL ACCESSORIES",
//       icon: Settings,
//       title: "MCCB (Molded Case Circuit Breaker)",
//       brands: ["Schneider Electric", "ABB", "Siemens", "L&T", "C&S Electric"],
//       description: "Heavy-duty circuit breakers for industrial applications with adjustable trip settings.",
//       detailedDescription:
//         "MCCBs are used for higher current ratings and provide protection with adjustable trip settings for industrial and commercial applications.",
//       rating: 4.7,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "Current: 16A to 6300A",
//         "Breaking capacity: 25kA to 150kA",
//         "Adjustable: Thermal/Magnetic",
//         "Poles: 3P, 4P",
//       ],
//       features: ["Adjustable protection", "High breaking capacity", "Indication system", "Auxiliary contacts"],
//       applications: ["Industrial panels", "Motor control centers", "Main distribution", "Heavy machinery"],
//     },
//     {
//       category: "ELECTRICAL ACCESSORIES",
//       icon: Shield,
//       title: "RCCB (Residual Current Circuit Breaker)",
//       brands: ["Schneider Electric", "ABB", "Legrand", "Havells", "L&T"],
//       description: "Earth leakage protection devices to prevent electric shock and fire hazards.",
//       detailedDescription:
//         "RCCBs detect earth leakage currents and disconnect the circuit to prevent electric shock and fire hazards caused by earth faults.",
//       rating: 4.6,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Current: 25A to 125A", "Sensitivity: 30mA to 1000mA", "Poles: 2P, 4P", "Type: AC, A"],
//       features: ["Earth fault protection", "Quick disconnection", "Test button", "High sensitivity"],
//       applications: ["Residential safety", "Commercial buildings", "IT equipment", "Medical facilities"],
//     },
//     {
//       category: "ELECTRICAL ACCESSORIES",
//       icon: Settings,
//       title: "Distribution Boards",
//       brands: ["Schneider Electric", "ABB", "Legrand", "Havells", "Siemens"],
//       description: "Metal enclosures for housing circuit breakers and electrical protection devices.",
//       detailedDescription:
//         "Distribution boards provide organized and safe housing for MCBs, RCCBs, and other electrical components in residential and commercial installations.",
//       rating: 4.5,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Ways: 4 to 72", "Material: MS/Plastic", "IP rating: IP40/IP65", "Standard: IS 8623"],
//       features: ["Modular design", "Easy wiring", "Safe enclosure", "Multiple configurations"],
//       applications: ["Residential distribution", "Commercial buildings", "Industrial panels", "Control rooms"],
//     },

//     // SOLAR
//     {
//       category: "SOLAR",
//       icon: Sun,
//       title: "Solar Panels",
//       brands: ["Tata Solar", "Adani Solar", "Vikram Solar", "Waaree", "Luminous"],
//       description: "High-efficiency photovoltaic panels for converting sunlight into electricity.",
//       detailedDescription:
//         "Monocrystalline and polycrystalline solar panels with high efficiency ratings for residential, commercial, and industrial solar installations.",
//       rating: 4.4,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Power: 100W to 540W", "Efficiency: 18% to 22%", "Voltage: 12V/24V", "Warranty: 25 years"],
//       features: ["High efficiency", "Weather resistant", "Long warranty", "Anti-reflective coating"],
//       applications: ["Rooftop installations", "Solar farms", "Off-grid systems", "Grid-tie systems"],
//     },
//     {
//       category: "SOLAR",
//       icon: Sun,
//       title: "Solar Street Lights",
//       brands: ["Luminous", "Su-Kam", "Microtek", "Waaree", "Solar Street Light Co."],
//       description: "Self-contained LED street lights powered by solar energy for outdoor lighting.",
//       detailedDescription:
//         "All-in-one solar street lights with integrated LED fixtures, solar panels, and batteries for autonomous outdoor lighting.",
//       rating: 4.3,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "LED power: 20W to 120W",
//         "Solar panel: 60W to 200W",
//         "Battery: Lithium/LiFePO4",
//         "Working time: 10-12 hours",
//       ],
//       features: ["All-in-one design", "Motion sensor", "Remote control", "Weather proof"],
//       applications: ["Street lighting", "Garden lighting", "Parking areas", "Rural areas"],
//     },
//     {
//       category: "SOLAR",
//       icon: Sun,
//       title: "Solar Inverters",
//       brands: ["Luminous", "Microtek", "Su-Kam", "Delta", "ABB"],
//       description: "Power conversion systems for solar energy applications.",
//       detailedDescription:
//         "Solar inverters convert DC power from solar panels to AC power for grid connection or battery charging applications.",
//       rating: 4.2,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Power: 1kW to 100kW", "Efficiency: >95%", "Type: Grid-tie/Off-grid", "MPPT: Dual/Multi"],
//       features: ["High efficiency", "MPPT tracking", "Grid synchronization", "Remote monitoring"],
//       applications: ["Solar power systems", "Grid-tie installations", "Off-grid systems", "Hybrid systems"],
//     },

//     // LITHIUM BATTERIES
//     {
//       category: "LITHIUM BATTERIES",
//       icon: BatteryCharging,
//       title: "Lithium Car Batteries",
//       brands: ["Exide", "Amaron", "Livguard", "Okaya", "Base"],
//       description: "High-performance lithium batteries for electric vehicles with longer range and faster charging.",
//       detailedDescription:
//         "Advanced lithium-ion batteries for electric cars providing superior performance, longer range, and faster charging compared to traditional batteries.",
//       rating: 4.5,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "Capacity: 40Ah to 200Ah",
//         "Voltage: 12V/48V/72V",
//         "Chemistry: LiFePO4",
//         "Cycle life: 2000+ cycles",
//       ],
//       features: ["Fast charging", "Long life", "Lightweight", "High energy density"],
//       applications: ["Electric cars", "Electric buses", "Commercial EVs", "Two-wheelers"],
//     },
//     {
//       category: "LITHIUM BATTERIES",
//       icon: BatteryCharging,
//       title: "E-Bike Batteries",
//       brands: ["Okaya", "Livguard", "Exide", "Amaron", "Microtek"],
//       description: "Lightweight lithium batteries for electric bikes and scooters with long cycle life.",
//       detailedDescription:
//         "Compact and lightweight lithium batteries designed specifically for electric bikes and scooters with excellent performance and durability.",
//       rating: 4.4,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Capacity: 20Ah to 60Ah", "Voltage: 24V/36V/48V", "Weight: 2-6 kg", "Charging time: 4-6 hours"],
//       features: ["Lightweight", "Quick charge", "High efficiency", "BMS protection"],
//       applications: ["Electric bikes", "Electric scooters", "E-rickshaws", "Personal mobility"],
//     },
//     {
//       category: "LITHIUM BATTERIES",
//       icon: BatteryCharging,
//       title: "Solar Batteries",
//       brands: ["Luminous", "Exide", "Amaron", "Su-Kam", "Okaya"],
//       description: "Energy storage batteries for solar power systems with deep cycle capability.",
//       detailedDescription:
//         "Lithium batteries specifically designed for solar energy storage applications with deep cycle capability and long service life.",
//       rating: 4.3,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Capacity: 50Ah to 300Ah", "Voltage: 12V/24V/48V", "DOD: 90%+", "Cycle life: 3000+ cycles"],
//       features: ["Deep cycle", "Long life", "High efficiency", "Temperature stable"],
//       applications: ["Solar power systems", "Off-grid installations", "Backup power", "Energy storage"],
//     },

//     // SAFETY ITEMS
//     {
//       category: "SAFETY ITEMS",
//       icon: Shield,
//       title: "Safety Testing Equipment",
//       brands: ["Motwane", "Kheraj", "Mazda", "Fluke", "Megger", "Kyoritsu"],
//       description: "Electrical testing instruments and safety equipment for maintenance and troubleshooting.",
//       detailedDescription:
//         "Professional testing instruments including multimeters, insulation testers, earth testers, and clamp meters for electrical safety and maintenance.",
//       rating: 4.5,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: [
//         "Voltage range: 0.1V to 1000V",
//         "Current: 0.1A to 1000A",
//         "Safety: CAT III/IV",
//         "Display: Digital LCD",
//       ],
//       features: ["High accuracy", "Safety certified", "Rugged design", "Multiple functions"],
//       applications: ["Electrical testing", "Maintenance work", "Troubleshooting", "Safety inspections"],
//     },

//     // TOOLS & TACKLES
//     {
//       category: "TOOLS & TACKLES",
//       icon: Wrench,
//       title: "Electrical Hand Tools",
//       brands: ["Stanley", "Taparia", "Jhalani", "Pye", "Tata Agrico"],
//       description: "Professional electrical tools including pliers, screwdrivers, and wire strippers.",
//       detailedDescription:
//         "Complete range of hand tools for electrical work including insulated tools, wire strippers, crimping tools, and testing equipment.",
//       rating: 4.5,
//       image: "/placeholder.svg?height=320&width=640",
//       specifications: ["Insulation: 1000V", "Material: Chrome vanadium", "Handles: Ergonomic", "Standards: IEC 60900"],
//       features: ["Insulated handles", "Precision made", "Durable construction", "Safety certified"],
//       applications: ["Electrical installations", "Maintenance work", "Panel building", "Field work"],
//     },
//   ]

//   const filteredProducts = products.filter((p) => {
//     const matchesFilter = activeFilter === "All" || p.category === activeFilter
//     const matchesSearch =
//       p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (p.brands?.some((b) => b.toLowerCase().includes(searchTerm.toLowerCase())) ?? false)
//     return matchesFilter && matchesSearch
//   })

//   const openDetails = (product: Product) => {
//     setSelectedProduct(product)
//     setShowDetails(true)
//     document.body.style.overflow = "hidden"
//   }

//   const closeDetails = () => {
//     setShowDetails(false)
//     setSelectedProduct(null)
//     document.body.style.overflow = "unset"
//   }

//   return (
//     <>
//       <section
//         id="products"
//         ref={sectionRef}
//         className="py-20 relative overflow-hidden"
//         style={
//           {
//             ["--brand-primary"]: brandPrimary,
//             ["--brand-secondary"]: brandSecondary,
//             background: `linear-gradient(135deg, hsl(${brandPrimary} / 0.06) 0%, hsl(${brandSecondary} / 0.12) 100%)`,
//           } as React.CSSProperties
//         }
//       >
//         {/* Static brand blobs + grid pattern */}
//         <div className="absolute inset-0 opacity-5 pointer-events-none">
//           <div className="absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl bg-[hsl(var(--brand-primary))]" />
//           <div className="absolute top-40 right-20 w-48 h-48 rounded-full blur-3xl bg-[hsl(var(--brand-secondary))]" />
//           <div className="absolute bottom-20 left-1/3 w-40 h-40 rounded-full blur-3xl bg-[hsl(var(--brand-primary))]" />
//           <div className="absolute bottom-40 right-10 w-36 h-36 rounded-full blur-3xl bg-[hsl(var(--brand-secondary))]" />
//         </div>
//         <div
//           className="absolute inset-0 opacity-10 pointer-events-none"
//           style={{
//             backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${brandPrimaryHex.replace(
//               "#",
//               "%23",
//             )}' fillOpacity='0.25'%3E%3Cpath d='M0 0h100v1H0zM0 0v100h1V0z'/%3E%3C/g%3E%3C/svg%3E")`,
//           }}
//         />

//         <div className="container mx-auto px-6">
//           <div className="text-center mb-16 relative z-10">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8, type: "spring", bounce: 0.35 }}
//               className="inline-block mb-6"
//             >
//               <span className="px-6 py-3 text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]">
//                 {"Our Product Range"}
//               </span>
//             </motion.div>
//             <motion.h2
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
//             >
//               {"Our Products"}
//             </motion.h2>
//             <motion.p
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8"
//             >
//               {
//                 "Premium products across power, infrastructure, safety, solar, and more — curated and engineered for performance."
//               }
//             </motion.p>

//             <div className="filter-section sticky top-4 z-20">
//               <div className="rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur-xl shadow-sm">
//                 <div className="flex items-center gap-2 p-3 md:p-4">
//                   {/* Desktop scroll controls */}
//                   <button
//                     type="button"
//                     aria-label="Scroll categories left"
//                     className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
//                     onClick={() => scrollCats("left")}
//                   >
//                     <ChevronLeft className="h-4 w-4" />
//                   </button>

//                   {/* Chips rail */}
//                   <div
//                     ref={catScrollRef}
//                     className="relative -mx-1 flex-1 overflow-x-auto no-scrollbar"
//                     onKeyDown={onCatsKeyDown}
//                     role="tablist"
//                     aria-label="Product categories"
//                     tabIndex={0}
//                   >
//                     <div className="flex items-center gap-2 md:gap-3 px-1 py-1 min-w-max">
//                       {categoryDefs.map(({ label, icon: Icon }) => {
//                         const active = activeFilter === label
//                         return (
//                           <motion.button
//                             key={label}
//                             ref={(el) => (catItemRefs.current[label] = el)}
//                             onClick={() => setActiveFilter(label)}
//                             whileHover={{ y: -1, scale: 1.02 }}
//                             whileTap={{ scale: 0.98 }}
//                             className="filter-button relative"
//                             role="tab"
//                             aria-selected={active}
//                           >
//                             {/* Active background pill */}
//                             {active && (
//                               <motion.div
//                                 layoutId="active-pill"
//                                 className="absolute inset-0 rounded-full shadow-md"
//                                 style={{
//                                   background:
//                                     "linear-gradient(90deg, hsl(var(--brand-primary)), hsl(var(--brand-secondary)))",
//                                 }}
//                               />
//                             )}
//                             <div
//                               className={
//                                 "relative flex items-center gap-2 md:gap-2.5 px-3.5 md:px-4 py-2 rounded-full border transition-colors " +
//                                 (active
//                                   ? "text-white border-transparent"
//                                   : "text-gray-700 border-gray-200 bg-white hover:bg-gray-50")
//                               }
//                             >
//                               <Icon className={active ? "h-4 w-4 text-white" : "h-4 w-4 text-gray-500"} />
//                               <span className={"text-sm font-semibold whitespace-nowrap"}>{label}</span>
//                             </div>
//                           </motion.button>
//                         )
//                       })}
//                     </div>
//                   </div>

//                   {/* Desktop scroll controls */}
//                   <button
//                     type="button"
//                     aria-label="Scroll categories right"
//                     className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
//                     onClick={() => scrollCats("right")}
//                   >
//                     <ChevronRight className="h-4 w-4" />
//                   </button>

//                   {/* Search (desktop) */}
//                   <div className="hidden md:flex relative ml-2">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
//                     <input
//                       type="text"
//                       placeholder="Search products or brands..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-9 pr-3 py-2 h-9 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-primary))]/50 text-sm text-gray-700 w-[220px]"
//                     />
//                   </div>
//                 </div>

//                 {/* Search (mobile) */}
//                 <div className="md:hidden px-3 pb-3">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
//                     <input
//                       type="text"
//                       placeholder="Search products or brands..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-9 pr-3 py-2 h-10 w-full rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-primary))]/50 text-sm text-gray-700"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeFilter + searchTerm}
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -12 }}
//               transition={{ duration: 0.4 }}
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
//             >
//               {filteredProducts.map((product, index) => {
//                 const Icon = product.icon
//                 const isHovered = hoveredCard === index
//                 return (
//                   <motion.div
//                     key={index}
//                     className="product-card group"
//                     whileHover={{ y: -12, scale: 1.02 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                     onHoverStart={() => setHoveredCard(index)}
//                     onHoverEnd={() => setHoveredCard(null)}
//                   >
//                     <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-gray-200 hover:border-[hsl(var(--brand-secondary))]">
//                       {/* Product Image */}
//                       <div className="relative h-56 overflow-hidden rounded-t-2xl">
//                         <img
//                           src={product.image || "/placeholder.svg?height=224&width=448&query=product%20image"}
//                           alt={product.title}
//                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                         />
//                         {/* Lighter overlay for clarity */}
//                         <div
//                           className="absolute inset-0"
//                           style={{
//                             background: `linear-gradient(0deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.00) 60%)`,
//                           }}
//                         />
//                         {/* Shine on hover */}
//                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -skew-x-12 translate-x-full group-hover:-translate-x-1/2" />

//                         {/* Icon + Price */}
//                         <div className="absolute top-4 left-4">
//                           <motion.div
//                             className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm bg-white/90 ring-1 ring-white/30"
//                             whileHover={{ scale: 1.1, rotate: 5 }}
//                             transition={{ duration: 0.25 }}
//                           >
//                             <Icon className="h-6 w-6 text-[hsl(var(--brand-primary))] transition-colors group-hover:text-[hsl(var(--brand-secondary))]" />
//                           </motion.div>
//                         </div>
                       

//                         {/* Rating */}
//                         <div className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
//                           <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
//                           <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
//                         </div>

//                         {/* Quick Actions */}
//                         <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                           <motion.button
//                             whileHover={{ scale: 1.1 }}
//                             whileTap={{ scale: 0.9 }}
//                             onClick={() => openDetails(product)}
//                             className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
//                           >
//                             <Eye className="h-5 w-5 text-gray-700" />
//                           </motion.button>
//                           <motion.button
//                             whileHover={{ scale: 1.1 }}
//                             whileTap={{ scale: 0.9 }}
//                             className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-secondary))]"
//                           >
//                             <ShoppingCart className="h-5 w-5 text-white" />
//                           </motion.button>
//                         </div>
//                       </div>

//                       {/* Content */}
//                       <div className="p-6">
//                         <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-700 transition-colors line-clamp-2">
//                           {product.title}
//                         </h3>
//                         <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-3">{product.description}</p>

//                         {/* Brands */}
//                         {!!product.brands?.length && (
//                           <div className="mb-6">
//                             <h4 className="font-semibold text-gray-700 mb-3 text-sm">Available Brands:</h4>
//                             <div className="flex flex-wrap gap-2">
//                               {product.brands.slice(0, 3).map((brand, idx) => (
//                                 <motion.span
//                                   key={idx}
//                                   className="px-3 py-1 text-xs rounded-full font-medium border bg-[hsl(var(--brand-secondary))]/10 border-[hsl(var(--brand-secondary))]/40 text-gray-700"
//                                   whileHover={{ scale: 1.05 }}
//                                 >
//                                   {brand}
//                                 </motion.span>
//                               ))}
//                               {product.brands.length > 3 && (
//                                 <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
//                                   +{product.brands.length - 3} more
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         )}

//                         {/* Actions */}
//                         <div className="flex gap-3">
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className="flex-1 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transition-all bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]"
//                           >
//                             Get Quote
//                           </motion.button>
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => openDetails(product)}
//                             className="px-4 py-3 border-2 rounded-xl font-semibold text-sm transition-all border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))]/10"
//                           >
//                             Details
//                           </motion.button>
//                         </div>
//                       </div>

//                       {/* Subtle glow */}
//                       <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))] pointer-events-none" />
//                     </div>
//                   </motion.div>
//                 )
//               })}
//             </motion.div>
//           </AnimatePresence>

//           {filteredProducts.length === 0 && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 relative z-10">
//               <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//               <p className="text-xl text-gray-600">{"No products found matching your criteria."}</p>
//               <p className="text-gray-500 mt-2">{"Try adjusting your search or filter options."}</p>
//             </motion.div>
//           )}

//           {/* Featured banner */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="mt-20 relative overflow-hidden rounded-3xl shadow-2xl"
//           >
//             <div className="absolute inset-0">
//               <img
//                 src="/placeholder.svg?height=420&width=1200"
//                 alt="Industrial Background"
//                 className="w-full h-full object-cover"
//               />
//               <div
//                 className="absolute inset-0"
//                 style={{
//                   background: `linear-gradient(90deg, hsl(${brandPrimary} / 0.65), hsl(${brandSecondary} / 0.65))`,
//                 }}
//               />
//               <div
//                 className="absolute inset-0 opacity-10"
//                 style={{
//                   backgroundImage:
//                     "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
//                 }}
//               />
//             </div>
//             <div className="relative z-10 text-center py-16 px-8 text-white">
//               <motion.h3
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6 }}
//                 className="text-3xl md:text-4xl font-bold mb-4"
//               >
//                 {"Need Custom Solutions?"}
//               </motion.h3>
//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.1 }}
//                 className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto"
//               >
//                 {"We deliver tailored engineering, fabrication, and supply solutions for your specific requirements."}
//               </motion.p>
//               <motion.button
//                 whileHover={{ scale: 1.05, y: -2 }}
//                 whileTap={{ scale: 0.95 }}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg text-lg"
//               >
//                 {"Contact Our Engineers"}
//               </motion.button>
//             </div>
//           </motion.div>
//         </div>

//         {/* Modal */}
//         <AnimatePresence>
//           {showDetails && selectedProduct && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//               onClick={closeDetails}
//             >
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9, y: 50 }}
//                 animate={{ opacity: 1, scale: 1, y: 0 }}
//                 exit={{ opacity: 0, scale: 0.9, y: 50 }}
//                 transition={{ type: "spring", damping: 24, stiffness: 280 }}
//                 className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Header image */}
//                 <div className="relative">
//                   <div className="h-64 overflow-hidden rounded-t-3xl">
//                     <img
//                       src={selectedProduct.image || "/placeholder.svg?height=256&width=1024&query=product%20hero"}
//                       alt={selectedProduct.title}
//                       className="w-full h-full object-cover"
//                     />
//                     <div
//                       className="absolute inset-0"
//                       style={{ background: `linear-gradient(0deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.10) 60%)` }}
//                     />
//                     <div
//                       className="absolute inset-0"
//                       style={{
//                         background: `linear-gradient(90deg, hsl(${brandPrimary} / 0.25), transparent, hsl(${brandSecondary} / 0.25))`,
//                         opacity: 1,
//                       }}
//                     />
//                   </div>

//                   {/* Close */}
//                   <motion.button
//                     whileHover={{ scale: 1.07 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={closeDetails}
//                     className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white"
//                   >
//                     <X className="h-5 w-5 text-gray-700" />
//                   </motion.button>

//                   {/* Icon */}
//                   <div className="absolute top-4 left-4">
//                     <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm bg-white/90 ring-1 ring-white/30">
//                       <selectedProduct.icon className="h-8 w-8 text-[hsl(var(--brand-primary))]" />
//                     </div>
//                   </div>

//                   {/* Title/Rating */}
//                   <div className="absolute bottom-4 left-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
//                     <h2 className="text-3xl font-bold mb-2">{selectedProduct.title}</h2>
//                     <div className="flex items-center gap-4">
//                       <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
//                         <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
//                         <span className="text-sm font-semibold">{selectedProduct.rating}</span>
//                       </div>
                      
//                     </div>
//                   </div>
//                 </div>

//                 {/* Body */}
//                 <div className="p-8">
//                   <div className="mb-8">
//                     <h3 className="text-2xl font-bold text-gray-800 mb-4">{"Product Description"}</h3>
//                     <p className="text-gray-700 leading-relaxed text-lg">{selectedProduct.detailedDescription}</p>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//                     {/* Specifications */}
//                     <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
//                       <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//                         <Settings className="h-5 w-5 mr-2 text-[hsl(var(--brand-primary))]" />
//                         {"Specifications"}
//                       </h4>
//                       <ul className="space-y-3">
//                         {selectedProduct.specifications?.map((spec, idx) => (
//                           <li key={idx} className="flex items-start">
//                             <CheckCircle className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-[hsl(var(--brand-primary))]" />
//                             <span className="text-gray-700 text-sm">{spec}</span>
//                           </li>
//                         )) || <span className="text-sm text-gray-500">{"Details on request."}</span>}
//                       </ul>
//                     </div>

//                     {/* Features */}
//                     <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
//                       <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//                         <Award className="h-5 w-5 mr-2 text-[hsl(var(--brand-primary))]" />
//                         {"Key Features"}
//                       </h4>
//                       <ul className="space-y-3">
//                         {selectedProduct.features?.map((feature, idx) => (
//                           <li key={idx} className="flex items-start">
//                             <CheckCircle className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-[hsl(var(--brand-primary))]" />
//                             <span className="text-gray-700 text-sm">{feature}</span>
//                           </li>
//                         )) || <span className="text-sm text-gray-500">{"Highlights on request."}</span>}
//                       </ul>
//                     </div>
//                   </div>

//                   {/* Applications */}
//                   <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
//                     <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//                       <Zap className="h-5 w-5 mr-2 text-[hsl(var(--brand-primary))]" />
//                       {"Applications"}
//                     </h4>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                       {selectedProduct.applications?.map((app, idx) => (
//                         <div
//                           key={idx}
//                           className="px-4 py-2 rounded-lg border bg-[hsl(var(--brand-secondary))]/10 border-[hsl(var(--brand-secondary))]/40"
//                         >
//                           <span className="text-gray-700 text-sm font-medium">{app}</span>
//                         </div>
//                       )) || <span className="text-sm text-gray-500">{"Use cases on request."}</span>}
//                     </div>
//                   </div>

//                   {/* Brands */}
//                   {!!selectedProduct.brands?.length && (
//                     <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
//                       <h4 className="text-xl font-bold text-gray-800 mb-4">{"Available Brands"}</h4>
//                       <div className="flex flex-wrap gap-3">
//                         {selectedProduct.brands.map((brand, idx) => (
//                           <span
//                             key={idx}
//                             className="px-4 py-2 text-white text-sm rounded-full font-medium shadow-lg bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]"
//                           >
//                             {brand}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Contact */}
//                   <div className="rounded-2xl p-6 text-white bg-[linear-gradient(90deg,hsl(var(--brand-primary)),hsl(var(--brand-secondary)))]">
//                     <h4 className="text-xl font-bold mb-4">{"Get in Touch"}</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                       <div className="flex items-center">
//                         <Phone className="h-5 w-5 mr-3" />
//                         <span className="text-sm">{"+91 9999113792"}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Mail className="h-5 w-5 mr-3" />
//                         <span className="text-sm">{"Ascendio.global@gmail.com"}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <MapPin className="h-5 w-5 mr-3" />
//                         <span className="text-sm">{"Greater Noida West"}</span>
//                       </div>
//                     </div>
//                     <div className="flex gap-4">
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         className="flex-1 bg-white text-gray-900 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
//                       >
//                         {"Request Quote"}
//                       </motion.button>
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30"
//                       >
//                         {"Download Catalog"}
//                       </motion.button>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </section>

//       <style>{`
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//         .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
//         .line-clamp-3 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
//       `}</style>
//     </>
//   )
// }