'use client'

import { Bell, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Notification } from '@/lib/mock-db'
import { toast } from 'sonner'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 10 seconds (simulating real-time)
    const interval = setInterval(fetchNotifications, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      if (data.data) {
        setNotifications(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string, currentReadStatus: boolean) => {
    if (currentReadStatus) return;

    try {
        const res = await fetch(`/api/notifications?id=${id}`, { method: 'PUT' });
        if (res.ok) {
             setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, read: true } : n)
             )
             toast.success('Đã đánh dấu là đã đọc')
        }
    } catch (error) {
        toast.error('Lỗi khi cập nhật trạng thái')
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-100 text-blue-800'
      case 'payment':
        return 'bg-orange-100 text-orange-800'
      case 'promo':
        return 'bg-green-100 text-green-800'
      case 'contract':
        return 'bg-purple-100 text-purple-800'
      case 'system':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'booking':
        return 'Đặt lịch'
      case 'payment':
        return 'Thanh toán'
      case 'promo':
        return 'Khuyến mãi'
      case 'contract':
        return 'Hợp đồng'
      case 'system':
        return 'Hệ thống'
      default:
        return 'Thông báo'
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Thông báo</h1>
            <p className="text-muted-foreground">Cập nhật về đặt lịch, thanh toán, khuyến mãi và hơn thế nữa</p>
        </div>
        <Button variant="outline" onClick={fetchNotifications}>Làm mới</Button>
      </div>

      {loading ? (
          <div className="text-center py-10">Đang tải thông báo...</div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 border border-border rounded-lg transition-all ${
                notif.read ? 'bg-white' : 'bg-primary/5 border-primary/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 cursor-pointer" onClick={() => handleMarkAsRead(notif.id, notif.read)}>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${notif.read ? 'text-foreground' : 'text-primary'}`}>
                      {notif.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(notif.type)}`}>
                      {getTypeLabel(notif.type)}
                    </span>
                    {!notif.read && <span className="h-2 w-2 rounded-full bg-red-500"></span>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notif.description}</p>
                  <p className="text-xs text-muted-foreground">
                      {new Date(notif.createdAt).toLocaleDateString('vi-VN')} {new Date(notif.createdAt).toLocaleTimeString('vi-VN')}
                  </p>
                </div>
                <div className="flex gap-2">
                   {!notif.read && (
                       <Button variant="ghost" size="icon" onClick={() => handleMarkAsRead(notif.id, notif.read)} title="Đánh dấu đã đọc">
                           <Check className="h-4 w-4 text-primary" />
                       </Button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Không có thông báo mới</h3>
          <p className="text-muted-foreground">Bạn đã cập nhật tất cả thông tin mới nhất</p>
        </div>
      )}
    </div>
  )
}
