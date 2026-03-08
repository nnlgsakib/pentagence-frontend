import { Button } from "@/components/ui/button";
import { Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-pen-text-secondary max-w-lg mx-auto">Have questions? Our team typically responds within 24 hours.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div>
            {submitted ? (
              <div className="p-8 rounded-xl border border-pen-success/30 bg-pen-success/5 text-center">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Message Sent!</h3>
                <p className="text-sm text-pen-text-muted">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                  <input type="text" required className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input type="email" required className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50" placeholder="you@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                  <textarea required rows={4} className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50 resize-none" placeholder="Tell us about your needs..." />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            )}
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-pen-brand mt-0.5" />
              <div>
                <h4 className="font-heading text-sm font-semibold text-foreground">Email</h4>
                <p className="text-sm text-pen-text-muted">hello@pentagence.io</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-pen-brand mt-0.5" />
              <div>
                <h4 className="font-heading text-sm font-semibold text-foreground">Sales</h4>
                <p className="text-sm text-pen-text-muted">sales@pentagence.io</p>
                <p className="text-xs text-pen-text-muted mt-1">Response within 4 business hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
