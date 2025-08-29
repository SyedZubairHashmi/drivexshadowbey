"use client";

import { MainLayout } from "@/components/layout/main-layout"
import { StatCard } from "@/components/ui/stat-card"
import { BatchHeader } from "@/components/ui/batch-header"
import { CarTable } from "@/components/ui/car-table"
import { Car, Package, Truck, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { carAPI } from "@/lib/api"

export default function CarsManagementPage() {
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    carsInTransit: 0,
    soldCars: 0
  })

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const response = await carAPI.getAll()
      
      if (response.success) {
        const carsData = response.data
        setCars(carsData)
        
        // Calculate stats
        const totalCars = carsData.length
        const availableCars = carsData.filter((car: any) => 
          car.status === "warehouse" || car.status === "showroom"
        ).length
        const carsInTransit = carsData.filter((car: any) => 
          car.status === "transit"
        ).length
        const soldCars = carsData.filter((car: any) => 
          car.status === "sold"
        ).length

        setStats({
          totalCars,
          availableCars,
          carsInTransit,
          soldCars
        })
      } else {
        setError(response.error || "Failed to fetch cars")
      }
    } catch (error: any) {
      console.error("Error fetching cars:", error)
      setError(error.message || "An error occurred while fetching cars")
    } finally {
      setLoading(false)
    }
  }

  const handleAddNewCar = () => {
    console.log("Add new car clicked")
  }

  const handleEditCar = (car: any) => {
    console.log("Edit car:", car)
  }

  const handleDeleteCar = (car: any) => {
    console.log("Delete car:", car)
  }

  const handleViewCar = (car: any) => {
    console.log("View car:", car)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cars...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button 
              onClick={fetchCars}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Cars Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Cars" value={stats.totalCars} icon={Car} />
          <StatCard title="Available Cars" value={stats.availableCars} icon={Package} />
          <StatCard title="Cars in Transit" value={stats.carsInTransit} icon={Truck} />
          <StatCard title="Sold Cars" value={stats.soldCars} icon={CheckCircle} />
        </div>

        {/* All Cars Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <BatchHeader title="All Cars" onAddNew={handleAddNewCar} showFilters={true} />

          <div className="mt-6">
            <CarTable cars={cars} batchNumber="all" />
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing 1 to {cars.length} of {cars.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">2</button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
