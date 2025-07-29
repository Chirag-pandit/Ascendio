import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ChevronDown, Zap, Shield, Award } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animated background elements
      gsap.set('.floating-element', { opacity: 0.1 });
      gsap.to('.floating-element', {
        y: -30,
        duration: 4,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
      });

      // Hero text animation
      gsap.fromTo(
        '.hero-text',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.2 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-500 via-accent-600 to-accent-500"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-100">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-white/15 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-accent-300/20 rounded-full blur-xl"></div>
        <div className="floating-element absolute bottom-32 left-1/4 w-40 h-40 bg-secondary-400/20 rounded-full blur-xl"></div>
        <div className="floating-element absolute bottom-20 right-1/3 w-28 h-28 bg-white/15 rounded-full blur-xl"></div>
        
        {/* Industrial Background Pattern */}
        <div className="absolute inset-0 opacity-90">
          <img 
            src="https://images.pexels.com/photos/236722/pexels-photo-236722.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop" 
            alt="Industrial Background" 
            className="w-full h-full object-cover brightness-100"
          />
        </div>``
        
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="hero-text text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            Engineering
            <span className="block text-accent-200 drop-shadow-2xl">Excellence</span>
          </h1>
          
          <p className="hero-text text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-xl">
            Premium engineering, supply, and project solutions across electrical, mechanical, oil & gas, and industrial infrastructure
          </p>

          <div className="hero-text flex flex-wrap justify-center gap-6 mb-12 text-white drop-shadow-lg">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Zap className="h-6 w-6 text-accent-200" />
              <span className="font-medium drop-shadow-md">Innovative Solutions</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="h-6 w-6 text-accent-200" />
              <span className="font-medium drop-shadow-md">Reliable Execution</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Award className="h-6 w-6 text-accent-200" />
              <span className="font-medium drop-shadow-md">Quality Assured</span>
            </div>
          </div>

          <div className="hero-text flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-accent-400 hover:text-white transition-all shadow-xl"
            >
              Explore Services
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all shadow-lg"
            >
              Get Quote
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="h-8 w-8 text-white/60" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;