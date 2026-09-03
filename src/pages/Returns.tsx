export const Returns = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-medium text-gray-900 mb-6">Returns & Exchange Policy</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Return Policy</h2>
            <p className="text-gray-600 mb-4">
              At B2C, we want you to be completely satisfied with your purchase. If you're not happy with your order, 
              we offer a 7-day return policy for eligible items.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Eligibility</h2>
            <p className="text-gray-600 mb-2">To be eligible for a return, items must:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Be unused and in the same condition as received</li>
              <li>Have original tags and packaging intact</li>
              <li>Be returned within 7 days of delivery</li>
              <li>Include proof of purchase (invoice/receipt)</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Non-Returnable Items</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Items marked as final sale or clearance</li>
              <li>Customized or personalized products</li>
              <li>Items damaged due to misuse</li>
              <li>Products without original packaging</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Exchange Policy</h2>
            <p className="text-gray-600 mb-4">
              We offer exchanges for defective or damaged items within 7 days of delivery. 
              Please contact our customer service team with photos of the defective item.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">How to Return</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Contact our customer service at support@b2c.com or +91 731 XXX XXXX</li>
              <li>Provide your order number and reason for return</li>
              <li>Pack the item securely with all original packaging</li>
              <li>Ship to our Indore warehouse (address will be provided)</li>
            </ol>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Refund Process</h2>
            <p className="text-gray-600 mb-4">
              Once we receive and inspect your return, we'll process your refund within 5-7 business days. 
              Refunds will be issued to the original payment method.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Questions?</h2>
            <p className="text-gray-600">
              If you have any questions about our return policy, please contact us at support@b2c.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
