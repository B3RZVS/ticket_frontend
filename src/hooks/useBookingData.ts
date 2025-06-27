"use client"

import { useState, useEffect } from "react"
import type { BookingData } from "../types/booking"

export const useBookingData = () => {
  const [data, setData] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call or load from localStorage
    const loadData = async () => {
      try {
        setLoading(true)

        // Mock data based on the image
        const mockData: BookingData = {
          guestPayment: {
            pricePerNight: 899.67,
            nights: 3,
            totalAccommodation: 2699.0,
            cleaningFees: 120.0,
            serviceCommission: 0.0,
            total: 2819.0,
          },
          hostCollection: {
            accommodationPrice: 2699.0,
            cleaningFees: 120.0,
            serviceCommission: -422.85,
            commissionRate: 15.0,
            total: 2396.15,
          },
          bookingId: "BK-2024-001",
          checkIn: "2024-01-15",
          checkOut: "2024-01-18",
        }

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setData(mockData)
      } catch (err) {
        setError("Error loading booking data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { data, loading, error, setData }
}
