'use client'

import { useMemo } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RoomCard } from '@/components/room-card'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/hooks/use-favorites'
import Link from 'next/link'

// Mock data - same as rooms page
const allRooms = [
  {
    id: 'standard-1',
    name: 'Phòng Standard 4 Người - Tầng 1',
    type: 'Standard',
    capacity: 4,
    price: 500000,
    status: 'available' as const,
    manager: { name: 'Nguyễn Văn A', phone: '0908 123 456' },
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
  {
    id: 'standard-3',
    name: 'Phòng Standard 4 Người - Tầng 3',
    type: 'Standard',
    capacity: 4,
    price: 500000,
    status: 'soon' as const,
    manager: { name: 'Nguyễn Văn A', phone: '0908 123 456' },
  },
  {
    id: 'premium-1',
    name: 'Phòng Premium 2 Người - Tầng 1',
    type: 'Premium',
    capacity: 2,
    price: 800000,
    status: 'available' as const,
    manager: { name: 'Trần Thị B', phone: '0909 234 567' },
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
    id: 'premium-3',
    name: 'Phòng Premium 2 Người - Tầng 3',
    type: 'Premium',
    capacity: 2,
    price: 850000,
    status: 'soon' as const,
    manager: { name: 'Trần Thị B', phone: '0909 234 567' },
  },
  {
    id: 'vip-1',
    name: 'Phòng VIP 1 Người - Tầng 4',
    type: 'VIP',
    capacity: 1,
    price: 1200000,
    status: 'available' as const,
    manager: { name: 'Lê Văn C', phone: '0910 345 678' },
  },
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
    id: 'standard-4',
    name: 'Phòng Standard 4 Người - Tầng 4',
    type: 'Standard',
    capacity: 4,
    price: 520000,
    status: 'available' as const,
    manager: { name: 'Phạm Thị D', phone: '0911 456 789' },
  },
]

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites()

  // Get favorite rooms
  const favoriteRooms = useMemo(() => {
    return allRooms.filter((room) => favorites.includes(room.id))
  }, [favorites])

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Đang tải...</p>
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
          <p className="text-lg text-muted-foreground">
            Danh sách {favoriteRooms.length} phòng mà bạn đã lưu
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {favoriteRooms.length > 0 ? (
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Bạn đã lưu {favoriteRooms.length} phòng yêu thích
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRooms.map((room) => (
                  <RoomCard key={room.id} {...room} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <p className="text-muted-foreground text-lg mb-4">
                Bạn chưa lưu phòng yêu thích nào
              </p>
              <p className="text-muted-foreground mb-6">
                Hãy thêm các phòng vào danh sách yêu thích để xem lại sau!
              </p>
              <Button
                asChild
                className="bg-primary hover:bg-[#922d28] text-white"
              >
                <Link href="/rooms">Xem tất cả phòng</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
