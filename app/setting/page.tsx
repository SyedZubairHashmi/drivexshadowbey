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
import { companyAPI } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

interface CompanyProfile {
  _id: string;
  ownerName: string;
  companyName: string;
  companyEmail: string;
  password: string;
  pin: string;
  recoveryEmail: string;
  role: 'company';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    ownerName: "",
    companyName: "",
    companyEmail: "",
    password: "",
    confirmPassword: "",
    enterPin: "",
    confirmPin: "",
    recoveryEmail: "",
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Validation function
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Required field validation
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = "Company email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = "Please enter a valid email address";
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

  // Fetch company data
  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      
      if (!user || user.role !== 'company') {
        console.error("No company user found");
        setLoading(false);
        return;
      }

      // Fetch company data using the logged-in user's ID
      const response = await companyAPI.getById(user._id);
      
      if (response.success) {
        setCompany(response.data);
        setFormData({
          ownerName: response.data.ownerName || "",
          companyName: response.data.companyName || "",
          companyEmail: response.data.companyEmail || "",
          password: "",
          confirmPassword: "",
          enterPin: "",
          confirmPin: "",
          recoveryEmail: response.data.recoveryEmail || "",
        });
      } else {
        console.error("Failed to fetch company data:", response.error);
        toast({
          title: "Error",
          description: "Failed to load company data",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error fetching company data:", error);
      toast({
        title: "Error",
        description: "An error occurred while loading company data",
        variant: "destructive"
      });
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

    if (!user || user.role !== 'company') {
      toast({
        title: "Error",
        description: "No company user found. Please login as a company.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      
      const updateData: any = {
        ownerName: formData.ownerName.trim(),
        companyName: formData.companyName.trim(),
        companyEmail: formData.companyEmail.trim(),
        recoveryEmail: formData.recoveryEmail.trim() || undefined,
      };

      // Add password if provided
      if (formData.password.trim()) {
        updateData.password = formData.password.trim();
      }
      
      console.log("Updating company with ID:", user._id);
      console.log("Update data:", updateData);
      
      const response = await companyAPI.update(user._id, updateData);

      if (response.success) {
        // Update local company state
        setCompany(response.data);
        
        // Show alert message
        alert("Settings saved successfully!");
        
        // Clear password fields after successful save
        setFormData(prev => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
        
        // Clear any errors
        setErrors({});
        
        toast({
          title: "Success",
          description: "Company profile updated successfully"
        });
      } else {
        console.error("Update failed:", response.error);
        toast({
          title: "Error",
          description: response.error || "Failed to update company profile",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error updating company profile:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating company profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Save security pin
  const saveSecurityPin = async () => {
    if (!user || user.role !== 'company') {
      toast({
        title: "Error",
        description: "No company user found. Please login as a company.",
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
      
      const newPin = formData.enterPin.trim();
      console.log("=== PIN UPDATE DEBUG ===");
      console.log("Company ID:", user._id);
      console.log("New PIN:", newPin);
      console.log("Confirm PIN:", formData.confirmPin);
      
      // First, let's check what the current company data looks like
      const currentCompanyResponse = await companyAPI.getById(user._id);
      console.log("Current company data before update:", currentCompanyResponse);
      
      // Now update the PIN
      const updateData = {
        pin: newPin
      };
      
      console.log("Sending update data:", updateData);
      console.log("Company email before update:", company?.companyEmail);
      console.log("Company recoveryEmail before update:", company?.recoveryEmail);
      
      const response = await companyAPI.update(user._id, updateData);
      
      console.log("PIN update response:", response);

      if (response.success) {
        console.log("PIN update successful! New company data:", response.data);
        
        // Update the local company state immediately
        if (company) {
          setCompany({
            ...company,
            pin: newPin
          });
        }
        
        // Clear PIN fields after successful save
        setFormData(prev => ({
          ...prev,
          enterPin: "",
          confirmPin: ""
        }));
        setErrors({});
        
        // Show alert message
        alert(`Security PIN updated successfully to: ${newPin}`);
        
        toast({
          title: "Success",
          description: `Security PIN updated successfully to: ${newPin}`
        });
        
        // Force a re-render by updating a timestamp
        setCompany(prev => prev ? { ...prev, updatedAt: new Date().toISOString() } : null);
        
        // Test: Try to verify the PIN was saved by making a test login request
        console.log("Testing PIN update with login API...");
        try {
          const testResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: company?.companyEmail || user?.companyEmail, 
              password: newPin 
            }),
          });
          const testData = await testResponse.json();
          console.log("Test login response:", testData);
          if (testData.success) {
            console.log("✅ PIN update verified - can login with new PIN!");
          } else {
            console.log("❌ PIN update failed - cannot login with new PIN:", testData.error);
          }
        } catch (testError) {
          console.error("Test login error:", testError);
        }
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
    if (!user || user.role !== 'company') {
      toast({
        title: "Error",
        description: "No company user found. Please login as a company.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      
      console.log("=== RESET PIN DEBUG ===");
      console.log("Resetting PIN for company:", user._id);
      
      const response = await companyAPI.update(user._id, {
        pin: ""
      });

      if (response.success) {
        console.log("PIN reset successful! New company data:", response.data);
        
        // Update the local company state immediately
        if (company) {
          setCompany({
            ...company,
            pin: ""
          });
        }
        
        setFormData(prev => ({
          ...prev,
          enterPin: "",
          confirmPin: ""
        }));
        setErrors({});
        
        // Show alert message
        alert("Security PIN reset successfully");
        
        toast({
          title: "Success",
          description: "Security PIN reset successfully"
        });
        
        // Force a re-render
        setCompany(prev => prev ? { ...prev, updatedAt: new Date().toISOString() } : null);
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

  // Load company data on component mount
  useEffect(() => {
    fetchCompanyData();
  }, [user]);

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
        {user && (
          <div className="text-xs text-gray-500">
            {/* Company ID: {user._id} */}
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
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/setting.PNG-ITZDSniVv3RJYHvsUU1aKz6igsT5NP.png"
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-green-600 text-white text-xl border-0">
                        {`${company?.ownerName?.[0] || ''}${company?.companyName?.[0] || ''}`.toUpperCase() || 'CO'}
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
                    {company ? `${company.ownerName} - ${company.companyName}` : "Company Profile"}
                  </h2>
                  <p className="text-sm text-muted-foreground">{company?.companyEmail || "company@example.com"}</p>
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
                          Owner Name
                        </Label>
                        <Input
                          id="ownerName"
                          value={formData.ownerName}
                          onChange={(e) => handleInputChange("ownerName", e.target.value)}
                          className={`bg-white border-0 shadow-none ${errors.ownerName ? 'border-red-500' : ''}`}
                          style={{
                            borderRadius: "8px",
                            border: errors.ownerName ? "1px solid #EF4444" : "1px solid #D1D5DB",
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
                        {errors.ownerName && (
                          <p className="text-xs text-red-500">{errors.ownerName}</p>
                        )}
                      </div>
                      <div className="space-y-1 flex flex-col">
                        <Label htmlFor="secondName" className="text-sm font-medium">
                          Company Name
                        </Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange("companyName", e.target.value)}
                          className={`bg-white border-0 shadow-none ${errors.companyName ? 'border-red-500' : ''}`}
                          style={{
                            borderRadius: "8px",
                            border: errors.companyName ? "1px solid #EF4444" : "1px solid #D1D5DB",
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
                        {errors.companyName && (
                          <p className="text-xs text-red-500">{errors.companyName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1 flex flex-col">
                        <Label htmlFor="companyEmail" className="text-sm font-medium">
                          Company Email
                        </Label>
                      <Input
                        value={formData.companyEmail}
                        onChange={(e) => handleInputChange("companyEmail", e.target.value)}
                        className={`bg-white border-0 shadow-none ${errors.companyEmail ? 'border-red-500' : ''}`}
                        style={{
                            display: "flex" ,
                            height: "42px",
                            padding: "10px 12px",
                            alignItems: "center",
                            gap: "12px",
                            alignSelf: "stretch",
                            borderRadius: "8px",
                            border: errors.companyEmail ? "1px solid #EF4444" : "1px solid #D1D5DB",
                            background: "#FFF",
                            boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                          }}
                      />
                      {errors.companyEmail && (
                        <p className="text-xs text-red-500">{errors.companyEmail}</p>
                      )}
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1 flex flex-col">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={`bg-white border-0 shadow-none ${errors.password ? 'border-red-500' : ''}`}
                          placeholder="Enter new password"
                          style={{
                            borderRadius: "8px",
                            border: errors.password ? "1px solid #EF4444" : "1px solid #D1D5DB",
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
                        {errors.password && (
                          <p className="text-xs text-red-500">{errors.password}</p>
                        )}
                      </div>
                      <div className="space-y-1 flex flex-col">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className={`bg-white border-0 shadow-none ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          placeholder="Confirm new password"
                          style={{
                            borderRadius: "8px",
                            border: errors.confirmPassword ? "1px solid #EF4444" : "1px solid #D1D5DB",
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
                        {errors.confirmPassword && (
                          <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>


                    {/* Pin Fields */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1 flex flex-col">
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
                            maxLength={4}
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
                          maxLength={4}
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