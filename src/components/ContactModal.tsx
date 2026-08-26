import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, MessageSquare, Camera, Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ContactModal: React.FC = () => {
  const {
    isContactModalOpen,
    setIsContactModalOpen,
    settings,
    getWhatsAppOrderUrl,
    getInstagramDmUrl,
  } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isContactModalOpen) return null;

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    const customNotes = `Direct Inquiry from ${name} (Phone: ${phone}): ${message}`;
    const url = getWhatsAppOrderUrl([], customNotes);
    window.open(url, '_blank');
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setIsContactModalOpen(false);
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsContactModalOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-brand-surface-card rounded-2xl shadow-2xl overflow-hidden z-10 border border-brand-outline-variant/40 max-h-[90vh] flex flex-col my-auto"
          style={{
            backgroundColor: 'var(--color-surface-card)',
            borderColor: 'var(--color-outline-variant)',
          }}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-brand-outline-variant/30 flex items-center justify-between bg-brand-surface-container/60">
            <div>
              <span className="text-xs font-label-brand font-bold uppercase tracking-widest text-brand-primary">
                Get In Touch
              </span>
              <h3 className="font-serif-brand text-xl font-bold text-brand-on-surface">
                Contact & Custom Inquiries
              </h3>
            </div>
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-brand-surface text-brand-on-surface transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            
            {/* Quick contact buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={getWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 hover:bg-emerald-100 transition shadow-2xs"
              >
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold font-label-brand uppercase tracking-wider">
                  WhatsApp Us
                </span>
                <span className="text-[11px] opacity-80">{settings.whatsappNumber}</span>
              </a>

              <a
                href={getInstagramDmUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 hover:bg-rose-100 transition shadow-2xs"
              >
                <Camera className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-bold font-label-brand uppercase tracking-wider">
                  Instagram DM
                </span>
                <span className="text-[11px] opacity-80">@{settings.instagramHandle}</span>
              </a>
            </div>

            {/* Inquiries Form */}
            <form onSubmit={handleSendQuery} className="space-y-3 pt-2 text-xs">
              <span className="text-xs font-label-brand font-bold uppercase tracking-wider text-brand-on-surface block">
                Send a Message or Bulk Order Query:
              </span>

              {sent && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Opening WhatsApp with your inquiry!</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-brand-on-surface">Your Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Reddy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-brand-surface-card border border-brand-outline-variant/60 rounded-lg text-brand-on-surface"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-brand-on-surface">Phone / WhatsApp Number:</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-brand-surface-card border border-brand-outline-variant/60 rounded-lg text-brand-on-surface"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-brand-on-surface">Your Message / Requirements:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ask about bulk wedding gifts, corporate boxes, spice customization, or courier status..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 bg-brand-surface-card border border-brand-outline-variant/60 rounded-lg text-brand-on-surface"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-xs font-label-brand font-bold uppercase tracking-widest text-white bg-brand-primary rounded-brand-btn flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Send className="w-4 h-4" />
                <span>Send Query on WhatsApp</span>
              </button>
            </form>

            {/* Address info */}
            <div className="pt-3 border-t border-brand-outline-variant/30 text-xs text-brand-on-surface-variant space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-primary shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
