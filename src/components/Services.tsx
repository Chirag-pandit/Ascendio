"use client"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Zap, Cog, Droplets, Factory, Wheat, Fuel, ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // Color theme from the provided palette
  const theme = {
    primary: "#1EB2A6",   // Main accent: teal (buttons, headers)
    secondary: "#D4F8E8", // Light secondary: backgrounds, subtle panels
    accent: "#FFA34D",    // Action/highlight: CTA buttons, highlights
    background: "#FFFFFF" // Use white for clean contrast
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate service cards
      gsap.fromTo(
        ".service-card",
        {
          y: 100,
          opacity: 0,
          scale: 0.9,
        },
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
      color: "from-[#1EB2A6] to-[#17a085]",
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
      color: "from-[#1EB2A6] to-[#17a085]",
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
      color: "from-[#1EB2A6] to-[#17a085]",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/oil-and-gas-TkEfiJt8oAXwpW6OOw2GnedbaG6Qh1.png",
      count: "200+",
      metric: "Pipelines",
    },
    {
      icon: Factory,
      title: "Industrial Infrastructure",
      description: "Manufacturing development and system integration for comprehensive industrial solutions.",
      features: ["Manufacturing Setup", "System Integration", "Quality Control", "Process Optimization"],
      color: "from-[#1EB2A6] to-[#17a085]",
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
      color: "from-[#1EB2A6] to-[#17a085]",
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
      color: "from-[#1EB2A6] to-[#17a085]",
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
      style={{
        background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.accent} 50%, ${theme.secondary} 100%)`,
      }}
    >
      {/* Add decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#1EB2A6] rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-[#FFA34D] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-[#1EB2A6] rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-36 h-36 bg-[#FFA34D] rounded-full blur-3xl"></div>
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%231EB2A6' fillOpacity='0.3'%3E%3Cpath d='M0 0h100v1H0zM0 0v100h1V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
          <div className="w-16 h-16 border-2 border-[#1EB2A6] rounded-full"></div>
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
          <div className="w-12 h-12 bg-[#FFA34D] rounded-lg transform rotate-45"></div>
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
          <div className="w-20 h-20 border border-[#1EB2A6] rounded-full"></div>
        </motion.div>
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <span className="px-6 py-2 bg-gradient-to-r from-[#1EB2A6] to-[#17a085] text-white text-sm font-semibold rounded-full shadow-lg">
              Our Expertise
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
          >
            Our Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
          >
            Comprehensive solutions across multiple industrial domains with expertise, innovation, and reliability that
            transforms your vision into reality.
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
                <div className="relative overflow-hidden rounded-2xl bg-[#FFFFFF] shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#D4F8E8] hover:border-[#FFA34D]">
                  {/* Service Image - More Visible */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-105"
                    />
                    {/* Enhanced gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>

                    {/* Add subtle shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>

                    {/* Icon overlay on image */}
                    <motion.div
                      className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center shadow-lg backdrop-blur-sm`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </motion.div>

                    {/* Stats overlay on image */}
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

                  {/* Content Section */}
                  <div className="relative z-10 p-6">
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-700 transition-colors">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 leading-relaxed text-sm">{service.description}</p>

                    {/* Features List */}
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
                            className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full mr-3`}
                            animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                          />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.button
                      className="flex items-center font-semibold text-[#1EB2A6] hover:text-[#17a085] transition-all duration-300 group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="mr-2">Learn More</span>
                      <motion.div whileHover={{ x: 3 }}>
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </motion.button>
                  </div>

                  {/* Subtle Border Glow */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Call to Action Section */}
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#1EB2A6]/70 to-[#17a085]/70"></div>
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
              Ready to Transform Your Industrial Operations?
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto"
            >
              Partner with Ascendio for comprehensive engineering solutions that drive efficiency, innovation, and
              sustainable growth across all industrial sectors.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-[#FFA34D] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#ff8c1a] transition-colors shadow-lg text-lg"
              >
                Get Started Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#1EB2A6] transition-colors shadow-lg text-lg"
              >
                View Our Portfolio
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services