export const Privacy = () => {
  return (
    <div className="min-h-screen bg-black text-white select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8 border-b border-neutral-800 pb-6">
          <span className="text-[11px] font-mono tracking-[0.24em] text-neutral-400 uppercase">
            B2C Archive Legal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase mt-2">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-2">
            Effective Date: January 2025 · Indore, India
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-neutral-300 font-sans">
          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              01. Introduction
            </h2>
            <p className="text-neutral-400">
              At B2C Exports & B2C Kicks, we respect your privacy and are committed to safeguarding your personal data. 
              This Privacy Policy explains how we collect, handle, process, and protect your information when accessing our platform.
            </p>
          </section>

          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              02. Information We Collect
            </h2>
            <p className="text-neutral-400 mb-3">We collect details provided directly by you during transactions and interaction:</p>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-400 font-mono text-xs">
              <li>Full name, verified email address, and active mobile contact</li>
              <li>Complete shipping and billing destination coordinates</li>
              <li>Payment details processed via certified gateway encryption</li>
              <li>Order history, size choices, and archive preferences</li>
              <li>Direct customer service correspondence and queries</li>
            </ul>
          </section>

          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              03. How Information Is Utilized
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-400 font-mono text-xs">
              <li>Process, dispatch, and fulfill your apparel and footwear orders</li>
              <li>Communicate real-time shipment milestones and tracking</li>
              <li>Provide dedicated customer and exchange assistance</li>
              <li>Prevent unauthorized transactions and maintain database security</li>
              <li>Analyze streetwear drop interest and optimize catalog performance</li>
            </ul>
          </section>

          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              04. Third-Party Sharing
            </h2>
            <p className="text-neutral-400 mb-3">
              We never sell or monetize user data. Information is shared strictly on an operational need-to-know basis with:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-400 font-mono text-xs">
              <li>Logistics and courier partners (Shiprocket, Bluedart, Delhivery)</li>
              <li>Secure automated payment processors</li>
              <li>Technical infrastructure and database providers</li>
              <li>Legal authorities when mandatory under Indian jurisdiction</li>
            </ul>
          </section>

          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              05. Data Security
            </h2>
            <p className="text-neutral-400">
              We deploy SSL/TLS encryption protocols, authenticated session tokens, and strict access controls across all infrastructure 
              to guard against unauthorized access, alterations, or disclosures.
            </p>
          </section>

          <section className="border-b border-neutral-900 pb-6">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              06. User Rights & Data Requests
            </h2>
            <p className="text-neutral-400 mb-2">You retain the right to:</p>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-400 font-mono text-xs">
              <li>Review your stored personal profile data</li>
              <li>Update or correct address and contact records</li>
              <li>Request permanent account and history deletion</li>
              <li>Opt-out of any promotional or notification channels</li>
            </ul>
          </section>

          <section className="pt-2">
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3 font-semibold">
              07. Contact & Grievance Officer
            </h2>
            <div className="bg-black border border-neutral-800 p-5 text-xs font-mono space-y-1.5 text-neutral-400">
              <p className="text-white font-bold">B2C Exports Studio</p>
              <p>137 Malwa Mill, Opposite Bank of India</p>
              <p>Indore, Madhya Pradesh - 452005</p>
              <p>Email: support@b2cstreetwear.com · Phone: +91 90981 78762</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
