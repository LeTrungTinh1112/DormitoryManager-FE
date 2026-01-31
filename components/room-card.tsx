'use client'

import React from "react"

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Eye, Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'

interface RoomCardProps {
  id: string
  name: string
  type: string
  capacity: number
  price: number
  status: 'available' | 'soon' | 'full'
  image?: string
  manager?: {
    name: string
    phone: string
  }
}

const statusConfig = {
  available: { label: '🟢 Còn trống', color: 'bg-green-100 text-green-800' },
  soon: { label: '🟡 Sắp trống', color: 'bg-yellow-100 text-yellow-800' },
  full: { label: '⚫ Đã kín', color: 'bg-gray-100 text-gray-800' },
}

export function RoomCard({
  id,
  name,
  type,
  capacity,
  price,
  status,
  image,
  manager,
}: RoomCardProps) {
  const statusInfo = statusConfig[status]
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites()
  const isFav = isLoaded ? isFavorite(id) : false

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(id)
  }

  return (
    <Link href={`/rooms/${id}`} className="relative bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer">
      {/* Image */}
      <div className="relative w-full h-48 bg-card overflow-hidden">
        {image ? (
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full bg-card flex items-center justify-center text-muted-foreground">
            <Eye size={32} />
          </div>
        )}

        {/* Favorite Button */}
        {isLoaded && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
            aria-label={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart
              size={20}
              className={`transition-colors ${
                isFav ? 'fill-primary text-primary' : 'text-gray-400'
              }`}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-foreground text-lg line-clamp-2">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>

        {/* Info Grid */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{capacity} người</span>
          </div>
        </div>

        {/* Status Badge */}
        <Badge className={`${statusInfo.color} border-0`}>
          {statusInfo.label}
        </Badge>

        {/* Price */}
        <div className="pt-2 border-t border-border">
          <p className="text-2xl font-bold text-primary mb-2">
            {price.toLocaleString('vi-VN')}đ
          </p>
          <p className="text-xs text-muted-foreground">/tháng</p>
        </div>

        {/* Manager Info */}
        {manager && (
          <div className="bg-card p-3 rounded text-sm space-y-1">
            <p className="text-muted-foreground">Quản lý:</p>
            <p className="font-medium text-foreground">{manager.name}</p>
            <p className="text-primary hover:underline">{manager.phone}</p>
          </div>
        )}

        {/* CTA Button */}
        <Button
          asChild
          className="w-full bg-primary hover:bg-[#922d28] text-white mt-4"
        >
          Xem chi tiết
        </Button>
      </div>
    </Link>
  )
}
