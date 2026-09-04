import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const DiagnosticPage = () => {
  const [results, setResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runDiagnostics = async () => {
    setTesting(true);
    setResults([]);
    
    addResult('🔍 Starting diagnostics...');
    
    // Test 1: Environment variables
    addResult('\n📋 Test 1: Environment Variables');
    const supabaseUrl = __SUPABASE_URL__;
    const supabaseKey = __SUPABASE_ANON_KEY__;
    
    if (supabaseUrl && supabaseKey) {
      addResult(`✅ URL: ${supabaseUrl}`);
      addResult(`✅ Key: ${supabaseKey.substring(0, 20)}...`);
    } else {
      addResult('❌ Missing environment variables!');
      setTesting(false);
      return;
    }
    
    // Test 2: Network connectivity
    addResult('\n🌐 Test 2: Network Connectivity');
    try {
      const response = await fetch(supabaseUrl);
      addResult(`✅ Can reach Supabase (status: ${response.status})`);
    } catch (error) {
      addResult(`❌ Cannot reach Supabase: ${error}`);
    }
    
    // Test 3: Database query
    addResult('\n📊 Test 3: Database Query');
    try {
      const { error } = await supabase.from('products').select('count').limit(1);
      if (error) {
        addResult(`❌ Query failed: ${error.message}`);
      } else {
        addResult('✅ Database query successful');
      }
    } catch (error) {
      addResult(`❌ Query error: ${error}`);
    }
    
    // Test 4: Auth endpoint
    addResult('\n🔐 Test 4: Auth Endpoint');
    try {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        addResult(`❌ Auth endpoint error: ${error.message}`);
      } else {
        addResult('✅ Auth endpoint reachable');
        addResult(`Session: ${session ? 'Active' : 'None'}`);
      }
    } catch (error) {
      addResult(`❌ Auth error: ${error}`);
    }
    
    // Test 5: Sign in with timeout
    addResult('\n🔑 Test 5: Sign In Test (10 second timeout)');
    addResult('Attempting to sign in with user@example.com...');
    
    const startTime = Date.now();
    
    const signInPromise = supabase.auth.signInWithPassword({
      email: 'user@example.com',
      password: 'User123!',
    });
    
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 10000)
    );
    
    try {
      const result = await Promise.race([signInPromise, timeoutPromise]);
      const duration = Date.now() - startTime;
      addResult(`✅ Sign in completed in ${duration}ms`);
      
      if ('error' in result && result.error) {
        addResult(`⚠️ Sign in error: ${result.error.message}`);
      } else if ('data' in result && result.data.user) {
        addResult(`✅ Successfully signed in as: ${result.data.user.email}`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      if (error instanceof Error && error.message === 'Timeout') {
        addResult(`❌ Sign in TIMED OUT after ${duration}ms`);
        addResult('⚠️ This indicates a network or CORS issue');
        addResult('💡 Check:');
        addResult('   1. Is your Supabase project active?');
        addResult('   2. Check browser Network tab for failed requests');
        addResult('   3. Check browser Console for CORS errors');
      } else {
        addResult(`❌ Sign in failed: ${error}`);
      }
    }
    
    addResult('\n✅ Diagnostics complete!');
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">🔧 Supabase Diagnostics</h1>
          
          <button
            onClick={runDiagnostics}
            disabled={testing}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {testing ? 'Running Tests...' : 'Run Diagnostics'}
          </button>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-auto max-h-96">
            {results.length === 0 ? (
              <div className="text-gray-500">Click "Run Diagnostics" to start testing...</div>
            ) : (
              results.map((result, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {result}
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-semibold mb-2">Common Issues:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>If sign in times out: Check Supabase project status and network connection</li>
              <li>If database query fails: Check RLS policies in Supabase</li>
              <li>If auth endpoint fails: Check Supabase project settings</li>
              <li>Check browser Network tab (F12) for failed requests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
