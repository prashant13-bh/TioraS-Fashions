
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, Circle, AlertTriangle, Phone, Mail, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/hooks/useCart.jsx';
import apiServerClient from '@/lib/apiServerClient';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import ShippingMethodSelector from '@/components/ShippingMethodSelector.jsx';
import PaymentMethodSelector from '@/components/PaymentMethodSelector.jsx';
import PolicyModal from '@/components/PolicyModal.jsx';
import SavedAddressSelector from '@/components/SavedAddressSelector.jsx';
import CouponInput from '@/components/CouponInput.jsx';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('DelhiverySurface');
  const [shippingCost, setShippingCost] = useState(60);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // 6 Mandatory Checkboxes
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    return: false,
    refund: false,
    shipping: false,
    cancellation: false
  });

  // Optional Checkboxes
  const [promoEmails, setPromoEmails] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Policy Modal
  const [modalState, setModalState] = useState({ open: false, type: null });

  // Address
  const [shippingAddress, setShippingAddress] = useState({
    fullName: currentUser?.name || '', email: currentUser?.email || '', phone: '',
    street: '', city: '', state: '', zipCode: '', country: 'India'
  });

  const [billingAddress, setBillingAddress] = useState({
    street: '', city: '', state: '', zipCode: '', country: 'India'
  });

  useEffect(() => {
    loadRazorpayScript();
    if (cartItems.length === 0) {
      toast.info('Your cart is empty');
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const rawSubtotalStr = getCartTotal().replace(/[^0-9.-]+/g,"");
  const subtotal = parseFloat(rawSubtotalStr) || 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount + shippingCost);
  const tax = Math.round(taxableAmount * 0.18);
  const totalAmount = taxableAmount + tax;

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === 'shipping') setShippingAddress(p => ({ ...p, [name]: value }));
    else setBillingAddress(p => ({ ...p, [name]: value }));
  };

  const handleAgreementChange = (key, val) => {
    setAgreements(p => ({ ...p, [key]: val }));
  };

  const openPolicy = (e, type) => {
    e.preventDefault();
    setModalState({ open: true, type });
  };

  const allMandatoryChecked = Object.values(agreements).every(v => v === true);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!allMandatoryChecked) {
      toast.error('Please accept all 6 legal agreements to proceed.', { style: { background: 'hsl(var(--destructive))', color: 'white' }});
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please log in to place an order');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode || !shippingAddress.phone) {
      toast.error('Please fill in all required shipping details');
      return;
    }

    setIsProcessing(true);
    toast.loading('Initiating secure checkout...', { id: 'checkout' });

    try {
      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) throw new Error('Payment SDK failed to load.');

      const finalBilling = sameAsShipping ? shippingAddress : billingAddress;
      
      const orderPayload = {
        items: cartItems.map(item => ({
          name: item.product.title, productId: item.product.id, variantId: item.variant.id,
          quantity: item.quantity, price: item.variant.sale_price_in_cents ? item.variant.sale_price_in_cents / 100 : item.variant.price_in_cents / 100,
          image: item.product.image
        })),
        shippingAddress, billingAddress: finalBilling,
        shippingMethod, shippingCost, subtotal, tax, totalAmount,
        consents: { ...agreements, promoEmails, smsAlerts }
      };

      const createRes = await apiServerClient.fetch('/orders/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!createRes.ok) throw new Error('Failed to create order');
      const { orderId, razorpayOrderId } = await createRes.json();

      toast.dismiss('checkout');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_mock",
        amount: totalAmount * 100,
        currency: "INR",
        name: "TioraS Fashions Studio",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async (response) => {
          toast.loading('Verifying payment...', { id: 'verify' });
          try {
            const verifyRes = await apiServerClient.fetch('/orders/verify-payment', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId, razorpayPaymentId: response.razorpay_payment_id, razorpaySignature: response.razorpay_signature
              })
            });
            if (!verifyRes.ok) throw new Error('Verification failed');
            
            toast.dismiss('verify');
            clearCart();
            navigate(`/order-confirmation/${orderId}`, { replace: true });
          } catch (err) {
            toast.dismiss('verify');
            toast.error(err.message);
            setIsProcessing(false);
          }
        },
        prefill: { name: shippingAddress.fullName, email: shippingAddress.email, contact: shippingAddress.phone },
        theme: { color: "hsl(224, 64%, 33%)" },
        modal: { ondismiss: () => { setIsProcessing(false); toast.info('Payment cancelled'); } }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      toast.dismiss('checkout');
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  const StepHeader = ({ number, title }) => (
    <h2 className="text-xl font-bold mb-6 flex items-center text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 text-sm font-sans">{number}</span>
      {title}
    </h2>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Secure Checkout - TioraS Fashions</title></Helmet>
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full mt-20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/cart" className="hover:text-primary flex items-center"><ArrowLeft className="w-4 h-4 mr-1"/> Back to Cart</Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
          Secure Checkout
        </h1>

        <form id="checkout-form" onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-6">
              
              <section className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm">
                <StepHeader number="1" title="Cart Review" />
                <div className="max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-4">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-muted/20 p-3 rounded-xl border border-border/50">
                      <img src={item.product.image} className="w-12 h-12 rounded object-cover" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{item.product.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-muted/40 p-3 rounded-lg border border-border/50 text-xs text-muted-foreground flex gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[hsl(var(--legal-primary))]" />
                  <span>Review items carefully. Custom printed items are subject to our <button onClick={(e) => openPolicy(e, 'return')} className="underline hover:text-foreground">Return Policy</button>.</span>
                </div>
              </section>

              <section className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm">
                <StepHeader number="2" title="Shipping Address" />
                
                {isAuthenticated && !showNewAddressForm ? (
                  <SavedAddressSelector 
                     onSelectAddress={(addr) => setShippingAddress({
                       fullName: addr.fullName, phone: addr.phone, street: addr.street, 
                       city: addr.city, state: addr.state, zipCode: addr.pincode, 
                       country: 'India', email: currentUser?.email || ''
                     })}
                     onAddNew={() => setShowNewAddressForm(true)}
                  />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-5">
                    {isAuthenticated && (
                      <div className="sm:col-span-2 flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setShowNewAddressForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" required value={shippingAddress.fullName} onChange={(e) => handleInputChange(e, 'shipping')} className="bg-background text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" name="phone" required value={shippingAddress.phone} onChange={(e) => handleInputChange(e, 'shipping')} className="bg-background text-foreground" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input id="street" name="street" required value={shippingAddress.street} onChange={(e) => handleInputChange(e, 'shipping')} className="bg-background text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" required value={shippingAddress.city} onChange={(e) => handleInputChange(e, 'shipping')} className="bg-background text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" name="state" required value={shippingAddress.state} onChange={(e) => handleInputChange(e, 'shipping')} className="bg-background text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Pincode</Label>
                      <Input id="zipCode" name="zipCode" required value={shippingAddress.zipCode} onChange={(e) => handleInputChange(e, 'shipping')} className="bg-background text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" value="India" readOnly className="bg-muted text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div className="mt-4 text-xs text-muted-foreground">
                  Estimated delivery varies by location. See <button onClick={(e) => openPolicy(e, 'shipping')} className="underline hover:text-foreground">Shipping Policy</button>.
                </div>
              </section>

              <section className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm">
                <StepHeader number="3" title="Shipping Method" />
                <ShippingMethodSelector selected={shippingMethod} onSelect={(m, c) => { setShippingMethod(m); setShippingCost(c); }} />
              </section>

              <section className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm">
                <StepHeader number="4" title="Billing Address" />
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox id="sameAsShipping" checked={sameAsShipping} onCheckedChange={setSameAsShipping} />
                  <Label htmlFor="sameAsShipping" className="text-sm cursor-pointer text-foreground">Same as shipping address</Label>
                </div>
                {!sameAsShipping && (
                  <div className="grid sm:grid-cols-2 gap-5 pt-4 border-t border-border/50">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="b-street">Street Address</Label>
                      <Input name="street" required value={billingAddress.street} onChange={(e) => handleInputChange(e, 'billing')} className="bg-background text-foreground" />
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm">
                <StepHeader number="5" title="Payment Method" />
                <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />
                <p className="mt-3 text-xs text-muted-foreground">We use encrypted gateways. Read our <button onClick={(e) => openPolicy(e, 'privacy')} className="underline hover:text-foreground">Privacy Policy</button>.</p>
              </section>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm sticky top-28">
                <StepHeader number="6" title="Order Review" />
                <div className="space-y-3 text-sm mb-6 border-b border-border/50 pb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span><span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                      <span>Discount ({appliedCoupon?.code})</span><span>- ₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span><span className="font-medium text-foreground">₹{shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (18%)</span><span className="font-medium text-foreground">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-4 text-foreground">
                    <span>Total</span><span className="text-primary">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mb-6 pt-2 pb-6 border-b border-border/50">
                  <CouponInput 
                    orderAmount={subtotal} 
                    cartItems={cartItems} 
                    appliedCoupon={appliedCoupon} 
                    onApplyCoupon={(data) => {
                      setAppliedCoupon(data);
                      setDiscountAmount(data.discountAmount);
                    }}
                    onRemoveCoupon={() => {
                      setAppliedCoupon(null);
                      setDiscountAmount(0);
                    }}
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-sans">7</span> 
                    Legal Agreements
                  </h3>
                  <div className="bg-[hsl(var(--legal-bg))] border border-border/60 rounded-xl p-4 mb-4">
                    <p className="text-xs text-muted-foreground mb-4">Mandatory agreements required to process your order:</p>
                    <div className="space-y-3">
                      {[
                        { key: 'terms', label: 'Terms & Conditions' },
                        { key: 'privacy', label: 'Privacy Policy' },
                        { key: 'return', label: 'Return Policy' },
                        { key: 'refund', label: 'Refund Policy' },
                        { key: 'shipping', label: 'Shipping Policy' },
                        { key: 'cancellation', label: 'Cancellation Policy' }
                      ].map((doc) => (
                        <div key={doc.key} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                          <Checkbox id={doc.key} checked={agreements[doc.key]} onCheckedChange={(v) => handleAgreementChange(doc.key, v)} className="mt-0.5" />
                          <Label htmlFor={doc.key} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground cursor-pointer">
                            I agree to the <button onClick={(e) => openPolicy(e, doc.key)} className="text-primary hover:underline">{doc.label}</button>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3 px-2">
                    <div className="flex items-center gap-3">
                      <Checkbox id="promo" checked={promoEmails} onCheckedChange={setPromoEmails} />
                      <Label htmlFor="promo" className="text-xs text-muted-foreground cursor-pointer">Send me promotional emails and exclusive offers (Optional)</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="sms" checked={smsAlerts} onCheckedChange={setSmsAlerts} />
                      <Label htmlFor="sms" className="text-xs text-muted-foreground cursor-pointer">Send SMS delivery alerts (Optional)</Label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 mb-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-sans">8</span> 
                    Complete Order
                  </h3>
                  <Button 
                    type="submit" 
                    disabled={isProcessing || !allMandatoryChecked} 
                    className="w-full h-14 text-lg font-bold rounded-xl gradient-primary text-white shadow-lg transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                    ) : (
                      <>Place Order & Pay <ArrowRight className="w-5 h-5 ml-2" /></>
                    )}
                  </Button>
                  {!allMandatoryChecked && (
                    <p className="text-xs text-destructive text-center mt-3 font-medium flex items-center justify-center gap-1">
                      <AlertTriangle className="w-3 h-3 inline" /> You must accept all 6 policies above.
                    </p>
                  )}
                </div>

                {/* Need Help Section */}
                <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
                  <h4 className="font-bold text-sm text-foreground mb-3">Need Help?</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <a href="mailto:support@tiorasfashions.com" className="text-primary hover:underline">
                        support@tiorasfashions.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <a href="tel:+91XXXXXXXXXX" className="text-primary hover:underline">
                        +91-XXXXXXXXXX
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        WhatsApp Support
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <PolicyModal 
        isOpen={modalState.open} 
        onClose={() => setModalState({ open: false, type: null })} 
        policyType={modalState.type}
        onAgree={() => handleAgreementChange(modalState.type, true)}
      />

      <Footer />
    </div>
  );
};

export default CheckoutPage;
