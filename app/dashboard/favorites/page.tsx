'use client'

import { useMemo } from 'react'
import { RoomCard } from '@/components/room-card'
import { useFavorites } from '@/hooks/use-favorites'
import { rooms } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function DashboardFavoritesPage() {
  const { favorites, isLoaded } = useFavorites()

  // Get favorite rooms
  const favoriteRooms = useMemo(() => {
    return rooms.filter((room) => favorites.includes(room.id))
  }, [favorites])

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Đang tải danh sách yêu thích...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Phòng yêu thích</h1>
        <p className="text-muted-foreground">
          Quản lý danh sách các phòng bạn quan tâm
        </p>
      </div>

      {favoriteRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRooms.map((room) => (
            <RoomCard
              key={room.id}
              id={room.id}
              name={room.name}
              type={room.type}
              capacity={room.capacity}
              price={room.price}
              status={room.status as 'available' | 'soon' | 'full'}
              manager={room.manager}
              image={room.images[0]}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 border-2 border-dashed border-border rounded-lg bg-card/50">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Chưa có phòng yêu thích
          </h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Bạn chưa lưu phòng nào vào danh sách yêu thích.
          </p>
          <Button asChild className="bg-primary hover:bg-[#922d28] text-white">
            <Link href="/rooms">Tìm phòng ngay</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
