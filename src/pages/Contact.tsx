import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-medium text-gray-900 mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Have questions about wholesale pricing or bulk orders? We're here to help!
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gray-900 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Store Address</h3>
                  <p className="text-sm text-gray-600">
                    137 Malwa Mill, Opposite Bank of India<br />
                    Indore, Madhya Pradesh - 452005<br />
                    India
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-gray-900 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Phone / WhatsApp</h3>
                  <p className="text-sm text-gray-600">
                    <a href="tel:+919098178762" className="hover:text-gray-900">+91 9098178762</a><br />
                    <a href="tel:+917489741505" className="hover:text-gray-900">+91 7489741505</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-gray-900 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Email</h3>
                  <p className="text-sm text-gray-600">
                    <a href="mailto:harshjain2904@gmail.com" className="hover:text-gray-900">harshjain2904@gmail.com</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-gray-900 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Business Hours</h3>
                  <p className="text-sm text-gray-600">
                    Monday - Saturday: 10:00 AM - 08:00 PM<br />
                    Sunday: 11:00 AM - 06:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
                  placeholder="+91 XXX XXX XXXX"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
                  placeholder="Tell us about your wholesale requirements..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
