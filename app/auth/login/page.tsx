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
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email không được để trống'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Valid credentials
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.error || 'Đăng nhập thất bại' });
        setIsLoading(false);
        return;
      }

      // Simulate successful login
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))
      document.cookie = `auth_token=${data.token}; path=/; max-age=604800`; // Thêm cookie cho middleware

      setIsLoading(false)
      alert('Đăng nhập thành công! Chào mừng bạn đến với KTX Student Housing.')
      router.push('/dashboard')

    } catch (error) {
      setErrors({ submit: 'Đã xảy ra lỗi kết nối' });
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Đăng nhập tài khoản</h1>
            <p className="text-muted-foreground text-sm">
              Đăng nhập để quản lý phòng yêu thích và lịch hẹn của bạn
            </p>
          </div>

          {/* Quick Login - Demo Only */}
          <div className="mb-4 space-y-2">
            <h3 className="text-sm font-semibold mb-2">Tài khoản demo:</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => {
                setFormData(prev => ({ ...prev, email: 'admin@ktx.edu.vn', password: 'admin123' }));
              }}>
                Manager
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => {
                setFormData(prev => ({ ...prev, email: 'sinhvien@ktx.edu.vn', password: 'resident123' }));
              }}>
                Resident
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => {
                setFormData(prev => ({ ...prev, email: 'guest@example.com', password: 'guest123' }));
              }}>
                Guest
              </Button>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg mb-4 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email hoặc Số điện thoại
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className={`pl-10 bg-card border-border focus:ring-primary ${errors.email ? 'border-red-500' : ''
                    }`}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 bg-card border-border focus:ring-primary ${errors.password ? 'border-red-500' : ''
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

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, remember: checked as boolean }))
                  }
                />
                <Label htmlFor="remember" className="text-muted-foreground cursor-pointer">
                  Ghi nhớ đăng nhập
                </Label>
              </div>
              <Link href="/auth/forgot-password" className="text-primary hover:text-[#922d28] font-medium">
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-[#922d28] text-white font-semibold h-12"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">Hoặc tiếp tục với</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="border-border bg-card hover:bg-primary/5"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-border bg-card hover:bg-primary/5"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-muted-foreground mt-8">
            Chưa có tài khoản?{' '}
            <Link href="/auth/register" className="text-primary hover:text-[#922d28] font-semibold">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
      <Footer />

    </main>
  )
}
