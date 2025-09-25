"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save, UserPlus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface TeamMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TeamMemberData) => void
  editingMember?: TeamMember | null
  loading?: boolean
}

interface TeamMemberData {
  name: string
  email: string
  password: string
  role: string
  branch: string
  access: {
    carManagement: boolean
    analytics: boolean
    setting: boolean
    sales: boolean
    customers: boolean
    investors: boolean
    dashboardUnits: boolean
  }
}

interface TeamMember {
  _id: string
  name: string
  email: string
  role?: string
  branch?: string
  access: {
    carManagement: boolean
    analytics: boolean
    setting: boolean
    sales: boolean
    customers: boolean
    investors: boolean
    dashboardUnits: boolean
  }
  createdAt: string
  updatedAt: string
}

export function TeamMemberModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingMember, 
  loading = false 
}: TeamMemberModalProps) {
  const [formData, setFormData] = useState<TeamMemberData>({
    name: editingMember?.name || "",
    email: editingMember?.email || "",
    password: "",
    role: editingMember?.role || "",
    branch: editingMember?.branch || "",
    access: {
      carManagement: editingMember?.access?.carManagement || false,
      analytics: editingMember?.access?.analytics || false,
      setting: editingMember?.access?.setting || false,
      sales: editingMember?.access?.sales || false,
      customers: editingMember?.access?.customers || false,
      investors: editingMember?.access?.investors || false,
      dashboardUnits: editingMember?.access?.dashboardUnits || false,
    }
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.role.trim()) {
      newErrors.role = "Role is required"
    }
    if (!editingMember && !formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      })
      return
    }

    onSubmit(formData)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('access.')) {
      const accessField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        access: {
          ...prev.access,
          [accessField]: value as boolean
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#00674F]" />
              <h2 className="text-xl font-semibold">
                {editingMember ? "Edit Team Member" : "Add Team Member"}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-[120px]">
              {/* Left Side - Team Member Details */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Enter Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`${errors.name ? 'border-red-500' : 'border-gray-300'} bg-white`}
                    placeholder="Enter full name"
                    style={{ height: '55px', borderRadius: '12px' }}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Enter Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`${errors.email ? 'border-red-500' : 'border-gray-300'} bg-white`}
                    placeholder="Enter email address"
                    style={{ height: '55px', borderRadius: '12px' }}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password {editingMember && <span className="text-gray-500">(leave blank to keep current)</span>}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`${errors.password ? 'border-red-500' : 'border-gray-300'} bg-white`}
                    placeholder={editingMember ? "Enter new password" : "Enter password"}
                    style={{ height: '55px', borderRadius: '12px' }}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Enter Role
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                  >
                    <SelectTrigger 
                      className={`${errors.role ? 'border-red-500' : 'border-gray-300'} bg-white`}
                      style={{ height: '55px', borderRadius: '12px' }}
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Finance Manager">Finance Manager</SelectItem>
                      <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                      <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                      <SelectItem value="Inventory Manager">Inventory Manager</SelectItem>
                      <SelectItem value="Analyst">Analyst</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-xs text-red-500">{errors.role}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="branch" className="text-sm font-medium text-gray-700">
                    Branch
                  </Label>
                  <Input
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => handleInputChange("branch", e.target.value)}
                    className="border-gray-300 bg-white"
                    placeholder="Enter branch name"
                    style={{ height: '55px', borderRadius: '12px' }}
                  />
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00674F] hover:bg-[#00674F] text-white"
                    style={{ height: '55px', borderRadius: '12px' }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>

              {/* Right Side - Team Access */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Team Access</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Analytics</Label>
                    </div>
                    <Switch
                      checked={formData.access.analytics}
                      onCheckedChange={(checked) => handleInputChange("access.analytics", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Sales and receipts</Label>
                    </div>
                    <Switch
                      checked={formData.access.sales}
                      onCheckedChange={(checked) => handleInputChange("access.sales", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Customers</Label>
                    </div>
                    <Switch
                      checked={formData.access.customers}
                      onCheckedChange={(checked) => handleInputChange("access.customers", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Car Management</Label>
                    </div>
                    <Switch
                      checked={formData.access.carManagement}
                      onCheckedChange={(checked) => handleInputChange("access.carManagement", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Investors</Label>
                    </div>
                    <Switch
                      checked={formData.access.investors}
                      onCheckedChange={(checked) => handleInputChange("access.investors", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Dashboard Units</Label>
                    </div>
                    <Switch
                      checked={formData.access.dashboardUnits}
                      onCheckedChange={(checked) => handleInputChange("access.dashboardUnits", checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
