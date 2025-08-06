"use client"
import { motion } from "framer-motion"
import { Building2, Mail, Phone, MapPin, ArrowUp, Sparkles } from "lucide-react"

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const currentYear = new Date().getFullYear()

  const services = [
    "Electrical Solutions",
    "Mechanical Services",
    "Oil & Gas",
    "Industrial Infrastructure",
    "Water & Sewerage",
    "Agriculture & EPC",
  ]

  const products = [
    "Lighting Solutions",
    "Cables & Accessories",
    "Panels & Enclosures",
    "Control & Safety",
    "Solar & LED",
    "Monitoring Systems",
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

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: "#96b6c5" }}>
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="mb-8">
              <motion.div
                className="flex items-center space-x-3 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div variants={floatingVariants} animate="animate" className="relative">
                  <Building2 className="h-10 w-10" style={{ color: "#eee0c9" }} />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Sparkles className="h-4 w-4" style={{ color: "#f1f0e8" }} />
                  </motion.div>
                </motion.div>
                <span className="text-3xl font-bold drop-shadow-lg" style={{ color: "#f1f0e8" }}>
                  Ascendio
                </span>
              </motion.div>

              <motion.p
                className="text-lg leading-relaxed mb-6 max-w-lg drop-shadow-sm"
                style={{ color: "#f1f0e8" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Ascendio Private Limited delivers premium engineering, supply, and project solutions across multiple
                industrial domains with innovation, reliability, and customer satisfaction.
              </motion.p>

              <div className="space-y-4">
                {[
                  { icon: Mail, text: "Ascendio.global@gmail.com" },
                  { icon: Phone, text: "+91 9999113792" },
                  { icon: MapPin, text: "Greater Noida West, UP - 201301" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 group cursor-pointer"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                      <item.icon className="h-5 w-5" style={{ color: "#eee0c9" }} />
                    </motion.div>
                    <span style={{ color: "#f1f0e8" }} className="group-hover:underline">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <motion.h4 className="text-xl font-bold mb-6" style={{ color: "#eee0c9" }} whileHover={{ scale: 1.05 }}>
              Services
            </motion.h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                >
                  <a
                    href="#services"
                    className="text-sm transition-all duration-300 hover:underline block"
                    style={{ color: "#f1f0e8" }}
                  >
                    {service}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Products */}
          <motion.div variants={itemVariants}>
            <motion.h4 className="text-xl font-bold mb-6" style={{ color: "#eee0c9" }} whileHover={{ scale: 1.05 }}>
              Products
            </motion.h4>
            <ul className="space-y-3">
              {products.map((product, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                >
                  <a
                    href="#products"
                    className="text-sm transition-all duration-300 hover:underline block"
                    style={{ color: "#f1f0e8" }}
                  >
                    {product}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          className="border-t py-8"
          style={{ borderColor: "#adc4ce" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div className="text-sm mb-4 md:mb-0" style={{ color: "#f1f0e8" }} whileHover={{ scale: 1.02 }}>
              <p>© {currentYear} Ascendio Private Limited. All rights reserved.</p>
              <p className="mt-1 opacity-80">CIN: U52599UP2020PTC136596</p>
            </motion.div>

            <motion.div
              className="flex items-center space-x-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.span
                className="text-sm font-medium"
                style={{ color: "#f1f0e8" }}
                animate={{
                  textShadow: [
                    "0 0 5px rgba(241, 240, 232, 0.5)",
                    "0 0 10px rgba(241, 240, 232, 0.8)",
                    "0 0 5px rgba(241, 240, 232, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Let's Ascend Together
              </motion.span>

              <motion.button
                onClick={scrollToTop}
                className="p-3 rounded-full shadow-xl transition-all duration-300"
                style={{ backgroundColor: "#eee0c9" }}
                whileHover={{
                  scale: 1.1,
                  y: -5,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  boxShadow: [
                    "0 5px 15px rgba(0,0,0,0.1)",
                    "0 8px 25px rgba(0,0,0,0.15)",
                    "0 5px 15px rgba(0,0,0,0.1)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <ArrowUp className="h-5 w-5" style={{ color: "#96b6c5" }} />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Animated Bottom Border */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1"
        style={{
          background: `linear-gradient(90deg,rgb(209, 196, 189) 0%, #f1f0e8 50%, #eee0c9 100%)`,
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </footer>
  )
}

export default Footer
