
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const BlogCard = ({ post }) => {
  const categoryColors = {
    'Fashion Tips': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Trends': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    'Style Guides': 'bg-green-500/10 text-green-600 border-green-500/20',
    'Customer Stories': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    'Behind the Scenes': 'bg-pink-500/10 text-pink-600 border-pink-500/20',
    'Sustainability': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  };

  const formattedDate = post.publishedDate 
    ? new Date(post.publishedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    : new Date(post.created).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="blog-card group h-full flex flex-col"
    >
      <Link to={`/blog/${post.slug}`} className="blog-card-image">
        <img
          src={post.featuredImage || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="blog-card-content flex flex-col flex-grow">
        <Badge className={`w-fit mb-3 border ${categoryColors[post.category] || 'bg-muted text-foreground'}`}>
          {post.category}
        </Badge>

        <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
          <h3 className="text-xl font-bold mb-3 line-clamp-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {post.title}
          </h3>
        </Link>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50 mt-auto">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {post.author || 'TioraS Team'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime || 5} min
          </span>
        </div>

        <Link to={`/blog/${post.slug}`} className="mt-4">
          <Button variant="ghost" className="w-full text-primary hover:text-primary/80 hover:bg-primary/5">
            Read More →
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default BlogCard;
