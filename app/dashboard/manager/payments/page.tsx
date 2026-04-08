
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
import { CheckCircle, XCircle, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image'

// Define Payment Type locally
type PaymentStatus = 'pending' | 'submitted' | 'paid' | 'rejected';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  title: string;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  createdAt: string;
  method?: string;
  proofImage?: string;
  note?: string;
  submittedAt?: string;
}

const statusConfig = {
  pending: { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800' },
  submitted: { label: 'Cần duyệt', color: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800' },
}

export default function ManagerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  
  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments')
      const data = await res.json()
      setPayments(data.data || [])
    } catch (error) {
      console.error(error)
      toast.error("Không thể tải danh sách hóa đơn")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (status: 'paid' | 'rejected') => {
    if (!selectedPayment) return;

    try {
        const res = await fetch('/api/payments', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: selectedPayment.id,
                action: 'update_status',
                status: status,
                role: 'manager', // Mock role
                userId: selectedPayment.userId // Pass userId for role transition
            })
        })

        if (res.ok) {
            toast.success(status === 'paid' ? "Đã duyệt thanh toán thành công" : "Đã từ chối thanh toán")
            setSelectedPayment(null) // Close dialog
            fetchPayments() // Refresh
        } else {
            toast.error("Cập nhật thất bại")
        }
    } catch (error) {
        toast.error("Có lỗi xảy ra")
    }
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý thanh toán</h1>
            <p className="text-muted-foreground">Duyệt minh chứng và quản lý thu phí.</p>
        </div>
        <Button>+ Tạo khoản phí mới</Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Danh sách giao dịch</CardTitle>
            <CardDescription>Các khoản thanh toán gần đây từ cư dân.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mã</TableHead>
                        <TableHead>Cư dân</TableHead>
                        <TableHead>Khoản phí</TableHead>
                        <TableHead>Số tiền</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày nộp</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell className="font-mono text-xs">{payment.id}</TableCell>
                            <TableCell>
                                <div className="font-medium">{payment.userName}</div>
                                <div className="text-xs text-muted-foreground">{payment.userId}</div>
                            </TableCell>
                            <TableCell>{payment.title}</TableCell>
                            <TableCell className="font-bold">{payment.amount.toLocaleString('vi-VN')} đ</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className={statusConfig[payment.status].color}>
                                    {statusConfig[payment.status].label}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {payment.submittedAt ? new Date(payment.submittedAt).toLocaleDateString('vi-VN') : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => setSelectedPayment(payment)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-150">
                                        <DialogHeader>
                                            <DialogTitle>Chi tiết thanh toán</DialogTitle>
                                            <DialogDescription>
                                                Kiểm tra thông tin và minh chứng chuyển khoản.
                                            </DialogDescription>
                                        </DialogHeader>
                                        
                                        {selectedPayment && (
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Người nộp</span>
                                                        <p>{selectedPayment.userName}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Số tiền</span>
                                                        <p className="text-xl font-bold text-primary">{selectedPayment.amount.toLocaleString()} đ</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Phương thức</span>
                                                        <p className="capitalize">{selectedPayment.method || '-'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-muted-foreground">Ghi chú</span>
                                                        <p>{selectedPayment.note || 'Không có'}</p>
                                                    </div>
                                                </div>

                                                {selectedPayment.proofImage && (
                                                    <div className="space-y-2">
                                                        <span className="text-sm font-medium text-muted-foreground">Minh chứng thanh toán</span>
                                                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                                                            <img 
                                                                src={selectedPayment.proofImage} 
                                                                alt="Payment Proof" 
                                                                className="object-contain w-full h-full"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedPayment.status === 'submitted' && (
                                                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                                        <Button variant="destructive" onClick={() => handleUpdateStatus('rejected')}>
                                                            <XCircle className="mr-2 h-4 w-4" /> Từ chối
                                                        </Button>
                                                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus('paid')}>
                                                            <CheckCircle className="mr-2 h-4 w-4" /> Xác nhận đã nhận tiền
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
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
