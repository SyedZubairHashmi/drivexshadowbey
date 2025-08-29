"use client"

import { useState } from "react"
import { X } from "lucide-react"
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
  const [showSuccess, setShowSuccess] = useState(false)

  const statusOptions = [
    { value: "Completed", label: "Completed", color: "#0D9700" },
    { value: "Pending", label: "Pending", color: "#FF0000" },
    { value: "inprogress", label: "In Progress", color: "#FF9500" }
  ]

  const handleSave = async () => {
    try {
      const success = await onStatusChange(selectedStatus)
      if (success === true) {
        setShowSuccess(true)
      }
      // Don't close modal if there was an error - let user try again
    } catch (error) {
      console.error('Error in status change:', error)
      // Don't show success card on error
    }
  }

  const handleClose = () => {
    setShowSuccess(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {!showSuccess ? (
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
           Save & close
         </Button>
       </DialogContent>
     ) : (
       <DialogContent 
         className="p-0 border-0 bg-white"
         style={{
           width: '496px',
           padding: '40px 24px',
           display: 'flex',
           flexDirection: 'column',
           justifyContent: 'center',
           alignItems: 'center',
           gap: '40px',
           border: '1px solid #0000003D'
         }}
       >
         {/* Success SVG */}
         <svg xmlns="http://www.w3.org/2000/svg" width="160" height="134" viewBox="0 0 160 134" fill="none">
           <circle opacity="0.6" cx="73.6027" cy="75.8936" r="57.2257" fill="#00674F" fillOpacity="0.12"/>
           <path fillRule="evenodd" clipRule="evenodd" d="M45.4546 31.3253C45.2618 31.5574 45.1468 32.1181 45.1988 32.5709C45.2836 33.3109 45.5189 33.4723 47.5185 34.1615C50.6109 35.2278 52.166 36.2116 54.207 38.3935C57.7154 42.1442 60.1109 49.1819 60.1109 55.7395V57.3536L58.5704 56.4721C56.3231 55.1864 52.901 53.8845 50.7561 53.4992C47.2703 52.8728 45.1289 53.905 43.8179 56.8436C43.4514 57.6652 37.8568 73.0749 31.3855 91.0873C19.0247 125.492 19.0355 125.458 20.0487 127.417C21.0085 129.273 23.6768 130.631 25.6051 130.245C26.0946 130.147 35.082 126.383 45.577 121.88C56.072 117.377 70.3365 111.299 77.2759 108.373C84.2152 105.447 90.3984 102.721 91.0163 102.316C93.92 100.408 93.9881 96.0619 91.2056 90.2185C90.5645 88.8717 90.1232 87.6343 90.2256 87.4692C90.4967 87.0302 94.6668 87.3676 95.9637 87.9336L97.0464 88.406L96.037 89.906C94.3619 92.3953 94.6782 94.9011 96.9161 96.8659C98.1194 97.9225 100.006 98.5152 101.43 98.284C104.55 97.7775 105.541 94.64 103.733 90.9872C103.318 90.1478 103.03 89.4084 103.095 89.3441C103.443 88.9961 107.367 88.4084 110.531 88.2306C114.368 88.0149 114.98 87.7811 114.98 86.5302C114.98 86.1631 114.717 85.6244 114.394 85.3331C113.379 84.4138 105.999 84.9977 101.62 86.3433C100.503 86.6866 100.354 86.6564 98.9791 85.8072C96.3014 84.1541 92.9074 83.6882 89.1593 84.4584C88.5097 84.5919 88.2579 84.3492 86.9587 82.3346C86.1518 81.0835 85.4517 79.9711 85.4029 79.8623C85.2574 79.5384 89.9498 77.8389 93.4139 76.9607C101.209 74.9842 109.316 75.2565 116.158 77.7244C118.471 78.5586 119.289 78.4677 119.571 77.3447C119.866 76.1687 119.378 75.7233 116.689 74.7107C107.673 71.3171 96.6875 71.6563 86.5185 75.6426C84.9854 76.2436 83.4429 76.755 83.0905 76.779C82.619 76.8113 81.6123 75.8976 79.2729 73.3138C75.6412 69.3027 71.3159 65.3442 66.8595 61.9538C63.4447 59.3556 63.4291 59.3286 63.3713 55.8433C63.293 51.1044 62.038 45.3845 60.2508 41.6178C57.792 36.4367 54.2886 33.2721 48.995 31.4509C47.0863 30.7942 45.9294 30.7531 45.4546 31.3253ZM48.4451 57.027C46.6805 57.7362 46.9067 60.8121 49.0581 65.3533C55.3478 78.6311 73.986 96.2849 85.449 99.8224C88.7767 100.849 90.3714 100.511 90.7702 98.6953C91.0307 97.5088 90.267 94.706 88.8712 91.7275L87.7098 89.2493L86.7668 89.7848C86.248 90.0791 84.8355 91.2771 83.6278 92.4473C82.4201 93.6174 81.2153 94.5746 80.9503 94.5746C80.2772 94.5746 79.5718 93.9622 79.3377 93.1747C79.1746 92.6263 79.4935 92.1404 81.1419 90.4253C82.2431 89.2798 83.7759 87.9143 84.5479 87.3908L85.9513 86.4393L84.2689 83.905C83.3434 82.5113 82.4708 81.3707 82.3297 81.3707C82.1885 81.3707 81.1654 81.91 80.0563 82.5691C77.9143 83.8416 77.1086 83.8959 76.5259 82.807C76.0065 81.837 76.5003 81.1164 78.4542 79.9926L80.3236 78.9175L78.2635 76.6323C74.3901 72.3358 64.8722 63.7656 63.9737 63.7656C63.8499 63.7656 63.5849 65.383 63.3854 67.36C62.5116 76.0091 61.257 79.0466 59.4037 76.9985C58.9252 76.4698 58.9387 76.2054 59.6611 71.9371C60.0801 69.46 60.5023 66.047 60.5994 64.3525L60.7758 61.2716L58.316 59.9248C55.5526 58.4116 53.2628 57.4662 51.3083 57.0317C49.7241 56.6793 49.3122 56.6787 48.4451 57.027ZM34.3402 93.6292C28.4953 109.884 23.5641 123.671 23.3822 124.267C23.1099 125.16 23.134 125.477 23.5192 126.065C24.5148 127.584 24.4699 127.599 41.7077 120.287C50.6191 116.507 63.4558 111.074 70.2338 108.214C77.0118 105.354 82.8053 102.884 83.1084 102.725C83.5741 102.481 83.2566 102.244 81.0545 101.193C74.0932 102.725 26.7863 125.448 25.6051 124.267C24.424 123.086 45.0236 76.6323 46.8284 67.6112C45.8666 65.738 45.0544 64.1764 45.0236 64.1406C44.9928 64.1051 40.1854 77.375 34.3402 93.6292ZM99.1655 91.5221C97.8938 93.1392 98.8045 95.1614 100.805 95.1614C101.608 95.1614 101.776 95.0505 101.776 94.5206C101.776 93.7656 100.745 91.5371 100.178 91.0662C99.872 90.8127 99.6423 90.9159 99.1655 91.5221Z" fill="#00674F"/>
           <path d="M103.783 23.4975C104.091 20.6855 104.335 19.7502 104.887 19.2605C105.768 18.4795 106.206 18.4731 107.28 19.2253C108.083 19.7872 108.116 19.966 107.913 22.6013C106.899 35.7513 100.209 50.5015 90.2123 61.6264C87.7647 64.3504 86.9152 64.7296 85.7074 63.6363C84.6392 62.6698 84.9347 61.7592 87.062 59.461C95.8938 49.922 102.423 35.8784 103.783 23.4975Z" fill="#00674F"/>
           <path d="M138.162 113.731C137.812 112.337 138.622 110.424 139.891 109.651C141.51 108.664 142.767 108.78 144.215 110.051C145.756 111.404 146.116 112.816 145.338 114.455C144.641 115.925 143.404 116.653 141.686 116.604C140.231 116.563 138.523 115.17 138.162 113.731Z" fill="#00674F" fillOpacity="0.24"/>
           <path d="M15.1445 23.599C15.1445 22.3176 16.2134 20.6968 17.4119 20.1612C18.8972 19.4966 20.4397 19.7874 21.6665 20.9629C22.967 22.2091 23.2445 23.6055 22.502 25.1702C21.925 26.3859 20.1801 27.5485 18.9321 27.5485C17.1835 27.5485 15.1445 25.4226 15.1445 23.599Z" fill="#00674F" fillOpacity="0.24"/>
           <path d="M130.125 35.9894L131.62 34.4326L133.115 32.8758L133.324 33.0767L133.533 33.2776L133.719 35.4528L133.904 37.628L135.434 38.6694L136.963 39.7107L136.67 40.0157L136.377 40.3207L134.427 40.3182L132.477 40.3158L131.041 41.811L129.605 43.3059L129.411 41.0256L129.217 38.7454L127.556 37.5367L125.894 36.3284L126.083 36.1321L126.272 35.9357L128.198 35.9626L130.125 35.9894Z" fill="#00674F" fillOpacity="0.24"/>
           <path d="M1.11095 97.2233C0.623725 95.7465 1.27288 93.8526 2.58087 92.9367C3.93482 91.9881 5.93109 92.1841 7.29042 93.3987C8.29718 94.2981 8.46306 94.6834 8.46306 96.121C8.46306 97.5586 8.29718 97.9439 7.29042 98.8433C5.12252 100.78 2.01609 99.966 1.11095 97.2233Z" fill="#00674F" fillOpacity="0.24"/>
           <path opacity="0.8" d="M147.024 71.4525L149.163 69.225L151.303 66.9974L151.602 67.2849L151.901 67.5724L152.166 70.6847L152.432 73.7971L154.62 75.287L156.808 76.777L156.389 77.2134L155.97 77.6498L153.18 77.6463L150.39 77.6427L148.335 79.7821L146.281 81.921L146.003 78.6584L145.725 75.3958L143.348 73.6665L140.971 71.9376L141.241 71.6566L141.511 71.3757L144.267 71.4141L147.024 71.4525Z" fill="#00674F"/>
           <path d="M89.9913 6.53557L91.6608 4.7972L93.3304 3.05882L93.564 3.28318L93.7976 3.50753L94.0046 5.93637L94.2115 8.36525L95.9193 9.52801L97.627 10.6908L97.2999 11.0314L96.9728 11.3719L94.7955 11.3692L92.6182 11.3664L91.0146 13.036L89.4115 14.7052L89.1944 12.159L88.9773 9.6129L87.1227 8.26331L85.2678 6.91408L85.4783 6.69484L85.6889 6.47562L87.8401 6.50559L89.9913 6.53557Z" fill="#00674F"/>
         </svg>
         
         {/* Success Text */}
         <div className="text-center">
           <h2 className="text-2xl font-semibold text-gray-900 mb-2">
             Status Updated
           </h2>
           <p className="text-gray-600">
             The status has been updated
           </p>
         </div>
       </DialogContent>
     )}
     </Dialog>
   )
 }
