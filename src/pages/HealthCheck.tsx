import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const HealthCheck = () => {
  const [status, setStatus] = useState<any>({
    supabase: 'checking...',
    auth: 'checking...',
    products: 'checking...',
    profiles: 'checking...',
  });

  useEffect(() => {
    const runChecks = async () => {
      const results: any = {};

      // Check Supabase connection
      try {
        results.supabase = '✅ Connected';
      } catch (error) {
        results.supabase = `❌ ${error}`;
      }

      // Check auth
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (error) throw error;
        results.auth = sessionData.session ? `✅ Logged in as ${sessionData.session.user.email}` : '✅ No session (not logged in)';
      } catch (error: any) {
        results.auth = `❌ ${error.message}`;
      }

      // Check products table
      try {
        const { error } = await supabase
          .from('products')
          .select('count')
          .limit(1);
        if (error) throw error;
        results.products = `✅ Products table accessible`;
      } catch (error: any) {
        results.products = `❌ ${error.message}`;
      }

      // Check profiles table
      try {
        const { error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
        if (error) throw error;
        results.profiles = `✅ Profiles table accessible`;
      } catch (error: any) {
        results.profiles = `❌ ${error.message}`;
      }

      setStatus(results);
    };

    runChecks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">System Health Check</h1>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">Supabase Connection</h2>
              <p className="text-gray-700">{status.supabase}</p>
            </div>

            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">Authentication</h2>
              <p className="text-gray-700">{status.auth}</p>
            </div>

            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">Products Table</h2>
              <p className="text-gray-700">{status.products}</p>
            </div>

            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">Profiles Table</h2>
              <p className="text-gray-700">{status.profiles}</p>
            </div>
          </div>

          <div className="mt-8">
            <a href="/" className="text-blue-600 hover:text-blue-700">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};
