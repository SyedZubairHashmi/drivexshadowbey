"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "./status-badge"
import { ActionMenu } from "./action-menu"
import type { Car } from "@/types"

interface CarTableProps {
  cars: Car[]
  batchNumber: string
  onDelete?: (car: Car) => void
}

export function CarTable({ cars, batchNumber, onDelete }: CarTableProps) {
  console.log("CarTable received cars:", cars);
  console.log("CarTable received batchNumber:", batchNumber);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 py-2">S.no</TableHead>
            <TableHead className="py-2">Car</TableHead>
            <TableHead className="py-2">Company</TableHead>
            <TableHead className="py-2">Engine Number</TableHead>
            <TableHead className="py-2">Engine Type</TableHead>
            <TableHead className="py-2">Mileage</TableHead>
            <TableHead className="w-20 py-2">Grade</TableHead>
            <TableHead className="py-2">Import Year</TableHead>
            <TableHead className="py-2">Manufacturing Year</TableHead>
            <TableHead className="py-2">Batch</TableHead>
            <TableHead className="py-2">Status</TableHead>
            <TableHead className="w-20 py-2">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car: any, index) => (
            <TableRow key={car._id || car.id || index}>
              <TableCell className="font-medium py-2">{index + 1}</TableCell>
              <TableCell className="font-medium py-2">{car.carName || car.name}</TableCell>
              <TableCell className="py-2">{car.company}</TableCell>
              <TableCell className="font-mono text-sm py-2">{car.engineNumber}</TableCell>
              <TableCell className="py-2">{car.engineType}</TableCell>
              <TableCell className="py-2">{car.mileage}</TableCell>
              <TableCell className="py-2">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {car.auctionGrade || car.grade}
                </div>
              </TableCell>
              <TableCell className="py-2">{car.importYear}</TableCell>
              <TableCell className="py-2">{car.manufacturingYear}</TableCell>
              <TableCell className="py-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  {car.batchNo || batchNumber}
                </span>
              </TableCell>
              <TableCell className="py-2">
                <StatusBadge status={car.status} />
              </TableCell>
              <TableCell className="py-2">
                <ActionMenu
                  car={car}
                  batchNumber={batchNumber}
                  onDelete={() => onDelete?.(car)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
