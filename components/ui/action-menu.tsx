"use client"

import { MoreHorizontal, Edit, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import type { Car } from "@/types"

interface ActionMenuProps {
  car: Car
  batchNumber: string
  onDelete?: () => void
  onGenerateInvoice?: () => void
}

export function ActionMenu({ car, batchNumber, onDelete, onGenerateInvoice }: ActionMenuProps) {
  const router = useRouter()

  const handleEdit = () => {
    try {
      // Encode complete car data as query parameters for editing
      const carData = encodeURIComponent(JSON.stringify(car))
      
      // Check if the URL would be too long (browsers have URL length limits)
      const url = `/cars/inventory/${batchNumber}/add-car?edit=true&carData=${carData}`
      if (url.length > 2000) {
        console.warn('Car data is very large, consider using a different approach for large datasets')
      }
      
      router.push(url)
    } catch (error) {
      console.error('Error preparing car data for editing:', error)
      // Fallback: navigate without car data
      router.push(`/cars/inventory/${batchNumber}/add-car?edit=true`)
    }
  }

  const handleView = () => {
    router.push(`/cars/inventory/${batchNumber}/${car.id}`)
  }

  const handleGenerateInvoice = () => {
    if (onGenerateInvoice) {
      onGenerateInvoice()
    } else {
      // Default behavior - navigate to invoice generation page
      router.push(`/sales-and-payments/invoice?carId=${car.id}&batchNumber=${batchNumber}`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleGenerateInvoice}>
          <FileText className="mr-2 h-4 w-4" />
          Generate Invoice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
