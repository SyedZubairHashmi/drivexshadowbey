"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, UserPlus, MoreVertical } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

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
  }
  createdAt: string
  updatedAt: string
}

interface TeamMemberListProps {
  teamMembers: TeamMember[]
  onEdit: (member: TeamMember) => void
  onDelete: (id: string) => void
  onAddNew: () => void
  loading?: boolean
}

export function TeamMemberList({ 
  teamMembers, 
  onEdit, 
  onDelete, 
  onAddNew, 
  loading = false 
}: TeamMemberListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      setDeletingId(id)
      try {
        await onDelete(id)
        toast({
          title: "Success",
          description: "Team member deleted successfully"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete team member",
          variant: "destructive"
        })
      } finally {
        setDeletingId(null)
      }
    }
  }

  const getAccessCount = (access: TeamMember['access']) => {
    return Object.values(access).filter(Boolean).length
  }

  const getAccessBadges = (access: TeamMember['access']) => {
    const badges = []
    if (access.carManagement) badges.push("Cars")
    if (access.analytics) badges.push("Analytics")
    if (access.setting) badges.push("Settings")
    if (access.sales) badges.push("Sales")
    if (access.customers) badges.push("Customers")
    if (access.investors) badges.push("Investors")
    if (access.dashboardUnits) badges.push("Dashboard Units")
    return badges
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Team Members</h3>
          <Button
            onClick={onAddNew}
            className="bg-[#00674F] hover:bg-[#00674F] text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00674F]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Team Members ({teamMembers.length})</h3>
        <Button
          onClick={onAddNew}
          className="bg-[#00674F] hover:bg-[#00674F] text-white"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {teamMembers.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">No team members yet</h4>
              <p className="text-gray-500">Add your first team member to get started</p>
            </div>
            <Button
              onClick={onAddNew}
              className="bg-[#00674F] hover:bg-[#00674F] text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {teamMembers.map((member) => (
            <Card key={member._id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-[#00674F] text-white">
                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{member.name}</h4>
                      {member.role && (
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                      )}
                      {member.branch && (
                        <Badge variant="secondary" className="text-xs">
                          {member.branch}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">
                        {getAccessCount(member.access)} permissions
                      </span>
                      <div className="flex gap-1">
                        {getAccessBadges(member.access).slice(0, 3).map((badge) => (
                          <Badge key={badge} variant="outline" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                        {getAccessBadges(member.access).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{getAccessBadges(member.access).length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(member)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(member._id)}
                    disabled={deletingId === member._id}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
