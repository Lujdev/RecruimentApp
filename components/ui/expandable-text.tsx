"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ExpandableTextProps {
  text: string
  maxLength?: number
  className?: string
  showButton?: boolean
  buttonText?: {
    expand: string
    collapse: string
  }
}

export function ExpandableText({ 
  text, 
  maxLength = 100, 
  className = "",
  showButton = true,
  buttonText = {
    expand: "Leer más",
    collapse: "Leer menos"
  }
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const shouldTruncate = text.length > maxLength
  const displayText = isExpanded || !shouldTruncate ? text : text.slice(0, maxLength) + "..."
  
  if (!shouldTruncate) {
    return <span className={className}>{text}</span>
  }
  
  return (
    <div className={className}>
      <span>{displayText}</span>
      {showButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 h-auto p-0 text-xs text-blue-600 hover:text-blue-800 underline hover:no-underline transition-all duration-200 bg-transparent border-none cursor-pointer"
        >
          {isExpanded ? (
            <>
              {buttonText.collapse}
              <ChevronUp className="ml-1 h-3 w-3 inline" />
            </>
          ) : (
            <>
              {buttonText.expand}
              <ChevronDown className="ml-1 h-3 w-3 inline" />
            </>
          )}
        </button>
      )}
    </div>
  )
}
