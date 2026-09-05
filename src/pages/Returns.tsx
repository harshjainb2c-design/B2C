export const Returns = () => {
  return (
    <div className="min-h-screen bg-black text-white select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8 border-b border-neutral-800 pb-6">
          <span className="text-[11px] font-mono tracking-[0.24em] text-neutral-400 uppercase">
            B2C Guarantee
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase mt-2">
            Returns & Exchange Policy
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-2">
            Hassle-Free 30-Day Policy · Indore, India
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-neutral-300 font-sans">
          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              01. 30-Day Hassle-Free Exchange
            </h2>
            <p className="text-neutral-400">
              We stand behind the craftsmanship of every garment and sneaker. If your piece does not fit as expected or you desire 
              an alternate colorway, we provide a 30-day exchange window with reverse pickup support.
            </p>
          </section>

          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              02. Eligibility Requirements
            </h2>
            <p className="text-neutral-400 mb-3">To qualify for exchange or return, items must satisfy:</p>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-400 font-mono text-xs">
              <li>Garment must be unworn, unwashed, and in pristine condition</li>
              <li>All original brand tags, archive labels, and packaging intact</li>
              <li>Footwear must include the original undamaged sneaker box and extra laces</li>
              <li>Requested within 30 calendar days of confirmed delivery</li>
              <li>Proof of purchase (invoice or digital order ID)</li>
            </ul>
          </section>

          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              03. How To Initiate An Exchange
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-4 bg-black border border-neutral-800">
                <span className="text-neutral-400 block mb-1">STEP 01</span>
                <p className="text-white font-semibold mb-1">Notify Concierge</p>
                <p className="text-neutral-400 text-[11px]">Message +91 90981 78762 with your order ID & photos.</p>
              </div>
              <div className="p-4 bg-black border border-neutral-800">
                <span className="text-neutral-400 block mb-1">STEP 02</span>
                <p className="text-white font-semibold mb-1">Doorstep Pickup</p>
                <p className="text-neutral-400 text-[11px]">Our courier arrives to inspect and collect the parcel.</p>
              </div>
              <div className="p-4 bg-black border border-neutral-800">
                <span className="text-neutral-400 block mb-1">STEP 03</span>
                <p className="text-white font-semibold mb-1">Replacement Dispatched</p>
                <p className="text-neutral-400 text-[11px]">Your new size or refund is processed within 48 hours.</p>
              </div>
            </div>
          </section>

          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              04. Defective Or Damaged Shipments
            </h2>
            <p className="text-neutral-400">
              In the rare event an item arrives with a transit defect, contact us within 48 hours of unboxing with photos. 
              An immediate priority replacement is dispatched with zero return fees.
            </p>
          </section>

          <section className="pt-2">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              05. Return Desk
            </h2>
            <div className="bg-black border border-neutral-800 p-5 text-xs font-mono space-y-1.5 text-neutral-400">
              <p className="text-white font-bold">B2C Warehouse & Exchange Center</p>
              <p>137 Malwa Mill, Indore, Madhya Pradesh - 452005</p>
              <p>Direct Exchange Helpline: +91 90981 78762</p>
              <p>Email: returns@b2cstreetwear.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
