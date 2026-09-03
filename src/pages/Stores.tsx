import { MapPin, Phone, Clock } from 'lucide-react';

export const Stores = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-medium text-gray-900 mb-6">Our Store</h1>
        
        <div className="max-w-3xl">
          <p className="text-gray-600 mb-8">
            Visit our wholesale store in Indore for the best deals and personalized service.
          </p>
          
          <div className="border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">B2C Wholesaler - Indore</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-900 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Address</p>
                  <p className="text-sm text-gray-600">
                    Indore, Madhya Pradesh<br />
                    India
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-900 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Phone</p>
                  <p className="text-sm text-gray-600">+91 731 XXX XXXX</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-900 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Business Hours</p>
                  <p className="text-sm text-gray-600">
                    Monday - Saturday: 10:00 AM - 07:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Visit Us</h3>
            <p className="text-sm text-gray-600">
              Walk-ins are welcome! For bulk orders, we recommend calling ahead to ensure product availability 
              and to discuss special wholesale pricing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
