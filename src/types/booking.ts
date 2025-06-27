export interface BookingData {
  guestPayment: {
    pricePerNight: number
    nights: number
    totalAccommodation: number
    cleaningFees: number
    serviceCommission: number
    total: number
  }
  hostCollection: {
    accommodationPrice: number
    cleaningFees: number
    serviceCommission: number
    commissionRate: number
    total: number
  }
  bookingId?: string
  checkIn?: string
  checkOut?: string
}
