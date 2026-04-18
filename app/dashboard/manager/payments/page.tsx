
'use client'

import { useState, useEffect, useMemo } from 'react'
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
  
  // STATE & LOGIC: BẢNG TƯƠNG TÁC (INTERACTIVE TABLE) - CHỌN/XÓA HÀNG LOẠT
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments')
      const data = await res.json()
      setPayments(data.data || [])
      setSelectedIds([]) // Reset chọn khi data mới load
    } catch (error) {
      console.error(error)
      toast.error("Không thể tải danh sách hóa đơn")
    } finally {
      setIsLoading(false)
    }
  }

  // ==========================================
  // THUẬT TOÁN 1: LIVE SEARCH TRÊN BẢNG GIỐNG NHƯ FILE EXAM-TEST
  // ==========================================
  const filteredPayments = useMemo(() => {
    if (!searchQuery.trim()) return payments;
    return payments.filter((payment) =>
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [payments, searchQuery]);

  // ==========================================
  // THUẬT TOÁN 2: CHỨC NĂNG CHECKBOX XẢ PHẲNG TỪ BÀI THỰC HÀNH
  // ==========================================
  // Cờ: true nếu TẤT CẢ các dòng THỎA MÃN TÌM KIẾM đều được click chọn
  const isAllSelected = filteredPayments.length > 0 && selectedIds.length === filteredPayments.length;
  const hasSelection = selectedIds.length > 0;

  const handleToggleAll = () => {
    if (isAllSelected) {
      // Đang chọn hết -> Click cái thành Hủy
      setSelectedIds([]); 
    } else {
      // Nhờ dùng filteredPayments mà ta chỉ bốc các ID của những người thỏa mãn ô tìm kiếm
      setSelectedIds(filteredPayments.map((p) => p.id)); 
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // ==========================================
  // THUẬT TOÁN 3: DUYỆT THU TIỀN HÀNG LOẠT (BULK APPROVE) 
  // Nút này disable nếu selectedIds rỗng
  // ==========================================
  const handleBulkApprove = async () => {
    const confirm = window.confirm(`Bạn có chắc chắn muốn XÁC NHẬN THU TIỀN ${selectedIds.length} giao dịch đã chọn không?`);
    if (confirm) {
      try {
        // Map chạy vòng lặp call API liên tục cho các ID được chọn (như trong bài thi Admin)
        await Promise.all(
          selectedIds.map(async (id) => {
            const payment = payments.find(p => p.id === id);
            if (!payment) return;
            await fetch('/api/payments', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  id: id,
                  action: 'update_status',
                  status: 'paid',
                  role: 'manager',
                  userId: payment.userId
              })
            })
          })
        );
        toast.success(`Đã nhận tiền ${selectedIds.length} hóa đơn thành công!`);
        fetchPayments();
      } catch (error) {
        toast.error("Có lỗi xảy ra trong quá trình thu tiền tự động");
      }
    }
  };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý thanh toán</h1>
            <p className="text-muted-foreground">Duyệt minh chứng và quản lý thu phí sinh viên.</p>
        </div>
        
        {/* Nút chức năng chọn nhiều - Ứng dụng bài InteractiveTable */}
        <div className="flex items-center gap-2">
          {hasSelection && (
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleBulkApprove}
            >
              Thu tiền hàng loạt ({selectedIds.length})
            </Button>
          )}
          <Button variant="outline">+ Tạo khoản phí mới</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Danh sách giao dịch</CardTitle>
                <CardDescription>Các khoản thanh toán gần đây từ cư dân. Đã tích hợp Live Search.</CardDescription>
              </div>
              
              {/* KHU VỰC LIVE SEARCH BẢNG */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Tra mã HĐ, SV, Khoản thu..."
                  className="px-3 py-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        {/* Cột Tích tất cả */}
                        <TableHead className="w-[50px]">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded cursor-pointer accent-primary"
                              checked={isAllSelected}
                              onChange={handleToggleAll}
                            />
                        </TableHead>
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
                    {filteredPayments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                            Không tìm thấy dữ liệu thanh toán nào 
                          </TableCell>
                        </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                              <TableCell>
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded cursor-pointer accent-primary"
                                    checked={selectedIds.includes(payment.id)}
                                    // Chặn tick với các giao dịch đỏ hoặc xanh lặp lại
                                    disabled={payment.status === 'paid' || payment.status === 'rejected'}
                                    onChange={() => handleSelectOne(payment.id)}
                                  />
                              </TableCell>
                              <TableCell className="font-mono text-xs text-muted-foreground">{payment.id.split('-')[0]}</TableCell>
                              <TableCell>
                                  <div className="font-medium">{payment.userName}</div>
                                  <div className="text-xs text-muted-foreground truncate w-24">{payment.userId}</div>
                              </TableCell>
                              <TableCell className="max-w-[150px] truncate">{payment.title}</TableCell>
                              <TableCell className="font-bold whitespace-nowrap">{payment.amount.toLocaleString('vi-VN')} đ</TableCell>
                              <TableCell>
                                  <Badge variant="secondary" className={`whitespace-nowrap ${statusConfig[payment.status].color}`}>
                                      {statusConfig[payment.status].label}
                                  </Badge>
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                                  {payment.submittedAt ? new Date(payment.submittedAt).toLocaleDateString('vi-VN') : '-'}
                              </TableCell>
                              <TableCell className="text-right">
                                  <Dialog>
                                      <DialogTrigger asChild>
                                          <Button variant="ghost" size="sm" onClick={() => setSelectedPayment(payment)}>
                                              Chi tiết
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
                      ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}
