import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Terminal, Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-terminal-green/30 text-terminal-green">CONTACT</Badge>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-pen-text-primary mb-4">
            Get in <span className="text-terminal-green">Touch</span>
          </h1>
          <p className="text-pen-text-secondary max-w-lg mx-auto text-lg">Have questions? Our team typically responds within 24 hours.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Terminal form */}
          <div>
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-xl border border-terminal-green/30 bg-terminal-green/5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-5 w-5 text-terminal-green" />
                  <span className="font-mono text-terminal-green">Message transmitted successfully</span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-pen-text-primary mb-2">Message Sent!</h3>
                <p className="text-sm text-pen-text-muted">We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <div className="rounded-xl border border-pen-border-soft bg-pen-terminal overflow-hidden">
                {/* Terminal header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-pen-border-soft bg-pen-surface2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-pen-danger/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-pen-warning/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-terminal-green/80" />
                    </div>
                    <span className="text-xs text-pen-text-muted font-mono ml-2">contact-form</span>
                  </div>
                  <Terminal className="h-4 w-4 text-pen-text-muted" />
                </div>
                
                {/* Form */}
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="p-4 space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-mono text-pen-text-muted">
                      <span className="text-terminal-green">$</span> name
                    </label>
                    <Input 
                      type="text" 
                      required 
                      placeholder="Your name" 
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-mono text-pen-text-muted">
                      <span className="text-terminal-green">$</span> email
                    </label>
                    <Input 
                      type="email" 
                      required 
                      placeholder="you@company.com" 
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-mono text-pen-text-muted">
                      <span className="text-terminal-green">$</span> message
                    </label>
                    <Textarea 
                      required 
                      rows={4} 
                      placeholder="Tell us about your needs..." 
                      className="font-mono text-sm resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2 font-mono" variant="terminal">
                    <Send className="h-4 w-4" /> Transmit
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <div className="p-5 rounded-xl border border-pen-border-soft bg-pen-surface1 hover:border-pen-brand/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pen-brand/10 border border-pen-brand/20">
                  <Mail className="h-4 w-4 text-pen-brand" />
                </div>
                <h4 className="font-heading text-sm font-semibold text-pen-text-primary">Email</h4>
              </div>
              <p className="text-sm text-pen-text-muted font-mono ml-12">hello@pentagence.io</p>
            </div>
            
            <div className="p-5 rounded-xl border border-pen-border-soft bg-pen-surface1 hover:border-pen-brand/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-terminal-green/10 border border-terminal-green/20">
                  <MessageSquare className="h-4 w-4 text-terminal-green" />
                </div>
                <h4 className="font-heading text-sm font-semibold text-pen-text-primary">Sales</h4>
              </div>
              <p className="text-sm text-pen-text-muted font-mono ml-12">sales@pentagence.io</p>
              <p className="text-xs text-pen-text-muted mt-2 ml-12">Response within 4 business hours</p>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pen-surface2 border border-pen-border-soft">
              <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
              <span className="text-xs font-mono text-pen-text-muted">Systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
