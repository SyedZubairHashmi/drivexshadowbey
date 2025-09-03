"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SuccessPopupCard from "@/components/ui/success-popup-card";

export default function TestSuccessPopupPage() {
  const [showCarSuccess, setShowCarSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Success Popup Card Demo</h1>
        <div className="max-w-md mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Car Added Success</h2>
            <p className="text-gray-600 mb-4">
              Shows success message when a car is added to inventory
            </p>
            <Button
              onClick={() => setShowCarSuccess(true)}
              className="w-full"
            >
              Show Car Success
            </Button>
          </div>
        </div>

        {/* Success Popup Card */}
        <SuccessPopupCard
          heading="Car Added Successfully"
          message="You have successfully added a new car to the inventory"
          isOpen={showCarSuccess}
          onClose={() => setShowCarSuccess(false)}
        />
      </div>
    </div>
  );
}
