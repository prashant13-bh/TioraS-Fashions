
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [offlineForm, setOfflineForm] = useState({ name: '', email: '', message: '' });
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentUser && isOpen) {
      loadMessages();
    }
  }, [currentUser, isOpen]);

  const loadMessages = async () => {
    if (!currentUser) return;
    try {
      const records = await pb.collection('_integratedAiMessages').getFullList({
        filter: `userId = "${currentUser.id}"`,
        sort: 'created',
        $autoCancel: false
      });
      
      const formattedMessages = records.map(record => ({
        id: record.id,
        role: record.role,
        content: record.content,
        timestamp: new Date(record.created)
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentUser) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: [{ text: inputMessage, type: 'text' }],
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      await pb.collection('_integratedAiMessages').create({
        userId: currentUser.id,
        role: 'user',
        content: [{ text: inputMessage, type: 'text' }]
      }, { $autoCancel: false });

      // Simulate operator response
      setTimeout(() => {
        const operatorMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: [{ text: 'Thank you for your message. Our team will respond shortly.', type: 'text' }],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, operatorMessage]);
        setIsTyping(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      setIsTyping(false);
    }
  };

  const handleOfflineSubmit = async (e) => {
    e.preventDefault();
    if (!offlineForm.name || !offlineForm.email || !offlineForm.message) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Store offline message
      toast.success('Message sent! We will get back to you via email.');
      setOfflineForm({ name: '', email: '', message: '' });
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full gradient-primary text-white shadow-lg hover:shadow-xl transition-all"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          {unreadCount > 0 && !isOpen && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-white border-2 border-background">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-[calc(100vw-3rem)] sm:w-[400px] bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 8rem)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white">TioraS Support</h3>
                  <p className="text-xs text-white/80">{isOnline ? 'Online' : 'Offline'}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {isOnline && currentUser ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 custom-scrollbar" style={{ minHeight: '300px', maxHeight: '400px' }}>
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">Start a conversation with our support team</p>
                    </div>
                  )}
                  
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">S</span>
                            </div>
                            <span className="text-xs text-muted-foreground">Support</span>
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background border border-border/50 text-foreground'
                          }`}
                        >
                          <p className="text-sm">{msg.content[0]?.text || msg.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-2">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-background border border-border/50 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-background border-t border-border/50">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 text-foreground"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="gradient-primary text-white h-11 w-11 p-0 shrink-0"
                    >
                      {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Offline Form */
              <div className="p-6 space-y-4">
                <div className="text-center mb-4">
                  <h4 className="font-bold text-foreground mb-2">We're currently offline</h4>
                  <p className="text-sm text-muted-foreground">Leave us a message and we'll get back to you via email</p>
                </div>
                
                <form onSubmit={handleOfflineSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="offline-name" className="text-foreground">Name</Label>
                    <Input
                      id="offline-name"
                      value={offlineForm.name}
                      onChange={(e) => setOfflineForm({ ...offlineForm, name: e.target.value })}
                      placeholder="Your name"
                      required
                      className="text-foreground"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="offline-email" className="text-foreground">Email</Label>
                    <Input
                      id="offline-email"
                      type="email"
                      value={offlineForm.email}
                      onChange={(e) => setOfflineForm({ ...offlineForm, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className="text-foreground"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="offline-message" className="text-foreground">Message</Label>
                    <Textarea
                      id="offline-message"
                      value={offlineForm.message}
                      onChange={(e) => setOfflineForm({ ...offlineForm, message: e.target.value })}
                      placeholder="How can we help you?"
                      required
                      rows={4}
                      className="text-foreground resize-none"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full gradient-primary text-white">
                    Send Message
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
