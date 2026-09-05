export const About = () => {
  return (
    <div className="min-h-screen bg-black text-white select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10 border-b border-neutral-800 pb-6">
          <span className="text-[11px] font-mono tracking-[0.24em] text-neutral-400 uppercase">
            Est. 2018 · Indore
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase mt-2">
            About B2C Exports & Kicks
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-2">
            Independent streetwear archive, heavyweight silhouettes, and footwear culture.
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-neutral-300 font-sans">
          <section className="p-6 bg-black border border-neutral-800 space-y-4">
            <h2 className="text-base font-mono uppercase tracking-wider text-white font-bold">
              The Genesis
            </h2>
            <p className="text-neutral-400">
              Founded in 2018 at Malwa Mill, Indore, <strong className="text-white">B2C Exports</strong> was created with a rebellious ambition: 
              to provide unapologetic, authentic oversized streetwear crafted with international heavyweight textile standards. 
              Alongside our apparel line, our sister division <strong className="text-white">B2C Kicks</strong> curates tier-one footwear 
              that completes the modern urban silhouette.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-mono uppercase tracking-wider text-white font-bold">
              Our Craft & Ethos
            </h2>
            <p className="text-neutral-400">
              We bypass conventional fast-fashion compromises. Each piece in our archive is crafted with custom 240+ GSM combed French Terry, 
              bio-washed for skin softness, pre-shrunk for an enduring boxy drape, and assembled with high-tensile double-needle chain stitching.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-4 bg-black border border-neutral-800">
                <span className="text-white font-bold block mb-1">240+ GSM Heavyweight</span>
                <p className="text-neutral-400">Dense structure that holds its drape through countless wears.</p>
              </div>
              <div className="p-4 bg-black border border-neutral-800">
                <span className="text-white font-bold block mb-1">Pre-Shrunk Bio Wash</span>
                <p className="text-neutral-400">Zero shape deformation or fabric tightening after laundering.</p>
              </div>
              <div className="p-4 bg-black border border-neutral-800">
                <span className="text-white font-bold block mb-1">Direct-To-Youth Pricing</span>
                <p className="text-neutral-400">Luxury export apparel without the artificial brand markups.</p>
              </div>
              <div className="p-4 bg-black border border-neutral-800">
                <span className="text-white font-bold block mb-1">Nationwide Dispatch</span>
                <p className="text-neutral-400">Indore flagship pickup and 24-48h pan-India air express.</p>
              </div>
            </div>
          </section>

          <section className="p-6 bg-black border border-neutral-800 space-y-3 text-xs font-mono">
            <h2 className="text-base uppercase tracking-wider text-white font-bold font-sans">
              Flagship Studio Coordinates
            </h2>
            <p className="text-neutral-400">
              <strong className="text-white">Founder:</strong> Harsh Jain
            </p>
            <p className="text-neutral-400">
              <strong className="text-white">Physical Store:</strong> 137 Malwa Mill, Opposite Bank of India, Indore, Madhya Pradesh - 452005
            </p>
            <p className="text-neutral-400">
              <strong className="text-white">Inquiries:</strong> support@b2cstreetwear.com · +91 90981 78762
            </p>
            <p className="text-neutral-400">
              <strong className="text-white">Instagram Community:</strong>{' '}
              <a
                href="https://instagram.com/b2cexports_since_2018"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline underline-offset-4 hover:text-neutral-300"
              >
                @b2cexports_since_2018
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
