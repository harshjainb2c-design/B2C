export const About = () => {
  return (
    <div className="min-h-screen bg-black text-white select-none font-inter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8 border-b border-neutral-800 pb-5">
          <span className="text-xs font-inter font-bold tracking-widest text-neutral-400 uppercase">
            Est. 2018 · Indore
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase mt-1">
            About B2C Exports & Kicks
          </h1>
          <p className="text-xs font-inter text-neutral-400 mt-2">
            Independent streetwear archive, heavyweight silhouettes, and footwear culture.
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-neutral-300 font-inter">
          <section className="p-5 sm:p-6 rounded-2xl bg-neutral-950/50 border border-white/10 space-y-3">
            <h2 className="text-sm sm:text-base font-inter uppercase tracking-wider text-white font-bold">
              The Genesis
            </h2>
            <p className="text-neutral-400 leading-relaxed">
              Founded in 2018 at Malwa Mill, Indore, <strong className="text-white">B2C Exports</strong> was created with a rebellious ambition: 
              to provide unapologetic, authentic oversized streetwear crafted with international heavyweight textile standards. 
              Alongside our apparel line, our sister division <strong className="text-white">B2C Kicks</strong> curates tier-one footwear 
              that completes the modern urban silhouette.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm sm:text-base font-inter uppercase tracking-wider text-white font-bold">
              Our Craft & Ethos
            </h2>
            <p className="text-neutral-400 leading-relaxed">
              We bypass conventional fast-fashion compromises. Each piece in our archive is crafted with custom 240+ GSM combed French Terry, 
              bio-washed for skin softness, pre-shrunk for an enduring boxy drape, and assembled with high-tensile double-needle chain stitching.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-inter">
              <div className="p-4 rounded-xl bg-neutral-950/50 border border-white/10">
                <span className="text-white font-bold block mb-1">240+ GSM Heavyweight</span>
                <p className="text-neutral-400">Dense structure that holds its drape through countless wears.</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950/50 border border-white/10">
                <span className="text-white font-bold block mb-1">Pre-Shrunk Bio Wash</span>
                <p className="text-neutral-400">Zero shape deformation or fabric tightening after laundering.</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950/50 border border-white/10">
                <span className="text-white font-bold block mb-1">Direct-To-Youth Pricing</span>
                <p className="text-neutral-400">Luxury export apparel without the artificial brand markups.</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950/50 border border-white/10">
                <span className="text-white font-bold block mb-1">Nationwide Dispatch</span>
                <p className="text-neutral-400">Indore flagship pickup and 24-48h pan-India air express.</p>
              </div>
            </div>
          </section>

          <section className="p-5 sm:p-6 rounded-2xl bg-neutral-950/50 border border-white/10 space-y-3 text-xs font-inter">
            <h2 className="text-sm sm:text-base uppercase tracking-wider text-white font-bold">
              Flagship Studio Coordinates
            </h2>
            <div className="space-y-1 text-neutral-400">
              <p className="text-white font-semibold">B2C Exports & B2C Kicks</p>
              <p>137 Malwa Mill, Opposite Bank of India</p>
              <p>Indore, Madhya Pradesh - 452005</p>
              <p className="text-neutral-500 pt-1">Mon - Sat: 10:00 AM - 08:00 PM · Sun: 11:00 AM - 06:00 PM</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
