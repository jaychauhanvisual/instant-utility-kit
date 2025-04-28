
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (feedback.trim()) {
      // Here you would typically send the feedback to your backend
      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your input and will review it shortly.",
      });
      setFeedback('');
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold tracking-tighter mb-4">
            Share Your Feedback
          </h2>
          <p className="text-muted-foreground mb-8">
            Your feedback helps us improve InstantUtils for everyone
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full h-32 p-4 rounded-lg border bg-background"
              placeholder="Tell us what you think..."
              required
            />
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Submit Feedback
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
