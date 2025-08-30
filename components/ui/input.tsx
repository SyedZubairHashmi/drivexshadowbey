import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border focus:outline-none focus:ring-1 focus:ring-green-500 placeholder:text-gray-300",
          className
        )}
        style={{
          border: "1px solid rgba(0, 0, 0, 0.24)",
          color: "#00000099"
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
