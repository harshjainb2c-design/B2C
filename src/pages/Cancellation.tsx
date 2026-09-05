export const Cancellation = () => {
  return (
    <div className="min-h-screen bg-black text-white select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8 border-b border-neutral-800 pb-6">
          <span className="text-[11px] font-mono tracking-[0.24em] text-neutral-400 uppercase">
            B2C Archive Policy
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase mt-2">
            Cancellation Policy
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-2">
            Last Updated: January 2025 · Indore, India
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-neutral-300 font-sans">
          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              01. Order Cancellation Window
            </h2>
            <p className="text-neutral-400">
              Orders can be cancelled free of cost before warehouse dispatch. Once a parcel has been handed to our express courier partner, 
              cancellation is locked and our standard exchange policy applies upon delivery.
            </p>
          </section>

          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              02. Cancellation Stages
            </h2>
            <ul className="space-y-3 text-xs font-mono text-neutral-400">
              <li className="p-3.5 bg-black border border-neutral-800">
                <span className="text-white font-bold block mb-1">Pre-Dispatch (Within 2-4 Hours):</span>
                Instant cancellation available from your Orders dashboard or via direct WhatsApp concierge.
              </li>
              <li className="p-3.5 bg-black border border-neutral-800">
                <span className="text-white font-bold block mb-1">Processing Stage:</span>
                Contact support immediately (+91 90981 78762) to intercept packing prior to label generation.
              </li>
              <li className="p-3.5 bg-black border border-neutral-800">
                <span className="text-white font-bold block mb-1">In-Transit / Dispatched:</span>
                Cannot be recalled mid-transit. You can request a 30-day exchange once the package arrives.
              </li>
            </ul>
          </section>

          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              03. Refund Processing For Prepaid Cancellations
            </h2>
            <p className="text-neutral-400 mb-3">
              If payment has been completed, refunds are initiated immediately to the original payment source:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-400 font-mono text-xs">
              <li>UPI / QR Payments: 24 to 48 banking hours</li>
              <li>Net Banking: 2 to 4 business days</li>
              <li>Credit / Debit Cards: 3 to 7 business days depending on issuing bank</li>
              <li>Cash on Delivery: No charge applied</li>
            </ul>
          </section>

          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              04. Partial Cancellations
            </h2>
            <p className="text-neutral-400">
              For multi-piece orders, individual items can be cancelled before packing. The proportional value and applicable taxes 
              are credited back to your account without affecting the rest of your order.
            </p>
          </section>

          <section className="pt-2">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              05. Support Concierge
            </h2>
            <div className="bg-black border border-neutral-800 p-5 text-xs font-mono space-y-1.5 text-neutral-400">
              <p className="text-white font-bold">B2C Customer Assistance</p>
              <p>WhatsApp / Call: +91 90981 78762 · +91 74897 41505</p>
              <p>Email: support@b2cstreetwear.com</p>
              <p>Hours: Monday to Saturday, 10:00 AM – 8:00 PM</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
