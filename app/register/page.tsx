'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2 } from 'lucide-react'

const roomTypes = ['Standard', 'Premium', 'VIP']

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    school: '',
    roomType: '',
    checkInDate: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (formData.fullName.length < 2) {
      newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự'
    }

    if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (formData.school.length < 3) {
      newErrors.school = 'Tên trường/khoa quá ngắn'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Gửi thông tin thất bại')
      }

      setSubmitted(true)
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          school: '',
          roomType: '',
          checkInDate: '',
          notes: '',
        })
      }, 3000)

    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Có lỗi xảy ra, vui lòng thử lại sau!')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 size={64} className="text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Đăng ký thành công!</h1>
              <p className="text-muted-foreground">
                Chúng tôi sẽ liên hệ với bạn sớm nhất để tư vấn chi tiết
              </p>
            </div>
            <Button asChild className="w-full bg-primary hover:bg-[#922d28] text-white">
              <a href="/">Quay lại trang chủ</a>
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Page Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">Đăng ký thuê phòng nhanh</h1>
          <p className="text-lg text-muted-foreground">
            Điền thông tin để chúng tôi gọi điện và tư vấn nhanh cho bạn
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8 space-y-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Họ và tên <span className="text-primary">*</span>
                </label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  required
                  className="border-border bg-white text-foreground"
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Số điện thoại <span className="text-primary">*</span>
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0908 123 456"
                    required
                    className="border-border bg-white text-foreground"
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Email <span className="text-primary">*</span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                    className="border-border bg-white text-foreground"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
              </div>

              {/* School */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Trường / Khoa <span className="text-primary">*</span>
                </label>
                <Input
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="Ví dụ: Đại học Bách khoa - Ngành CNTT"
                  required
                  className="border-border bg-white text-foreground"
                />
                {errors.school && <p className="text-red-500 text-sm">{errors.school}</p>}
              </div>

              {/* Room Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Loại phòng mong muốn <span className="text-primary">*</span>
                </label>
                <Select value={formData.roomType} onValueChange={(value) => handleSelectChange('roomType', value)}>
                  <SelectTrigger className="border-border bg-white text-foreground">
                    <SelectValue placeholder="Chọn loại phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Check-in Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Ngày dự kiến nhận phòng <span className="text-primary">*</span>
                </label>
                <Input
                  name="checkInDate"
                  type="date"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  required
                  className="border-border bg-white text-foreground"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Ghi chú (tuỳ chọn)
                </label>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Có yêu cầu hoặc câu hỏi gì không? Chia sẻ với chúng tôi..."
                  className="border-border bg-white text-foreground min-h-28"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-[#922d28] text-white py-2.5"
                size="lg"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi đơn đăng ký'}
              </Button>
            </form>

            {/* Info Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>Lưu ý:</strong> Các trường được đánh dấu <span className="text-primary">*</span> là bắt buộc. Chúng tôi sẽ
                xác nhận chỗ phòng qua điện thoại hoặc email trong 24 giờ.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
