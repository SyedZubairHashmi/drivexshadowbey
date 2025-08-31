"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

interface AddCarModalProps {
  trigger?: React.ReactNode
  onSubmit?: (carData: any) => void
}

export function AddCarModal({ trigger, onSubmit }: AddCarModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    engineNumber: "",
    mileage: "",
    grade: "",
    importYear: "",
    batch: "",
    status: "Available",
    price: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    setOpen(false)
    setFormData({
      name: "",
      company: "",
      engineNumber: "",
      mileage: "",
      grade: "",
      importYear: "",
      batch: "",
      status: "Available",
      price: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    // Auto-capitalize first letter for car name field
    let processedValue = value;
    if (field === "name" && value.length > 0) {
      processedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    setFormData((prev) => ({ ...prev, [field]: processedValue }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Car
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Car</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Car Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Civic"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select value={formData.company} onValueChange={(value) => handleInputChange("company", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Nissan">Nissan</SelectItem>
                  <SelectItem value="Mazda">Mazda</SelectItem>
                  <SelectItem value="Subaru">Subaru</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="engineNumber">Engine Number</Label>
              <Input
                id="engineNumber"
                value={formData.engineNumber}
                onChange={(e) => handleInputChange("engineNumber", e.target.value)}
                placeholder="e.g., M16A-345678"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                value={formData.mileage}
                onChange={(e) => handleInputChange("mileage", e.target.value)}
                placeholder="e.g., 14K"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="importYear">Import Year</Label>
              <Select value={formData.importYear} onValueChange={(value) => handleInputChange("importYear", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="25000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batch">Batch</Label>
              <Select value={formData.batch} onValueChange={(value) => handleInputChange("batch", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Batch 01">Batch 01</SelectItem>
                  <SelectItem value="Batch 02">Batch 02</SelectItem>
                  <SelectItem value="Batch 03">Batch 03</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Car</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
