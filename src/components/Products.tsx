"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "@studio-freight/lenis"
import {
  Lightbulb,
  Cable,
  Shield,
  Sun,
  Camera,
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
  Droplets,
  Factory,
  Wrench,
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const Products = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)

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

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".product-card",
        {
          y: 80,
          opacity: 0,
          scale: 0.9,
        },
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

      // Animate filter buttons
      gsap.fromTo(
        ".filter-button",
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".filter-section",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }, sectionRef)

    return () => {
      ctx.revert()
      lenisRef.current?.destroy()
      gsap.ticker.remove((time) => {
        lenisRef.current?.raf(time * 1000)
      })
    }
  }, [activeFilter])

  const categories = [
    "All",
    "Electrical",
    "Cables",
    "Safety",
    "Solar",
    "Monitoring",
    "Mechanical",
    "Water Treatment",
    "Oil & Gas",
    "Agriculture",
  ]

  const products = [
    {
      category: "Electrical",
      icon: Lightbulb,
      title: "LED Lighting Solutions",
      brands: ["Bajaj", "Philips", "Surya", "Anchor", "Crompton", "Osram", "Havells", "Orient"],
      description: "Energy-efficient LED lights, industrial lighting, and commercial illumination solutions",
      detailedDescription:
        "Our comprehensive LED lighting solutions offer superior energy efficiency, longer lifespan, and exceptional brightness. Perfect for industrial facilities, commercial spaces, and residential applications. These lights consume up to 80% less energy than traditional lighting while providing better illumination quality.",
      price: "₹850 - ₹15,500",
      rating: 4.6,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/32014ace-a09d-4132-7913-08d9aeb6e494-qAP7S7nUCfWICRBjHF44bJA0MJ5h8z.jpeg",
      productImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/32014ace-a09d-4132-7913-08d9aeb6e494-qAP7S7nUCfWICRBjHF44bJA0MJ5h8z.jpeg",
      color: "from-[#96b6c5] to-[#adc4ce]",
      specifications: [
        "Power Range: 5W to 200W",
        "Voltage: 85-265V AC",
        "Lifespan: 25,000+ hours",
        "Color Temperature: 3000K-6500K",
        "IP Rating: IP65 (Outdoor models)",
        "Warranty: 2-3 years",
      ],
      features: [
        "Energy efficient design",
        "Long lasting performance",
        "Multiple color temperatures",
        "Instant on/off capability",
        "Mercury-free construction",
        "Wide operating temperature range",
      ],
      applications: [
        "Industrial warehouses",
        "Commercial offices",
        "Retail spaces",
        "Street lighting",
        "Residential complexes",
        "Parking areas",
      ],
    },
    {
      category: "Cables",
      icon: Cable,
      title: "Power & Control Cables",
      brands: ["Polycab", "Empire", "Plaza", "Dowell", "Jainson", "KEI", "RR Kabel"],
      description: "High-quality electrical cables, wires, and accessories for industrial applications",
      detailedDescription:
        "Premium quality power and control cables designed for reliable electrical transmission in industrial and commercial environments. Our cables meet international standards and are suitable for various voltage levels and environmental conditions.",
      price: "₹45 - ₹850/meter",
      rating: 4.5,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/power---control-cables-NtSRWL4QivTTvaLRex1DXVT3EBahJG.png",
      productImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/power---control-cables-NtSRWL4QivTTvaLRex1DXVT3EBahJG.png",
      color: "from-[#96b6c5] to-[#adc4ce]",
      specifications: [
        "Voltage Rating: 1.1kV to 33kV",
        "Conductor: Copper/Aluminum",
        "Insulation: XLPE/PVC",
        "Temperature Rating: 90°C",
        "Standards: IS 7098, IEC 60502",
        "Fire Retardant: Available",
      ],
      features: [
        "Superior conductivity",
        "Weather resistant",
        "Flame retardant options",
        "Low smoke emission",
        "Flexible installation",
        "Long service life",
      ],
      applications: [
        "Power distribution",
        "Industrial machinery",
        "Control systems",
        "Building wiring",
        "Underground installations",
        "Overhead lines",
      ],
    },
    {
      category: "Mechanical",
      icon: Wrench,
      title: "Industrial Flanges & Fittings",
      brands: ["Comet", "Hensel", "Jackson", "Schneider", "ABB", "Siemens"],
      description: "High-grade stainless steel flanges, pipe fittings, and mechanical components",
      detailedDescription:
        "Professional-grade industrial flanges and mechanical fittings manufactured from premium stainless steel and carbon steel. Designed for high-pressure applications in oil & gas, chemical processing, and industrial piping systems.",
      price: "₹1,200 - ₹25,000",
      rating: 4.7,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/61IatN6qZPL.jpg-9fukJo9L6UqgBfkw69ktmx7thWPnmS.jpeg",
      productImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/61IatN6qZPL.jpg-9fukJo9L6UqgBfkw69ktmx7thWPnmS.jpeg",
      color: "from-[#96b6c5] to-[#adc4ce]",
      specifications: [
        "Material: SS316/SS304/Carbon Steel",
        "Pressure Rating: 150# to 2500#",
        'Size Range: 1/2" to 48"',
        "Standards: ANSI, ASME, DIN",
        "Face Type: RF, FF, RTJ",
        "Temperature: -196°C to 540°C",
      ],
      features: [
        "Corrosion resistant",
        "High pressure rating",
        "Precision machined",
        "Multiple material options",
        "Standard compliance",
        "Long service life",
      ],
      applications: [
        "Oil & gas pipelines",
        "Chemical processing",
        "Power generation",
        "Water treatment",
        "Petrochemical plants",
        "Industrial piping",
      ],
    },
    {
      category: "Safety",
      icon: Shield,
      title: "Safety Equipment & Tools",
      brands: ["Motwane", "Kheraj", "Mazda", "Fluke", "Megger", "Kyoritsu"],
      description: "Testing instruments, safety sirens, protective gear, and communication cables",
      detailedDescription:
        "Comprehensive safety equipment and testing instruments to ensure workplace safety and compliance. Our range includes advanced testing tools, protective equipment, and safety devices designed to meet international safety standards.",
      price: "₹350 - ₹45,000",
      rating: 4.4,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/safety-equipment---tools-cWGr01aPo9rjw3BZu8W91oNwXwUgk0.png",
      productImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/safety-equipment---tools-cWGr01aPo9rjw3BZu8W91oNwXwUgk0.png",
      color: "from-[#96b6c5] to-[#adc4ce]",
      specifications: [
        "Testing Range: 0.1V to 1000V",
        "Accuracy: ±2%",
        "Display: Digital LCD",
        "Safety Rating: CAT III/IV",
        "Operating Temp: -10°C to 50°C",
        "Certifications: CE, RoHS",
      ],
      features: [
        "High accuracy measurements",
        "Safety certified",
        "Rugged construction",
        "Easy to use interface",
        "Data logging capability",
        "Long battery life",
      ],
      applications: [
        "Electrical testing",
        "Maintenance work",
        "Safety inspections",
        "Quality control",
        "Field measurements",
        "Troubleshooting",
      ],
    },
    {
      category: "Solar",
      icon: Sun,
      title: "Solar Power Systems",
      brands: ["Solar Panels", "Charge Controllers", "Inverters", "Luminous", "Microtek", "Su-Kam"],
      description: "Complete solar solutions including panels, inverters, and charge controllers",
      detailedDescription:
        "Complete solar power systems designed for residential, commercial, and industrial applications. Our solutions include high-efficiency solar panels, advanced inverters, and intelligent charge controllers for optimal energy harvesting and management.",
      price: "₹18,500 - ₹8,50,000",
      rating: 4.3,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agriculture-food-production-concept-with-tractor-machine-silos-irrigation-system_342744-565-q3cqwTQOJzDN0ZYWKDC7CQNRTvHU7b.avif",
      productImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agriculture-food-production-concept-with-tractor-machine-silos-irrigation-system_342744-565-q3cqwTQOJzDN0ZYWKDC7CQNRTvHU7b.avif",
      color: "from-[#96b6c5] to-[#adc4ce]",
      specifications: [
        "Panel Efficiency: 18-22%",
        "System Voltage: 12V/24V/48V",
        "Power Range: 1kW to 100kW",
        "Inverter Efficiency: >95%",
        "Warranty: 10-25 years",
        "Standards: IEC 61215, IEC 61730",
      ],
      features: [
        "High efficiency panels",
        "MPPT charge controllers",
        "Grid-tie capability",
        "Battery backup options",
        "Remote monitoring",
        "Weather resistant",
      ],
      applications: [
        "Residential rooftops",
        "Commercial buildings",
        "Industrial facilities",
        "Agricultural pumping",
        "Street lighting",
        "Remote installations",
      ],
    },
    {
      category: "Monitoring",
      icon: Camera,
      title: "CCTV & Surveillance",
      brands: ["CCTV Cameras", "DVR Systems", "Security Equipment", "Hikvision", "Dahua", "CP Plus"],
      description: "Advanced surveillance systems, CCTV cameras, and monitoring equipment",
      detailedDescription:
        "State-of-the-art surveillance systems providing comprehensive security solutions. Our CCTV systems offer high-definition video quality, advanced analytics, and remote monitoring capabilities for enhanced security and peace of mind.",
      price: "₹4,200 - ₹1,25,000",
      rating: 4.2,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TAZIZ-Industrial-Chemical-Zone-1200x628.jpg-givYt5Y4KO4y5sF5UVg2wahEQKavTK.jpeg",
      productImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TAZIZ-Industrial-Chemical-Zone-1200x628.jpg-givYt5Y4KO4y5sF5UVg2wahEQKavTK.jpeg",
      color: "from-[#96b6c5] to-[#adc4ce]",
      specifications: [
        "Resolution: 2MP to 8MP",
        "Night Vision: Up to 50m",
        "Storage: 1TB to 16TB",
        "Viewing Angle: 90° to 180°",
        "Weather Rating: IP66/IP67",
        "Compression: H.264/H.265",
      ],
      features: [
        "HD video quality",
        "Night vision capability",
        "Motion detection",
        "Remote access",
        "Mobile app support",
        "Cloud storage options",
      ],
      applications: [
        "Office buildings",
        "Retail stores",
        "Manufacturing units",
        "Residential complexes",
        "Parking areas",
        "Perimeter security",
      ],
    },
    {
      category: "Water Treatment",
      icon: Droplets,
      title: "Water Treatment Systems",
      brands: ["Grundfos", "KSB", "Kirloskar", "Crompton", "Aqua", "Ion Exchange"],
      description: "Industrial water treatment plants, filtration systems, and sewage treatment solutions",
      detailedDescription:
        "Comprehensive water and wastewater treatment solutions for industrial, municipal, and commercial applications. Our systems ensure efficient water purification, recycling, and environmental compliance with advanced filtration and treatment technologies.",
      price: "₹2,50,000 - ₹50,00,000",
      rating: 4.8,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/industrial-waste-waer-treatment-plant.jpg-G0aMnlKytiWwDT79e3jcFznn2l67gT.jpeg",
      productImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/industrial-waste-waer-treatment-plant.jpg-G0aMnlKytiWwDT79e3jcFznn2l67gT.jpeg",
      color: "from-[#96b6c5] to-[#adc4ce]",
      specifications: [
        "Capacity: 10 KLD to 50 MLD",
        "Treatment Type: Physical, Chemical, Biological",
        "Automation: PLC/SCADA controlled",
        "Efficiency: >95% BOD/COD removal",
        "Standards: CPCB, SPCB compliant",
        "Power: 415V, 3-phase supply",
      ],
      features: [
        "Advanced filtration technology",
        "Automated operation",
        "Energy efficient design",
        "Modular construction",
        "Remote monitoring",
        "Low maintenance",
      ],
      applications: [
        "Industrial effluent treatment",
        "Municipal sewage treatment",
        "Water recycling plants",
        "Pharmaceutical industries",
        "Textile processing",
        "Food & beverage industry",
      ],
    },
    {
      category: "Oil & Gas",
      icon: Factory,
      title: "Oil & Gas Equipment",
      brands: ["Honeywell", "Emerson", "Yokogawa", "ABB", "Siemens", "Schneider"],
      description: "Process control equipment, instrumentation, and safety systems for oil & gas industry",
      detailedDescription:
        "Specialized equipment and instrumentation for oil & gas processing facilities. Our solutions include process control systems, safety instrumentation, and monitoring equipment designed for hazardous environments and critical applications.",
      price: "₹75,000 - ₹25,00,000",
      rating: 4.9,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/drives-frontpage-segment-oilgas.jpg-T1GqBcB9LhBsVro2hf4SGqEgypXJb6.jpeg",
      productImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/drives-frontpage-segment-oilgas.jpg-T1GqBcB9LhBsVro2hf4SGqEgypXJb6.jpeg",
      color: "from-[#96b6c5] to-[#adc4ce]",
      specifications: [
        "Pressure Rating: Up to 10,000 PSI",
        "Temperature: -40°C to 200°C",
        "Hazardous Area: Zone 1/2, Div 1/2",
        "Material: SS316L, Hastelloy",
        "Accuracy: ±0.1% to ±0.5%",
        "Certifications: ATEX, IECEx, SIL",
      ],
      features: [
        "Explosion-proof design",
        "High accuracy measurement",
        "Corrosion resistant",
        "SIL rated safety systems",
        "Remote diagnostics",
        "Redundant architecture",
      ],
      applications: [
        "Refineries",
        "Petrochemical plants",
        "Offshore platforms",
        "Gas processing units",
        "Pipeline systems",
        "Storage terminals",
      ],
    },
    {
      category: "Agriculture",
      icon: Wrench,
      title: "Agricultural Equipment",
      brands: ["Mahindra", "John Deere", "Tafe", "Sonalika", "Escorts", "New Holland"],
      description: "Agricultural machinery, irrigation systems, and farm equipment solutions",
      detailedDescription:
        "Complete range of agricultural equipment and machinery for modern farming operations. Our solutions include tractors, irrigation systems, harvesting equipment, and precision farming tools to enhance productivity and efficiency.",
      price: "₹25,000 - ₹15,00,000",
      rating: 4.5,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agriculture-food-production-concept-with-tractor-machine-silos-irrigation-system_342744-565-q3cqwTQOJzDN0ZYWKDC7CQNRTvHU7b.avif",
      productImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agriculture-food-production-concept-with-tractor-machine-silos-irrigation-system_342744-565-q3cqwTQOJzDN0ZYWKDC7CQNRTvHU7b.avif",
      color: "from-[#96b6c5] to-[#adc4ce]",
      specifications: [
        "Power Range: 20 HP to 120 HP",
        "Fuel Type: Diesel/Electric",
        "Transmission: Manual/Automatic",
        "PTO Speed: 540/1000 RPM",
        "Hydraulic Capacity: 2000-4000 kg",
        "Warranty: 2-5 years",
      ],
      features: [
        "Fuel efficient engines",
        "Advanced hydraulics",
        "Comfortable operator cabin",
        "GPS guidance ready",
        "Multiple implement compatibility",
        "Low maintenance design",
      ],
      applications: [
        "Field cultivation",
        "Crop harvesting",
        "Irrigation systems",
        "Material handling",
        "Land preparation",
        "Precision farming",
      ],
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesFilter = activeFilter === "All" || product.category === activeFilter
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brands.some((brand) => brand.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const openDetails = (product: any) => {
    setSelectedProduct(product)
    setShowDetails(true)
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }

  const closeDetails = () => {
    setShowDetails(false)
    setSelectedProduct(null)
    document.body.style.overflow = "unset" // Restore scrolling
  }

  return (
    <section
      id="products"
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #f1f0e8 0%, #eee0c9 50%, #adc4ce 100%)`,
      }}
    >
      {/* Add decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#96b6c5] rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-[#adc4ce] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-[#eee0c9] rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-36 h-36 bg-[#96b6c5] rounded-full blur-3xl"></div>
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2396b6c5' fillOpacity='0.3'%3E%3Cpath d='M0 0h100v1H0zM0 0v100h1V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Floating decorative elements */}
      <div className="absolute top-32 left-20 opacity-20">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div className="w-16 h-16 border-2 border-[#96b6c5] rounded-full"></div>
        </motion.div>
      </div>
      <div className="absolute top-60 right-32 opacity-15">
        <motion.div
          animate={{
            rotate: -360,
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="w-12 h-12 bg-[#eee0c9] rounded-lg transform rotate-45"></div>
        </motion.div>
      </div>
      <div className="absolute bottom-32 left-1/4 opacity-10">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="w-20 h-20 border border-[#adc4ce] rounded-full"></div>
        </motion.div>
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="inline-block mb-6"
          >
            <span className="px-6 py-3 bg-gradient-to-r from-[#96b6c5] to-[#adc4ce] text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm">
              Our Product Range
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
          >
            Our Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8"
          >
            Premium products from leading brands across electrical, mechanical, and safety equipment.
          </motion.p>
          {/* Filter and Search */}
          <div className="filter-section flex flex-col md:flex-row gap-6 items-center justify-center mb-12 relative z-10">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  className="filter-button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(category)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`px-6 py-3 rounded-full transition-all font-semibold shadow-lg ${
                      activeFilter === category
                        ? "bg-gradient-to-r from-[#96b6c5] to-[#adc4ce] text-white shadow-xl"
                        : "bg-[#f1f0e8] text-gray-700 hover:bg-white border border-[#eee0c9]"
                    }`}
                  >
                    {category}
                  </div>
                </motion.button>
              ))}
            </div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search products or brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 border-2 border-[#eee0c9] rounded-full focus:outline-none focus:ring-2 focus:ring-[#96b6c5] focus:border-transparent shadow-lg text-gray-700 bg-[#f1f0e8] w-80"
              />
            </motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter + searchTerm}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
          >
            {filteredProducts.map((product, index) => {
              const Icon = product.icon
              const isHovered = hoveredCard === index
              return (
                <motion.div
                  key={index}
                  className="product-card group"
                  whileHover={{ y: -15, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <div className="bg-[#f1f0e8] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-[#eee0c9] hover:border-[#adc4ce]">
                    {/* Product Image - More Visible */}
                    <div className="relative h-56 overflow-hidden rounded-t-2xl">
                      <img
                        src={product.productImage || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-105"
                      />
                      {/* Enhanced gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10"></div>

                      {/* Add subtle shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                      {/* Icon and Price Overlay */}
                      <div className="absolute top-4 left-4">
                        <motion.div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${product.color} flex items-center justify-center shadow-lg backdrop-blur-sm`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </motion.div>
                      </div>
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                        <span className="text-sm font-bold text-gray-800">{product.price}</span>
                      </div>
                      {/* Rating */}
                      <div className="absolute bottom-4 left-4 flex items-center bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
                      </div>
                      {/* Quick Action Buttons */}
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openDetails(product)}
                          className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        >
                          <Eye className="h-5 w-5 text-gray-700" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 bg-[#96b6c5] rounded-full flex items-center justify-center shadow-lg hover:bg-[#adc4ce] transition-colors"
                        >
                          <ShoppingCart className="h-5 w-5 text-white" />
                        </motion.button>
                      </div>
                    </div>
                    {/* Content Section */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-700 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm">{product.description}</p>
                      {/* Brands Section */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-700 mb-3 text-sm">Available Brands:</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.brands.slice(0, 3).map((brand, idx) => (
                            <motion.span
                              key={idx}
                              className="px-3 py-1 bg-gradient-to-r from-[#96b6c5]/10 to-[#adc4ce]/10 text-gray-700 text-xs rounded-full font-medium border border-[#eee0c9]"
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
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-gradient-to-r from-[#96b6c5] to-[#adc4ce] text-white py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                        >
                          Get Quote
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openDetails(product)}
                          className="px-4 py-3 border-2 border-[#96b6c5] text-[#96b6c5] rounded-xl font-semibold text-sm hover:bg-[#96b6c5]/10 transition-all"
                        >
                          Details
                        </motion.button>
                      </div>
                    </div>
                    {/* Hover Glow Effect */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${product.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                    />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 relative z-10">
            <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No products found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter options.</p>
          </motion.div>
        )}

        {/* Featured Products Banner */}
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#96b6c5]/60 to-[#adc4ce]/60"></div>
            {/* Add subtle pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
          {/* Content */}
          <div className="relative z-10 text-center py-16 px-8 text-white">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Need Custom Solutions?
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto"
            >
              We provide customized engineering solutions tailored to your specific requirements with expert
              consultation and support.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white text-[#96b6c5] px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg text-lg"
            >
              Contact Our Engineers
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Product Details Modal */}
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
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#f1f0e8] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative">
                <div className="h-64 overflow-hidden rounded-t-3xl">
                  <img
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent"></div>

                  {/* Add subtle animated overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#96b6c5]/20 via-transparent to-[#adc4ce]/20 opacity-0 animate-pulse"></div>
                </div>
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeDetails}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </motion.button>
                {/* Product Icon */}
                <div className="absolute top-4 left-4">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${selectedProduct.color} flex items-center justify-center shadow-lg backdrop-blur-sm`}
                  >
                    <selectedProduct.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                {/* Title and Rating */}
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">{selectedProduct.title}</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-semibold">{selectedProduct.rating}</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold">{selectedProduct.price}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="p-8">
                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Product Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{selectedProduct.detailedDescription}</p>
                </div>
                {/* Grid Layout for Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Specifications */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#eee0c9]">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-[#96b6c5]" />
                      Specifications
                    </h4>
                    <ul className="space-y-3">
                      {selectedProduct.specifications?.map((spec: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-[#96b6c5] mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Features */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#eee0c9]">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-[#96b6c5]" />
                      Key Features
                    </h4>
                    <ul className="space-y-3">
                      {selectedProduct.features?.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-[#96b6c5] mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Applications */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#eee0c9] mb-8">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-[#96b6c5]" />
                    Applications
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedProduct.applications?.map((app: string, idx: number) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-r from-[#96b6c5]/10 to-[#adc4ce]/10 px-4 py-2 rounded-lg border border-[#eee0c9]"
                      >
                        <span className="text-gray-700 text-sm font-medium">{app}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* All Brands */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#eee0c9] mb-8">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">Available Brands</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProduct.brands.map((brand: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gradient-to-r from-[#96b6c5] to-[#adc4ce] text-white text-sm rounded-full font-medium shadow-lg"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Contact Section */}
                <div className="bg-gradient-to-r from-[#96b6c5] to-[#adc4ce] rounded-2xl p-6 text-white">
                  <h4 className="text-xl font-bold mb-4">Get in Touch</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3" />
                      <span className="text-sm">+91 9999113792</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3" />
                      <span className="text-sm">Ascendio.global@gmail.com</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3" />
                      <span className="text-sm">Greater Noida West</span>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-white text-[#96b6c5] py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                    >
                      Request Quote
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30"
                    >
                      Download Catalog
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Products
