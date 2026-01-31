'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RoomCard } from '@/components/room-card'
import { ImageSlideshow } from '@/components/image-slideshow'
import { useFavorites } from '@/hooks/use-favorites'
import {
  AirVent,
  Wifi,
  Tv,
  Bath,
  Bed,
  Lock,
  Phone,
  ChevronLeft,
  Heart,
} from 'lucide-react'

// Mock data - replace with API calls
const roomDetails: Record<
  string,
  {
    id: string
    name: string
    type: string
    capacity: number
    price: number
    status: 'available' | 'soon' | 'full'
    manager: { name: string; phone: string }
    description: string
    amenities: string[]
    totalBeds: number
    availableBeds: number
    soonBeds: number
    images: string[]
  }
> = {
  'vip-1': {
    id: 'vip-1',
    name: 'Phòng VIP 1 Người',
    type: 'VIP',
    capacity: 1,
    price: 1200000,
    status: 'available',
    manager: { name: 'Lê Văn C', phone: '0910 345 678' },
    description:
      'Phòng VIP 1 người phù hợp sinh viên hoặc người đi làm, có WC riêng, máy lạnh, không gian yên tĩnh, đảm bảo riêng tư. Phòng được trang bị đầy đủ tiện nghi hiện đại.',
    amenities: [
      'Máy lạnh',
      'WC riêng',
      'Wifi 100Mbps',
      'Bàn học',
      'Tủ đồ',
      'Đèn LED',
      'Cửa sổ rộng',
      'Khóa an toàn',
    ],
    totalBeds: 1,
    availableBeds: 1,
    soonBeds: 0,
    images: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0',
      'https://images.unsplash.com/photo-1615873968403-89e068629265',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    ],
  },
  'standard-1': {
    id: 'standard-1',
    name: 'Phòng Standard 4 Người',
    type: 'Standard',
    capacity: 4,
    price: 500000,
    status: 'available',
    manager: { name: 'Nguyễn Văn A', phone: '0908 123 456' },
    description:
      'Phòng Standard 4 người là lựa chọn kinh tế cho sinh viên. Phòng rộng rãi, thoáng mát, được trang bị giường tầng và các tiện nghi cơ bản đầy đủ.',
    amenities: [
      'Máy lạnh',
      'WC chung',
      'Wifi',
      'Bàn học',
      'Tủ đồ',
      'Giường tầng',
      'Bàn ghế',
      'Cửa sổ',
    ],
    totalBeds: 4,
    availableBeds: 3,
    soonBeds: 1,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
      'https://images.unsplash.com/photo-1600585152915-d208bec867a1',
    ],
  },
  'premium-1': {
    id: 'premium-1',
    name: 'Phòng Premium 2 Người',
    type: 'Premium',
    capacity: 2,
    price: 800000,
    status: 'available',
    manager: { name: 'Trần Thị B', phone: '0909 234 567' },
    description:
      'Phòng Premium 2 người kết hợp tiện ích và thoải mái. Phòng có WC riêng, máy lạnh, không gian yên tĩnh để học tập và nghỉ ngơi.',
    amenities: [
      'Máy lạnh',
      'WC riêng',
      'Wifi 100Mbps',
      'Bàn học',
      'Tủ đồ',
      'Giường đôi',
      'Bàn làm việc',
      'Gương soi',
    ],
    totalBeds: 2,
    availableBeds: 2,
    soonBeds: 0,
      images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11',
    ],
  },
}

const relatedRooms = [
  {
    id: 'vip-2',
    name: 'Phòng VIP 1 Người - Tầng 5',
    type: 'VIP',
    capacity: 1,
    price: 1200000,
    status: 'full' as const,
    manager: { name: 'Lê Văn C', phone: '0910 345 678' },
  },
  {
    id: 'premium-2',
    name: 'Phòng Premium 2 Người - Tầng 2',
    type: 'Premium',
    capacity: 2,
    price: 800000,
    status: 'available' as const,
    manager: { name: 'Trần Thị B', phone: '0909 234 567' },
  },
  {
    id: 'standard-2',
    name: 'Phòng Standard 4 Người - Tầng 2',
    type: 'Standard',
    capacity: 4,
    price: 500000,
    status: 'available' as const,
    manager: { name: 'Nguyễn Văn A', phone: '0908 123 456' },
  },
]

const amenityIcons: Record<string, React.ReactNode> = {
  'Máy lạnh': <AirVent size={20} />,
  'WC riêng': <Bath size={20} />,
  'WC chung': <Bath size={20} />,
  Wifi: <Wifi size={20} />,
  'Wifi 100Mbps': <Wifi size={20} />,
  'Bàn học': <Bed size={20} />,
  'Tủ đồ': <Lock size={20} />,
  'Giường tầng': <Bed size={20} />,
  'Giường đôi': <Bed size={20} />,
}

const statusConfig = {
  available: { label: '🟢 Còn trống', color: 'bg-green-100 text-green-800' },
  soon: { label: '🟡 Sắp trống', color: 'bg-yellow-100 text-yellow-800' },
  full: { label: '⚫ Đã kín', color: 'bg-gray-100 text-gray-800' },
}

interface RoomDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { slug } = React.use(params)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const room = roomDetails[slug] || roomDetails['vip-1']
  const status = statusConfig[room.status]
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites()
  const isFav = isLoaded ? isFavorite(room.id) : false

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    alert('Yêu cầu của bạn đã được gửi. Chúng tôi sẽ liên hệ sớm nhất!')
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/rooms" className="hover:text-primary">
              Danh sách phòng
            </Link>
            <span>/</span>
            <span className="text-foreground">{room.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <h1 className="text-4xl font-bold text-foreground">{room.name}</h1>
                  <p className="text-lg text-muted-foreground">{room.type}</p>
                </div>
                {isLoaded && (
                  <button
                    onClick={() => toggleFavorite(room.id)}
                    className="flex-shrink-0 p-3 rounded-lg border border-border hover:bg-primary/5 transition-all"
                    aria-label={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Heart
                      size={28}
                      className={`transition-colors ${
                        isFav ? 'fill-primary text-primary' : 'text-gray-400'
                      }`}
                    />
                  </button>
                )}
              </div>
              <Badge className={`${status.color} border-0 w-fit`}>
                {status.label}
              </Badge>
            </div>

            {/* Room Image - Slideshow */}
            <ImageSlideshow images={room.images ?? []} alt={room.name} />

            {/* Quick Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-max">
              {[
                { label: 'Loại phòng', value: room.type },
                { label: 'Sức chứa', value: `${room.capacity} người` },
                { label: 'Tổng giường', value: room.totalBeds },
                { label: 'Giường trống', value: room.availableBeds },
              ].map((item, idx) => (
                <div key={idx} className="bg-card p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Mô tả chi tiết</h2>
              <p className="text-muted-foreground leading-relaxed">{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Tiện ích phòng</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg min-h-fit"
                  >
                    <div className="text-primary flex-shrink-0">
                      {amenityIcons[amenity] || <Lock size={20} />}
                    </div>
                    <span className="text-sm font-medium text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Rooms */}
            {relatedRooms.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Phòng liên quan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                  {relatedRooms.map((r) => (
                    <RoomCard key={r.id} {...r} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            {/* Sticky Box */}
            <div className="bg-card border-2 border-primary rounded-lg p-6 sticky top-20 space-y-6">
              {/* Price */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Giá mỗi tháng</p>
                <p className="text-4xl font-bold text-primary">
                  {room.price.toLocaleString('vi-VN')}đ
                </p>
              </div>

              {/* Manager Info */}
              <div className="bg-white border border-border rounded-lg p-4 space-y-3">
                <p className="text-sm text-muted-foreground font-semibold">Quản lý phòng</p>
                <div>
                  <p className="font-semibold text-foreground">{room.manager.name}</p>
                  <a
                    href={`tel:${room.manager.phone}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {room.manager.phone}
                  </a>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập họ và tên"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Nhập số điện thoại"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Nhập email"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    placeholder="Nhập ghi chú của bạn..."
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-[#922d28] text-white h-12 font-semibold"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu thuê phòng'}
                </Button>
              </form>

              {/* Alternative Contact */}
              <div className="border-t border-border pt-4">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
                >
                  <a href={`tel:${room.manager.phone}`}>
                    <Phone size={16} className="mr-2" />
                    Gọi quản lý ngay
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
