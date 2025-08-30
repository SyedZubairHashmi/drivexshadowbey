"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainLayout } from "@/components/layout/main-layout"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, ChevronRight, Home, Settings, User, Bell, LogOut, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { userAPI } from "@/lib/api"

interface UserProfile {
  _id: string;
  firstName: string;
  secondName: string;
  email: string;
  city: string;
  country: string;
  pin: string;
  confirmPin: string;
  recoveryEmail: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string>("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    city: "",
    country: "",
    enterPin: "",
    confirmPin: "",
    recoveryEmail: "",
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Validation function
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Required field validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.secondName.trim()) {
      newErrors.secondName = "Second name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // PIN validation
    if (formData.enterPin && formData.enterPin.length < 4) {
      newErrors.enterPin = "PIN must be at least 4 characters long";
    }
    if (formData.enterPin && formData.confirmPin && formData.enterPin !== formData.confirmPin) {
      newErrors.confirmPin = "PINs do not match";
    }

    // Recovery email validation
    if (formData.recoveryEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recoveryEmail)) {
      newErrors.recoveryEmail = "Please enter a valid recovery email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create a test user if none exists
  const createTestUser = async () => {
    try {
      const testUserData = {
        firstName: "Admin",
        secondName: "User",
        email: "admin@drivexdeal.com",
        city: "Karachi",
        country: "Pakistan",
        pin: "1234",
        confirmPin: "1234",
        recoveryEmail: "admin@drivexdeal.com"
      };

      const response = await userAPI.create(testUserData);
      
      if (response.success) {
        setUserId(response.data._id);
        setUser(response.data);
        
        // Don't populate form with test user data - keep fields empty
        setFormData({
          firstName: "",
          secondName: "",
          email: "",
          city: "",
          country: "",
          enterPin: "",
          confirmPin: "",
          recoveryEmail: "",
        });
        
        toast({
          title: "Success",
          description: "Test user created successfully"
        });
      } else {
        console.error("Failed to create test user:", response.error);
      }
    } catch (error: any) {
      console.error("Error creating test user:", error);
    }
  };

  // Load user data
  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // First, try to get all users to see if any exist
      const usersResponse = await userAPI.getAll({ limit: 1 });
      
      if (usersResponse.success && usersResponse.data.length > 0) {
        // Use the first user found
        const firstUser = usersResponse.data[0];
        setUserId(firstUser._id);
        
        // Now get the full user data
        const response = await userAPI.getById(firstUser._id);
        
        if (response.success) {
          const userData = response.data;
          setUser(userData);
          
          // Populate form with existing user data
          setFormData({
            firstName: userData.firstName || "",
            secondName: userData.secondName || "",
            email: userData.email || "",
            city: userData.city || "",
            country: userData.country || "",
            enterPin: "",
            confirmPin: "",
            recoveryEmail: userData.recoveryEmail || "",
          });
          
          // Log current PIN for debugging (remove in production)
          console.log("Current user PIN:", userData.pin ? "***" : "Not set");
        } else {
          console.error("Failed to load user:", response.error);
          // Create a test user if loading fails
          await createTestUser();
        }
      } else {
        // No users exist, create a test user
        console.log("No users found, creating test user...");
        await createTestUser();
      }
    } catch (error: any) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while loading profile",
        variant: "destructive"
      });
      
      // Try to create a test user as fallback
      await createTestUser();
    } finally {
      setLoading(false);
    }
  };

  // Save profile settings
  const saveProfile = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Error",
        description: "No user ID available. Please refresh the page.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        firstName: formData.firstName.trim(),
        secondName: formData.secondName.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        country: formData.country.trim(),
        recoveryEmail: formData.recoveryEmail.trim() || undefined,
      };
      
      console.log("Updating user with ID:", userId);
      console.log("Update data:", updateData);
      
      const response = await userAPI.update(userId, updateData);

      if (response.success) {
        setUser(response.data);
        
        // Show alert message
        alert("Settings saved successfully!");
        
        // Empty all input fields after successful save
        setFormData({
          firstName: "",
          secondName: "",
          email: "",
          city: "",
          country: "",
          enterPin: "",
          confirmPin: "",
          recoveryEmail: "",
        });
        
        // Clear any errors
        setErrors({});
        
        toast({
          title: "Success",
          description: "Profile updated successfully"
        });
      } else {
        console.error("Update failed:", response.error);
        toast({
          title: "Error",
          description: response.error || "Failed to update profile",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Save security pin
  const saveSecurityPin = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "No user ID available. Please refresh the page.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.enterPin.trim()) {
      setErrors({ enterPin: "PIN is required" });
      toast({
        title: "Error",
        description: "PIN is required",
        variant: "destructive"
      });
      return;
    }

    if (formData.enterPin.length < 4) {
      setErrors({ enterPin: "PIN must be at least 4 characters long" });
      toast({
        title: "Error",
        description: "PIN must be at least 4 characters long",
        variant: "destructive"
      });
      return;
    }

    if (formData.enterPin !== formData.confirmPin) {
      setErrors({ confirmPin: "PINs do not match" });
      toast({
        title: "Error",
        description: "PINs do not match",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      
      console.log("Updating PIN for user:", userId, "New PIN:", formData.enterPin);
      
      const response = await userAPI.update(userId, {
        pin: formData.enterPin,
        confirmPin: formData.confirmPin
      });

      if (response.success) {
        // Update the user state with new PIN
        if (user) {
          setUser({
            ...user,
            pin: formData.enterPin,
            confirmPin: formData.confirmPin
          });
        }
        
        // Clear PIN fields after successful save
        setFormData(prev => ({
          ...prev,
          enterPin: "",
          confirmPin: ""
        }));
        setErrors({});
        
        toast({
          title: "Success",
          description: "Security PIN updated successfully! You can now use this PIN to access secure information."
        });
      } else {
        console.error("PIN update failed:", response.error);
        toast({
          title: "Error",
          description: response.error || "Failed to update security PIN",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error updating security PIN:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating security PIN",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Reset security pin
  const resetSecurityPin = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "No user ID available. Please refresh the page.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      
      const response = await userAPI.update(userId, {
        pin: "",
        confirmPin: ""
      });

      if (response.success) {
        setFormData(prev => ({
          ...prev,
          enterPin: "",
          confirmPin: ""
        }));
        setErrors({});
        toast({
          title: "Success",
          description: "Security PIN reset successfully"
        });
      } else {
        console.error("PIN reset failed:", response.error);
        toast({
          title: "Error",
          description: response.error || "Failed to reset security PIN",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error resetting security PIN:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while resetting security PIN",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading profile...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 gap-5 mt-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-lg">
          <span>Settings</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Profile Settings</span>
        </div>

        {/* Debug Info */}
        {userId && (
          <div className="text-xs text-gray-500">
            {/* User ID: {userId} */}
          </div>
        )}

        {/* Form Container */}
        <div className="flex max-w-full items-start gap-5 mr-8">
          <Card className="overflow-hidden flex-1 border-0 shadow-none bg-transparent">
            <div className="flex">
              {/* Left Profile Section */}
              <div className="w-80 pl-3 pr-3 bg-white">

                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="w-28 h-28 border-0 shadow-none">
                      <AvatarImage
                        src={user?.image || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/setting.PNG-ITZDSniVv3RJYHvsUU1aKz6igsT5NP.png"}
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-green-600 text-white text-xl border-0">
                        {`${user?.firstName?.[0] || ''}${user?.secondName?.[0] || ''}`.toUpperCase() || 'RA'}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-black hover:bg-gray-800 p-0 border-0"
                    >
                      <Edit className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {user ? `${user.firstName} ${user.secondName}` : "Romail Ahmed"}
                  </h2>
                  <p className="text-sm text-muted-foreground">{user?.email || "romail.ahmed120@gmail.com"}</p>
                </div>
              </div>

              {/* Right Form Section */}
              <div className="flex-1 relative">
                <div className="pl-5">
                  <div className="space-y-5">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1 flex flex-col">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className={`bg-white border-0 shadow-none ${errors.firstName ? 'border-red-500' : ''}`}
                          style={{
                            borderRadius: "8px",
                            border: errors.firstName ? "1px solid #EF4444" : "1px solid #D1D5DB",
                            background: "#FFF",
                            boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                            display: "flex",
                            height: "42px",
                            padding: "10px 12px",
                            alignItems: "center",
                            gap: "12px",
                            alignSelf: "stretch",
                          }}
                        />
                        {errors.firstName && (
                          <p className="text-xs text-red-500">{errors.firstName}</p>
                        )}
                      </div>
                      <div className="space-y-1 flex flex-col">
                        <Label htmlFor="secondName" className="text-sm font-medium">
                          Second Name
                        </Label>
                        <Input
                          id="secondName"
                          value={formData.secondName}
                          onChange={(e) => handleInputChange("secondName", e.target.value)}
                          className={`bg-white border-0 shadow-none ${errors.secondName ? 'border-red-500' : ''}`}
                          style={{
                            borderRadius: "8px",
                            border: errors.secondName ? "1px solid #EF4444" : "1px solid #D1D5DB",
                            background: "#FFF",
                            boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                            display: "flex",
                            height: "42px",
                            padding: "10px 12px",
                            alignItems: "center",
                            gap: "12px",
                            alignSelf: "stretch",
                          }}
                        />
                        {errors.secondName && (
                          <p className="text-xs text-red-500">{errors.secondName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1 flex flex-col">
                        <Label htmlFor="email" className="text-sm font-medium">
                          email
                        </Label>
                      <Input
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`bg-white border-0 shadow-none ${errors.email ? 'border-red-500' : ''}`}
                        style={{
                            display: "flex" ,
                            height: "42px",
                            padding: "10px 12px",
                            alignItems: "center",
                            gap: "12px",
                            alignSelf: "stretch",
                            borderRadius: "8px",
                            border: errors.email ? "1px solid #EF4444" : "1px solid #D1D5DB",
                            background: "#FFF",
                            boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                          }}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Location Fields */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1 flex flex-col">
                        <Label htmlFor="city" className="text-sm font-medium">
                          City
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="bg-white border-0 shadow-none"
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #D1D5DB",
                            background: "#FFF",
                            boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                            display: "flex",
                            height: "42px",
                            padding: "10px 12px",
                            alignItems: "center",
                            gap: "12px",
                            alignSelf: "stretch",
                          }}
                        />
                      </div>
                      <div className="space-y-1 flex flex-col">
                        <Label htmlFor="country" className="text-sm font-medium">
                          Country
                        </Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => handleInputChange("country", e.target.value)}
                          className="bg-white border-0 shadow-none"
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #D1D5DB",
                            background: "#FFF",
                            boxShadow: "0 1px 2px 0 r  gba(16, 24, 40, 0.05)",
                            display: "flex",
                            height: "42px",
                            padding: "10px 12px",
                            alignItems: "center",
                            gap: "12px",
                            alignSelf: "stretch",
                          }}
                        />
                      </div>
                    </div>

                    {/* Pin Fields */}
                    <div className="space-y-4 w-ful">
                      <div className="space-y-1 w-full" >
                        <Label htmlFor="enterPin" className="text-sm font-medium">
                          Enter Pin
                        </Label>
                        <div className="relative">
                          <Input
                            id="enterPin"
                            value={formData.enterPin}
                            onChange={(e) => handleInputChange("enterPin", e.target.value)}
                            className={`bg-white w-full border-0 shadow-none ${errors.enterPin ? 'border-red-500' : ''}`}
                            type="password"
                            placeholder="Enter your new PIN (min 4 characters)"
                            maxLength={6}
                            style={{
                                display: "flex" ,
                                height: "42px",
                                padding: "10px 12px",
                                alignItems: "center",
                                gap: "12px",
                                alignSelf: "stretch",
                                borderRadius: "8px",
                                border: errors.enterPin ? "1px solid #EF4444" : "1px solid #D1D5DB",
                                background: "#FFF",
                                boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                              }}
                          />
                          <Badge
                            variant="secondary"
                            className="absolute -top-2 left-2 bg-green-500 text-white text-xs px-1 border-0"
                          >
                            PIN
                          </Badge>
                        </div>
                        {errors.enterPin && (
                          <p className="text-xs text-red-500">{errors.enterPin}</p>
                        )}
                        {user?.pin && (
                          <p className="text-xs text-gray-500">
                            Current PIN: {user.pin.replace(/./g, '*')} (Click "Set Security Pin" to update)
                          </p>
                        )}
                      </div>

                      <div className="space-y-1 flex flex-col">
                        <Label htmlFor="confirmPin" className="text-sm font-medium">
                          Confirm Pin
                        </Label>
                        <Input
                          id="confirmPin"
                          value={formData.confirmPin}
                          onChange={(e) => handleInputChange("confirmPin", e.target.value)}
                          className={`bg-white border-0 shadow-none ${errors.confirmPin ? 'border-red-500' : ''}`}
                          type="password"
                          placeholder="Confirm your new PIN"
                          maxLength={6}
                          style={{
                            display: "flex" ,
                            height: "42px",
                            padding: "10px 12px",
                            alignItems: "center",
                            gap: "12px",
                            alignSelf: "stretch",
                            borderRadius: "8px",
                            border: errors.confirmPin ? "1px solid #EF4444" : "1px solid #D1D5DB",
                            background: "#FFF",
                            boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                          }}
                        />
                        {errors.confirmPin && (
                          <p className="text-xs text-red-500">{errors.confirmPin}</p>
                        )}
                      </div>
                    </div>

                    {/* Recovery Email */}
                    <div className="space-y-1 flex flex-col">
                      <Label htmlFor="recoveryEmail" className="text-sm font-medium">
                        Recovery Email
                      </Label>
                      <Input
                        id="recoveryEmail"
                        value={formData.recoveryEmail}
                        onChange={(e) => handleInputChange("recoveryEmail", e.target.value)}
                        className={`bg-white border-0 shadow-none ${errors.recoveryEmail ? 'border-red-500' : ''}`}
                        style={{
                            display: "flex" ,
                            height: "42px",
                            padding: "10px 12px",
                            alignItems: "center",
                            gap: "12px",
                            alignSelf: "stretch",
                            borderRadius: "8px",
                            border: errors.recoveryEmail ? "1px solid #EF4444" : "1px solid #D1D5DB",
                            background: "#FFF",
                            boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                          }}
                      />
                      {errors.recoveryEmail && (
                        <p className="text-xs text-red-500">{errors.recoveryEmail}</p>
                      )}
                      <p className="text-xs text-muted-foreground">Security Pin help to protect your data.</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 ">
                      <Button 
                        onClick={saveSecurityPin}
                        disabled={saving}
                        className="flex-1 bg-[#00674F] hover:bg-[#00674F] text-white rounded-xl border-0"
                      >
                        {saving ? "Saving..." : "Set Security Pin"}
                      </Button>
                      <Button 
                        onClick={resetSecurityPin}
                        disabled={saving}
                        variant="outline" 
                        className="flex-1 bg-black text-white border-black rounded-xl"
                      >
                        {saving ? "Resetting..." : "Reset Security Pin"}
                      </Button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end mt-8">
                    <Button 
                      onClick={saveProfile}
                      disabled={saving}
                      className="bg-[#00674F] hover:bg-[#00674F] text-white px-8 rounded-xl border-0"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save Setting"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}