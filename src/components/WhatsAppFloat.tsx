import React from "react"
import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"

const WhatsAppFloat: React.FC = () => {
  const phoneNumber = "+919999113792" // Contact component se liya
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}`

  const handleClick = () => {
    window.open(whatsappUrl, "_blank")
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
    >
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 sm:p-4 shadow-2xl hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center group relative"
        aria-label="WhatsApp par message bhejein"
        title="WhatsApp par message bhejein"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        
        {/* Pulse animation effect */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30"></span>
        
        {/* Tooltip - only show on desktop */}
        <span className="hidden sm:block absolute right-full mr-3 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          WhatsApp par message bhejein
        </span>
      </motion.button>
    </motion.div>
  )
}

export default WhatsAppFloat

