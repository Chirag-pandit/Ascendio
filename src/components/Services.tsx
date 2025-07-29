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
      color: "from-[#96b6c5] to-[#adc4ce]",
      image:
        "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      count: "500+",
      metric: "Projects",
    },
    {
      icon: Cog,
      title: "Mechanical",
      description: "Comprehensive mechanical systems installation, repairs, fabrication, and maintenance services.",
      features: ["System Installation", "Mechanical Repairs", "Custom Fabrication", "Maintenance"],
      color: "from-[#96b6c5] to-[#adc4ce]",
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
      color: "from-[#96b6c5] to-[#adc4ce]",
      image:
        "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      count: "200+",
      metric: "Pipelines",
    },
    {
      icon: Factory,
      title: "Industrial Infrastructure",
      description: "Manufacturing development and system integration for comprehensive industrial solutions.",
      features: ["Manufacturing Setup", "System Integration", "Quality Control", "Process Optimization"],
      color: "from-[#96b6c5] to-[#adc4ce]",
      image:
        "https://images.pexels.com/photos/236722/pexels-photo-236722.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      count: "150+",
      metric: "Facilities",
    },
    {
      icon: Droplets,
      title: "Water & Sewerage",
      description: "Water treatment solutions including pumps, pipes, STP/ETP systems, and infrastructure.",
      features: ["Water Treatment", "Sewage Systems", "Pump Installation", "Pipeline Networks"],
      color: "from-[#96b6c5] to-[#adc4ce]",
      image:
        "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      count: "300+",
      metric: "Systems",
    },
    {
      icon: Wheat,
      title: "Agriculture & EPC",
      description: "Agricultural infrastructure and EPC projects for sustainable farming solutions.",
      features: ["Agricultural Systems", "EPC Projects", "Irrigation Solutions", "Farm Infrastructure"],
      color: "from-[#96b6c5] to-[#adc4ce]",
      image:
        "https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      count: "400+",
      metric: "Farms",
    },
  ]

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-[#f1f0e8] via-[#eee0c9] to-[#adc4ce] relative"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <span className="px-6 py-2 bg-gradient-to-r from-[#96b6c5] to-[#adc4ce] text-white text-sm font-semibold rounded-full shadow-lg">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            const isHovered = hoveredCard === index

            return (
              <motion.div
                key={index}
                className="service-card group relative"
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-[#f1f0e8] shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#eee0c9]">
                  {/* Service Image - More Visible */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

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
                      className={`flex items-center font-semibold bg-gradient-to-r ${service.color} bg-clip-text text-transparent hover:opacity-80 transition-all duration-300`}
                      whileHover={{ x: 5 }}
                    >
                      <span className="mr-2">Learn More</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>

                  {/* Subtle Border Glow */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Services
