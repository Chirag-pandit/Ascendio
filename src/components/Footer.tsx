import React from "react";
import { motion } from "framer-motion";
import { Building2, Mail, Phone, MapPin, ArrowUp, Sparkles } from "lucide-react";

const Footer: React.FC = () => {
  // Logo-inspired theme (matches contact.tsx)
  const theme = {
    primary: "#0E3B34", // deep teal/green
    secondary: "#24B6A6", // vibrant teal
    background: "#F7FFFE", // soft off-white
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  const services = [
    "Electrical Solutions",
    "Mechanical Services",
    "Oil & Gas",
    "Industrial Infrastructure",
    "Water & Sewerage",
    "Agriculture & EPC",
  ];

  const products = [
    "Lighting Solutions",
    "Cables & Accessories",
    "Panels & Enclosures",
    "Control & Safety",
    "Solar & LED",
    "Monitoring Systems",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  } as const;

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
      }}
      aria-label="Footer"
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="mb-8">
              <motion.div
                className="flex items-center space-x-3 mb-6"
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className="relative">
                  <Building2 className="h-10 w-10" style={{ color: theme.background }} />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Sparkles className="h-4 w-4" style={{ color: theme.secondary }} />
                  </motion.div>
                </div>
                <span className="text-3xl font-bold drop-shadow-lg" style={{ color: theme.background }}>
                  Ascendio
                </span>
              </motion.div>

              <motion.p
                className="text-lg leading-relaxed mb-6 max-w-2xl drop-shadow-sm"
                style={{ color: theme.background, opacity: 0.95 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
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
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <item.icon className="h-5 w-5" style={{ color: theme.background }} />
                    <span style={{ color: theme.background }} className="group-hover:underline">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <motion.h4 className="text-xl font-bold mb-6" style={{ color: theme.background }} whileHover={{ scale: 1.04 }}>
              Services
            </motion.h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                >
                  <a
                    href="#services"
                    className="text-sm transition-all duration-300 hover:underline block"
                    style={{ color: theme.background, opacity: 0.9 }}
                  >
                    {service}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Products */}
          <motion.div variants={itemVariants}>
            <motion.h4 className="text-xl font-bold mb-6" style={{ color: theme.background }} whileHover={{ scale: 1.04 }}>
              Products
            </motion.h4>
            <ul className="space-y-3">
              {products.map((product, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                >
                  <a
                    href="#products"
                    className="text-sm transition-all duration-300 hover:underline block"
                    style={{ color: theme.background, opacity: 0.9 }}
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
          style={{ borderColor: `${theme.background}55` }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <motion.div className="text-sm" style={{ color: theme.background }} whileHover={{ scale: 1.02 }}>
              <p>© {currentYear} Ascendio Private Limited. All rights reserved.</p>
              <p className="mt-1 opacity:80">CIN: U52599UP2020PTC136596</p>
            </motion.div>

            <motion.div
              className="flex items-center space-x-6"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <motion.span
                className="text-sm font-medium"
                style={{ color: theme.background }}
                animate={{
                  textShadow: [
                    "0 0 5px rgba(255,255,255,0.35)",
                    "0 0 10px rgba(255,255,255,0.55)",
                    "0 0 5px rgba(255,255,255,0.35)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Let's Ascend Together
              </motion.span>

              <motion.button
                onClick={scrollToTop}
                className="p-3 rounded-full shadow-xl transition-all duration-300"
                style={{ backgroundColor: theme.background }}
                whileHover={{ scale: 1.1, y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.92 }}
              >
                <ArrowUp className="h-5 w-5" style={{ color: theme.secondary }} />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Animated Bottom Border */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1"
        style={{ background: `linear-gradient(90deg, ${theme.secondary}, ${theme.background}, ${theme.primary})` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
    </footer>
  );
};

export default Footer;