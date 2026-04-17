
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/api/EcommerceApi';
import { useCart } from '@/hooks/useCart.jsx';
import { useWishlist } from '@/contexts/WishlistContext.jsx';

const ProductListItem = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-4 bg-card rounded-xl border border-border hover:shadow-premium transition-all duration-300 group">
      {/* Image */}
      <div className="relative w-full sm:w-48 h-48 shrink-0 rounded-lg overflow-hidden bg-muted">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {product.salePrice && (
          <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow py-1">
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
              <h3 className="text-lg font-bold mb-1">{product.title}</h3>
            </Link>
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-accent text-accent' : 'text-muted'}`} />
                ))}
              </div>
              ({product.reviewCount || 0} reviews)
            </div>
          </div>
          <button 
            onClick={() => toggleWishlist(product.id)}
            className={`p-2 rounded-full transition-colors ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 max-w-2xl">
          {product.description?.replace(/<[^>]*>?/gm, '') || 'Premium quality fashion item designed for comfort and style. Perfect for any occasion.'}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-foreground">
              {formatCurrency(product.salePrice || product.price_in_cents, { code: product.currency, symbol: '₹' })}
            </span>
            {product.salePrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.price_in_cents, { code: product.currency, symbol: '₹' })}
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            <Link to={`/product/${product.id}`}>
              <Button variant="outline" className="bg-background">View Details</Button>
            </Link>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                if (product.variants?.[0]) {
                  addToCart(product, product.variants[0], 1, product.variants[0].inventory_quantity || 99);
                }
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
