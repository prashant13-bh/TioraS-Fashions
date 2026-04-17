
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Award, Heart, Users, Zap, Star, Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const values = [
    { icon: Award, title: 'Premium Quality', description: 'We source only the finest materials and work with skilled artisans to ensure every piece meets our high standards.' },
    { icon: Heart, title: 'Sustainability', description: 'Committed to ethical fashion practices and reducing our environmental footprint through responsible sourcing.' },
    { icon: Users, title: 'Customer First', description: 'Your satisfaction is our priority. We provide exceptional service and support at every step of your journey.' },
    { icon: Zap, title: 'Innovation', description: 'Constantly evolving with the latest trends while maintaining timeless elegance in every collection.' }
  ];

  const team = [
    { name: 'Priya Sharma', position: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
    { name: 'Rajesh Kumar', position: 'Creative Director', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400' },
    { name: 'Anjali Patel', position: 'Head of Operations', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400' },
    { name: 'Vikram Singh', position: 'Marketing Lead', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400' }
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Products' },
    { value: '50+', label: 'Brands' },
    { value: '4.8', label: 'Average Rating', icon: Star }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>About Us | TioraS Fashions - Our Story & Values</title>
        <meta name="description" content="Learn about TioraS Fashions' journey, mission, values, and the team behind premium fashion collections." />
      </Helmet>
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-6 text-[#D4AF37]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              About TioraS Fashions
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/80 max-w-3xl mx-auto"
            >
              Discover our story, values, and mission to bring premium fashion to everyone
            </motion.p>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800" 
                  alt="TioraS Fashions Store" 
                  className="rounded-2xl shadow-premium w-full h-[500px] object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Our Story</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Founded in 2018, TioraS Fashions began with a simple vision: to make premium fashion accessible to everyone. What started as a small boutique in Bangalore has grown into a beloved online destination for fashion enthusiasts across India.
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Our founder, Priya Sharma, recognized a gap in the market for high-quality, stylish clothing at fair prices. With a background in fashion design and a passion for customer service, she set out to create a brand that would redefine the shopping experience.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Today, we curate collections from over 50 premium brands, serve thousands of happy customers, and continue to uphold our commitment to quality, sustainability, and exceptional service.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold text-lg">Our Mission</p>
                  <p className="text-muted-foreground">To empower individuals through fashion by offering premium quality, sustainable choices, and an unparalleled shopping experience.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide everything we do</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-premium transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">The passionate people behind TioraS Fashions</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{member.name}</h3>
                  <p className="text-muted-foreground text-sm">{member.position}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold text-[#D4AF37] mb-2 flex items-center justify-center gap-2">
                    {stat.value}
                    {stat.icon && <stat.icon className="w-8 h-8 fill-[#D4AF37]" />}
                  </div>
                  <p className="text-white/80">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Ready to Experience Premium Fashion?</h2>
            <p className="text-muted-foreground mb-8 text-lg">Explore our curated collections and find your perfect style</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button className="bg-[#D4AF37] text-[#1a1a2e] hover:bg-[#F4E5B8] px-8 py-6 text-lg rounded-full">
                  Shop Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="px-8 py-6 text-lg rounded-full border-2">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Company Contact Info */}
        <section className="py-20 bg-muted/30 border-t border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                Get in Touch
              </h2>
              <p className="text-muted-foreground text-lg">
                Have questions? We'd love to hear from you.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-foreground mb-3">Company Address</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  TioraS Fashions<br />
                  PLACEHOLDER - Street Address<br />
                  PLACEHOLDER - City, State, Postal Code<br />
                  India
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Phone</h3>
                </div>
                <a href="tel:+91XXXXXXXXXX" className="text-primary hover:underline font-medium">
                  +91-XXXXXXXXXX
                </a>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Email</h3>
                </div>
                <a href="mailto:support@tiorasfashions.com" className="text-primary hover:underline font-medium">
                  support@tiorasfashions.com
                </a>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">WhatsApp</h3>
                </div>
                <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                  +91-XXXXXXXXXX
                </a>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm sm:col-span-2 lg:col-span-4">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Business Hours</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  PLACEHOLDER - Business Hours<br />
                  (To be updated)
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
