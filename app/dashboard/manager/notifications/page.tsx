'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Send, BellRing } from 'lucide-react'
import { Notification } from '@/lib/mock-db'

export default function ManagerNotificationsPage() {
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('system')
  const [targetUser, setTargetUser] = useState('all')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      // Re-use existing GET to fetch all for display
      const res = await fetch('/api/manager/notifications')
      const data = await res.json()
      if (data.data) {
        setNotifications(data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/manager/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type,
          userId: targetUser
        })
      })

      if (res.ok) {
        toast.success('Gửi thông báo thành công')
        setTitle('')
        setDescription('')
        setType('system')
        setTargetUser('all')
        fetchHistory()
      } else {
        toast.error('Có lỗi xảy ra')
      }
    } catch (error) {
      toast.error('Không thể gửi thông báo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kênh Thông Báo</h1>
        <p className="text-muted-foreground">Tạo và gửi thông báo đến cư dân ký túc xá</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Soạn thông báo
            </CardTitle>
            <CardDescription>Gửi thông báo mới trực tiếp tới ứng dụng của sinh viên</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Đối tượng nhận</Label>
                <Select value={targetUser} onValueChange={setTargetUser}>
                  <SelectTrigger>
                     <SelectValue placeholder="Chọn đối tượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả cư dân</SelectItem>
                    <SelectItem value="resident">Thử nghiệm (Gửi user Resident mẫu)</SelectItem>
                    {/* In a real app we would load actual residents here */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Phân loại</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                     <SelectValue placeholder="Loại thông báo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">Tin tức/Hệ thống</SelectItem>
                    <SelectItem value="payment">Tài chính/Công nợ</SelectItem>
                    <SelectItem value="contract">Quy định/Hợp đồng</SelectItem>
                    <SelectItem value="promo">Sự kiện/Khuyến mãi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tiêu đề</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nhập tiêu đề ngắn gọn..." />
              </div>

              <div className="space-y-2">
                <Label>Nội dung chi tiết</Label>
                <Textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Nhập nội dung đầy đủ của thông báo..."
                  rows={5}
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-[#922d28] text-white" disabled={loading}>
                {loading ? 'Đang gửi...' : 'Phát đi thông báo'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-blue-600" />
              Lịch sử phát thông báo
            </CardTitle>
            <CardDescription>Các thông báo gần đây đã được gửi</CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{notif.title}</h4>
                        <p className="text-sm text-gray-500">Gửi tới: {notif.userId === 'all' ? 'Tất cả cư dân' : notif.userId}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(notif.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{notif.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">Chưa có thông báo nào được phát</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
