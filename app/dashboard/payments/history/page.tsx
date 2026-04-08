'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Eye } from 'lucide-react'

// Define Payment interface matching API
interface Payment {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'submitted' | 'paid' | 'rejected';
  dueDate: string;
  createdAt: string;
  submittedAt?: string;
  method?: string;
  note?: string;
}

const paymentMethods: Record<string, string> = {
  bank: 'Chuyển khoản',
  wallet: 'Ví điện tử',
  qr: 'QR code',
  counter: 'Tại quầy',
  failed: 'Thất bại',
}

const statusConfig: Record<string, { label: string; color: string }> = {
  paid: {
    label: 'Đã thanh toán',
    color: 'bg-green-100 text-green-800',
  },
  submitted: {
    label: 'Đang chờ duyệt',
    color: 'bg-yellow-100 text-yellow-800',
  },
  pending: {
    label: 'Chưa thanh toán',
    color: 'bg-blue-100 text-blue-800',
  },
  rejected: {
    label: 'Bị từ chối',
    color: 'bg-red-100 text-red-800',
  },
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterMonth, setFilterMonth] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMethod, setFilterMethod] = useState('all')

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch('/api/payments')
        const data = await res.json()
        if (data.data) {
           setPayments(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch payments", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  const filtered = payments.filter((payment) => {
    if (filterStatus !== 'all' && payment.status !== filterStatus) return false
    if (filterMethod !== 'all' && payment.method !== filterMethod) return false
    // Simple month filter - can be improved
    if (filterMonth !== 'all') {
         // Assuming title or period is not always available in format we want, 
         // let's skip strict filtering or implement parsing if needed. 
         // For now, let's just match string if it's simple
         return true; 
    }
    return true
  })

  // Sort by date descending
  const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.submittedAt || a.createdAt).getTime();
      const dateB = new Date(b.submittedAt || b.createdAt).getTime();
      return dateB - dateA;
  });

  return (
    <main className="min-h-screen flex flex-col bg-white">

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Lịch sử thanh toán</h1>
            <p className="text-muted-foreground">
              Xem chi tiết tất cả các khoản thanh toán và tải biên lai
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-4 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Trạng thái</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-white border-border">
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                    <SelectItem value="submitted">Đang chờ duyệt</SelectItem>
                    <SelectItem value="pending">Chưa thanh toán</SelectItem>
                    <SelectItem value="rejected">Bị từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Phương thức</label>
                <Select value={filterMethod} onValueChange={setFilterMethod}>
                  <SelectTrigger className="bg-white border-border">
                    <SelectValue placeholder="Tất cả phương thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả phương thức</SelectItem>
                    <SelectItem value="bank">Chuyển khoản</SelectItem>
                    <SelectItem value="wallet">Ví điện tử</SelectItem>
                    <SelectItem value="qr">QR code</SelectItem>
                    <SelectItem value="counter">Tại quầy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Kỳ thanh toán</label>
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="bg-white border-border">
                    <SelectValue placeholder="Tất cả kỳ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả kỳ</SelectItem>
                    {/* Dynamic generation based on available data would be robust here */}
                    <SelectItem value="2026-03">Tháng 03/2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground font-medium uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Mã HĐ</th>
                    <th className="px-6 py-4">Kỳ thanh toán</th>
                    <th className="px-6 py-4">Ngày thanh toán</th>
                    <th className="px-6 py-4 text-right">Số tiền</th>
                    <th className="px-6 py-4">Phương thức</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                       <tr><td colSpan={7} className="text-center py-8">Đang tải...</td></tr>
                  ) : sorted.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-8">Không có dữ liệu</td></tr>
                  ) : (
                    sorted.map((payment) => {
                        const statusKey = payment.status;
                        const config = statusConfig[statusKey] || statusConfig.pending;
                        const methodLabel = payment.method ? (paymentMethods[payment.method] || payment.method) : '-';
                        return (
                        <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-foreground">{payment.id}</td>
                            <td className="px-6 py-4 text-foreground">{payment.title}</td>
                            <td className="px-6 py-4 text-muted-foreground">
                                {payment.submittedAt 
                                    ? new Date(payment.submittedAt).toLocaleDateString('vi-VN') 
                                    : payment.createdAt 
                                        ? new Date(payment.createdAt).toLocaleDateString('vi-VN')
                                        : '-'}
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-foreground">
                                {payment.amount.toLocaleString('vi-VN')} VND
                            </td>
                            <td className="px-6 py-4 text-foreground">
                                {methodLabel}
                            </td>
                            <td className="px-6 py-4">
                                <Badge className={`${config.color} border-0`}>
                                {config.label}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <Eye size={16} />
                                </Button>
                                {statusKey === 'paid' && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <Download size={16} />
                                    </Button>
                                )}
                                </div>
                            </td>
                        </tr>
                        )
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {!loading && sorted.length > 0 && (
                 <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                 <p className="text-sm text-muted-foreground">Hiển thị {sorted.length} kết quả</p>
                 <div className="flex gap-2">
                   <Button variant="outline" size="sm" disabled>Trước</Button>
                   <Button variant="outline" size="sm" disabled>Sau</Button>
                 </div>
               </div>
            )}
           
          </div>
        </div>
      </div>
    </main>
  )
}
