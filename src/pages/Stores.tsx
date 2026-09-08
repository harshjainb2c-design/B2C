import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

export const Stores = () => {
  return (
    <div className="min-h-screen bg-black text-white select-none font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8 border-b border-neutral-800 pb-5">
          <span className="text-xs font-inter font-bold tracking-widest text-neutral-400 uppercase">
            Flagship Destination
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase mt-1">
            Our Store & Studio
          </h1>
          <p className="text-xs font-inter text-neutral-400 mt-2">
            Experience our streetwear archive and footwear collections in person.
          </p>
        </div>

        <div className="max-w-3xl space-y-6">
          <div className="bg-neutral-950 border border-neutral-800 p-5 sm:p-7 space-y-5 font-inter">
            <div>
              <span className="text-[10px] font-inter font-bold tracking-[0.2em] text-neutral-400 uppercase">
                FLAGSHIP STORE 01
              </span>
              <h2 className="text-lg sm:text-xl font-bold uppercase text-white mt-1">
                B2C Exports & Kicks - Indore
              </h2>
            </div>

            <div className="space-y-4 pt-2 border-t border-neutral-900">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-white mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-inter uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                    Address
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-inter">
                    137 Malwa Mill, Opposite Bank of India<br />
                    Indore, Madhya Pradesh - 452005<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-white mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-inter uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                    Phone / WhatsApp
                  </p>
                  <p className="text-xs sm:text-sm font-inter text-neutral-300">
                    +91 90981 78762 · +91 74897 41505
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-white mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-inter uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                    Operating Hours
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-300 font-inter">
                    Monday - Saturday: 10:00 AM - 08:00 PM<br />
                    Sunday: 11:00 AM - 06:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row gap-3">
              <a
                href="https://maps.google.com/?q=137+Malwa+Mill+Indore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-inter font-bold uppercase tracking-wider border border-white"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
              <a
                href="https://wa.me/919098178762"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-neutral-800 text-white text-xs font-inter font-bold uppercase tracking-wider bg-black"
              >
                <span>WhatsApp Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
