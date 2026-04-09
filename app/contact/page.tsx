'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    toast({
      title: 'Gửi thành công',
      description: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ trả lời sớm nhất!',
    })
      ; (e.target as HTMLFormElement).reset()
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Page Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">Liên hệ với chúng tôi</h1>
          <p className="text-lg text-muted-foreground">
            Để lại thông tin để chúng tôi tư vấn cho bạn
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8 bg-card border border-border rounded-lg p-8">
              <div className="space-y-4 text-center">
                <h2 className="text-2xl font-bold text-foreground">Thông tin liên hệ</h2>
                <p className="text-muted-foreground">
                  Liên hệ với chúng tôi qua các kênh dưới đây
                </p>
              </div>

              {/* Contact Items */}
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex gap-4 items-center p-4 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="text-primary" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Điện thoại</h3>
                    <a
                      href="tel:0903123456"
                      className="text-primary hover:underline font-medium"
                    >
                      0903 123 456
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">Hotline 24/7</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 items-center p-4 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="text-primary" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <a
                      href="mailto:info@ktx.edu.vn"
                      className="text-primary hover:underline font-medium"
                    >
                      info@ktx.edu.vn
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Phản hồi trong 24 giờ
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4 items-center p-4 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="text-primary" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Địa chỉ</h3>
                    <p className="text-muted-foreground">
                      123 Đường Lê Duẩn, Quận 1
                      <br />
                      TP. Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4 items-center p-4 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="text-primary" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Giờ làm việc</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Thứ 2 - Thứ 6: 08:00 - 18:00</p>
                      <p>Thứ 7: 09:00 - 16:00</p>
                      <p>Chủ nhật: Đóng cửa</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
