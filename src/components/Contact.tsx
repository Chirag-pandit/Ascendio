import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2,
  Clock,
  Send,
  User,
  MessageSquare
} from 'lucide-react';

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-card',
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      info: 'Ascendio.global@gmail.com',
      description: 'Send us your inquiries',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: Phone,
      title: 'Phone',
      info: '+91 9999113792',
      description: 'Call us for immediate support',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: MapPin,
      title: 'Location',
      info: 'Greater Noida West',
      description: 'Gautam Buddha Nagar, UP - 201301',
      color: 'from-purple-400 to-pink-500',
    },
    {
      icon: Building2,
      title: 'Company',
      info: 'CIN: U52599UP2020PTC136596',
      description: 'Registered Private Limited',
      color: 'from-orange-400 to-red-500',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-secondary-500 relative">
      <div className="container mx-auto px-6">
        {/* Background overlay for better text contrast */}
        <div className="absolute inset-0 bg-secondary-500/98"></div>
        
        <div className="text-center mb-16 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6"
          >
            Get In Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-primary-900 max-w-3xl mx-auto leading-relaxed"
          >
            Ready to start your next project? Let's discuss how we can help you achieve your engineering goals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-primary-900 mb-8">
              Contact Information
            </h3>
            
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="contact-card group"
                  whileHover={{ x: 10 }}
                >
                  <div className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-primary-900 text-lg mb-1">
                        {item.title}
                      </h4>
                      <p className="text-accent-500 font-semibold mb-1">
                        {item.info}
                      </p>
                      <p className="text-primary-800 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Business Hours */}
            <motion.div
              className="contact-card"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-8 bg-gradient-to-r from-primary-400 to-accent-400 rounded-2xl text-white relative overflow-hidden shadow-xl">
                {/* Background Image */}
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src="https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" 
                    alt="Business Hours" 
                    className="w-full h-full object-cover brightness-40"
                  />
                </div>
                
                {/* Dark overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/70 to-accent-500/70"></div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <Clock className="h-8 w-8 relative z-10 drop-shadow-xl" />
                  <h4 className="font-display font-bold text-xl relative z-10 drop-shadow-xl">Business Hours</h4>
                </div>
                <div className="space-y-2 text-white relative z-10 drop-shadow-lg">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            className="contact-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-display font-bold text-primary-900 mb-6">
                Send us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full pl-12 pr-4 py-4 border-2 border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm text-primary-800"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full pl-12 pr-4 py-4 border-2 border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm text-primary-800"
                      required
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    className="w-full pl-12 pr-4 py-4 border-2 border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm text-primary-800"
                  />
                </div>
                
                <div className="relative">
                  <Building2 className="absolute left-3 top-4 h-5 w-5 text-primary-400" />
                  <input
                    type="text"
                    placeholder="Company Name (Optional)"
                    className="w-full pl-12 pr-4 py-4 border-2 border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm text-primary-800"
                  />
                </div>
                
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-primary-400" />
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full pl-12 pr-4 py-4 border-2 border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all resize-none shadow-sm text-primary-800"
                    required
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-primary-400 to-accent-400 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <span>Send Message</span>
                  <Send className="h-5 w-5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;