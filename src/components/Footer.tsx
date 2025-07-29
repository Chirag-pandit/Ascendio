import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const services = [
    'Electrical Solutions',
    'Mechanical Services',
    'Oil & Gas',
    'Industrial Infrastructure',
    'Water & Sewerage',
    'Agriculture & EPC',
  ];

  const products = [
    'Lighting Solutions',
    'Cables & Accessories',
    'Panels & Enclosures',
    'Control & Safety',
    'Solar & LED',
    'Monitoring Systems',
  ];

  return (
    <footer className="bg-primary-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/30 to-accent-400/20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Building2 className="h-10 w-10 text-accent-300" />
                <span className="text-3xl font-display font-bold drop-shadow-md">Ascendio</span>
              </div>
              <p className="text-gray-200 text-lg leading-relaxed mb-6 max-w-lg drop-shadow-sm">
                Ascendio Private Limited delivers premium engineering, supply, and project solutions across multiple industrial domains with innovation, reliability, and customer satisfaction.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-accent-300" />
                  <span className="text-gray-200">Ascendio.global@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-accent-300" />
                  <span className="text-gray-200">+91 9999113792</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-accent-300" />
                  <span className="text-gray-200">Greater Noida West, UP - 201301</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-xl font-display font-bold mb-6 text-accent-300">Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href="#services"
                    className="text-gray-200 hover:text-accent-300 transition-colors text-sm"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-xl font-display font-bold mb-6 text-accent-300">Products</h4>
            <ul className="space-y-3">
              {products.map((product, index) => (
                <li key={index}>
                  <a
                    href="#products"
                    className="text-gray-200 hover:text-accent-300 transition-colors text-sm"
                  >
                    {product}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-700 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-gray-300 text-sm mb-4 md:mb-0"
            >
              <p>© {currentYear} Ascendio Private Limited. All rights reserved.</p>
              <p className="mt-1">CIN: U52599UP2020PTC136596</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center space-x-6"
            >
              <span className="text-gray-300 text-sm font-medium">Let's Ascend Together</span>
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="bg-accent-400 hover:bg-accent-500 text-white p-3 rounded-full transition-colors shadow-xl"
              >
                <ArrowUp className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-accent-400 to-accent-500"></div>
    </footer>
  );
};

export default Footer;