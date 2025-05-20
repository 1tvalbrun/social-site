"use client"

import { useState, useEffect, useCallback } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  // Use useCallback to memoize the handler function
  const checkIfMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      // Initial check
      checkIfMobile()

      // Add event listener
      window.addEventListener("resize", checkIfMobile)

      // Clean up
      return () => window.removeEventListener("resize", checkIfMobile)
    }
  }, [checkIfMobile]) // Include checkIfMobile in dependencies array

  return isMobile
}
