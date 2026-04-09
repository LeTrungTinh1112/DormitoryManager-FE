'use client'

import Link from 'next/link'
import { Menu, Bell, User, LogOut, Home } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DashboardTopbarProps {
  onMenuClick: () => void
  sidebarOpen: boolean
}

interface UserData {
  name: string
  email: string
  avatar?: string
}

export function DashboardTopbar({ onMenuClick, sidebarOpen }: DashboardTopbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data && data.data) {
          setUserData(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch user data', error)
      }
    }

    const fetchUnreadNotifications = async () => {
      try {
        const res = await fetch('/api/notifications')
        const data = await res.json()
        if (data && data.data && Array.isArray(data.data)) {
          const count = data.data.filter((n: any) => !n.read).length
          setUnreadCount(count)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchUser()
    fetchUnreadNotifications()

    // Poll for notifications
    const interval = setInterval(fetchUnreadNotifications, 10000)
    return () => clearInterval(interval)
  }, [])

  // Helper to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(-2)
      .join('')
      .toUpperCase()
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e)
    }
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    document.cookie = 'auth_token=; path=/; max-age=0' // Xóa cookie ở phía client
    router.push('/')
    // Reload to refresh auth state
    window.location.href = '/'
  }

  return (
    <>
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">Đăng xuất</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="sticky top-0 z-40 bg-white border-b border-border h-16 flex items-center justify-between px-4 sm:px-6">
        {/* Left: Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-card rounded-lg transition-colors"
          aria-label="Mở menu"
        >
          <Menu size={24} />
        </button>

        {/* Center: Title/Breadcrumb */}
        <div className="flex-1 hidden sm:block ml-4 md:ml-0">
          <h1 className="text-lg font-semibold text-foreground">Khu vực người dùng</h1>
        </div>

        {/* Right: Navigation & Notifications & User Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Back to Website */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2 text-foreground hover:bg-[#922d28]"
          >
            <Link href="/">
              <Home size={18} />
              <span className="hidden sm:inline text-sm">Về Website</span>
            </Link>
          </Button>

          {/* Notifications */}
          <Link href="/dashboard/notifications" className="relative p-2 hover:bg-muted rounded-full transition-colors">
            <Bell size={20} className="stroke-[2.5]" />
            {unreadCount > 0 && (
              <span className="absolute -top-[2px] -right-[2px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow ring-2 ring-background">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-card rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                {userData?.avatar && userData.avatar.startsWith('http') ? (
                  <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{userData ? getInitials(userData.name) : '...'}</span>
                )}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-foreground">
                {userData ? userData.name : 'Đang tải...'}
              </span>
            </button>

            {/* User Menu Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg py-2 z-50">
                <Link href="/dashboard/profile" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-card transition-colors">
                  <User size={16} />
                  <span>Hồ sơ</span>
                </Link>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-primary hover:bg-card transition-colors border-t border-border"
                >
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
