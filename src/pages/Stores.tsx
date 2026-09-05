import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

export const Stores = () => {
  return (
    <div className="min-h-screen bg-black text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10 border-b border-neutral-800 pb-6">
          <span className="text-[11px] font-mono tracking-[0.24em] text-neutral-400 uppercase">
            Flagship Destination
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase mt-2">
            Our Store & Studio
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-2">
            Experience our streetwear archive and footwear collections in person.
          </p>
        </div>

        <div className="max-w-3xl space-y-6">
          <div className="bg-black border border-neutral-800 p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                FLAGSHIP STORE 01
              </span>
              <h2 className="text-xl sm:text-2xl font-bold uppercase text-white mt-1">
                B2C Exports & Kicks - Indore
              </h2>
            </div>

            <div className="space-y-4 pt-2 border-t border-neutral-900">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-white mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                    Address
                  </p>
                  <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                    137 Malwa Mill, Opposite Bank of India<br />
                    Indore, Madhya Pradesh - 452005<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-white mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                    Phone / WhatsApp
                  </p>
                  <p className="text-sm font-mono text-neutral-300">
                    +91 90981 78762 · +91 74897 41505
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-white mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                    Studio Timings
                  </p>
                  <p className="text-sm font-mono text-neutral-300">
                    Monday - Saturday: 10:00 AM – 08:00 PM<br />
                    Sunday: 11:00 AM – 06:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="https://maps.google.com/?q=137+Malwa+Mill+Indore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          <div className="p-5 bg-black border border-neutral-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-1">
              Walk-Ins & Wholesale Buyers
            </h3>
            <p className="text-xs font-mono text-neutral-400 leading-relaxed">
              Walk-ins are always welcome. For wholesale bulk orders and distribution consultations, 
              please contact our studio ahead of time to arrange reserved showroom slots.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
