"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface StatusChangeModalProps {
  isOpen: boolean
  onClose: () => void
  currentStatus: string
  onStatusChange: (newStatus: string) => Promise<boolean>
  customerName: string
}

export function StatusChangeModal({ 
  isOpen, 
  onClose, 
  currentStatus, 
  onStatusChange, 
  customerName 
}: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)

  const statusOptions = [
    { value: "Completed", label: "Completed", color: "#0D9700" },
    { value: "Pending", label: "Pending", color: "#FF0000" },
    { value: "inprogress", label: "In Progress", color: "#FF9500" }
  ]

  const handleSave = async () => {
    try {
      setIsLoading(true)
      console.log("StatusChangeModal: Starting status change...");
      const success = await onStatusChange(selectedStatus)
      console.log("StatusChangeModal: onStatusChange result:", success);
      if (success === true) {
        console.log("StatusChangeModal: Status change successful, closing modal");
        // Close the modal - parent component will handle success popup
        onClose()
      } else {
        console.log("StatusChangeModal: Status change failed, not closing modal");
      }
      // Don't close modal if there was an error - let user try again
    } catch (error) {
      console.error('Error in status change:', error)
      // Don't show success card on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="p-0 border-0 bg-white"
        style={{
          width: '520px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '40px'
        }}
      >
        {/* Header */}
        <div className="w-full flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Changing Status
            </h2>
            <p className="text-sm text-gray-500">
              Once Changed status can't be edit
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Status Options */}
        <div className="w-full space-y-3">
          {statusOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className="cursor-pointer"
              style={{
                display: 'flex',
                padding: '12px',
                alignItems: 'center',
                gap: '12px',
                alignSelf: 'stretch',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.24)',
                background: selectedStatus === option.value 
                  ? 'rgba(13, 151, 0, 0.10)' 
                  : 'white'
              }}
            >
              <div
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: option.color,
                  backgroundColor: selectedStatus === option.value ? option.color : 'transparent'
                }}
              >
                {selectedStatus === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span 
                className="font-medium"
                style={{ color: option.color }}
              >
                {option.label}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full"
          style={{
            display: 'flex',
            height: '50px',
            maxHeight: '55px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            flex: '1 0 0',
            borderRadius: '12px',
            background: '#00674F',
            padding: '10px 0px'
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save & close'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
