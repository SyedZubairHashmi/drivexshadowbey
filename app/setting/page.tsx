"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainLayout } from "@/components/layout/main-layout"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, ChevronRight, Home, Settings, User, Bell, LogOut, Save, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
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
  image?: string;
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
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  const [isProfileUploadOpen, setIsProfileUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [teamForm, setTeamForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    branch: "",
  });
  const [teamAccess, setTeamAccess] = useState({
    analytics: true,
    sales: false,
    customers: true,
    carManagement: true,
    investors: false,
    dashboardUnits: false,
  });

  // Function to fetch team members
  const fetchTeamMembers = async () => {
    try {
      if (!user) return;
      
      const companyId = user.role === 'subuser' ? user.companyId : user._id;
      
      if (!companyId) return;
      
      const response = await fetch('/api/users/team-members', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-company-id': companyId,
        } as HeadersInit,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTeamMembers(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = (memberId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
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

  // Load company data on component mount (skip for subusers)
  useEffect(() => {
    if (user?.role === 'subuser') {
      setLoading(false);
      return;
    }
    fetchCompanyData();
    fetchTeamMembers();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }

  const handleTeamFormChange = (field: keyof typeof teamForm, value: string) => {
    setTeamForm(prev => ({ ...prev, [field]: value }));
  }

  const toggleAccess = (field: keyof typeof teamAccess) => {
    setTeamAccess(prev => ({ ...prev, [field]: !prev[field] }));
  }

  const saveTeamMember = async () => {
    if (!user || !company) {
      toast({
        title: "Error",
        description: "User or company information not found",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!teamForm.fullName || !teamForm.email || !teamForm.password || !teamForm.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      
      const subUserData = {
        companyId: company._id,
        name: teamForm.fullName,
        email: teamForm.email,
        password: teamForm.password,
        role: teamForm.role,
        branch: teamForm.branch || undefined,
        access: teamAccess
      };

      console.log("Sending subuser data:", subUserData);
      
      const response = await fetch('/api/subusers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(subUserData),
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response result:", result);

      if (result.success) {
        toast({
          title: "Success",
          description: "Team member added successfully"
        });
    setIsAddTeamOpen(false);
        setTeamForm({ fullName: "", email: "", password: "", role: "", branch: "" });
        setTeamAccess({ analytics: true, sales: false, customers: true, carManagement: true, investors: false, dashboardUnits: false });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add team member",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  const saveProfilePicture = async () => {
    if (!selectedFile || !company) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch(`/api/companies/${company._id}/upload-image`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Update the company state with the new image
        setCompany(prev => prev ? { ...prev, image: result.data.image } : null);
        
        toast({
          title: "Success",
          description: "Profile picture updated successfully"
        });
        setIsProfileUploadOpen(false);
        setSelectedFile(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to upload profile picture",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
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

  // Subuser view: show basic profile info (name, email, role, branch)
  if (user && user.role === 'subuser') {
    return (
      <MainLayout>
        <div className="flex flex-col flex-1 gap-5 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg">
              <span>Settings</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">Profile</span>
            </div>
          </div>
          <div className="flex max-w-full items-start gap-5 mr-8">
            <Card className="overflow-hidden flex-1 border-0 shadow-none bg-transparent">
              <div className="flex">
                <div className="w-80 pl-3 pr-3 bg-white">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <Avatar className="w-28 h-28 border-0 shadow-none">
                        <AvatarImage
                          src="/placeholder-user.jpg"
                          alt="Profile"
                        />
                        <AvatarFallback className="bg-green-600 text-white text-xl border-0">
                          {(user.name || user.email || 'SU').slice(0,2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {user.name || 'Team Member'}
                    </h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="mt-2 text-xs text-gray-600">
                      <div>Role: {user.userRole || 'Staff'}</div>
                      {user.branch ? <div>Branch: {user.branch}</div> : null}
                    </div>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className="pl-5">
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Email</Label>
                        <Input value={user.email || ''} readOnly className="bg-white border-0 shadow-none" style={{
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
                        }} />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Role</Label>
                          <Input value={user.userRole || 'Staff'} readOnly className="bg-white border-0 shadow-none" style={{
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
                          }} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Branch</Label>
                          <Input value={user.branch || ''} readOnly className="bg-white border-0 shadow-none" style={{
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
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 gap-5 mt-4">
        {/* Breadcrumb and Add Team Member Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <span>Settings</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Profile Settings</span>
          </div>
          <Button 
            className="bg-[#00674F] hover:bg-[#00674F] text-white px-6 rounded-xl border-0"
            style={{ width: "190px" }}
            onClick={() => setIsAddTeamOpen(true)}
          >
            Add Team Member
          </Button>
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
                        src={company?.image || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/setting.PNG-ITZDSniVv3RJYHvsUU1aKz6igsT5NP.png"}
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-green-600 text-white text-xl border-0">
                        {`${company?.ownerName?.[0] || ''}${company?.companyName?.[0] || ''}`.toUpperCase() || 'CO'}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-black hover:bg-gray-800 p-0 border-0"
                      onClick={() => setIsProfileUploadOpen(true)}
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
      {isAddTeamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div
            className="relative"
            style={{
              display: "inline-flex",
              padding: "20px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "35px",
              borderRadius: "8px",
              background: "#FFF",
              width: "70%"
            }}
          >
            <div className="w-full flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Team Member</h3>
              <button
                onClick={() => setIsAddTeamOpen(false)}
                className="flex items-center justify-center"
                style={{ width: "35px", height: "35px", flexShrink: 0, borderRadius: "35px", background: "var(--Dark-Blue-dark-blue-50, #E6E6EB)" }}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingLeft: "10px"}}>
              {/* Left: Inputs */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Enter Full Name</Label>
                  <Input
                    value={teamForm.fullName}
                    onChange={(e) => handleTeamFormChange("fullName", e.target.value)}
                    style={{ width: "540px", height: "50px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.12)", background: "#FFF",paddingLeft: '20px' }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Enter Email</Label>
                  <Input
                    value={teamForm.email}
                    onChange={(e) => handleTeamFormChange("email", e.target.value)}
                    style={{ width: "540px", height: "50px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.12)", background: "#FFF", paddingLeft: '20px' }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={teamForm.password}
                    onChange={(e) => handleTeamFormChange("password", e.target.value)}
                    style={{ width: "540px", height: "50px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.12)", background: "#FFF", paddingLeft: '20px' }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Enter Role</Label>
                  <Input
                    value={teamForm.role}
                    onChange={(e) => handleTeamFormChange("role", e.target.value)}
                    style={{ width: "540px", height: "50px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.12)", background: "#FFF", paddingLeft: '20px' }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Branch</Label>
                  <Input
                    value={teamForm.branch}
                    onChange={(e) => handleTeamFormChange("branch", e.target.value)}
                    style={{ width: "540px", height: "50px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.12)", background: "#FFF", paddingLeft: '20px' }}
                  />
                </div>
                <div>
                  <Button 
                    onClick={saveTeamMember} 
                    disabled={saving}
                    className="bg-[#00674F] hover:bg-[#00674F] text-white rounded-xl border-0" 
                    style={{ height: "48px", width: "540px" }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>

              {/* Right: Team Access */}
              <div className="flex flex-col items-center" style={{ 
                display: "flex",
                padding: "20px 20px",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                background: "#FFF",
                boxShadow: "0 6px 15px 0 rgba(0, 0, 0, 0.05)"
              }}>
                <h4 className="text-base font-semibold mb-2">Team Access</h4>

                {[
                  { key: "analytics", label: "Analytics" },
                  { key: "sales", label: "Sales and receipts" },
                  { key: "customers", label: "Customers" },
                  { key: "carManagement", label: "Car Management" },
                  { key: "investors", label: "Investors" },
                  { key: "dashboardUnits", label: "Dashboard Units" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between w-full"
                    style={{ width: "360px", height: "52px", padding: "12px 8px 12px 16px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.12)" }}
                  >
                    <span className="text-sm">{item.label}</span>
                    <Switch 
                      checked={(teamAccess as any)[item.key]} 
                      onCheckedChange={() => toggleAccess(item.key as any)}
                      className="data-[state=checked]:bg-[#00674F]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Picture Upload Modal */}
      {isProfileUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div
            style={{
              display: "flex",
              width: "520px",
              padding: "24px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "40px",
              borderRadius: "8px",
              background: "#FFF",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}
          >
            {/* Close Button */}
            <div className="w-full flex justify-end">
              <button
                onClick={() => setIsProfileUploadOpen(false)}
                style={{
                  width: "35px",
                  height: "35px",
                  flexShrink: 0,
                  background: "#00000014",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                  <circle cx="17.5" cy="17.5" r="17.5" fill="black" fillOpacity="0.08"/>
                  <path d="M13.2578 22.0978L22.0966 13.259" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22.0966 22.0968L13.2578 13.258" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Browse/Upload Area */}
            <div
              style={{
                display: "flex",
                width: "472px",
                padding: "15px 135px 13px 128px",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                borderRadius: "12px",
                border: "1.5px dashed rgba(0, 0, 0, 0.24)",
                background: "#FFF"
              }}
            >
              {/* Image Icon */}
              <div
                style={{
                  display: "flex",
                  height: "45px",
                  maxHeight: "45px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  flex: "1 0 0"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none">
                  <path d="M39.7083 5.29167V39.7083H5.29167V5.29167H39.7083ZM39.7083 0.375H5.29167C2.5875 0.375 0.375 2.5875 0.375 5.29167V39.7083C0.375 42.4125 2.5875 44.625 5.29167 44.625H39.7083C42.4125 44.625 44.625 42.4125 44.625 39.7083V5.29167C44.625 2.5875 42.4125 0.375 39.7083 0.375ZM27.7608 22.1558L20.3858 31.6696L15.125 25.3025L7.75 34.7917H37.25L27.7608 22.1558Z" fill="black"/>
                </svg>
              </div>

              {/* File Name */}
              <div style={{ textAlign: "center" }}>
                {selectedFile ? (
                  <p style={{ fontSize: "14px", color: "#000", margin: 0 }}>
                    {selectedFile.name}
                  </p>
                ) : (
                  <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                    No file selected
                  </p>
                )}
              </div>

              {/* Browse Files Button */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  id="profile-upload"
                />
                <label htmlFor="profile-upload">
                  <button
                    style={{
                      display: "flex",
                      padding: "8px 14px",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      borderRadius: "1000px",
                      background: "#8080801F",
                      color: "#000",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Browse Files
                  </button>
                </label>
              </div>
            </div>

            {/* Save Changes Button */}
            <div className="w-full">
              <Button
                onClick={saveProfilePicture}
                disabled={saving || !selectedFile}
                className="w-full"
                style={{
                  borderRadius: "12px",
                  background: "#00674F",
                  height: "48px"
                }}
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Team</h2>
        <div className="space-y-4">
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div key={member._id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                {/* Profile Circle */}
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">
                    {getInitials(member.name || 'Unknown')}
                  </span>
                </div>
                
                {/* Member Details */}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-base">
                    {member.name || 'Unknown User'}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {member.role === 'subuser' ? 'Team Member' : member.role || 'User'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {visiblePasswords[member._id] ? member.password || 'No password' : '*************'}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(member._id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {visiblePasswords[member._id] ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Edit Button */}
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Edit now
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No team members found</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}