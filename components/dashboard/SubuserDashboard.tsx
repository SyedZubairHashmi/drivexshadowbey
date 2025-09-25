"use client"

import { useAuth } from "@/hooks/useAuth"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Car, 
  BarChart3, 
  Settings, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Building2,
  MapPin
} from "lucide-react"

export function SubuserDashboard() {
  const { user } = useAuth()

  if (!user || user.role !== 'subuser') {
    return null
  }

  const getAccessCount = () => {
    if (!user.access) return 0
    return Object.values(user.access).filter(Boolean).length
  }

  const getAccessItems = () => {
    if (!user.access) return []
    
    const items = []
    if (user.access.carManagement) items.push({ name: "Car Management", icon: Car, color: "bg-blue-500" })
    if (user.access.analytics) items.push({ name: "Analytics", icon: BarChart3, color: "bg-green-500" })
    if (user.access.setting) items.push({ name: "Settings", icon: Settings, color: "bg-purple-500" })
    if (user.access.sales) items.push({ name: "Sales & Payments", icon: ShoppingCart, color: "bg-orange-500" })
    if (user.access.customers) items.push({ name: "Customers", icon: Users, color: "bg-pink-500" })
    if (user.access.investors) items.push({ name: "Investors", icon: TrendingUp, color: "bg-indigo-500" })
    
    return items
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#00674F] to-[#004d3a] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 border-2 border-white">
              <AvatarFallback className="bg-white text-[#00674F] text-xl font-semibold">
                {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
              <p className="text-green-100">You're logged in as {user.userRole || 'Staff'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-green-100">
              <Building2 className="w-5 h-5" />
              <span>{user.companyName}</span>
            </div>
            {user.branch && (
              <div className="flex items-center space-x-2 text-green-100 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{user.branch}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Access Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Your Access</h3>
              <p className="text-3xl font-bold text-[#00674F]">{getAccessCount()}</p>
              <p className="text-sm text-gray-500">Available features</p>
            </div>
            <div className="w-12 h-12 bg-[#00674F] bg-opacity-10 rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-[#00674F]" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Your Role</h3>
              <p className="text-lg font-semibold text-gray-700">{user.userRole || 'Staff'}</p>
              <p className="text-sm text-gray-500">Current position</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 bg-opacity-10 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Company</h3>
              <p className="text-lg font-semibold text-gray-700">{user.companyName}</p>
              <p className="text-sm text-gray-500">Your organization</p>
            </div>
            <div className="w-12 h-12 bg-green-500 bg-opacity-10 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Available Features */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Features</h3>
        {getAccessItems().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getAccessItems().map((item, index) => {
              const IconComponent = item.icon
              return (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 ${item.color} bg-opacity-20 rounded-full flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${item.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <Badge variant="secondary" className="text-xs">Available</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No specific features assigned yet</p>
            <p className="text-sm text-gray-400">Contact your administrator for access permissions</p>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {user.access?.carManagement && (
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <Car className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-blue-900">Manage Cars</p>
              <p className="text-sm text-blue-600">View and manage inventory</p>
            </button>
          )}
          
          {user.access?.analytics && (
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-medium text-green-900">View Analytics</p>
              <p className="text-sm text-green-600">Check reports and insights</p>
            </button>
          )}
          
          {user.access?.sales && (
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
              <ShoppingCart className="w-6 h-6 text-orange-600 mb-2" />
              <p className="font-medium text-orange-900">Sales & Payments</p>
              <p className="text-sm text-orange-600">Manage transactions</p>
            </button>
          )}
          
          {user.access?.customers && (
            <button className="p-4 bg-pink-50 hover:bg-pink-100 rounded-lg text-left transition-colors">
              <Users className="w-6 h-6 text-pink-600 mb-2" />
              <p className="font-medium text-pink-900">Customer Management</p>
              <p className="text-sm text-pink-600">View customer data</p>
            </button>
          )}
        </div>
      </Card>
    </div>
  )
}

