export const Cancellation = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-medium text-gray-900 mb-6">Cancellation Policy</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Order Cancellation</h2>
            <p className="text-gray-600 mb-4">
              We understand that plans change. You can cancel your order before it's shipped without any charges.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">When Can I Cancel?</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li><strong>Before Processing:</strong> Cancel anytime before order is processed (usually within 2 hours of placing order)</li>
              <li><strong>During Processing:</strong> Contact us immediately - we'll try our best to cancel if not yet shipped</li>
              <li><strong>After Shipping:</strong> Cannot be cancelled, but you can return after delivery (see Returns Policy)</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">How to Cancel</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Log in to your account and go to Orders page</li>
              <li>Find the order you want to cancel</li>
              <li>Click "Cancel Order" button (if available)</li>
              <li>Select cancellation reason and confirm</li>
            </ol>
            <p className="text-gray-600 mb-4">
              Alternatively, you can contact our customer service at support@b2c.com or +91 731 XXX XXXX
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Refund for Cancelled Orders</h2>
            <p className="text-gray-600 mb-4">
              If you've already made payment, the refund will be processed within 5-7 business days to your original payment method.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Credit/Debit Card: 5-7 business days</li>
              <li>UPI/Net Banking: 3-5 business days</li>
              <li>Cash on Delivery: No refund needed</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Partial Cancellation</h2>
            <p className="text-gray-600 mb-4">
              For orders with multiple items, you can cancel individual items before the order is shipped. 
              Refund will be processed for the cancelled items only.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Bulk Orders</h2>
            <p className="text-gray-600 mb-4">
              For wholesale and bulk orders, cancellation terms may vary. 
              Please contact us directly to discuss cancellation of bulk orders.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Seller Cancellation</h2>
            <p className="text-gray-600 mb-4">
              In rare cases, we may need to cancel your order due to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Product unavailability</li>
              <li>Pricing errors</li>
              <li>Delivery area restrictions</li>
              <li>Technical issues</li>
            </ul>
            <p className="text-gray-600 mb-4">
              In such cases, you'll be notified immediately and full refund will be processed.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Questions?</h2>
            <p className="text-gray-600">
              For any questions about order cancellation, please contact us at support@b2c.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
