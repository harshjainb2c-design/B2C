export const Shipping = () => {
  return (
    <div className="min-h-screen bg-black text-white select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8 border-b border-neutral-800 pb-6">
          <span className="text-[11px] font-mono tracking-[0.24em] text-neutral-400 uppercase">
            B2C Logistics
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase mt-2">
            Shipping Policy
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-2">
            Nationwide & Express Indore Dispatch · Indore, India
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-neutral-300 font-sans">
          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              01. Delivery Coverage
            </h2>
            <p className="text-neutral-400">
              We ship nationwide across all pin codes in India, with hyper-local same-day or next-day express delivery across Indore. 
              Orders are packaged in tamper-evident sealed archive polybags.
            </p>
          </section>

          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              02. Estimated Transit Timelines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-4 bg-black border border-neutral-800">
                <span className="text-white font-bold block mb-1">Within Indore:</span>
                <p className="text-neutral-400">24 to 48 hours direct express courier dispatch.</p>
              </div>
              <div className="p-4 bg-black border border-neutral-800">
                <span className="text-white font-bold block mb-1">Metro Cities (Delhi, Mumbai, BLR):</span>
                <p className="text-neutral-400">2 to 4 business days air freight delivery.</p>
              </div>
              <div className="p-4 bg-black border border-neutral-800">
                <span className="text-white font-bold block mb-1">Rest of India:</span>
                <p className="text-neutral-400">3 to 6 business days with live SMS tracking.</p>
              </div>
              <div className="p-4 bg-black border border-neutral-800">
                <span className="text-white font-bold block mb-1">Wholesale & Bulk Shipments:</span>
                <p className="text-neutral-400">Surface transport arranged via verified logistics fleet.</p>
              </div>
            </div>
          </section>

          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              03. Shipping Charges
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-400 font-mono text-xs">
              <li>Free Express Shipping on all prepaid orders across India</li>
              <li>Cash on Delivery available on select postal codes with ₹50 nominal handling</li>
              <li>Wholesale bulk consignments invoiced with customized discounted freight rates</li>
            </ul>
          </section>

          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              04. Real-Time Tracking
            </h2>
            <p className="text-neutral-400">
              Immediately following courier handover, an automated tracking link with Airway Bill (AWB) is dispatched via WhatsApp and email. 
              Track directly from your account or courier partner portals (Shiprocket, Bluedart, Delhivery).
            </p>
          </section>

          <section className="pt-2">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              05. Dispatch Hub
            </h2>
            <div className="bg-black border border-neutral-800 p-5 text-xs font-mono space-y-1.5 text-neutral-400">
              <p className="text-white font-bold">B2C Logistics Desk</p>
              <p>137 Malwa Mill, Indore, Madhya Pradesh - 452005</p>
              <p>Helpline: +91 90981 78762 · +91 74897 41505</p>
              <p>Email: logistics@b2cstreetwear.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
