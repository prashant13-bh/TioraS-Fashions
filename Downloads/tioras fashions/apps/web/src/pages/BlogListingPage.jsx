
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight, Search } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBlogFilters } from '@/hooks/useBlogFilters.js';
import pocketbaseClient from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const BlogListingPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { 
    filters, 
    filteredPosts, 
    paginatedPosts, 
    totalPages, 
    totalResults,
    setCategory, 
    setSearchQuery, 
    setSortBy, 
    setPage 
  } = useBlogFilters(posts);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const records = await pocketbaseClient.collection('blogPosts').getFullList({
        filter: 'status = "published"',
        sort: '-publishedDate',
        $autoCancel: false
      });
      setPosts(records);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Fashion Tips', 'Trends', 'Style Guides', 'Customer Stories', 'Behind the Scenes', 'Sustainability'];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Blog | TioraS Fashions - Fashion Tips, Trends & Style Guides</title>
        <meta name="description" content="Explore the latest fashion trends, style guides, and insider tips from TioraS Fashions. Stay updated with our fashion blog." />
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
              Fashion Blog
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/80 max-w-3xl mx-auto mb-8"
            >
              Discover the latest trends, style tips, and fashion insights
            </motion.p>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                value={filters.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-[#D4AF37]"
              />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  onClick={() => setCategory(cat === 'All' ? 'all' : cat)}
                  variant={filters.category === (cat === 'All' ? 'all' : cat) ? 'default' : 'outline'}
                  className={filters.category === (cat === 'All' ? 'all' : cat) ? 'bg-[#D4AF37] text-[#1a1a2e] hover:bg-[#F4E5B8]' : ''}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-sm animate-pulse">
                    <div className="h-64 bg-muted" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-6 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedPosts.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold mb-4">No blog posts found</h3>
                <p className="text-muted-foreground mb-8">Try adjusting your filters or search query</p>
                <Button onClick={() => { setCategory('all'); setSearchQuery(''); }} className="bg-[#D4AF37] text-[#1a1a2e] hover:bg-[#F4E5B8]">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedPosts.map((post) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                    >
                      {post.featuredImage && (
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={pocketbaseClient.files.getUrl(post, post.featuredImage)}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {post.category && (
                            <Badge className="absolute top-4 left-4 bg-[#D4AF37] text-[#1a1a2e]">
                              {post.category}
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                          </div>
                          {post.readTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.readTime} min read</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-[#D4AF37] transition-colors">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                        {post.author && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                        )}
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 text-[#D4AF37] font-semibold hover:gap-3 transition-all"
                        >
                          Read More <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        variant={filters.page === pageNum ? 'default' : 'outline'}
                        className={filters.page === pageNum ? 'bg-[#D4AF37] text-[#1a1a2e] hover:bg-[#F4E5B8]' : ''}
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogListingPage;
