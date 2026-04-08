'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSubmitted(true)
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {isSubmitted ? (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Đã gửi email khôi phục</h1>
                <p className="text-muted-foreground">
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <strong>{email}</strong>. 
                  Vui lòng kiểm tra hộp thư của bạn (cả mục spam/rác).
                </p>
              </div>
              <div className="pt-4">
                <Button asChild className="w-full bg-transparent border border-border text-foreground hover:bg-muted">
                  <Link href="/auth/login">
                    Quay lại đăng nhập
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Quên mật khẩu?</h1>
                <p className="text-muted-foreground">
                  Nhập email đăng ký của bạn để nhận hướng dẫn đặt lại mật khẩu
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-9 bg-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-[#922d28] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                  </Button>
                  
                  <Button asChild variant="link" className="w-full text-muted-foreground hover:text-foreground">
                    <Link href="/auth/login" className="flex items-center gap-2">
                      <ArrowLeft size={16} />
                      Quay lại đăng nhập
                    </Link>
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}