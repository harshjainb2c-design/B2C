export const Shipping = () => {
  return (
    <div className="min-h-screen bg-black text-white select-none font-inter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8 border-b border-neutral-800 pb-5">
          <span className="text-xs font-inter font-bold tracking-widest text-neutral-400 uppercase">
            B2C Logistics
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase mt-1">
            Shipping Policy
          </h1>
          <p className="text-xs font-inter text-neutral-400 mt-2">
            Nationwide & Express Indore Dispatch · Indore, India
          </p>
        </div>

        <div className="space-y-7 text-xs sm:text-sm leading-relaxed text-neutral-300 font-inter">
          <section className="border-b border-neutral-900 pb-5">
            <h2 className="text-sm sm:text-base font-inter font-bold uppercase tracking-wider text-white mb-2">
              01. Delivery Coverage
            </h2>
            <p className="text-neutral-400">
              We ship nationwide across all pin codes in India, with hyper-local same-day or next-day express delivery across Indore. 
              Orders are packaged in tamper-evident sealed archive polybags.
            </p>
          </section>

          <section className="border-b border-neutral-900 pb-5">
            <h2 className="text-sm sm:text-base font-inter font-bold uppercase tracking-wider text-white mb-3">
              02. Estimated Transit Timelines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-inter">
              <div className="p-4 bg-neutral-950 border border-neutral-800">
                <span className="text-white font-bold block mb-1">Within Indore:</span>
                <p className="text-neutral-400">24 to 48 hours direct express courier dispatch.</p>
              </div>
              <div className="p-4 bg-neutral-950 border border-neutral-800">
                <span className="text-white font-bold block mb-1">Metro Cities (Delhi, Mumbai, BLR):</span>
                <p className="text-neutral-400">2 to 4 business days air freight delivery.</p>
              </div>
              <div className="p-4 bg-neutral-950 border border-neutral-800">
                <span className="text-white font-bold block mb-1">Rest of India:</span>
                <p className="text-neutral-400">3 to 6 business days with live SMS tracking.</p>
              </div>
              <div className="p-4 bg-neutral-950 border border-neutral-800">
                <span className="text-white font-bold block mb-1">Wholesale & Bulk Shipments:</span>
                <p className="text-neutral-400">Surface transport arranged via verified logistics fleet.</p>
              </div>
            </div>
          </section>

          <section className="border-b border-neutral-900 pb-5">
            <h2 className="text-sm sm:text-base font-inter font-bold uppercase tracking-wider text-white mb-2">
              03. Shipping Charges
            </h2>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 font-inter">
              <li>Free Express Shipping on all prepaid orders across India</li>
              <li>Cash on Delivery available on select postal codes with ₹50 nominal handling</li>
              <li>Wholesale bulk consignments invoiced with customized discounted freight rates</li>
            </ul>
          </section>

          <section className="border-b border-neutral-900 pb-5">
            <h2 className="text-sm sm:text-base font-inter font-bold uppercase tracking-wider text-white mb-2">
              04. Real-Time Tracking
            </h2>
            <p className="text-neutral-400">
              Immediately following courier handover, an automated tracking link with Airway Bill (AWB) is dispatched via WhatsApp and email. 
              Track directly from your account or courier partner portals (Shiprocket, Bluedart, Delhivery).
            </p>
          </section>

          <section className="pt-1">
            <h2 className="text-sm sm:text-base font-inter font-bold uppercase tracking-wider text-white mb-2">
              05. Damaged or Tampered Parcels
            </h2>
            <p className="text-neutral-400">
              If the outer courier polybag is visibly torn or unsealed upon delivery, do not accept the package. 
              Report the issue immediately to our concierge at +91 90981 78762 with photos for an instant replacement.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
