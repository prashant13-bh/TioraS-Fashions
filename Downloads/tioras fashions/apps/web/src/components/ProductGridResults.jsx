
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import ProductListItem from './ProductListItem.jsx';

const ProductGridResults = ({ products, loading, viewMode, total, currentPage, onPageChange }) => {
  const itemsPerPage = 20;
  const totalPages = Math.ceil(total / itemsPerPage);

  if (loading) {
    return (
      <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-6"}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className={viewMode === 'grid' ? "h-[300px] w-full rounded-xl" : "h-48 w-full sm:w-48 rounded-xl"} />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-6"}>
        {products.map(product => (
          viewMode === 'grid' 
            ? <ProductCard key={product.id} product={product} />
            : <ProductListItem key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-1 mx-4">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              // Simple pagination logic for display
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  className={`w-10 h-10 p-0 ${currentPage === pageNum ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGridResults;
