"use client";

import { useState } from "react";

export default function DebugAPIPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const testData = {
        name: "Debug Test Investor",
        contactNumber: "+1234567890",
        emailAddress: "debug@example.com",
        investorId: "DEBUG123",
        investAmount: 100000,
        percentageShare: 25,
        amountPaid: 50000,
        remainingAmount: 50000,
        paymentDate: new Date().toISOString(),
        batchNo: "Batch01",
        paymentMethod: {
          type: "Cash",
          details: {}
        }
      };

      console.log('Testing with data:', testData);

      const response = await fetch('/api/investors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('Raw response status:', response.status);
      console.log('Raw response headers:', response.headers);

      const data = await response.json();
      console.log('Parsed response data:', data);
      
      setResult({
        status: response.status,
        ok: response.ok,
        data: data,
        success: data.success,
        hasError: data.success === false
      });
    } catch (error) {
      console.error('Test failed:', error);
      setResult({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        type: 'catch_error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">API Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Debug API Response</h2>
          
          <button 
            onClick={testAPI}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API'}
          </button>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-bold mb-2">Debug Result:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

