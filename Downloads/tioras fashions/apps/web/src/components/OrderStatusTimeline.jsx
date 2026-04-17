
import React from 'react';
import { CheckCircle2, Clock, Package, Truck, CheckCircle, PenTool, ClipboardCheck } from 'lucide-react';

const OrderStatusTimeline = ({ currentStatus }) => {
  const steps = [
    { key: 'Pending', label: 'Order Placed', icon: Clock },
    { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'In Production', label: 'In Production', icon: PenTool },
    { key: 'Quality Check', label: 'Quality Check', icon: ClipboardCheck },
    { key: 'Shipped', label: 'Shipped', icon: Package },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'Delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const currentIndex = steps.findIndex(s => s.key === currentStatus);
  // If cancelled or unknown, maybe handle differently, but fallback to 0
  const activeIndex = currentIndex >= 0 ? currentIndex : (currentStatus === 'Cancelled' ? -1 : 0);

  if (currentStatus === 'Cancelled') {
    return (
      <div className="w-full py-6 px-4 bg-destructive/10 rounded-2xl border border-destructive/20 text-center">
        <h3 className="text-xl font-bold text-destructive mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Order Cancelled</h3>
        <p className="text-destructive/80">This order has been cancelled and refunded.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto pb-6 pt-2 scrollbar-hide">
      <div className="min-w-[700px] flex items-center justify-between relative px-6">
        {/* Connecting Line Background */}
        <div className="absolute top-1/2 left-10 right-10 h-1 bg-muted -translate-y-1/2 z-0"></div>
        
        {/* Connecting Line Active */}
        <div 
          className="absolute top-1/2 left-10 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
          style={{ width: `calc(${(activeIndex / (steps.length - 1)) * 100}% - 2.5rem)` }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-primary border-background text-primary-foreground shadow-lg scale-110' 
                    : 'bg-muted border-background text-muted-foreground'
                }`}
              >
                <Icon size={20} className={isCurrent ? 'animate-pulse' : ''} />
              </div>
              <div className="mt-3 text-center w-24">
                <span className={`text-xs font-bold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
