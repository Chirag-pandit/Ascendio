"use client"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "@studio-freight/lenis"
import { Target, Users, Lightbulb, Heart, Award, Globe, Zap, CheckCircle, Building, Calendar } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const lenisRef = useRef<Lenis | null>(null)

  // Color theme from the provided palette
  const theme = {
    primary: "#1EB2A6",   // Main accent: teal (buttons, headers)
    secondary: "#D4F8E8", // Light secondary: backgrounds, subtle panels
    accent: "#FFA34D",    // Action/highlight: CTA buttons, highlights
    background: "#FFFFFF" // Use white for clean contrast
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

    const ctx = gsap.context(() => {
      // Animate value cards with enhanced effects
      gsap.fromTo(
        ".about-card",
        {
          y: 120,
          opacity: 0,
          scale: 0.8,
          rotationY: 25,
        },
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

      // Animate stats with counter effect
      gsap.fromTo(
        ".stat-card",
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
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".stats-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Animate mission content
      gsap.fromTo(
        ".mission-content",
        {
          x: -80,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".mission-section",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Animate company info with 3D effect
      gsap.fromTo(
        ".company-info",
        {
          x: 80,
          opacity: 0,
          scale: 0.9,
          rotationY: -15,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".mission-section",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Animate achievement items
      gsap.fromTo(
        ".achievement-item",
        {
          x: -30,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".achievements-list",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Counter animation for stats
      gsap.fromTo(
        ".stat-number",
        {
          textContent: 0,
        },
        {
          textContent: (i, target) => target.getAttribute("data-value"),
          duration: 2.5,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: ".stats-section",
            start: "top 70%",
            toggleActions: "play none none none",
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
  }, [])

  const values = [
    {
      icon: Target,
      title: "Expertise",
      description: "A team of experienced professionals ensures delivery of high-quality, industry-specific solutions.",
      color: "from-[#1EB2A6] to-[#16a085]",
      bgColor: "bg-white",
      image:
        "https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
    {
      icon: Users,
      title: "Reliability",
      description: "Known for timely execution and precise solutions that meet and exceed client expectations.",
      color: "from-[#1EB2A6] to-[#16a085]",
      bgColor: "bg-white",
      image:
        "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly evolving with cutting-edge technology to provide future-ready solutions.",
      color: "from-[#1EB2A6] to-[#16a085]",
      bgColor: "bg-white",
      image:
        "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
    {
      icon: Heart,
      title: "Customer-Centric",
      description: "Focused on understanding and adapting to each client's unique needs and requirements.",
      color: "from-[#1EB2A6] to-[#16a085]",
      bgColor: "bg-white",
      image:
        "https://images.pexels.com/photos/236722/pexels-photo-236722.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
  ]

  const stats = [
    { number: 2, label: "Projects Completed", suffix: "+", icon: Building },
    { number:  20, label: "Expert Team Members", suffix: "+", icon: Users },
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
        background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.accent} 50%, ${theme.secondary} 100%)`,
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
            <span className="px-6 py-3 bg-gradient-to-r from-[#1EB2A6] to-[#16a085] text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm">
              About Our Company
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-gray-800 mb-8"
          >
            About Ascendio
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
          >
            Ascendio Private Limited is a dynamic and future-focused company that delivers premium engineering, supply,
            and project solutions across multiple industrial domains.
          </motion.p>
        </div>

        {/* Hero Image Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop"
              alt="Engineering Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1EB2A6]/20 to-[#16a085]/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center text-white"
              >
                <h3 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">Engineering Excellence</h3>
                <p className="text-lg md:text-xl drop-shadow">Delivering innovative solutions across industries</p>
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
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-[#D4F8E8] group hover:bg-[#D4F8E8]/20">
                    <motion.div
                      className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-[#1EB2A6] to-[#16a085] flex items-center justify-center`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="text-4xl font-bold text-gray-800 mb-2">
                      <span className="stat-number" data-value={stat.number}>
                        0
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

        {/* Values Section with Images */}
        <div className="values-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {values.map((value, index) => {
            const Icon = value.icon
            const isHovered = hoveredCard === index

            return (
              <motion.div
                key={index}
                className="about-card group relative"
                whileHover={{ y: -15, rotateY: 5 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                style={{ perspective: 1000 }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-700 border border-[#D4F8E8] hover:border-[#1EB2A6]">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={value.image || "/placeholder.svg"}
                      alt={value.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Light overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

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
        <div className="mission-section bg-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-[#D4F8E8]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Mission Content */}
            <div className="mission-content">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-6"
              >
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#1EB2A6] to-[#16a085] text-white rounded-full text-sm font-semibold mb-4">
                  <Award className="w-4 h-4 mr-2" />
                  Our Mission
                </span>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
              >
                Setting New Benchmarks in Quality
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg text-gray-700 mb-8 leading-relaxed"
              >
                We are committed to setting new benchmarks in quality and performance through innovation, reliability,
                and customer satisfaction. Our expertise spans across electrical, mechanical, oil & gas, industrial
                infrastructure, and EPC power projects.
              </motion.p>

              {/* Achievements List */}
              <div className="achievements-list space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    className="achievement-item flex items-center space-x-3"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-[#1EB2A6]" />
                    </div>
                    <span className="text-gray-700 font-medium">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Company Info Card with Clear Image */}
            <div className="company-info">
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Clear Background Image */}
                <div className="relative h-96">
                  <img
                    src="https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
                    alt="Industrial Equipment"
                    className="w-full h-full object-cover"
                  />

                  {/* Subtle gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1EB2A6]/80 via-[#1EB2A6]/40 to-transparent"></div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm self-center"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Globe className="w-8 h-8 text-white" />
                    </motion.div>

                    <div className="text-center">
                      <motion.div
                        className="text-5xl font-bold mb-4 drop-shadow-lg"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        2020
                      </motion.div>

                      <div className="text-xl mb-6 drop-shadow">Established</div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-center space-x-2">
                          <Zap className="w-4 h-4" />
                          <span>CIN: U52599UP2020PTC136596</span>
                        </div>
                        <div className="border-t border-white/20 pt-3">
                          <p>Greater Noida West, Gautam Buddha Nagar</p>
                          <p>Uttar Pradesh – 201301</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-[#FFA34D] rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.div
                  className="absolute top-1/2 left-4 w-3 h-3 bg-[#FFA34D]/60 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About