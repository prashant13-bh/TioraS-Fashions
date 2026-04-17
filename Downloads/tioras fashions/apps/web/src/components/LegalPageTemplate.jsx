
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Printer, Share2, ChevronLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { toast } from 'sonner';

const LegalPageTemplate = ({ title, lastUpdated, sections, contactEmail = 'support@tiorasfashions.com' }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${title} - TioraS Fashions Studio`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{title} | TioraS Fashions Studio</title>
      </Helmet>
      
      <div className="no-print">
        <Header />
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full mt-20">
        
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 no-print">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/legal" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
              <ChevronLeft className="w-4 h-4 mr-1" /> Legal Hub
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground">{title}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleShare} className="rounded-full">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-full">
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-12 border-b border-border/50 pb-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Table of Contents - Sticky Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-28 no-print">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Table of Contents</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block w-full text-left text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all py-1"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <article className="flex-1 min-w-0 legal-content">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-12 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-6 text-foreground">{section.title}</h2>
                
                {section.isAccordion ? (
                  <Accordion type="single" collapsible className="w-full">
                    {section.content.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left font-medium">
                          {item.heading}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          <div dangerouslySetInnerHTML={{ __html: item.body }} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                )}
              </section>
            ))}

            <section className="mt-16 p-8 bg-primary/5 rounded-2xl border border-primary/10">
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary" /> Contact Us
              </h3>
              <p className="text-muted-foreground mb-4">
                If you have any questions or concerns regarding this {title.toLowerCase()}, please feel free to contact our support team.
              </p>
              <a href={`mailto:${contactEmail}`} className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                Email Support
              </a>
            </section>
          </article>
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
};

export default LegalPageTemplate;
