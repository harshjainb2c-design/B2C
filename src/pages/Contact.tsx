import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Check } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export const Contact = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in your name, email, and message.',
        variant: 'destructive',
      });
      return;
    }
    setSubmitted(true);
    toast({
      title: 'Message Sent',
      description: 'Our team will get back to you within 24 hours.',
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-black text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10 border-b border-neutral-800 pb-6">
          <span className="text-[11px] font-mono tracking-[0.24em] text-neutral-400 uppercase">
            B2C Studio Concierge
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase mt-2">
            Contact & Support
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-2">
            Reach out for order inquiries, wholesale distribution, or styling advice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-6">
            <div className="p-6 bg-black border border-neutral-800 space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-white mt-1 shrink-0" />
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Store & Studio Address
                  </h3>
                  <p className="text-sm font-medium text-white leading-relaxed">
                    137 Malwa Mill, Opposite Bank of India<br />
                    Indore, Madhya Pradesh - 452005<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-white mt-1 shrink-0" />
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Direct Phone / WhatsApp
                  </h3>
                  <p className="text-sm font-medium text-white space-y-0.5">
                    <a href="tel:+919098178762" className="block hover:text-neutral-300 font-mono">
                      +91 90981 78762
                    </a>
                    <a href="tel:+917489741505" className="block hover:text-neutral-300 font-mono">
                      +91 74897 41505
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-white mt-1 shrink-0" />
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Email Desk
                  </h3>
                  <p className="text-sm font-medium text-white">
                    <a href="mailto:harshjain2904@gmail.com" className="hover:text-neutral-300 font-mono">
                      harshjain2904@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-white mt-1 shrink-0" />
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Operating Hours
                  </h3>
                  <p className="text-sm text-neutral-300 font-mono text-xs leading-relaxed">
                    Monday - Saturday: 10:00 AM - 08:00 PM<br />
                    Sunday: 11:00 AM - 06:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-black border border-neutral-800">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                Wholesale & Bulk Orders
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                Store owners and distributors can reach out via WhatsApp at +91 90981 78762 for volume catalog rates.
              </p>
            </div>
          </div>

          <div className="bg-black border border-neutral-800 p-6 sm:p-8">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-6 font-bold">
              Send Us A Message
            </h2>

            {submitted ? (
              <div className="p-6 text-center border border-emerald-900/60 bg-emerald-950/20">
                <div className="w-10 h-10 rounded-full border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-mono font-bold uppercase text-white mb-1">
                  Message Dispatched
                </h3>
                <p className="text-xs font-mono text-neutral-400 mb-4">
                  We have logged your query and will reply within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-neutral-800 text-white hover:bg-neutral-900"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                    placeholder="+91 90981 78762"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                    placeholder="How can we assist you?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-black bg-white hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
