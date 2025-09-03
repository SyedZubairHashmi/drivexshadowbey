export default function TestCSSPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with transparent navbar */}
      <div className="h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">Navbar Test</h1>
          <p className="text-xl">Scroll down to test navbar behavior</p>
          <p className="text-lg mt-2">Navbar should be transparent here</p>
        </div>
      </div>

      {/* Content sections to test scroll behavior */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Navbar Functionality Test</h2>
          
          <div className="space-y-16">
            {/* Cars Section */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Cars Section</h3>
              <p className="text-gray-600 mb-4">
                Test the Cars dropdown menu in the navbar. It should show Cars Collection and Cars Accessories.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-800">Cars Collection</h4>
                  <p className="text-gray-600 text-sm">Navigate to /features/automotive/car-section</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-800">Cars Accessories</h4>
                  <p className="text-gray-600 text-sm">Navigate to /features/automotive/accessories</p>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Products Section</h3>
              <p className="text-gray-600 mb-4">
                Test the Products mega menu. It should show a comprehensive grid of product categories.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-800">Car Accessories</h4>
                  <p className="text-gray-600 text-sm">Seat covers, floor mats, etc.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-800">Interior</h4>
                  <p className="text-gray-600 text-sm">LED lights, organizers, etc.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-800">Exterior</h4>
                  <p className="text-gray-600 text-sm">Wheels, body kits, etc.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-800">Electronics</h4>
                  <p className="text-gray-600 text-sm">Cameras, sensors, etc.</p>
                </div>
              </div>
            </div>

            {/* Other Navigation */}
            <div className="bg-green-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Other Navigation</h3>
              <p className="text-gray-600 mb-4">
                Test the other navigation links: Blog, Gallery, and Contact.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-800">Blog</h4>
                  <p className="text-gray-600 text-sm">Navigate to /features/automotive/blog</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-800">Gallery</h4>
                  <p className="text-gray-600 text-sm">Navigate to /features/automotive/gallery</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-800">Contact</h4>
                  <p className="text-gray-600 text-sm">Navigate to /features/general/contact</p>
                </div>
              </div>
            </div>

            {/* Mobile Testing */}
            <div className="bg-purple-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Mobile Testing</h3>
              <p className="text-gray-600 mb-4">
                Test the mobile menu on smaller screens. The hamburger menu should open a drawer with all navigation options.
              </p>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-800">Mobile Features</h4>
                <ul className="text-gray-600 text-sm space-y-1 mt-2">
                  <li>• Hamburger menu button</li>
                  <li>• Slide-out drawer</li>
                  <li>• Collapsible submenus</li>
                  <li>• Touch-friendly interactions</li>
                  <li>• Proper overlay behavior</li>
                </ul>
              </div>
            </div>

            {/* Responsive Testing */}
            <div className="bg-yellow-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Responsive Testing</h3>
              <p className="text-gray-600 mb-4">
                Test the navbar across different screen sizes. The breakpoint is at lg (1024px).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-800">Desktop (lg+)</h4>
                  <p className="text-gray-600 text-sm">Full horizontal menu with dropdowns</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-800">Mobile/Tablet (&lt;lg)</h4>
                  <p className="text-gray-600 text-sm">Hamburger menu with drawer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final section to test scroll behavior */}
      <div className="h-screen bg-gradient-to-tl from-green-600 via-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Scroll Test Complete</h2>
          <p className="text-xl">Navbar should have dark background here</p>
          <p className="text-lg mt-2">All functionality should work properly</p>
        </div>
      </div>
    </div>
  );
}

