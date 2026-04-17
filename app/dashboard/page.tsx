'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/hooks/use-favorites'
import { useEffect, useState } from 'react'
import {
  TrendingUp,
  Calendar,
  Heart,
  CreditCard,
} from 'lucide-react'

export default function DashboardPage() {
  const { isLoaded, favorites } = useFavorites()
  const [user, setUser] = useState<any>(null)
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [statsData, setStatsData] = useState({
      bookingsConfig: 0,
      paymentsPending: 0
  })
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Fetch all data when component mounts or when user changes
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Get User
        const userRes = await fetch('/api/auth/me', { cache: 'no-store' })
        const userData = await userRes.json()
        if (userData.data) {
          setUser(userData.data)
        }

        // 2. Get Bookings  
        const bookingsRes = await fetch('/api/bookings', { cache: 'no-store' })
        const bookingsData = await bookingsRes.json()
        if (bookingsData.data && Array.isArray(bookingsData.data)) {
          // Filter for confirmed/pending and sort by date in ascending order (upcoming first)
          const upcoming = bookingsData.data
            .filter((b: any) => b.status === 'confirmed' || b.status === 'pending')
            .sort((a: any, b: any) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime())
          
          setStatsData(prev => ({ ...prev, bookingsConfig: upcoming.length }))
          setRecentBookings(upcoming.slice(0, 3)) // Take top 3
        }

        // 3. Get Payments
        const paymentsRes = await fetch('/api/payments', { cache: 'no-store' })
        const paymentsData = await paymentsRes.json()
        if (paymentsData.data && Array.isArray(paymentsData.data)) {
          // Count only pending payments (not rejected or paid)
          const pending = paymentsData.data.filter((p: any) => p.status === 'pending').length
          setStatsData(prev => ({ ...prev, paymentsPending: pending }))
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchAllData()
  }, [refreshTrigger])

  // Auto-refresh data every 30 seconds to ensure it stays up-to-date
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1)
    }, 30000)

    return () => clearInterval(interval)
  }, [])
  
  // Real data stats
  const stats = [
    { label: 'Phòng yêu thích', value: isLoaded ? favorites.length : 0, icon: Heart, href: '/dashboard/favorites' },
    { label: 'Lịch sắp tới', value: statsData.bookingsConfig, icon: Calendar, href: '/dashboard/bookings/history' },
    { label: 'Hóa đơn chờ', value: statsData.paymentsPending, icon: CreditCard, href: '/dashboard/payments' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Xin chào, {user ? user.name : '...'}!</h1>
        <p className="text-muted-foreground">Đây là bảng điều khiển của bạn. Quản lý phòng, thanh toán và tất cả thông tin liên quan.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Link key={idx} href={stat.href}>
              <div className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="text-primary" size={24} />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Lịch sắp tới</h2>
            <p className="text-sm text-muted-foreground">Các lịch xem phòng gần đây nhất của bạn</p>
          </div>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/5 bg-transparent">
            <Link href="/dashboard/bookings/history">Xem tất cả</Link>
          </Button>
        </div>

        {recentBookings.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map((booking: any) => {
                let statusColor = 'bg-gray-100 text-gray-800';
                let statusText = 'Đang xử lý';
            
                if (booking.status === 'confirmed') {
                    statusColor = 'bg-green-100 text-green-800';
                    statusText = 'Đã xác nhận';
                } else if (booking.status === 'pending') {
                    statusColor = 'bg-yellow-100 text-yellow-800';
                    statusText = 'Chờ xác nhận';
                } else if (booking.status === 'cancelled') {
                    statusColor = 'bg-red-100 text-red-800';
                    statusText = 'Đã hủy';
                }
            
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{booking.roomName || 'Phòng chưa đặt tên'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                      {statusText}
                    </span>
                  </div>
                )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Bạn chưa có lịch xem phòng nào</p>
            <Button asChild className="bg-primary hover:bg-[#922d28] text-white">
              <Link href="/rooms">Duyệt phòng</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/">
          <div className="bg-primary text-white rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Calendar className="mb-3" size={32} />
            <h3 className="font-bold text-lg mb-1">Đặt lịch xem phòng</h3>
            <p className="text-sm opacity-90">Tìm và đặt lịch xem các phòng mới</p>
          </div>
        </Link>
        <Link href="/dashboard/payments">
          <div className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <CreditCard className="text-primary mb-3" size={32} />
            <h3 className="font-bold text-lg mb-1 text-foreground">Thanh toán</h3>
            <p className="text-sm text-muted-foreground">Quản lý hóa đơn và lịch sử thanh toán</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
