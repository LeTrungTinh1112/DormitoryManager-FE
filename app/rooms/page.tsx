'use client'

import { useState, useMemo, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RoomCard } from '@/components/room-card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { Room } from '@/lib/data'

const ITEMS_PER_PAGE = 9

const MIN_PRICE = 0
const MAX_PRICE = 5000000

export default function RoomsPage() {
  const [allRooms, setAllRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedCapacities, setSelectedCapacities] = useState<number[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [priceMin, setPriceMin] = useState(MIN_PRICE)
  const [priceMax, setPriceMax] = useState(MAX_PRICE)
  const [sortBy, setSortBy] = useState<string>('default')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch rooms from API
  useEffect(() => {
    async function fetchRooms() {
      try {
        setIsLoading(true)
        const res = await fetch('/api/rooms?limit=100')
        if (!res.ok) throw new Error('Failed to fetch rooms')
        const data = await res.json()
        setAllRooms(data.data)
      } catch (error) {
        console.error('Error fetching rooms:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRooms()
  }, [])

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

      // Price filter - range slider
      if (room.price < priceMin || room.price > priceMax) return false

      return true
    })
  }, [allRooms, selectedTypes, selectedCapacities, selectedStatus, priceMin, priceMax, searchQuery])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedTypes, selectedCapacities, selectedStatus, priceMin, priceMax, searchQuery, sortBy])

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

  // Pagination logic
  const totalPages = Math.ceil(sortedRooms.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedRooms = sortedRooms.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    // Scroll to top of rooms section
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
                          className="text-sm font-normal cursor-pointer bg-white"
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
                          className="text-sm font-normal cursor-pointer bg-white"
                          checked={selectedCapacities.includes(capacity)}
                          onCheckedChange={() => toggleCapacity(capacity)}
                        />
                        <Label
                          htmlFor={`capacity-${capacity}`}
                          className="text-sm font-normal cursor-pointer "
                        >
                          {capacity} người
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-4">Khoảng giá</h3>
                  <div className="space-y-4">
                    {/* Min Price Slider */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Giá tối thiểu</label>
                      <input
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        value={priceMin}
                        onChange={(e) => {
                          const val = parseInt(e.target.value)
                          if (val <= priceMax) setPriceMin(val)
                        }}
                        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="text-sm font-semibold text-primary mt-1">
                        {(priceMin / 1000000).toFixed(1)}M VNĐ
                      </div>
                    </div>

                    {/* Max Price Slider */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Giá tối đa</label>
                      <input
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        value={priceMax}
                        onChange={(e) => {
                          const val = parseInt(e.target.value)
                          if (val >= priceMin) setPriceMax(val)
                        }}
                        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="text-sm font-semibold text-primary mt-1">
                        {(priceMax / 1000000).toFixed(1)}M VNĐ
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setSelectedTypes([])
                    setSelectedCapacities([])
                    setSelectedStatus('all')
                    setPriceMin(MIN_PRICE)
                    setPriceMax(MAX_PRICE)
                    setSearchQuery('')
                    setCurrentPage(1)
                  }}
                  className="w-full py-2 text-sm text-primary hover:text-primary/90 font-medium border border-primary rounded-lg transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>

            {/* Room List Section */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search & Sort Bar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border border-border">
                <div className="relative w-full sm:w-96">
                  <input
                    type="text"
                    placeholder="Tìm theo tên vé, số phòng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {/* Search Icon */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="available">Còn trống</option>
                        <option value="soon">Sắp trống</option>
                        <option value="full">Đã kín</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        <option value="default">Sắp xếp mặc định</option>
                        <option value="price-asc">Giá tăng dần</option>
                        <option value="price-desc">Giá giảm dần</option>
                        <option value="name">Tên A-Z</option>
                    </select>
                </div>
              </div>

              {/* Room Grid */}
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin text-primary" size={48} />
                </div>
              ) : paginatedRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedRooms.map((room) => (
                    <div key={room.id} className="h-full">
                      <RoomCard
                        id={room.slug} // Use slug for navigation
                        name={room.name}
                        type={room.type}
                        capacity={room.capacity}
                        price={room.price}
                        status={room.status}
                        image={room.images?.[0]}
                        manager={room.manager}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card rounded-lg border border-border">
                  <p className="text-lg text-muted-foreground">
                    Không tìm thấy phòng nào phù hợp với bộ lọc.
                  </p>
                  <button
                    onClick={() => {
                        setSelectedTypes([])
                        setSelectedCapacities([])
                        setSelectedStatus('all')
                        setPriceMin(MIN_PRICE)
                        setPriceMax(MAX_PRICE)
                        setSearchQuery('')
                        setCurrentPage(1)
                    }}
                    className="mt-4 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    Xóa bộ lọc và thử lại
                  </button>
                </div>
              )}

              {/* Pagination */}
              {!isLoading && sortedRooms.length > 0 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent border border-border'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
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
