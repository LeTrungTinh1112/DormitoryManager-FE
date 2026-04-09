'use client'

import { useMemo } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RoomCard } from '@/components/room-card'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/hooks/use-favorites'
import { rooms } from '@/lib/data'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites()

  // Get favorite rooms
  const favoriteRooms = useMemo(() => {
    return rooms.filter((room) => favorites.includes(room.id))
  }, [favorites])

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Đang tải danh sách yêu thích...</p>
          </div>
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Phòng yêu thích</h1>
          <p className="text-lg text-muted-foreground">
            Danh sách các phòng bạn đã đánh dấu để xem lại
          </p>
        </div>
      </section>

      {/* Favorites Content */}
      <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {favoriteRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                Hãy khám phá danh sách phòng của chúng tôi và lưu lại những phòng phù hợp với bạn.
              </p>
              <Button asChild className="bg-primary hover:bg-[#922d28] text-white">
                <Link href="/rooms">Xem danh sách phòng</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
