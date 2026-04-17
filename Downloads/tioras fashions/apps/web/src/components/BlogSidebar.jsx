
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import NewsletterSignup from './NewsletterSignup.jsx';

const BlogSidebar = ({ recentPosts = [], categories = [], tags = [] }) => {
  return (
    <div className="space-y-8">
      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
          <h4 className="font-bold text-lg mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Recent Posts
          </h4>
          <div className="space-y-4">
            {recentPosts.slice(0, 5).map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="block group"
              >
                <h5 className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-1">
                  {post.title}
                </h5>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.publishedDate || post.created).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
          <h4 className="font-bold text-lg mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Categories
          </h4>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <span className="text-foreground hover:text-primary cursor-pointer transition-colors">
                  {cat.name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {cat.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
          <h4 className="font-bold text-lg mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Popular Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      <NewsletterSignup />
    </div>
  );
};

export default BlogSidebar;
