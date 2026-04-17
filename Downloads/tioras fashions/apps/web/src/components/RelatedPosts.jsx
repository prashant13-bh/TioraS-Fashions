
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

const RelatedPosts = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-16 pt-16 border-t border-border/50">
      <h3 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
        Related Posts
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.slice(0, 3).map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group"
          >
            <Link to={`/blog/${post.slug}`} className="block">
              <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-muted">
                <img
                  src={post.featuredImage || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800'}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h4 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.publishedDate || post.created).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime || 5} min
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
