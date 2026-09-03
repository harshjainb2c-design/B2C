export const Shipping = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-medium text-gray-900 mb-6">Shipping Policy</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Delivery Areas</h2>
            <p className="text-gray-600 mb-4">
              We currently deliver to Indore and surrounding areas in Madhya Pradesh. 
              For deliveries outside Indore, please contact us for availability and shipping charges.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Delivery Time</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li><strong>Within Indore:</strong> 1-2 business days</li>
              <li><strong>Nearby areas:</strong> 3-5 business days</li>
              <li><strong>Bulk orders:</strong> Delivery time may vary based on order size</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Orders placed before 2:00 PM are typically processed the same day. 
              Orders placed after 2:00 PM will be processed the next business day.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Shipping Charges</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Orders above ₹2,000: <strong>Free delivery</strong> within Indore</li>
              <li>Orders below ₹2,000: ₹50 delivery charge within Indore</li>
              <li>Outside Indore: Charges vary based on location (contact us for details)</li>
              <li>Bulk/Wholesale orders: Special rates available - contact us for details</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Order Tracking</h2>
            <p className="text-gray-600 mb-4">
              Once your order is shipped, you'll receive a confirmation email with tracking details. 
              You can also track your order status by logging into your account and visiting the Orders page.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Delivery Process</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Order confirmation via email/SMS</li>
              <li>Order processing and packaging</li>
              <li>Dispatch notification with tracking details</li>
              <li>Delivery to your specified address</li>
              <li>Signature required upon delivery</li>
            </ol>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Failed Delivery</h2>
            <p className="text-gray-600 mb-4">
              If delivery fails due to incorrect address or unavailability, our delivery partner will attempt 
              delivery again. After 2 failed attempts, the order will be returned to our warehouse. 
              Re-delivery charges may apply.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Bulk Orders</h2>
            <p className="text-gray-600 mb-4">
              For wholesale and bulk orders, we offer flexible delivery options. 
              Contact us at <a href="mailto:harshjain2904@gmail.com" className="text-blue-600 hover:underline">harshjain2904@gmail.com</a> or 
              <a href="tel:+919098178762" className="text-blue-600 hover:underline"> +91 9098178762</a> to discuss your requirements.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Questions?</h2>
            <p className="text-gray-600">
              For any shipping-related queries, please contact our customer service team:
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Email:</strong> <a href="mailto:harshjain2904@gmail.com" className="text-blue-600 hover:underline">harshjain2904@gmail.com</a><br />
              <strong>Phone/WhatsApp:</strong> <a href="tel:+919098178762" className="text-blue-600 hover:underline">+91 9098178762</a>, <a href="tel:+917489741505" className="text-blue-600 hover:underline">+91 7489741505</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
