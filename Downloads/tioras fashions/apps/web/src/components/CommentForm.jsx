
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const CommentForm = ({ postId, parentCommentId = null, onCommentAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !content) {
      toast.error('Please fill in all fields');
      return;
    }

    if (content.length < 10) {
      toast.error('Comment must be at least 10 characters');
      return;
    }

    try {
      setSubmitting(true);
      await pb.collection('blogComments').create({
        postId,
        authorName: name,
        authorEmail: email,
        content,
        parentCommentId,
        status: 'pending',
        likes: 0
      }, { $autoCancel: false });

      toast.success('Comment submitted for approval');
      setName('');
      setEmail('');
      setContent('');
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Failed to submit comment:', error);
      toast.error('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-background text-foreground"
        />
        <Input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-background text-foreground"
        />
      </div>
      <Textarea
        placeholder="Your Comment (minimum 10 characters)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
        minLength={10}
        className="bg-background text-foreground"
      />
      <Button
        type="submit"
        disabled={submitting}
        className="bg-[#D4AF37] text-[#1a1a2e] hover:bg-[#F4E5B8]"
      >
        {submitting ? 'Submitting...' : 'Post Comment'}
      </Button>
    </form>
  );
};

export default CommentForm;
