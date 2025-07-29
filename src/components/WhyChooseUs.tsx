import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Brain, 
  Rocket, 
  Handshake, 
  TrendingUp,
  CheckCircle,
  Star
} from 'lucide-react';

const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the main content
      gsap.fromTo(
        '.why-card',
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
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate the statistics
      gsap.fromTo(
        '.stat-number',
        { textContent: 0 },
        {
          textContent: (index: number, target: HTMLElement) => target.getAttribute('data-value'),
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: '.stats-section',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const reasons = [
    {
      icon: Brain,
      title: 'Deep Technical Know-how',
      description: 'Years of industry experience and technical expertise across multiple engineering domains.',
      features: ['Expert Engineers', 'Industry Knowledge', 'Technical Innovation'],
    },
    {
      icon: Rocket,
      title: 'Strong Execution Capabilities',
      description: 'Proven track record of delivering complex industrial projects on time and within budget.',
      features: ['Timely Delivery', 'Quality Assurance', 'Project Management'],
    },
    {
      icon: Handshake,
      title: 'Partnership Mindset',
      description: 'Long-term collaboration approach focused on building lasting relationships with clients.',
      features: ['Client Relations', 'Ongoing Support', 'Collaborative Approach'],
    },
    {
      icon: TrendingUp,
      title: 'Sustainable Growth Focus',
      description: 'Committed to quality, compliance, and sustainable business practices for long-term success.',
      features: ['Quality Standards', 'Compliance', 'Sustainability'],
    },
  ];

  const stats = [
    { value: 400, label: 'kV Projects', suffix: '' },
    { value: 100, label: 'Satisfied Clients', suffix: '+' },
    { value: 2020, label: 'Established', suffix: '' },
    { value: 50, label: 'Product Categories', suffix: '+' },
  ];

  return (
    <section id="why-choose-us" ref={sectionRef} className="py-20 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6"
          >
            Why Choose Ascendio?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-primary-800 max-w-3xl mx-auto leading-relaxed"
          >
            Experience the difference with our comprehensive approach to engineering excellence and client satisfaction.
          </motion.p>
        </div>

        {/* Statistics Section */}
        <div className="stats-section mb-20">
          <div className="bg-gradient-to-r from-primary-400 to-accent-400 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-15">
              <img 
                src="https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop" 
                alt="Industrial Background" 
                className="w-full h-full object-cover brightness-40"
              />
            </div>
            
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/70 to-accent-500/70"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="group relative z-10"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    <span className="stat-number drop-shadow-2xl" data-value={stat.value}>0</span>
                    <span>{stat.suffix}</span>
                  </div>
                  <div className="text-white font-medium drop-shadow-xl">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                className="why-card group"
                whileHover={{ y: -10 }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-accent-200 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-8 transition-opacity duration-500">
                    <img 
                      src="https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" 
                      alt="Industrial Pattern" 
                      className="w-full h-full object-cover brightness-60"
                    />
                  </div>
                  
                  {/* Subtle overlay for better text contrast */}
                  <div className="absolute inset-0 bg-white/95 group-hover:bg-white/90 transition-all duration-500 rounded-3xl"></div>
                  
                  <div className="flex items-start space-x-6">
                    <div className="bg-accent-400 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-accent-500 transition-colors relative z-10 shadow-md">
                      <Icon className="h-8 w-8 text-white group-hover:text-white transition-colors" />
                    </div>
                    
                    <div className="flex-1 relative z-10">
                      <h3 className="text-2xl font-display font-bold text-primary-900 mb-4">
                        {reason.title}
                      </h3>
                      <p className="text-primary-800 mb-6 leading-relaxed">
                        {reason.description}
                      </p>
                      
                      <ul className="space-y-2">
                        {reason.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-primary-900">
                            <CheckCircle className="h-4 w-4 text-accent-500 mr-3 flex-shrink-0" />
                            <span className="text-sm font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center bg-gradient-to-r from-primary-400 to-accent-400 rounded-3xl p-12 text-white relative overflow-hidden shadow-xl"
        >
          {/* Background Image */}
          <div className="absolute inset-0 opacity-15">
            <img 
              src="https://images.pexels.com/photos/236722/pexels-photo-236722.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop" 
              alt="Industrial Excellence" 
              className="w-full h-full object-cover brightness-40"
            />
          </div>
          
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/70 to-accent-500/70"></div>
          
          <Star className="h-16 w-16 mx-auto mb-6 text-accent-200 relative z-10 drop-shadow-2xl" />
          <h3 className="text-3xl font-display font-bold mb-6 relative z-10 drop-shadow-xl">
            Ready to Ascend Together?
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto relative z-10 drop-shadow-lg">
            Join industries, clients, and collaborators in building future-ready infrastructure with innovation, safety, and excellence at the core.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-accent-100 hover:text-primary-700 transition-colors shadow-xl"
            >
              Start Your Project
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors shadow-lg"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;