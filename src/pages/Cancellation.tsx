export const Cancellation = () => {
  return (
    <div className="min-h-screen bg-black text-white select-none font-inter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8 border-b border-neutral-800 pb-5">
          <span className="text-xs font-inter font-bold tracking-widest text-neutral-400 uppercase">
            B2C Archive Policy
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase mt-1">
            Cancellation Policy
          </h1>
          <p className="text-xs font-inter text-neutral-400 mt-2">
            Last Updated: January 2025 · Indore, India
          </p>
        </div>

        <div className="space-y-7 text-xs sm:text-sm leading-relaxed text-neutral-300 font-inter">
          <section className="border-b border-neutral-900 pb-5">
            <h2 className="text-sm sm:text-base font-inter font-bold uppercase tracking-wider text-white mb-2">
              01. Order Cancellation Window
            </h2>
            <p className="text-neutral-400">
              Orders can be cancelled free of cost before warehouse dispatch. Once a parcel has been handed to our express courier partner, 
              cancellation is locked and our standard exchange policy applies upon delivery.
            </p>
          </section>

          <section className="border-b border-neutral-900 pb-5">
            <h2 className="text-sm sm:text-base font-inter font-bold uppercase tracking-wider text-white mb-3">
              02. Cancellation Stages
            </h2>
            <ul className="space-y-2.5 text-xs font-inter text-neutral-400">
              <li className="p-3.5 rounded-xl bg-neutral-950/50 border border-white/10">
                <span className="text-white font-bold block mb-0.5">Pre-Dispatch (Within 2-4 Hours):</span>
                Instant cancellation available from your Orders dashboard or via direct WhatsApp concierge.
              </li>
              <li className="p-3.5 rounded-xl bg-neutral-950/50 border border-white/10">
                <span className="text-white font-bold block mb-0.5">Processing Stage:</span>
                Contact support immediately (+91 90981 78762) to intercept packing prior to label generation.
              </li>
              <li className="p-3.5 rounded-xl bg-neutral-950/50 border border-white/10">
                <span className="text-white font-bold block mb-0.5">In-Transit / Dispatched:</span>
                Cannot be recalled mid-transit. You can request a 30-day exchange once the package arrives.
              </li>
            </ul>
          </section>

          <section className="border-b border-neutral-900 pb-5">
            <h2 className="text-sm sm:text-base font-inter font-bold uppercase tracking-wider text-white mb-2">
              03. Refund Processing For Prepaid Cancellations
            </h2>
            <p className="text-neutral-400 mb-2.5">
              If payment has been completed, refunds are initiated immediately to the original payment source:
            </p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 font-inter">
              <li>UPI / QR Payments: 24 to 48 banking hours</li>
              <li>Net Banking: 2 to 4 business days</li>
              <li>Credit / Debit Cards: 3 to 7 business days depending on issuing bank</li>
              <li>Cash on Delivery: No charge applied</li>
            </ul>
          </section>

          <section className="pt-1">
            <h2 className="text-sm sm:text-base font-inter font-bold uppercase tracking-wider text-white mb-2">
              04. Cancellation by B2C Exports
            </h2>
            <p className="text-neutral-400">
              We reserve the right to cancel orders in rare instances of unexpected warehouse inventory defects, unserviceable remote delivery pincodes, 
              or failed fraud verification. In such instances, full refunds are processed immediately.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
