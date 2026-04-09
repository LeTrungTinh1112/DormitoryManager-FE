'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { CreditCard, Download, Phone, Zap, Droplets, Wifi, AlertCircle } from 'lucide-react'

// Define Payment interface matching API
interface Payment {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'submitted' | 'paid' | 'rejected';
  dueDate: string;
  createdAt: string;
}

export default function PaymentPage() {
  const { toast } = useToast()
  const [selectedMethod, setSelectedMethod] = useState('bank')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success'>('idle')
  const [currentInvoice, setCurrentInvoice] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [discountCodeInput, setDiscountCodeInput] = useState('')
  const [discountError, setDiscountError] = useState('')
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)
  const [proofImage, setProofImage] = useState<string | null>(null)

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments')
      const data = await res.json()
      if (data.data) {
        // Find first pending payment
        const pending = data.data.find((p: Payment) => p.status === 'pending')
        if (pending) {
          // Map to UI invoice format
          setCurrentInvoice({
            id: pending.id,
            period: pending.title, // Use title as period desc
            room: 'Phòng của bạn', // Generic
            roomPrice: (pending as any).originalAmount || pending.amount,
            electricity: 0,
            water: 0,
            internet: 0,
            discount: (pending as any).discountAmount || 0,
            appliedDiscountCode: (pending as any).discountCode,
            total: pending.amount,
            dueDate: pending.dueDate,
            status: pending.status,
            note: (pending as any).note,
          })
        } else {
          setCurrentInvoice(null)
        }
      }
    } catch (error) {
      console.error("Failed to load payments", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const handleApplyDiscount = async () => {
    if (!discountCodeInput.trim()) {
      setDiscountError('Vui lòng nhập mã giảm giá')
      return;
    }

    setIsApplyingDiscount(true)
    setDiscountError('')
    try {
      const res = await fetch('/api/payments/apply-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: currentInvoice.id,
          discountCode: discountCodeInput.trim()
        })
      })

      const result = await res.json()
      if (res.ok && result.success) {
        // Refetch to get updated amounts
        await fetchPayments()
      } else {
        setDiscountError(result.error || result.message || 'Mã giảm giá không hợp lệ')
      }
    } catch (error) {
      setDiscountError('Có lỗi xảy ra khi áp dụng mã')
    } finally {
      setIsApplyingDiscount(false)
    }
  }

  const handlePayment = async () => {
    if (selectedMethod === 'bank' && !proofImage) {
      toast({
        variant: 'destructive',
        title: 'Thiếu minh chứng',
        description: 'Vui lòng tải lên minh chứng thanh toán ngân hàng.',
      });
      return;
    }
    setIsProcessing(true)
    try {
      const response = await fetch('/api/payments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submit_proof',
          id: currentInvoice.id,
          method: selectedMethod,
          proofImage: proofImage || 'https://placehold.co/300x500?text=Payment+Proof',
          note: `Thanh toán qua ${selectedMethod}`
        }),
      });

      if (response.ok) {
        setPaymentStatus('success')
      } else {
        console.error("Payment failed", await response.text());
      }
    } catch (error) {
      console.error("Payment error", error);
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>
  }

  if (!currentInvoice && paymentStatus !== 'success') {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-xl font-bold text-foreground">Không có hóa đơn cần thanh toán</h2>
            <p className="text-muted-foreground mt-2">Bạn đã hoàn thành tất cả nghĩa vụ tài chính.</p>
            <Button asChild className="mt-6" variant="outline">
              <Link href="/dashboard">Về trang chủ</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  if (paymentStatus === 'success') {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Thanh toán thành công!</h2>
            <p className="text-muted-foreground mb-6">
              Hóa đơn {currentInvoice?.id} đã được thanh toán. Vui lòng kiểm tra email để nhận biên lai.
            </p>
            <div className="space-y-3">
              <Button
                asChild
                className="w-full bg-primary hover:bg-[#922d28] text-white"
              >
                <Link href="/dashboard/payments/history">Xem lịch sử thanh toán</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
              >
                <Link href="/dashboard/profile">Quay lại hồ sơ</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Thanh toán</h1>
            <p className="text-muted-foreground">
              Quản lý khoản thanh toán tiền phòng, điện, nước và các dịch vụ khác
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Invoice Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Invoice Card */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <div className="flex items-start justify-between pb-6 border-b border-border">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Hóa đơn hiện tại</h2>
                    <p className="text-sm text-muted-foreground mt-1">Mã HĐ: {currentInvoice.id}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800 border-0">
                    {currentInvoice.status === 'unpaid' || currentInvoice.status === 'pending' ? 'Chưa thanh toán' : 'Đã thanh toán'}
                  </Badge>
                </div>

                {/* Invoice Details */}
                <div className="space-y-4">
                  {currentInvoice.note && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4 border border-red-200">
                      <strong>Lưu ý:</strong> {currentInvoice.note}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Kỳ thanh toán:</span>
                    <span className="font-semibold text-foreground">{currentInvoice.period}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Phòng:</span>
                    <span className="font-semibold text-foreground">{currentInvoice.room}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Hạn thanh toán:</span>
                    <span className="font-semibold text-foreground">
                      {new Date(currentInvoice.dueDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 py-6 border-t border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏠</span>
                      <span className="text-muted-foreground">Tổng tiền</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {currentInvoice.roomPrice.toLocaleString('vi-VN')} VND
                    </span>
                  </div>
                  {currentInvoice.discount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">✨</span>
                        <span>Giảm giá ({currentInvoice.appliedDiscountCode})</span>
                      </div>
                      <span className="font-semibold">
                        -{currentInvoice.discount.toLocaleString('vi-VN')} VND
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-6">
                  <span className="text-xl font-bold text-foreground">Tổng thanh toán:</span>
                  <span className="text-3xl font-bold text-primary">
                    {currentInvoice.total.toLocaleString('vi-VN')} VND
                  </span>
                </div>

                {/* Discount Code */}
                {!currentInvoice.appliedDiscountCode && (
                  <div className="pt-4 border-t border-border mt-4">
                    <label className="text-sm font-medium text-foreground mb-2 block">Mã giảm giá</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nhập mã giảm giá"
                        value={discountCodeInput}
                        onChange={(e) => setDiscountCodeInput(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyDiscount}
                        disabled={isApplyingDiscount}
                      >
                        {isApplyingDiscount ? 'Đang áp dụng...' : 'Áp dụng'}
                      </Button>
                    </div>
                    {discountError && <p className="text-red-500 text-xs mt-2">{discountError}</p>}
                  </div>
                )}
              </div>


              {/* Payment Methods */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-bold text-foreground mb-6">Chọn phương thức thanh toán</h3>

                <div className="space-y-3">
                  {/* Bank Transfer */}
                  <button
                    onClick={() => setSelectedMethod('bank')}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedMethod === 'bank'
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-white hover:bg-primary/5'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard size={24} className={selectedMethod === 'bank' ? 'text-primary' : 'text-muted-foreground'} />
                      <div>
                        <p className="font-semibold text-foreground">Chuyển khoản ngân hàng</p>
                        <p className="text-sm text-muted-foreground">VietcomBank - 1234567890</p>
                      </div>
                    </div>
                  </button>

                  {/* QR Payment */}
                  <button
                    onClick={() => setSelectedMethod('qr')}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedMethod === 'qr'
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-white hover:bg-primary/5'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-current rounded-sm shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">QR Thanh toán</p>
                        <p className="text-sm text-muted-foreground">Quét mã QR để thanh toán</p>
                      </div>
                    </div>
                  </button>

                  {/* E-Wallet */}
                  <button
                    onClick={() => setSelectedMethod('wallet')}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedMethod === 'wallet'
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-white hover:bg-primary/5'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard size={24} className={selectedMethod === 'wallet' ? 'text-primary' : 'text-muted-foreground'} />
                      <div>
                        <p className="font-semibold text-foreground">Ví điện tử</p>
                        <p className="text-sm text-muted-foreground">Momo, ZaloPay</p>
                      </div>
                    </div>
                  </button>

                  {/* Counter Payment */}
                  <button
                    onClick={() => setSelectedMethod('counter')}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedMethod === 'counter'
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-white hover:bg-primary/5'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard size={24} className={selectedMethod === 'counter' ? 'text-primary' : 'text-muted-foreground'} />
                      <div>
                        <p className="font-semibold text-foreground">Thanh toán tại quầy</p>
                        <p className="text-sm text-muted-foreground">Liên hệ ban quản lý để hẹn giờ</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="lg:col-span-1 space-y-4 h-fit">
              {/* Alert */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <AlertCircle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900 text-sm">Quá hạn thanh toán</p>
                  <p className="text-xs text-yellow-800 mt-1">
                    Vui lòng thanh toán trước {new Date(currentInvoice.dueDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Upload Proof */}
              <div className="bg-card border border-border rounded-lg p-4">
                <label className="block text-sm font-semibold text-foreground mb-2">Tải lên minh chứng thanh toán</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Mock reading file as data URL to preview/send
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setProofImage(event.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary/10 file:text-primary
                    hover:file:bg-primary/20
                    cursor-pointer"
                />
                {proofImage && (
                  <div className="mt-3">
                    <p className="text-xs text-green-600 mb-1">Đã tải lên minh chứng</p>
                    <img src={proofImage} alt="Payment Proof" className="max-h-32 rounded border border-border" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-[#922d28] text-white h-12 font-semibold"
              >
                {isProcessing ? 'Đang xử lý...' : 'Thanh toán ngay'}
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent h-11"
              >
                <a href="#">
                  <Download size={18} className="mr-2" />
                  Tải hóa đơn PDF
                </a>
              </Button>

              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent h-11"
              >
                <Phone size={18} className="mr-2" />
                Liên hệ hỗ trợ
              </Button>

              {/* Info Box */}
              <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-foreground">Thông tin thanh toán</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Trạng thái</p>
                    <p className="font-semibold text-foreground">Chưa thanh toán</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Số tiền</p>
                    <p className="font-semibold text-foreground">
                      {currentInvoice.total.toLocaleString('vi-VN')} VND
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  )
}
