"use client"

import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import type { Car } from "@/types"

interface ActionMenuProps {
  car: Car
  batchNumber: string
  onDelete?: () => void
}

export function ActionMenu({ car, batchNumber, onDelete }: ActionMenuProps) {
  const router = useRouter()

  const handleEdit = () => {
    // Encode car data as query parameters for editing
    const carData = encodeURIComponent(JSON.stringify(car))
    router.push(`/cars/inventory/${batchNumber}/add-car?edit=true&carData=${carData}`)
  }

  const handleView = () => {
    router.push(`/cars/inventory/${batchNumber}/${car._id || car.id}`)
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
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
