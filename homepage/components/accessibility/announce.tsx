"use client"

import { useEffect, useState } from "react"

interface AnnounceProps {
  message: string
  priority?: "polite" | "assertive"
  clearAfter?: number
}

export function Announce({ 
  message, 
  priority = "polite",
  clearAfter = 1000 
}: AnnounceProps) {
  const [announcement, setAnnouncement] = useState("")

  useEffect(() => {
    // Clear previous announcement to ensure it's re-announced
    setAnnouncement("")
    
    // Set new announcement after a brief delay
    const announceTimeout = setTimeout(() => {
      setAnnouncement(message)
    }, 100)

    // Clear announcement after specified time
    const clearTimeout = setTimeout(() => {
      setAnnouncement("")
    }, clearAfter)

    return () => {
      clearTimeout(announceTimeout)
      clearTimeout(clearTimeout)
    }
  }, [message, clearAfter])

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}