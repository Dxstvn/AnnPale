"use client"

import { useEffect, useRef, ReactNode } from "react"

interface FocusTrapProps {
  children: ReactNode
  active?: boolean
  returnFocus?: boolean
}

export function FocusTrap({ 
  children, 
  active = true,
  returnFocus = true 
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    // Store the currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    const container = containerRef.current
    if (!container) return

    // Get all focusable elements
    const getFocusableElements = () => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input[type="text"]:not([disabled])',
        'input[type="radio"]:not([disabled])',
        'input[type="checkbox"]:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ]
      
      return container.querySelectorAll<HTMLElement>(
        focusableSelectors.join(', ')
      )
    }

    // Focus the first focusable element
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    // Handle Tab key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = Array.from(getFocusableElements())
      if (focusableElements.length === 0) return

      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLElement
      )

      if (e.shiftKey) {
        // Shift + Tab
        const nextIndex = currentIndex <= 0 
          ? focusableElements.length - 1 
          : currentIndex - 1
        focusableElements[nextIndex].focus()
      } else {
        // Tab
        const nextIndex = currentIndex >= focusableElements.length - 1
          ? 0
          : currentIndex + 1
        focusableElements[nextIndex].focus()
      }

      e.preventDefault()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      
      // Return focus to the previously focused element
      if (returnFocus && previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [active, returnFocus])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}