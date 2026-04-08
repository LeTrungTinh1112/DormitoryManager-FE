'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Wifi, Shield, ParkingCircle, BookOpen, Shirt, Utensils, Users, Eye } from 'lucide-react'
import Link from 'next/link'

const facilities = [
  {
    id: 'wifi',
    name: 'Wifi tốc độ cao',
    description: 'Wifi 100Mbps ổn định 24/7 cho học tập và giải trí',
    icon: Wifi,
    color: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  {
    id: 'security',
    name: 'Bảo vệ 24/7',
    description: 'Đội bảo vệ chuyên nghiệp tuần tra, camera giám sát khắp nơi',
    icon: Shield,
    color: 'bg-red-100',
    textColor: 'text-red-600',
  },
  {
    id: 'parking',
    name: 'Bãi giữ xe',
    description: 'Bãi xe rộng rãi, an toàn với camera giám sát',
    icon: ParkingCircle,
    color: 'bg-yellow-100',
    textColor: 'text-yellow-600',
  },
  {
    id: 'study',
    name: 'Khu tự học',
    description: 'Phòng tự học yên tĩnh, trang bị bàn ghế thoải mái, có điều hòa',
    icon: BookOpen,
    color: 'bg-green-100',
    textColor: 'text-green-600',
  },
  {
    id: 'laundry',
    name: 'Máy giặt tự động',
    description: 'Máy giặt hiện đại, giá hợp lý, sạch sẽ và an toàn',
    icon: Shirt,
    color: 'bg-purple-100',
    textColor: 'text-purple-600',
  },
  {
    id: 'canteen',
    name: 'Căn tin ký túc xá',
    description: 'Đa dạng thực đơn, giá rẻ, mở cửa từ 6h sáng đến 21h',
    icon: Utensils,
    color: 'bg-orange-100',
    textColor: 'text-orange-600',
  },
  {
    id: 'common',
    name: 'Khu sinh hoạt chung',
    description: 'Sân bóng, phòng giải trí, TV, bàn billiard cho sinh viên thư giãn',
    icon: Users,
    color: 'bg-pink-100',
    textColor: 'text-pink-600',
  },
  {
    id: 'cctv',
    name: 'Hệ thống giám sát',
    description: 'Camera HD tại tất cả các khu vực công cộng, hành lang, cầu thang',
    icon: Eye,
    color: 'bg-indigo-100',
    textColor: 'text-indigo-600',
  },
]

export default function FacilitiesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Page Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">Tiện ích ký túc xá</h1>
          <p className="text-lg text-muted-foreground">
            Ký túc xá được trang bị đầy đủ các tiện ích hiện đại cho sinh viên
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility) => {
              const IconComponent = facility.icon
              return (
                <div
                  key={facility.id}
                  className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-all group"
                >
                  {/* Icon */}
                  <div className={`${facility.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent size={32} className={facility.textColor} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-foreground mb-2">{facility.name}</h3>
                  <p className="text-muted-foreground text-sm">{facility.description}</p>
                </div>
              )
            })}
          </div>

          {/* Additional Benefits */}
          <div className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Các lợi ích khác</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Nước sạch, điện 24/7 ổn định',
                'Giặc ủi, dọn vệ sinh định kỳ',
                'Hỗ trợ quét, lau phòng hàng tuần',
                'Quản lý ký túc xá chuyên nghiệp',
                'Tổ chức các hoạt động sinh viên',
                'Chính sách cho phép khách thăm hợp lý',
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Sẵn sàng đăng ký?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Với các tiện ích hoàn hảo, ký túc xá của chúng tôi là nơi lý tưởng cho sinh viên thành phố
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild className="bg-primary hover:bg-[#922d28] text-white">
                <Link href="/register">Đăng ký ngay</Link>
              </Button>
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/5 bg-transparent">
                <Link href="/rooms">Xem các phòng</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
