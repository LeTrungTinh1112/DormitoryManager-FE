'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    school: '',
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName) {
      newErrors.fullName = 'Họ tên không được để trống'
    }

    if (!formData.email) {
      newErrors.email = 'Email không được để trống'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.phone) {
      newErrors.phone = 'Số điện thoại không được để trống'
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        router.push('/auth/login');
      } else {
        setErrors(prev => ({ ...prev, apiError: data.error || 'Đăng ký thất bại' }));
        alert(data.error || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Đã xảy ra lỗi khi kết nối đến máy chủ');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Tạo tài khoản mới</h1>
            <p className="text-muted-foreground">
              Đăng ký tài khoản để lưu phòng yêu thích và quản lý lịch hẹn
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground font-medium">
                Họ và tên <span className="text-primary">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className={`bg-card border-border focus:ring-primary ${
                  errors.fullName ? 'border-red-500' : ''
                }`}
              />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email <span className="text-primary">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className={`bg-card border-border focus:ring-primary ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">
                  Số điện thoại <span className="text-primary">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0123456789"
                  className={`bg-card border-border focus:ring-primary ${
                    errors.phone ? 'border-red-500' : ''
                  }`}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Mật khẩu <span className="text-primary">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`pr-10 bg-card border-border focus:ring-primary ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                  Xác nhận mật khẩu <span className="text-primary">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`pr-10 bg-card border-border focus:ring-primary ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Gender & School (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground font-medium">
                  Giới tính (Tùy chọn)
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="school" className="text-foreground font-medium">
                  Trường / Khoa (Tùy chọn)
                </Label>
                <Input
                  id="school"
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="VD: ĐH Bách Khoa Hà Nội"
                  className="bg-card border-border focus:ring-primary"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
              <Checkbox
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))
                }
              />
              <div className="flex-1">
                <label htmlFor="agreeTerms" className="text-sm text-muted-foreground cursor-pointer">
                  Tôi đồng ý với{' '}
                  <Link href="/terms" className="text-primary hover:text-[#922d28] font-semibold">
                    Điều khoản dịch vụ
                  </Link>{' '}
                  và{' '}
                  <Link href="/privacy" className="text-primary hover:text-[#922d28] font-semibold">
                    Chính sách bảo mật
                  </Link>
                </label>
                {errors.agreeTerms && <p className="text-sm text-red-500 mt-1">{errors.agreeTerms}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-[#922d28] text-white font-semibold h-12"
            >
              {isLoading ? 'Đang xử lý...' : 'Tạo tài khoản'}
            </Button>

            {/* Login Link */}
            <p className="text-center text-muted-foreground">
              Đã có tài khoản?{' '}
              <Link href="/auth/login" className="text-primary hover:text-[#922d28] font-semibold">
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  )
}
