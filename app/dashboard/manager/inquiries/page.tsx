
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Eye, Phone, MapPin, Calendar, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Reuse Booking type from mock-db but define locally
interface Booking {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  roomName: string;
  status: string;
  checkInDate: string;
  notes: string;
  createdAt: string;
}

const statusConfig = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Đã ký HĐ', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
}

export default function ManagerInquiriesPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings')
      const data = await res.json()
      // Map if necessary, but mock API returns flat structure similar to what we need
      setBookings(data.data || [])
    } catch (error) {
      toast.error("Không thể tải danh sách yêu cầu")
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
      try {
          const res = await fetch('/api/bookings', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, status })
          });
          if (res.ok) {
              toast.success(`Đã cập nhật trạng thái: ${status}`);
              fetchBookings();
          } else {
              toast.error("Thất bại");
          }
      } catch (error) {
          toast.error("Lỗi kết nối");
      }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý yêu cầu thuê</h1>
            <p className="text-muted-foreground">Tiếp nhận và xử lý yêu cầu xem phòng từ sinh viên.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Danh sách yêu cầu mới</CardTitle>
            <CardDescription>Các yêu cầu đặt lịch xem phòng cần xử lý.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>Thông tin liên hệ</TableHead>
                        <TableHead>Nhu cầu thuê</TableHead>
                        <TableHead>Ngày hẹn</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                            <TableCell>
                                <div className="font-medium">{booking.fullName}</div>
                                <div className="text-xs text-muted-foreground">Đăng ký: {new Date(booking.createdAt).toLocaleDateString('vi-VN')}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} className="text-muted-foreground" />
                                        <span>{booking.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-muted-foreground" />
                                        <span>{booking.email}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium text-sm">{booking.roomName || 'Chưa chọn phòng'}</div>
                                <div className="text-xs text-muted-foreground italic">{booking.notes}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    <span>{new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className={statusConfig[booking.status as keyof typeof statusConfig]?.color}>
                                    {statusConfig[booking.status as keyof typeof statusConfig]?.label || booking.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">

                                    <div className="flex justify-end gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                                                    <Eye size={16} className="mr-2" /> Chi tiết
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px]">
                                                <DialogHeader>
                                                    <DialogTitle>Chi tiết yêu cầu #{booking.id}</DialogTitle>
                                                    <DialogDescription>
                                                        Xem thông tin chi tiết và xử lý yêu cầu.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <span className="text-sm font-medium text-muted-foreground">Họ tên</span>
                                                            <p className="font-medium">{booking.fullName}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-medium text-muted-foreground">Số điện thoại</span>
                                                            <p>{booking.phone}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-medium text-muted-foreground">Email</span>
                                                            <p>{booking.email}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-medium text-muted-foreground">Ngày đăng ký</span>
                                                            <p>{new Date(booking.createdAt).toLocaleDateString('vi-VN')}</p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className="text-sm font-medium text-muted-foreground">Phòng quan tâm</span>
                                                            <p className="font-medium text-primary">{booking.roomName}</p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className="text-sm font-medium text-muted-foreground">Ngày hẹn xem</span>
                                                            <p className="font-bold flex items-center gap-2">
                                                                <Calendar size={16} /> 
                                                                {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}
                                                            </p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className="text-sm font-medium text-muted-foreground">Ghi chú</span>
                                                            <div className="bg-muted p-3 rounded-md text-sm italic">
                                                                {booking.notes || "Không có ghi chú"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center bg-gray-50 p-4 -mx-6 -mb-6 rounded-b-lg">
                                                    <div>
                                                        <span className="text-xs text-muted-foreground uppercase font-bold pr-2">Trạng thái hiện tại:</span> 
                                                        <Badge variant="outline" className={statusConfig[booking.status as keyof typeof statusConfig]?.color}>
                                                            {statusConfig[booking.status as keyof typeof statusConfig]?.label || booking.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            variant="destructive" 
                                                            size="sm" 
                                                            disabled={booking.status === 'cancelled'}
                                                            onClick={() => updateStatus(booking.id, 'cancelled')}
                                                        >
                                                            Hủy
                                                        </Button>
                                                        {booking.status !== 'confirmed' && (
                                                            <Button 
                                                                className="bg-green-600 hover:bg-green-700" 
                                                                size="sm"
                                                                onClick={() => updateStatus(booking.id, 'confirmed')}
                                                            >
                                                                Xác nhận
                                                            </Button>
                                                        )}
                                                        {booking.status === 'confirmed' && (
                                                            <Button 
                                                                className="bg-blue-600 hover:bg-blue-700" 
                                                                size="sm"
                                                                onClick={() => updateStatus(booking.id, 'completed')}
                                                            >
                                                                Đã ký HĐ
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}
