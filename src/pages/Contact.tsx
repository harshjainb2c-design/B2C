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
    <div className="min-h-screen bg-black text-white select-none font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8 border-b border-neutral-800 pb-5">
          <span className="text-xs font-inter font-bold tracking-widest text-neutral-400 uppercase">
            B2C Studio Concierge
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase mt-1">
            Contact & Support
          </h1>
          <p className="text-xs font-inter text-neutral-400 mt-2">
            Reach out for order inquiries, wholesale distribution, or styling advice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-5">
            <div className="p-5 sm:p-6 bg-neutral-950 border border-neutral-800 space-y-5 font-inter">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-white mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-xs font-inter uppercase tracking-wider text-neutral-400 mb-1">
                    Store & Studio Address
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-white leading-relaxed font-inter">
                    137 Malwa Mill, Opposite Bank of India<br />
                    Indore, Madhya Pradesh - 452005<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-white mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-xs font-inter uppercase tracking-wider text-neutral-400 mb-1">
                    Direct Phone / WhatsApp
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-white space-y-0.5 font-inter">
                    <a href="tel:+919098178762" className="block text-white">
                      +91 90981 78762
                    </a>
                    <a href="tel:+917489741505" className="block text-white">
                      +91 74897 41505
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-white mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-xs font-inter uppercase tracking-wider text-neutral-400 mb-1">
                    Email Desk
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-white font-inter">
                    <a href="mailto:harshjain2904@gmail.com" className="text-white">
                      harshjain2904@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-white mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-xs font-inter uppercase tracking-wider text-neutral-400 mb-1">
                    Operating Hours
                  </h3>
                  <p className="text-xs text-neutral-300 font-inter leading-relaxed">
                    Monday - Saturday: 10:00 AM - 08:00 PM<br />
                    Sunday: 11:00 AM - 06:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-950 border border-neutral-800 font-inter">
              <span className="text-[11px] font-inter uppercase tracking-wider text-neutral-400 block mb-1">
                Wholesale & Bulk Orders
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed font-inter">
                Store owners and distributors can reach out via WhatsApp at +91 90981 78762 for volume catalog rates.
              </p>
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-5 sm:p-7 font-inter">
            <h2 className="text-sm sm:text-base font-inter uppercase tracking-wider text-white mb-5 font-bold">
              Send Us A Message
            </h2>

            {submitted ? (
              <div className="p-6 text-center border border-emerald-900/60 bg-emerald-950/20">
                <div className="w-10 h-10 rounded-full border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-inter font-bold uppercase text-white mb-1">
                  Message Dispatched
                </h3>
                <p className="text-xs font-inter text-neutral-400 mb-4">
                  We have logged your query and will reply within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 text-xs font-inter uppercase tracking-wider border border-neutral-800 text-white bg-black"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-inter">
                <div>
                  <label htmlFor="name" className="block text-xs font-inter uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-white text-xs sm:text-sm placeholder-neutral-600 focus:outline-none focus:border-white font-inter"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-inter uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-white text-xs sm:text-sm placeholder-neutral-600 focus:outline-none focus:border-white font-inter"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-inter uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-white text-xs sm:text-sm placeholder-neutral-600 focus:outline-none focus:border-white font-inter"
                    placeholder="+91 90981 78762"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-inter uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-white text-xs sm:text-sm placeholder-neutral-600 focus:outline-none focus:border-white font-inter"
                    placeholder="How can we assist you?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-6 text-xs sm:text-sm font-inter font-bold uppercase tracking-[0.16em] text-black bg-white border border-white flex items-center justify-center gap-2"
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
