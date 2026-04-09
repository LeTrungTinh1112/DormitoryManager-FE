'use client'

import React, { useState } from "react"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImageSlideshow } from '@/components/image-slideshow'
import { useFavorites } from '@/hooks/use-favorites'
import { useToast } from '@/hooks/use-toast'
import {
  AirVent,
  Wifi,
  Bath,
  Bed,
  Lock,
  Phone,
  Heart,
} from 'lucide-react'
import { Room } from "@/lib/data"
import { RoomCard } from "@/components/room-card"

// Amenity Icons map
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

interface RoomDetailProps {
  room: Room
  relatedRooms: Room[]
}

export function RoomDetail({ room, relatedRooms }: RoomDetailProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form refs
  const nameRef = React.useRef<HTMLInputElement>(null)
  const phoneRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const noteRef = React.useRef<HTMLTextAreaElement>(null)

  // Fallback status if somehow invalid
  const status = statusConfig[room.status] || statusConfig.available
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites()
  const isFav = isLoaded ? isFavorite(room.id) : false

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const name = nameRef.current?.value || ''
    const phone = phoneRef.current?.value || ''
    const email = emailRef.current?.value || ''

    if (name.length < 2) {
      newErrors.name = 'Tên phải có ít nhất 2 ký tự'
    }

    if (!/^[0-9]{10,11}$/.test(phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)'
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    toast({
      title: 'Đăng ký phòng thành công',
      description: 'Yêu cầu của bạn đã được gửi. Chúng tôi sẽ liên hệ sớm nhất!',
    })

    // Reset form
    if (nameRef.current) nameRef.current.value = ''
    if (phoneRef.current) phoneRef.current.value = ''
    if (emailRef.current) emailRef.current.value = ''
    if (noteRef.current) noteRef.current.value = ''
    setErrors({})
  }

  return (
    <>
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
                    className="shrink-0 p-3 rounded-lg border border-border hover:bg-primary/5 transition-all"
                    aria-label={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Heart
                      size={28}
                      className={`transition-colors ${isFav ? 'fill-primary text-primary' : 'text-gray-400'
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
                    <div className="text-primary shrink-0">
                      {amenityIcons[amenity] || <Lock size={20} />}
                    </div>
                    <span className="text-sm font-medium text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

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
                    ref={nameRef}
                    type="text"
                    required
                    placeholder="Nhập họ và tên"
                    onChange={() => setErrors((prev) => ({ ...prev, name: '' }))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Số điện thoại
                  </label>
                  <input
                    ref={phoneRef}
                    type="tel"
                    required
                    placeholder="Nhập số điện thoại"
                    onChange={() => setErrors((prev) => ({ ...prev, phone: '' }))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="Nhập email"
                    onChange={() => setErrors((prev) => ({ ...prev, email: '' }))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    ref={noteRef}
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

        {/* Related Rooms */}
        {relatedRooms.length > 0 && (
          <div className="max-w-7xl mx-auto mt-16 pb-16">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Phòng tương tự</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedRooms.map((relatedRoom) => (
                <RoomCard
                  key={relatedRoom.id}
                  id={relatedRoom.slug}
                  name={relatedRoom.name}
                  type={relatedRoom.type}
                  capacity={relatedRoom.capacity}
                  price={relatedRoom.price}
                  status={relatedRoom.status}
                  image={relatedRoom.images?.[0]}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
