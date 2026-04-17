
import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TestimonialCard = ({ name, rating, text, avatar, date }) => {
  return (
    <div className="bg-card p-8 rounded-xl shadow-subtle border border-border/50 h-full flex flex-col relative">
      <Quote className="absolute top-6 right-6 h-12 w-12 text-primary/10" />
      
      <div className="flex items-center gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} 
          />
        ))}
      </div>
      
      <p className="text-foreground/80 italic mb-8 flex-grow relative z-10">
        "{text}"
      </p>
      
      <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
        <Avatar className="h-12 w-12 border-2 border-primary/20">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h5 className="font-semibold text-sm text-foreground">{name}</h5>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span className="flex items-center text-emerald-600 font-medium">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
            </span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
