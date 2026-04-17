
import React from 'react';
import { CreditCard, Wallet, Smartphone, Building2 } from 'lucide-react';

const PaymentMethodSelector = ({ selected, onSelect }) => {
  const methods = [
    { 
      id: 'Razorpay', 
      label: 'Razorpay Secure Checkout', 
      description: 'Pay via UPI, Cards, NetBanking, or Wallets',
      icons: [CreditCard, Smartphone, Building2, Wallet]
    }
  ];

  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const isActive = selected === method.id;
        
        return (
          <div 
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              isActive 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-border/50 bg-card hover:border-primary/30'
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-bold text-foreground">{method.label}</h4>
                <p className="text-xs text-muted-foreground">{method.description}</p>
              </div>
              {isActive && (
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
            {method.icons.length > 0 && (
              <div className="flex gap-3">
                {method.icons.map((Icon, idx) => (
                  <div key={idx} className="w-10 h-7 rounded bg-card border flex items-center justify-center text-muted-foreground shadow-sm">
                    <Icon size={14} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PaymentMethodSelector;
