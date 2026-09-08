export const Returns = () => {
  return (
    <div className="min-h-screen bg-black text-white select-none font-inter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8 border-b border-neutral-800 pb-5">
          <span className="text-xs font-inter font-bold tracking-widest text-neutral-400 uppercase">
            B2C Guarantee
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase mt-1">
            Returns & Exchange Policy
          </h1>
          <p className="text-xs font-inter text-neutral-400 mt-2">
            Hassle-Free 30-Day Policy · Indore, India
          </p>
        </div>

        <div className="space-y-7 text-xs sm:text-sm leading-relaxed text-neutral-300 font-inter">
          <section className="border-b border-neutral-900 pb-5">
            <h2 className="text-sm sm:text-base font-inter font-bold uppercase tracking-wider text-white mb-2">
              01. 30-Day Hassle-Free Exchange
            </h2>
            <p className="text-neutral-400">
              We stand behind the craftsmanship of every garment and sneaker. If your piece does not fit as expected or you desire 
              an alternate colorway, we provide a 30-day exchange window with reverse pickup support.
            </p>
          </section>

          <section className="border-b border-neutral-900 pb-5">
            <h2 className="text-sm sm:text-base font-inter font-bold uppercase tracking-wider text-white mb-2">
              02. Eligibility Requirements
            </h2>
            <p className="text-neutral-400 mb-2.5">To qualify for exchange or return, items must satisfy:</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 font-inter">
              <li>Garment must be unworn, unwashed, and in pristine condition</li>
              <li>All original brand tags, archive labels, and packaging intact</li>
              <li>Footwear must include the original undamaged sneaker box and extra laces</li>
              <li>Requested within 30 calendar days of confirmed delivery</li>
              <li>Proof of purchase (invoice or digital order ID)</li>
            </ul>
          </section>

          <section className="border-b border-neutral-900 pb-5">
            <h2 className="text-sm sm:text-base font-inter font-bold uppercase tracking-wider text-white mb-3">
              03. How To Initiate An Exchange
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-inter">
              <div className="p-4 bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400 block mb-1">STEP 01</span>
                <p className="text-white font-semibold mb-1">Notify Concierge</p>
                <p className="text-neutral-400 text-[11px]">Message +91 90981 78762 with your order ID & photos.</p>
              </div>
              <div className="p-4 bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400 block mb-1">STEP 02</span>
                <p className="text-white font-semibold mb-1">Doorstep Pickup</p>
                <p className="text-neutral-400 text-[11px]">Our courier arrives to inspect and collect the parcel.</p>
              </div>
              <div className="p-4 bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400 block mb-1">STEP 03</span>
                <p className="text-white font-semibold mb-1">Replacement Dispatched</p>
                <p className="text-neutral-400 text-[11px]">Your new size or refund is processed within 48 hours.</p>
              </div>
            </div>
          </section>

          <section className="pt-1">
            <h2 className="text-sm sm:text-base font-inter font-bold uppercase tracking-wider text-white mb-2">
              04. Refunds & Store Credit
            </h2>
            <p className="text-neutral-400">
              Refunds for approved returns are credited directly back to original payment method or issued as lifetime store credit 
              within 3-5 business days upon warehouse quality check.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
