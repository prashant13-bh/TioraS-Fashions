
import React, { useState } from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AskQuestionModal = ({ isOpen, onClose, productId }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    question: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.question || formData.question.trim().length < 10) {
      newErrors.question = 'Question must be at least 10 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await pb.collection('productQuestions').create({
        productId: productId,
        userId: currentUser?.id || '',
        name: formData.name.trim(),
        email: formData.email.trim(),
        question: formData.question.trim(),
        status: 'pending'
      }, { $autoCancel: false });

      toast.success('Your question has been submitted');
      onClose();
      setFormData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        question: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to submit question:', error);
      toast.error('Failed to submit question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
            <MessageCircle className="w-5 h-5 text-primary" />
            Ask a Question
          </DialogTitle>
          <DialogDescription>
            Have a question about this product? We'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="question-name" className="text-foreground">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="question-name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: '' });
              }}
              className="text-foreground"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-email" className="text-foreground">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="question-email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: '' });
              }}
              className="text-foreground"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-text" className="text-foreground">
              Question <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="question-text"
              placeholder="What would you like to know about this product?"
              value={formData.question}
              onChange={(e) => {
                setFormData({ ...formData, question: e.target.value });
                setErrors({ ...errors, question: '' });
              }}
              rows={4}
              className="text-foreground resize-none"
            />
            {errors.question && (
              <p className="text-sm text-destructive">{errors.question}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.question.length}/10 characters minimum
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-primary text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Ask Question'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AskQuestionModal;
