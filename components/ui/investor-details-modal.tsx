"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Edit, Check, X as XIcon } from "lucide-react";

interface InvestorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  investor: {
    _id: string;
    name: string;
    emailAddress: string;
    contactNumber: string;
    investorId: string;
    investAmount: number;
    percentageShare: number;
    amountPaid: number;
    remainingAmount: number;
    paymentDate: string;
    batchNo: string;
    paymentMethod: {
      type: string;
      details: any;
    };
    createdAt: string;
    updatedAt: string;
  } | null;
  onEdit?: (investor: any) => void;
}

export function InvestorDetailsModal({ isOpen, onClose, investor, onEdit }: InvestorDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: "",
    emailAddress: "",
    contactNumber: "",
    investorId: "",
    investAmount: 0,
    percentageShare: 0,
    amountPaid: 0,
    paymentMethod: "",
    paymentDate: "",
    bankName: "",
    ibanNo: "",
    accountNo: "",
    chequeNumber: "",
    chequeClearanceDate: "",
    chequeBankName: "",
    depositBankName: "",
    slipNo: "",
  });

  // Initialize edited data when investor changes
  useEffect(() => {
    if (investor) {
      setEditedData({
        name: investor.name,
        emailAddress: investor.emailAddress,
        contactNumber: investor.contactNumber,
        investorId: investor.investorId,
        investAmount: investor.investAmount,
        percentageShare: investor.percentageShare,
        amountPaid: investor.amountPaid,
        paymentMethod: investor.paymentMethod.type,
        paymentDate: investor.paymentDate,
        bankName: investor.paymentMethod.details?.bankName || "",
        ibanNo: investor.paymentMethod.details?.ibanNo || "",
        accountNo: investor.paymentMethod.details?.accountNo || "",
        chequeNumber: investor.paymentMethod.details?.chequeNumber || "",
        chequeClearanceDate: investor.paymentMethod.details?.chequeClearanceDate || "",
        chequeBankName: investor.paymentMethod.details?.chequeBankName || "",
        depositBankName: investor.paymentMethod.details?.depositBankName || "",
        slipNo: investor.paymentMethod.details?.slipNo || "",
      });
    }
  }, [investor]);

  // Reset edit mode when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onEdit && investor) {
      onEdit({
        ...investor,
        ...editedData,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (investor) {
      setEditedData({
        name: investor.name,
        emailAddress: investor.emailAddress,
        contactNumber: investor.contactNumber,
        investorId: investor.investorId,
        investAmount: investor.investAmount,
        percentageShare: investor.percentageShare,
        amountPaid: investor.amountPaid,
        paymentMethod: investor.paymentMethod.type,
        paymentDate: investor.paymentDate,
        bankName: investor.paymentMethod.details?.bankName || "",
        ibanNo: investor.paymentMethod.details?.ibanNo || "",
        accountNo: investor.paymentMethod.details?.accountNo || "",
        chequeNumber: investor.paymentMethod.details?.chequeNumber || "",
        chequeClearanceDate: investor.paymentMethod.details?.chequeClearanceDate || "",
        chequeBankName: investor.paymentMethod.details?.chequeBankName || "",
        depositBankName: investor.paymentMethod.details?.depositBankName || "",
        slipNo: investor.paymentMethod.details?.slipNo || "",
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen || !investor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-xl border border-gray-200 flex flex-col"
        style={{
          width: "520px",
          height: "600px",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 ">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Batch Investor Payment Detail</h2>
              <p className="text-sm text-gray-600 mt-1">You will see complete payment detail here</p>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              style={{
                width: "35px",
                height: "35px",
                opacity: 1,
                background: "#00000014",
              }}
              className="p-0 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div 
          className="flex-1 scrollbar-hide"
          style={{
            maxHeight: 'calc(100% - 80px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            padding: '0 22px'
          }}
        >
          <div className="space-y-4">
            {/* Status Badge - Full Width */}
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Payment Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Paid
                </span>
              </div>
            </div>

            {/* Investment Amount and Percentage Share - Row 1 */}
            <div className="flex gap-3">
              <div className="space-y-1" style={{ width: "220px" }}>
                <Label className="text-sm font-medium text-gray-700">Investment Amount</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedData.investAmount}
                    onChange={(e) => handleInputChange("investAmount", Number(e.target.value))}
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      borderWidth: "1px",
                      padding: "10px 12px",
                    }}
                  />
                ) : (
                  <Input
                    value={investor.investAmount.toLocaleString()}
                    readOnly
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      borderWidth: "1px",
                      padding: "10px 12px",
                      backgroundColor: "#f9fafb",
                    }}
                  />
                )}
              </div>

              <div className="space-y-1" style={{ width: "220px" }}>
                <Label className="text-sm font-medium text-gray-700">Percentage Share</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedData.percentageShare}
                    onChange={(e) => handleInputChange("percentageShare", Number(e.target.value))}
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      borderWidth: "1px",
                      padding: "10px 12px",
                    }}
                  />
                ) : (
                  <Input
                    value={investor.percentageShare.toLocaleString()}
                    readOnly
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      borderWidth: "1px",
                      padding: "10px 12px",
                      backgroundColor: "#f9fafb",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Amount Paid and Remaining Balance - Row 2 */}
            <div className="flex gap-3">
              <div className="space-y-1" style={{ width: "220px" }}>
                <Label className="text-sm font-medium text-gray-700">Amount Paid</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedData.amountPaid}
                    onChange={(e) => handleInputChange("amountPaid", Number(e.target.value))}
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      borderWidth: "1px",
                      padding: "10px 12px",
                    }}
                  />
                ) : (
                  <Input
                    value={investor.amountPaid.toLocaleString()}
                    readOnly
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      borderWidth: "1px",
                      padding: "10px 12px",
                      backgroundColor: "#f9fafb",
                    }}
                  />
                )}
              </div>

              <div className="space-y-1" style={{ width: "220px" }}>
                <Label className="text-sm font-medium text-gray-700">Remaining Balance</Label>
                <Input
                  value={investor.remainingAmount.toLocaleString()}
                  readOnly
                  style={{
                    height: "42px",
                    borderRadius: "8px",
                    borderWidth: "1px",
                    padding: "10px 12px",
                    backgroundColor: "#f9fafb",
                  }}
                />
              </div>
            </div>

            {/* Payment Date and Payment Method - Row 3 */}
            <div className="flex gap-3">
              <div className="space-y-1" style={{ width: "220px" }}>
                <Label className="text-sm font-medium text-gray-700">Payment Date</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={new Date(investor.paymentDate).toISOString().split('T')[0]}
                    onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      borderWidth: "1px",
                      padding: "10px 12px",
                    }}
                  />
                ) : (
                  <Input
                    value={new Date(investor.paymentDate).toLocaleDateString()}
                    readOnly
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      borderWidth: "1px",
                      padding: "10px 12px",
                      backgroundColor: "#f9fafb",
                    }}
                  />
                )}
              </div>

              <div className="space-y-1" style={{ width: "220px" }}>
                <Label className="text-sm font-medium text-gray-700">Payment Method</Label>
                {isEditing ? (
                  <select
                    value={editedData.paymentMethod || investor.paymentMethod.type}
                    onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      borderWidth: "1px",
                      padding: "10px 12px",
                      width: "100%",
                      backgroundColor: "white",
                      borderColor: "#d1d5db",
                    }}
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank</option>
                    <option value="cheque">Cheque</option>
                    <option value="bank_deposit">Bank Deposit</option>
                  </select>
                ) : (
                  <Input
                    value={investor.paymentMethod.type.charAt(0).toUpperCase() + investor.paymentMethod.type.slice(1)}
                    readOnly
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      borderWidth: "1px",
                      padding: "10px 12px",
                      backgroundColor: "#f9fafb",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Bank Details - Conditional based on payment method */}
            {(isEditing ? editedData.paymentMethod === 'bank' : investor.paymentMethod.type === 'bank') && (
              <div className="flex gap-3">
                <div className="space-y-1" style={{ width: "220px" }}>
                  <Label className="text-sm font-medium text-gray-700">Bank Name</Label>
                  {isEditing ? (
                    <Input
                      value={editedData.bankName || "Habib Bank Limited"}
                      onChange={(e) => handleInputChange("bankName", e.target.value)}
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                      }}
                    />
                  ) : (
                    <Input
                      value={investor.paymentMethod.details?.bankName || "Habib Bank Limited"}
                      readOnly
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                        backgroundColor: "#f9fafb",
                      }}
                    />
                  )}
                </div>

                <div className="space-y-1" style={{ width: "220px" }}>
                  <Label className="text-sm font-medium text-gray-700">IBAN No.</Label>
                  {isEditing ? (
                    <Input
                      value={editedData.ibanNo || "PK1123HBL123401231234"}
                      onChange={(e) => handleInputChange("ibanNo", e.target.value)}
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                      }}
                    />
                  ) : (
                    <Input
                      value={investor.paymentMethod.details?.ibanNo || "PK1123HBL123401231234"}
                      readOnly
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                        backgroundColor: "#f9fafb",
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Account No - Show only for bank method */}
            {(isEditing ? editedData.paymentMethod === 'bank' : investor.paymentMethod.type === 'bank') && (
              <div className="flex gap-3">
                <div className="space-y-1" style={{ width: "220px" }}>
                  <Label className="text-sm font-medium text-gray-700">Account No.</Label>
                  {isEditing ? (
                    <Input
                      value={editedData.accountNo || "123401231234"}
                      onChange={(e) => handleInputChange("accountNo", e.target.value)}
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                      }}
                    />
                  ) : (
                    <Input
                      value={investor.paymentMethod.details?.accountNo || "123401231234"}
                      readOnly
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                        backgroundColor: "#f9fafb",
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Cheque Details - Conditional based on payment method */}
            {(isEditing ? editedData.paymentMethod === 'cheque' : investor.paymentMethod.type === 'cheque') && (
              <div className="flex gap-3">
                <div className="space-y-1" style={{ width: "220px" }}>
                  <Label className="text-sm font-medium text-gray-700">Cheque Number</Label>
                  {isEditing ? (
                    <Input
                      value={editedData.chequeNumber || ""}
                      onChange={(e) => handleInputChange("chequeNumber", e.target.value)}
                      placeholder="Enter cheque number"
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                      }}
                    />
                  ) : (
                    <Input
                      value={investor.paymentMethod.details?.chequeNumber || ""}
                      readOnly
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                        backgroundColor: "#f9fafb",
                      }}
                    />
                  )}
                </div>

                <div className="space-y-1" style={{ width: "220px" }}>
                  <Label className="text-sm font-medium text-gray-700">Cheque Clearance Date</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedData.chequeClearanceDate || ""}
                      onChange={(e) => handleInputChange("chequeClearanceDate", e.target.value)}
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                      }}
                    />
                  ) : (
                    <Input
                      value={investor.paymentMethod.details?.chequeClearanceDate ? new Date(investor.paymentMethod.details.chequeClearanceDate).toLocaleDateString() : ""}
                      readOnly
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                        backgroundColor: "#f9fafb",
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Cheque Bank Name - Show only for cheque method */}
            {(isEditing ? editedData.paymentMethod === 'cheque' : investor.paymentMethod.type === 'cheque') && (
              <div className="flex gap-3">
                <div className="space-y-1" style={{ width: "220px" }}>
                  <Label className="text-sm font-medium text-gray-700">Bank Name</Label>
                  {isEditing ? (
                    <Input
                      value={editedData.chequeBankName || ""}
                      onChange={(e) => handleInputChange("chequeBankName", e.target.value)}
                      placeholder="Enter bank name"
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                      }}
                    />
                  ) : (
                    <Input
                      value={investor.paymentMethod.details?.chequeBankName || ""}
                      readOnly
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                        backgroundColor: "#f9fafb",
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Bank Deposit Details - Conditional based on payment method */}
            {(isEditing ? editedData.paymentMethod === 'bank_deposit' : investor.paymentMethod.type === 'bank_deposit') && (
              <div className="flex gap-3">
                <div className="space-y-1" style={{ width: "220px" }}>
                  <Label className="text-sm font-medium text-gray-700">Bank Name</Label>
                  {isEditing ? (
                    <Input
                      value={editedData.depositBankName || ""}
                      onChange={(e) => handleInputChange("depositBankName", e.target.value)}
                      placeholder="Enter bank name"
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                      }}
                    />
                  ) : (
                    <Input
                      value={investor.paymentMethod.details?.depositBankName || ""}
                      readOnly
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                        backgroundColor: "#f9fafb",
                      }}
                    />
                  )}
                </div>

                <div className="space-y-1" style={{ width: "220px" }}>
                  <Label className="text-sm font-medium text-gray-700">Slip No.</Label>
                  {isEditing ? (
                    <Input
                      value={editedData.slipNo || ""}
                      onChange={(e) => handleInputChange("slipNo", e.target.value)}
                      placeholder="Enter slip number"
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                      }}
                    />
                  ) : (
                    <Input
                      value={investor.paymentMethod.details?.slipNo || ""}
                      readOnly
                      style={{
                        height: "42px",
                        borderRadius: "8px",
                        borderWidth: "1px",
                        padding: "10px 12px",
                        backgroundColor: "#f9fafb",
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Note */}
            <div className="text-xs text-gray-500 mt-4">
              Note: Previous records can't be edited later
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 pt-4">
          <div className="flex gap-3" style={{ gap: "2.1px" }}>
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center"
                  style={{
                    height: "45px",
                    borderRadius: "12px",
                    background: "#00674F",
                    color: "white",
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 flex items-center justify-center"
                  style={{
                    height: "45px",
                    borderRadius: "12px",
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleEdit}
                  className="flex-1 flex items-center justify-center"
                  style={{
                    height: "45px",
                    borderRadius: "12px",
                    background: "#000000",
                    color: "white",
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center"
                  style={{
                    height: "45px",
                    borderRadius: "12px",
                    background: "#00674F",
                    color: "white",
                  }}
                >
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
