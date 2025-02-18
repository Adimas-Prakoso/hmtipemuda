'use client'

import { useEffect } from 'react'

export function ClientMonitor() {
  useEffect(() => {
    const monitorVisit = async () => {
      try {
        await fetch('/api/monitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        console.error('Error monitoring visit:', error)
      }
    }

    monitorVisit()
  }, []) // Jalankan sekali saat komponen dimount

  return null // Komponen ini tidak merender apapun
}
