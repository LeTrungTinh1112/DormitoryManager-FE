'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, Heart, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useFavorites } from '@/hooks/use-favorites'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showBackButton, setShowBackButton] = useState(false)
  const router = useRouter()
  const { favorites } = useFavorites()
  const count = favorites.length

  useEffect(() => {
    // Show back button on non-home pages
    setShowBackButton(typeof window !== 'undefined' && window.location.pathname !== '/')
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Back Button & Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-card rounded-lg transition-colors md:hidden"
                aria-label="Quay lại"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">
                KTX
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:inline">
                Student Housing
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <Link href="/rooms" className="text-foreground hover:text-primary transition-colors">
              Phòng
            </Link>
            <Link href="/pricing" className="text-foreground hover:text-primary transition-colors">
              Bảng giá
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              Liên hệ
            </Link>
          </nav>

          {/* CTA Button & Favorites - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              asChild
              variant="ghost"
              className="text-foreground hover:text-primary relative"
            >
              <Link href="/favorites" className="flex items-center gap-2">
                <Heart size={20} />
                <span>Yêu thích</span>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Link>
            </Button>
            <Button
              asChild
              className="bg-primary hover:bg-[#922d28] text-white rounded-full"
            >
              <Link href="/rooms">Xem phòng trống</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 space-y-3">
            <Link
              href="/"
              className="block text-foreground hover:text-primary transition-colors py-2"
            >
              Trang chủ
            </Link>
            <Link
              href="/rooms"
              className="block text-foreground hover:text-primary transition-colors py-2"
            >
              Phòng
            </Link>
            <Link
              href="/pricing"
              className="block text-foreground hover:text-primary transition-colors py-2"
            >
              Bảng giá
            </Link>
            <Link
              href="/contact"
              className="block text-foreground hover:text-primary transition-colors py-2"
            >
              Liên hệ
            </Link>
            <Link
              href="/favorites"
              className="block text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2 relative"
            >
              <Heart size={20} />
              <span>Yêu thích</span>
              {count > 0 && (
                <span className="ml-auto bg-primary text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {count}
                </span>
              )}
            </Link>
            <Button
              asChild
              className="w-full bg-primary hover:bg-[#922d28] text-white"
            >
              <Link href="/rooms">Xem phòng trống</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
