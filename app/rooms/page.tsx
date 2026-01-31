'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RoomCard } from '@/components/room-card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Heart } from 'lucide-react'

// Mock data - replace with API calls
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

export default function RoomsPage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedCapacities, setSelectedCapacities] = useState<number[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('default')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false)

  // Filter logic
  const filteredRooms = useMemo(() => {
    return allRooms.filter((room) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          room.name.toLowerCase().includes(query) ||
          room.type.toLowerCase().includes(query) ||
          room.manager.name.toLowerCase().includes(query) ||
          room.manager.phone.includes(query)
        if (!matchesSearch) return false
      }

      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(room.type)) {
        return false
      }

      // Capacity filter
      if (selectedCapacities.length > 0 && !selectedCapacities.includes(room.capacity)) {
        return false
      }

      // Status filter
      if (selectedStatus !== 'all' && room.status !== selectedStatus) {
        return false
      }

      // Price filter
      if (priceRange === 'low' && room.price > 600000) return false
      if (priceRange === 'mid' && (room.price < 600000 || room.price > 1000000)) return false
      if (priceRange === 'high' && room.price < 1000000) return false

      return true
    })
  }, [selectedTypes, selectedCapacities, selectedStatus, priceRange, searchQuery])

  // Sort logic
  const sortedRooms = useMemo(() => {
    const rooms = [...filteredRooms]
    if (sortBy === 'price-asc') rooms.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') rooms.sort((a, b) => b.price - a.price)
    if (sortBy === 'name') rooms.sort((a, b) => a.name.localeCompare(b.name))
    return rooms
  }, [filteredRooms, sortBy])

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const toggleCapacity = (capacity: number) => {
    setSelectedCapacities((prev) =>
      prev.includes(capacity) ? prev.filter((c) => c !== capacity) : [...prev, capacity]
    )
  }

  const resetFilters = () => {
    setSelectedTypes([])
    setSelectedCapacities([])
    setSelectedStatus('all')
    setPriceRange('all')
    setSearchQuery('')
    setShowFavoritesOnly(false)
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Page Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Danh sách phòng ký túc xá đang cho thuê
          </h1>
          <p className="text-lg text-muted-foreground">
            Giá từ 500.000đ – đầy đủ tiện nghi
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-lg border border-border sticky top-20 space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Loại phòng</h3>
                  <div className="space-y-3">
                    {['Standard', 'Premium', 'VIP'].map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                        />
                        <Label
                          htmlFor={`type-${type}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-4">Sức chứa</h3>
                  <div className="space-y-3">
                    {[1, 2, 4].map((capacity) => (
                      <div key={capacity} className="flex items-center gap-2">
                        <Checkbox
                          id={`capacity-${capacity}`}
                          checked={selectedCapacities.includes(capacity)}
                          onCheckedChange={() => toggleCapacity(capacity)}
                        />
                        <Label
                          htmlFor={`capacity-${capacity}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {capacity} người
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-4">Giá</h3>
                  <div className="space-y-3">
                    {[
                      { value: 'low', label: '500k - 600k' },
                      { value: 'mid', label: '600k - 1tr' },
                      { value: 'high', label: '> 1tr' },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center gap-2">
                        <Checkbox
                          id={`price-${option.value}`}
                          checked={priceRange === option.value}
                          onCheckedChange={() =>
                            setPriceRange(priceRange === option.value ? 'all' : option.value)
                          }
                        />
                        <Label
                          htmlFor={`price-${option.value}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-4">Trạng thái</h3>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded bg-white text-sm text-foreground"
                  >
                    <option value="all">Tất cả</option>
                    <option value="available">Còn trống</option>
                    <option value="soon">Sắp trống</option>
                  </select>
                </div>

                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>

            {/* Rooms Grid */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search Bar */}
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm phòng, loại, quản lý..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all w-full sm:w-auto ${
                    showFavoritesOnly
                      ? 'bg-primary text-white border-primary'
                      : 'border-border bg-card text-foreground hover:bg-primary/5'
                  }`}
                >
                  <Heart size={18} className={showFavoritesOnly ? 'fill-white' : ''} />
                  <span>Yêu thích của tôi</span>
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-muted-foreground">
                  Hiển thị {sortedRooms.length} phòng
                </p>
                <div className="w-full sm:w-auto">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Mặc định</SelectItem>
                      <SelectItem value="price-asc">Giá: Thấp → Cao</SelectItem>
                      <SelectItem value="price-desc">Giá: Cao → Thấp</SelectItem>
                      <SelectItem value="name">Tên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Rooms Grid */}
              {sortedRooms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedRooms.map((room) => (
                    <RoomCard key={room.id} {...room} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-lg border border-border">
                  <p className="text-muted-foreground text-lg mb-4">
                    Không tìm thấy phòng phù hợp
                  </p>
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/5 bg-transparent"
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
