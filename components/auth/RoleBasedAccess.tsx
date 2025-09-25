"use client"

import { useAuth } from "@/hooks/useAuth"
import { ReactNode } from "react"

interface RoleBasedAccessProps {
  children: ReactNode
  allowedRoles?: ('admin' | 'company' | 'subuser')[]
  requiredAccess?: string
  fallback?: ReactNode
}

export function RoleBasedAccess({ 
  children, 
  allowedRoles = ['admin', 'company', 'subuser'], 
  requiredAccess,
  fallback = null 
}: RoleBasedAccessProps) {
  const { user, hasAccess } = useAuth()

  // Check if user is authenticated
  if (!user) {
    return <>{fallback}</>
  }

  // Check if user role is allowed
  if (!allowedRoles.includes(user.role)) {
    return <>{fallback}</>
  }

  // Check if user has required access (for subusers)
  if (requiredAccess && !hasAccess(requiredAccess)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Convenience components for common access patterns
export function AdminOnly({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <RoleBasedAccess allowedRoles={['admin']} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  )
}

export function CompanyOnly({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <RoleBasedAccess allowedRoles={['company']} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  )
}

export function SubuserOnly({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <RoleBasedAccess allowedRoles={['subuser']} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  )
}

export function CompanyAndAdmin({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <RoleBasedAccess allowedRoles={['company', 'admin']} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  )
}

export function WithAccess({ 
  children, 
  access, 
  fallback = null 
}: { 
  children: ReactNode, 
  access: string, 
  fallback?: ReactNode 
}) {
  return (
    <RoleBasedAccess requiredAccess={access} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  )
}

