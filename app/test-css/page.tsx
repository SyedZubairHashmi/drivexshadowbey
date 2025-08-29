export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">CSS Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tailwind CSS Test</h2>
          <p className="text-gray-600 mb-4">
            If you can see this styled text, Tailwind CSS is working properly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-500 text-white p-4 rounded-lg">
              <h3 className="font-bold">Blue Card</h3>
              <p>This should be blue with white text</p>
            </div>
            
            <div className="bg-green-500 text-white p-4 rounded-lg">
              <h3 className="font-bold">Green Card</h3>
              <p>This should be green with white text</p>
            </div>
            
            <div className="bg-red-500 text-white p-4 rounded-lg">
              <h3 className="font-bold">Red Card</h3>
              <p>This should be red with white text</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Button Test</h2>
          <div className="space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Primary Button
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Secondary Button
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Danger Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

