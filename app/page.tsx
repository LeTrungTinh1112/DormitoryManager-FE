'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RoomCard } from '@/components/room-card'
import {
  Lock,
  Users,
  Wifi,
  Wrench,
  Phone,
  MapPin,
  DollarSign,
} from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

// Mock data - replace with API calls later
const featuredRooms = [
  {
    id: 'standard-1',
    name: 'Phòng Standard 4 Người',
    type: 'Standard',
    capacity: 4,
    price: 500000,
    status: 'available' as const,
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500&h=300&fit=crop',
    manager: { name: 'Nguyễn Văn A', phone: '0908 123 456' },
  },
  {
    id: 'premium-1',
    name: 'Phòng Premium 2 Người',
    type: 'Premium',
    capacity: 2,
    price: 800000,
    status: 'available' as const,
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500&h=300&fit=crop',
    manager: { name: 'Trần Thị B', phone: '0909 234 567' },
  },
  {
    id: 'vip-1',
    name: 'Phòng VIP 1 Người',
    type: 'VIP',
    capacity: 1,
    price: 1200000,
    status: 'soon' as const,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
    manager: { name: 'Lê Văn C', phone: '0910 345 678' },
  },
  {
    id: 'standard-2',
    name: 'Phòng Standard 4 Người - Khác',
    type: 'Standard',
    capacity: 4,
    price: 500000,
    status: 'available' as const,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop',
    manager: { name: 'Phạm Thị D', phone: '0911 456 789' },
  },
]

const amenities = [
  { icon: Lock, title: 'An ninh 24/7', description: 'Hệ thống camera và bảo vệ 24 giờ' },
  { icon: Users, title: 'Quản lý tới từng giường', description: 'Quản lý chuyên nghiệp và chu đáo' },
  {
    icon: DollarSign,
    title: 'Có bãi đỗ xe',
    description: 'Bãi đỗ xe an toàn cho sinh viên',
  },
  {
    icon: Wrench,
    title: 'Hỗ trợ bảo trì',
    description: 'Dịch vụ bảo trì nhanh chóng 24/7',
  },
]

const faqs = [
  {
    question: 'Giá thuê có bao gồm các dịch vụ khác không?',
    answer:
      'Giá thuê phòng bao gồm: nước, điện, wifi, dịch vụ vệ sinh. Các dịch vụ khác như giặt giũ phụ thu thêm.',
  },
  {
    question: 'Thời hạn hợp đồng tối thiểu là bao lâu?',
    answer: 'Thời hạn hợp đồng tối thiểu là 6 tháng. Chúng tôi cũng linh hoạt với các yêu cầu cụ thể.',
  },
  {
    question: 'Có cần đặt cọc không?',
    answer:
      'Có, bạn cần đặt cọc 1 tháng tiền thuê. Khoản cọc này sẽ được hoàn lại sau khi kết thúc hợp đồng.',
  },
  {
    question: 'Có được phép mang theo vật nuôi không?',
    answer: 'Không được mang theo vật nuôi theo chính sách của KTX để đảm bảo vệ sinh chung.',
  },
  {
    question: 'Phòng có thể được sơn hoặc trang trí không?',
    answer:
      'Có thể trang trí nhẹ nhàng nhưng không được thay đổi cấu trúc. Tất cả phải được phục hồi trước khi trả phòng.',
  },
  {
    question: 'Làm thế nào để đặt phòng?',
    answer:
      'Bạn có thể đặt phòng qua website hoặc liên hệ trực tiếp với quản lý phòng. Chúng tôi cũng hỗ trợ qua điện thoại.',
  },
]

const slideshowImages = [
  {
    src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop',
    alt: 'Standard - Tiêu chuẩn',
    title: 'Standard - Tiêu chuẩn',
  },
  {
    src: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop',
    alt: 'Premium',
    title: 'Premium',
  },
  {
    src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
    alt: 'VIP',
    title: 'VIP',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Ký túc xá hiện đại – An toàn – Giá hợp lý
              </h1>
              <p className="text-lg text-muted-foreground">
                Gần trường, đầy đủ tiện nghi, quản lý chuyên nghiệp. Tìm phòng trọ sinh viên
                lý tưởng ngay hôm nay.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-[#922d28] text-white rounded-full"
                >
                  <Link href="/register">Đăng ký thuê phòng nhanh</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5 rounded-full bg-transparent"
                >
                  <Link href="/rooms">Xem phòng</Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                <div>
                  <p className="text-2xl font-bold text-primary">150+</p>
                  <p className="text-sm text-muted-foreground">Phòng</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">4.8</p>
                  <p className="text-sm text-muted-foreground">Đánh giá</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Sinh viên</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative h-96 md:h-full min-h-96 bg-card rounded-lg overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <MapPin size={48} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Ký túc xá sinh viên</h3>
                <p className="text-muted-foreground mt-2">Gần trường, an toàn, giá hợp lý</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Giới thiệu nhanh KTX
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon
              return (
                <div key={index} className="bg-white p-6 rounded-lg border border-border">
                  <Icon size={32} className="text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{amenity.title}</h3>
                  <p className="text-sm text-muted-foreground">{amenity.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Room Slideshow */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Loại phòng ký túc xá
            </h2>
          </div>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {slideshowImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform hover:scale-105 duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex items-end justify-between">
                        <h3 className="text-xl font-bold text-white">{image.title}</h3>
                        <Button asChild size="sm" className="bg-white text-primary hover:bg-white/90 border-0 pointer-events-auto">
                          <Link href="/pricing">Xem chi tiết</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Phòng nổi bật</h2>
            <Link
              href="/rooms"
              className="text-primary hover:underline font-semibold"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Câu hỏi thường gặp
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-border rounded-lg overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between bg-card p-6 font-semibold text-foreground hover:bg-primary/5 transition-colors">
                  <span>{faq.question}</span>
                  <span className="ml-4 text-primary group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="border-t border-border bg-white px-6 py-4 text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Sẵn sàng tìm phòng ở lý tưởng?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Duyệt qua 150+ phòng trống, chọn phòng yêu thích và liên hệ ngay hôm nay
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Link href="/rooms">Xem tất cả phòng</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/contact">Gọi tư vấn</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
