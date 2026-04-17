
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you for contacting us. We will get back to you soon');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const faqs = [
    { question: 'What are your shipping times?', answer: 'We typically ship orders within 24-48 hours. Delivery takes 3-7 business days depending on your location.' },
    { question: 'Do you offer international shipping?', answer: 'Currently, we only ship within India. International shipping will be available soon.' },
    { question: 'What is your return policy?', answer: 'We offer a 7-day return policy for non-customized items. Customized items are final sale. See our Return Policy page for details.' },
    { question: 'How can I track my order?', answer: 'Once your order ships, you will receive a tracking number via email. You can also track orders from your account dashboard.' },
    { question: 'Do you offer gift wrapping?', answer: 'Yes, we offer complimentary gift wrapping. Select this option at checkout.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Contact Us | TioraS Fashions - Get in Touch</title>
        <meta name="description" content="Contact TioraS Fashions for inquiries, support, or feedback. We're here to help with all your fashion needs." />
      </Helmet>
      <Header />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-6 text-[#D4AF37]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Get in Touch
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/80 max-w-3xl mx-auto"
            >
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </motion.p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your full name"
                      required
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your.email@example.com"
                      required
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 XXXXXXXXXX"
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Select value={formData.subject} onValueChange={(v) => setFormData({...formData, subject: v})}>
                      <SelectTrigger className="bg-background text-foreground">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="order">Order Issue</SelectItem>
                        <SelectItem value="product">Product Question</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us how we can help..."
                      rows={6}
                      required
                      className="bg-background text-foreground"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#D4AF37] text-[#1a1a2e] hover:bg-[#F4E5B8] py-6 text-lg rounded-full">
                    <Send className="w-5 h-5 mr-2" /> Send Message
                  </Button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Contact Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Address</h3>
                        <p className="text-muted-foreground text-sm">
                          TioraS Fashions<br />
                          PLACEHOLDER - Street Address<br />
                          PLACEHOLDER - City, State, Postal Code<br />
                          India
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center shrink-0">
                        <Mail className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <a href="mailto:support@tiorasfashions.com" className="text-primary hover:underline">
                          support@tiorasfashions.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center shrink-0">
                        <Phone className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <a href="tel:+91XXXXXXXXXX" className="text-primary hover:underline">
                          +91-XXXXXXXXXX
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center shrink-0">
                        <MessageCircle className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">WhatsApp</h3>
                        <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          +91-XXXXXXXXXX
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Business Hours</h3>
                        <p className="text-muted-foreground text-sm">
                          PLACEHOLDER - Business Hours<br />
                          (To be updated)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-2xl shadow-sm">
                  <h3 className="font-semibold mb-4 text-lg">Other Ways to Reach Us</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="w-5 h-5 mr-3" /> Live Chat (9AM-6PM IST)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-5 h-5 mr-3" /> WhatsApp Support
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-2xl overflow-hidden h-64">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNiJF!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="TioraS Fashions Location"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Quick answers to common questions</p>
            </div>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-xl px-6 border-none shadow-sm">
                  <AccordionTrigger className="hover:no-underline text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
