'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, Heart, ArrowLeft, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useFavorites } from '@/hooks/use-favorites'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showBackButton, setShowBackButton] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { count } = useFavorites()

  useEffect(() => {
    // Show back button on non-home pages
    setShowBackButton(typeof window !== 'undefined' && window.location.pathname !== '/')
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if(data.data) setUser(data.data)
      })
      .catch((_) => {})
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

          {/* Desktop Menu - Simplified Public */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Trang chủ
            </Link>
            <Link href="/rooms" className="text-foreground hover:text-primary transition-colors font-medium">
              Phòng
            </Link>
            <Link href="/pricing" className="text-foreground hover:text-primary transition-colors font-medium">
              Bảng giá
            </Link>
            <Link href="/promotions" className="text-foreground hover:text-primary transition-colors font-medium">
              Khuyến mãi
            </Link>
            <Link href="/faq" className="text-foreground hover:text-primary transition-colors font-medium">
              FAQ
            </Link>
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Favorites Button */}
                <Button
                  asChild
                  variant="ghost"
                  className="text-foreground relative"
                >
                  <Link href="/dashboard/favorites" className="flex items-center gap-2">
                    <Heart size={20} />
                    <span className="text-sm">Yêu thích</span>
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary hover:bg-[#922d28] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </Link>
                </Button>
                {/* Dashboard Button */}
                <Button
                  asChild
                  className="bg-primary hover:bg-[#922d28] text-white text-sm"
                >
                  <Link href="/dashboard">Chào, {user.name.split(' ').pop()}</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  className="bg-primary hover:bg-[#922d28] text-white"
                >
                  <Link href="/auth/login">Đăng nhập</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5 bg-transparent"
                >
                  <Link href="/auth/register">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - Simplified Public */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block text-foreground hover:text-primary transition-colors py-2 font-medium"
            >
              Trang chủ
            </Link>
            <Link
              href="/rooms"
              className="block text-foreground hover:text-primary transition-colors py-2 font-medium"
            >
              Phòng
            </Link>
            <Link
              href="/pricing"
              className="block text-foreground hover:text-primary transition-colors py-2 font-medium"
            >
              Bảng giá
            </Link>
            <Link
              href="/promotions"
              className="block text-foreground hover:text-primary transition-colors py-2 font-medium"
            >
              Khuyến mãi
            </Link>
            <Link
              href="/faq"
              className="block text-foreground hover:text-primary transition-colors py-2 font-medium"
            >
              FAQ
            </Link>
            <div className="space-y-2 pt-4 border-t border-border">
              {user ? (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start text-foreground hover:text-primary gap-2"
                  >
                    <Link href="/dashboard/favorites" className="flex items-center">
                      <Heart size={18} />
                      <span>Yêu thích {count > 0 && `(${count})`}</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-[#922d28] text-white"
                  >
                    <Link href="/dashboard">Chào, {user.name.trim().split(' ').pop()}</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-[#922d28] text-white"
                  >
                    <Link href="/auth/login">Đăng nhập</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
                  >
                    <Link href="/auth/register">Đăng ký</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
