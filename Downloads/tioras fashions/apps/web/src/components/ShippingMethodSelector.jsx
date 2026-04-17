
import React from 'react';
import { Truck, Zap, Rocket } from 'lucide-react';

const ShippingMethodSelector = ({ selected, onSelect }) => {
  const methods = [
    { id: 'DelhiverySurface', label: 'Delhivery Surface', price: 60, days: '4-7 Business Days', icon: Truck },
    { id: 'DelhiveryExpress', label: 'Delhivery Express', price: 120, days: '2-4 Business Days', icon: Zap },
  ];

  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const Icon = method.icon;
        const isActive = selected === method.id;
        
        return (
          <div 
            key={method.id}
            onClick={() => onSelect(method.id, method.price)}
            className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              isActive 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-border/50 bg-card hover:border-primary/30'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shrink-0 ${isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              <Icon size={20} />
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-foreground">{method.label}</h4>
              <p className="text-xs text-muted-foreground">{method.days}</p>
            </div>
            
            <div className="text-right">
              <span className="font-bold text-lg">₹{method.price}</span>
            </div>
            
            {/* Active Indicator */}
            {isActive && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ShippingMethodSelector;
