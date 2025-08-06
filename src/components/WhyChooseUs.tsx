import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Brain, Rocket, Handshake, TrendingUp, CheckCircle, Star, Sparkles } from "lucide-react"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the main content
      gsap.fromTo(
        ".why-card",
        {
          y: 80,
          opacity: 0,
          rotationY: 15,
        },
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

      // Animate the statistics
      gsap.fromTo(
        ".stat-number",
        { textContent: 0 },
        {
          textContent: (index: number, target: HTMLElement) => target.getAttribute("data-value"),
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: ".stats-section",
            start: "top 80%",
          },
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
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #FFE5CC 0%, #FFA34D 35%, #FF8C1A 100%)`,
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
              <Sparkles className="h-8 w-8" style={{ color: "#1EB2A6" }} />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: "#2d2d2d" }}>
              Why Choose Ascendio?
            </h2>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="ml-4"
            >
              <Sparkles className="h-8 w-8" style={{ color: "#1EB2A6" }} />
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: "#5a5a5a" }}
          >
            Experience the difference with our comprehensive approach to engineering excellence and client satisfaction.
          </motion.p>
        </div>

        {/* Statistics Section */}
        <div className="stats-section mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl"
            style={{
              background: `linear-gradient(135deg, #1EB2A6 0%, #17a085 100%)`,
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    scale: 1.1,
                    y: -10,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group relative"
                >
                  <motion.div
                    className="text-4xl md:text-5xl font-bold mb-2"
                    style={{ color: "#FFFFFF" }}
                    whileHover={{
                      textShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    <span className="stat-number drop-shadow-2xl" data-value={stat.value}>
                      0
                    </span>
                    <span>{stat.suffix}</span>
                  </motion.div>
                  <div className="font-medium drop-shadow-xl" style={{ color: "#FFA34D" }}>
                    {stat.label}
                  </div>

                  {/* Hover effect background */}
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
                <Star className="h-12 w-12" style={{ color: "#FFA34D" }} />
              </motion.div>
            </div>
            <div className="absolute bottom-4 left-4 opacity-20">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Star className="h-8 w-8" style={{ color: "#FFA34D" }} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Reasons Grid */}
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
                  className="rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 relative overflow-hidden"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#FFA34D"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "transparent"
                  }}
                >
                  <div className="flex items-start space-x-6 relative z-10">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: "#1EB2A6" }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "#17a085",
                        rotate: 5,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="h-8 w-8" style={{ color: "#FFFFFF" }} />
                    </motion.div>

                    <div className="flex-1">
                      <motion.h3
                        className="text-2xl font-bold mb-4"
                        style={{ color: "#2d2d2d" }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {reason.title}
                      </motion.h3>
                      <p className="mb-6 leading-relaxed" style={{ color: "#4a4a4a" }}>
                        {reason.description}
                      </p>

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
                            <CheckCircle className="h-4 w-4 mr-3 flex-shrink-0" style={{ color: "#FFA34D" }} />
                            <span className="text-sm font-medium" style={{ color: "#2d2d2d" }}>
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ backgroundColor: "#1EB2A6" }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center rounded-3xl p-12 relative overflow-hidden shadow-2xl"
          style={{
            background: `linear-gradient(135deg, #1EB2A6 0%, #17a085 100%)`,
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            <Star className="h-16 w-16 mx-auto mb-6 drop-shadow-2xl" style={{ color: "#FFA34D" }} />
          </motion.div>

          <h3 className="text-3xl font-bold mb-6 relative z-10 drop-shadow-xl" style={{ color: "#FFFFFF" }}>
            Ready to Ascend Together?
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto relative z-10 drop-shadow-lg" style={{ color: "#FFA34D" }}>
            Join industries, clients, and collaborators in building future-ready infrastructure with innovation, safety,
            and excellence at the core.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-xl"
              style={{
                backgroundColor: "#FFA34D",
                color: "#FFFFFF",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ff8c1a"
                e.currentTarget.style.color = "#FFFFFF"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFA34D"
                e.currentTarget.style.color = "#FFFFFF"
              }}
            >
              Start Your Project
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "#FFA34D",
                color: "#FFFFFF",
              }}
              whileTap={{ scale: 0.95 }}
              className="border-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg"
              style={{
                borderColor: "#FFA34D",
                color: "#FFA34D",
                backgroundColor: "transparent",
              }}
            >
              Learn More
            </motion.button>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-8 left-8 opacity-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sparkles className="h-8 w-8" style={{ color: "#FFA34D" }} />
            </motion.div>
          </div>
          <div className="absolute bottom-8 right-8 opacity-10">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6" style={{ color: "#FFA34D" }} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function App() {
  return (
    <div className="min-h-screen">
      <WhyChooseUs />
    </div>
  );
}

export default App;