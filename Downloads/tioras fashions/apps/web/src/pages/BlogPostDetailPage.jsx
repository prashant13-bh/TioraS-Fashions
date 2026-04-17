
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import pocketbaseClient from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const BlogPostDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const records = await pocketbaseClient.collection('blogPosts').getFullList({
        filter: `slug = "${slug}" && status = "published"`,
        $autoCancel: false
      });
      
      if (records.length === 0) {
        navigate('/blog');
        toast.error('Blog post not found');
        return;
      }
      
      const postData = records[0];
      setPost(postData);
      
      // Fetch related posts
      if (postData.category) {
        const related = await pocketbaseClient.collection('blogPosts').getFullList({
          filter: `category = "${postData.category}" && status = "published" && id != "${postData.id}"`,
          sort: '-publishedDate',
          $autoCancel: false
        });
        setRelatedPosts(related.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Failed to load blog post');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Helmet><title>Loading... | TioraS Fashions Blog</title></Helmet>
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading blog post...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{`${post.title} | TioraS Fashions Blog`}</title>
        <meta name="description" content={post.excerpt || post.title} />
      </Helmet>
      <Header />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-[#D4AF37] mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            
            {post.category && (
              <Badge className="bg-[#D4AF37] text-[#1a1a2e] mb-4">
                {post.category}
              </Badge>
            )}
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {post.title}
            </motion.h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              {post.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} min read</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {post.featuredImage && (
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <img
                src={pocketbaseClient.files.getUrl(post, post.featuredImage)}
                alt={post.title}
                className="w-full h-[500px] object-cover rounded-2xl shadow-lg"
              />
            </div>
          </section>
        )}

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h4 className="text-sm font-semibold mb-4">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mt-12 pt-8 border-t">
              <h4 className="text-sm font-semibold mb-4">Share this article:</h4>
              <div className="flex gap-3">
                <Button onClick={() => handleShare('facebook')} variant="outline" size="icon">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleShare('twitter')} variant="outline" size="icon">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleShare('linkedin')} variant="outline" size="icon">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-12 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="group">
                    <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                      {relatedPost.featuredImage && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={pocketbaseClient.files.getUrl(relatedPost, relatedPost.featuredImage)}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPostDetailPage;
