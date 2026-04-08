'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, MapPin, User, Calendar, Phone, X, RotateCcw, Phone as CallIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const ITEMS_PER_PAGE = 9

const statusConfig = {
  pending: {
    label: 'Chờ xác nhận',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: 'bg-blue-100 text-blue-800',
    icon: Calendar,
  },
  completed: {
    label: 'Đã hoàn thành',
    color: 'bg-green-100 text-green-800',
    icon: Calendar,
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800',
    icon: X,
  },
}

interface Booking {
  id: string;
  roomName: string;
  roomImage: string;
  bookingDate: string; // From checkInDate
  appointmentTime: string;
  manager: string;
  managerPhone: string;
  status: string;
  notes: string;
}

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings')
        if (response.ok) {
          const result = await response.json()
          // Map API data to UI structure if needed, or rely on API matching
          const mappedBookings = result.data.map((b: any) => ({
            id: b.id,
            roomName: b.roomName || `Phòng ${b.roomType}`,
            roomImage: b.roomImage || 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500&h=300&fit=crop',
            bookingDate: b.checkInDate || b.createdAt,
            appointmentTime: '09:00', // Default
            manager: b.manager || 'Chưa phân công',
            managerPhone: b.managerPhone || '',
            status: b.status,
            notes: b.notes
          }))
          setBookings(mappedBookings)
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const filteredBookings = selectedStatus === 'all'
    ? bookings
    : bookings.filter((booking) => booking.status === selectedStatus)

  // Reset page when status filter changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [selectedStatus])

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Lịch sử đặt lịch</h1>
            <p className="text-muted-foreground">
              Quản lý lịch hẹn xem phòng và tư vấn thuê phòng của bạn
            </p>
          </div>

          {/* Filter */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="w-full sm:w-64">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả lịch hẹn</SelectItem>
                  <SelectItem value="pending">Chờ xác nhận</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="completed">Đã hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Hiển thị {filteredBookings.length} lịch hẹn
            </p>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              <>
                <div className="space-y-4">
                {paginatedBookings.map((booking) => {
                const status = statusConfig[booking.status as keyof typeof statusConfig]
                const StatusIcon = status.icon

                return (
                  <div
                    key={booking.id}
                    className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow"
                  >
                    {/* Top Row */}
                    <div className="flex flex-col sm:flex-row gap-4 pb-4 border-b border-border">
                      {/* Image */}
                      <div className="relative w-full sm:w-24 h-24 flex-shrink-0">
                        <Image
                          src={booking.roomImage}
                          alt={booking.roomName}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-bold text-foreground text-lg">{booking.roomName}</h3>
                            <p className="text-sm text-muted-foreground">Mã lịch: {booking.id}</p>
                          </div>
                          <Badge className={`${status.color} border-0 flex-shrink-0`}>
                            {status.label}
                          </Badge>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                          <div className="text-sm">
                            <p className="text-muted-foreground mb-0.5">Ngày đặt</p>
                            <p className="font-semibold text-foreground">
                              {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div className="text-sm">
                            <p className="text-muted-foreground mb-0.5">Thời gian</p>
                            <p className="font-semibold text-foreground">{booking.appointmentTime}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-muted-foreground mb-0.5">Quản lý</p>
                            <p className="font-semibold text-foreground">{booking.manager}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-muted-foreground mb-0.5">SĐT</p>
                            <p className="font-semibold text-foreground">{booking.managerPhone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes & Actions */}
                    <div className="space-y-4">
                      {booking.notes && (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                          <p className="text-sm text-foreground">
                            <span className="font-semibold">Ghi chú:</span> {booking.notes}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link href={`/rooms/${booking.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
                          >
                            Xem chi tiết
                          </Button>
                        </Link>

                        {booking.status === 'pending' && (
                          <Button
                            variant="outline"
                            className="flex-1 border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                          >
                            <X size={16} className="mr-1" />
                            Hủy lịch
                          </Button>
                        )}

                        {booking.status === 'confirmed' && (
                          <Button
                            variant="outline"
                            className="flex-1 border-primary text-primary hover:bg-primary/5 bg-transparent"
                          >
                            <RotateCcw size={16} className="mr-1" />
                            Đặt lại
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          className="flex-1 border-primary text-primary hover:bg-primary/5 bg-transparent"
                        >
                          <CallIcon size={16} className="mr-1" />
                          Liên hệ quản lý
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-border hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`min-w-10 h-10 rounded-lg border transition-colors font-medium text-sm ${
                              currentPage === page
                                ? 'bg-primary text-white border-primary'
                                : 'border-border hover:bg-card'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-border hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Trang {currentPage} / {totalPages} - Hiển thị {paginatedBookings.length} / {filteredBookings.length} lịch
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-card rounded-lg border border-border">
                <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">Không có lịch hẹn nào</p>
              </div>
            )}
          </div>

          {/* Back to Rooms */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Muốn đặt lịch xem phòng mới?</p>
            <Link href="/rooms">
              <Button className="bg-primary hover:bg-[#922d28] text-white">
                Xem danh sách phòng
              </Button>
            </Link>
          </div>
        </div>
      </div>

    </main>
  )
}
