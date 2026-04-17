
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Star, Tag, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart.jsx';
import { formatCurrency } from '@/api/EcommerceApi';

const SearchSuggestions = ({ query, suggestions, loading, onSelect, onClose }) => {
  const { addToCart } = useCart();

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Searching...</div>;
  }

  if (!suggestions || (!suggestions.products?.length && !suggestions.categories?.length && !suggestions.brands?.length)) {
    return <div className="p-8 text-center text-muted-foreground">No results found for "{query}"</div>;
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto py-2">
      {/* Categories & Brands */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-b border-border">
        {suggestions.categories?.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Categories</h4>
            <ul className="space-y-2">
              {suggestions.categories.map((cat, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => onSelect(cat.name)}
                    className="flex items-center text-sm hover:text-primary transition-colors w-full text-left"
                  >
                    <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
                    {cat.name} <span className="ml-auto text-xs text-muted-foreground">{cat.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {suggestions.brands?.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Brands</h4>
            <ul className="space-y-2">
              {suggestions.brands.map((brand, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => onSelect(brand.name)}
                    className="flex items-center text-sm hover:text-primary transition-colors w-full text-left"
                  >
                    <Box className="w-4 h-4 mr-2 text-muted-foreground" />
                    {brand.name} <span className="ml-auto text-xs text-muted-foreground">{brand.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Products */}
      {suggestions.products?.length > 0 && (
        <div className="p-4">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Products</h4>
          <div className="space-y-4">
            {suggestions.products.map((product) => (
              <div key={product.id} className="flex items-center gap-4 group">
                <Link to={`/product/${product.id}`} onClick={onClose} className="shrink-0">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                </Link>
                <div className="flex-grow min-w-0">
                  <Link to={`/product/${product.id}`} onClick={onClose} className="hover:text-primary transition-colors">
                    <h5 className="text-sm font-medium truncate">{product.title}</h5>
                  </Link>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                    {product.rating || '4.5'}
                  </div>
                  <div className="text-sm font-bold mt-1">
                    {formatCurrency(product.price_in_cents, { code: product.currency, symbol: '₹' })}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    if (product.variants?.[0]) {
                      addToCart(product, product.variants[0], 1, product.variants[0].inventory_quantity || 99);
                      onClose();
                    }
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-border bg-muted/30">
        <Link 
          to={`/search?q=${encodeURIComponent(query)}`} 
          onClick={onClose}
          className="flex items-center justify-center w-full text-sm font-medium text-primary hover:underline"
        >
          View all results for "{query}" <Search className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default SearchSuggestions;
