'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { X, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  User,
  Heart,
  Bell,
  Calendar,
  History,
  FileText,
  CreditCard,
  ReceiptText,
  HelpCircle,
  ShieldCheck,
  Users,
  BadgeCheck,
  LogOut,
} from 'lucide-react'

// Define Role type locally to avoid importing server-only type
type Role = 'student' | 'resident' | 'manager' | 'admin';

interface DashboardSidebarProps {
  isOpen: boolean
  isCollapsed: boolean
  onToggleCollapse: () => void
  onClose: () => void
}

export function DashboardSidebar({
  isOpen,
  isCollapsed,
  onToggleCollapse,
  onClose,
}: DashboardSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<{ roles: Role[], name: string } | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    personal: true,
    booking: true,
    payment: true,
    support: true,
    manager: true, // New section for managers
  })

  useEffect(() => {
    // Fetch user info
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setCurrentUser(data.data)
        }
      })
      .catch(err => console.error(err))
  }, [])

  // Refresh user data every 20 seconds to reflect role changes
  // (e.g., when payment is approved and guest becomes resident)
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/api/auth/me', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data.data) {
            setCurrentUser(data.data)
          }
        })
        .catch(err => console.error(err))
    }, 20000) // 20 second interval

    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch(e) {
          console.error(e)
        }
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      router.push('/')
      // Reload to refresh auth state
      window.location.href = '/'
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const isActive = (href: string) => {
    // Exact match is always active
    if (pathname === href) return true
    
    // Handle Dashboard Home specifically
    if (href === '/dashboard' && pathname === '/dashboard') return true
    
    // Fix for Payment menu overlap: 
    // Prevent "Payment" (/dashboard/payments) from being active when "Payment History" (/dashboard/payments/history) is active
    if (href === '/dashboard/payments' && pathname?.startsWith('/dashboard/payments/history')) {
        return false
    }

    // Standard check for nested routes
    if (href !== '/dashboard' && pathname?.startsWith(href)) return true
    
    return false
  }

  // Base Menu (Always visible)
  const baseMenuItems = [
    {
      section: 'overview',
      label: 'Tổng quan',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      section: 'personal',
      label: 'Cá nhân & Tiện ích',
      items: [
        { label: 'Hồ sơ của tôi', href: '/dashboard/profile', icon: User },
        { label: 'Phòng yêu thích', href: '/dashboard/favorites', icon: Heart },
        { label: 'Thông báo', href: '/dashboard/notifications', icon: Bell },
      ],
    },
     {
      section: 'booking',
      label: 'Thuê phòng',
      items: [
        { label: 'Lịch sử đặt lịch', href: '/dashboard/bookings/history', icon: History },
        // Conditional: Only show Contracts if user has them (Resident)
        ...(currentUser?.roles?.includes('resident') ? [
             { label: 'Hợp đồng thuê', href: '/dashboard/contracts', icon: FileText }
        ] : []),
      ],
    },
  ]

  // Payment Menu (For both Resident and Student/Guest)
  const paymentMenu = (currentUser?.roles?.includes('resident') || currentUser?.roles?.includes('student')) ? [
    {
      section: 'payment',
      label: 'Tài chính & Thanh toán',
      items: [
        { label: 'Thanh toán hóa đơn', href: '/dashboard/payments', icon: CreditCard },
        { label: 'Lịch sử giao dịch', href: '/dashboard/payments/history', icon: ReceiptText },
      ],
    }
  ] : []

  // Manager Specific Menu
  const managerMenu = currentUser?.roles?.includes('manager') ? [
    {
      section: 'manager',
      label: 'Quản lý (Manager)',
      items: [
        { label: 'Yêu cầu thuê phòng', href: '/dashboard/manager/inquiries', icon: Users },
        { label: 'Duyệt thanh toán', href: '/dashboard/manager/payments', icon: BadgeCheck },
        { label: 'Quản lý hợp đồng', href: '/dashboard/manager/contracts', icon: ShieldCheck },
      ],
    }
  ] : []

  const menuItems = [
      ...baseMenuItems,
      ...paymentMenu,
      ...managerMenu,
      {
      section: 'support',
      label: 'Hỗ trợ',
      items: [
        { label: 'FAQ & Nội quy', href: '/dashboard/faq', icon: HelpCircle },
      ],
    },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-sm">
            KTX
          </div>
          {!isCollapsed && <span className="font-bold text-foreground hidden md:inline">Student Housing</span>}
        </div>
        {isOpen && (
          <button
            onClick={onClose}
            className="md:hidden p-1 hover:bg-card rounded transition-colors"
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2">
        {menuItems.map((section) => (
          <div key={section.section}>
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.section)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isCollapsed
                  ? 'justify-center'
                  : 'hover:bg-card text-muted-foreground'
              }`}
            >
              {!isCollapsed && section.label}
              {!isCollapsed && section.items.length > 0 && (
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    expandedSections[section.section] ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {/* Section Items */}
            {expandedSections[section.section] && (
              <div className={`space-y-1 ${isCollapsed ? 'hidden' : ''}`}>
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)

                  return (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          active
                            ? 'bg-primary text-white'
                            : 'text-foreground hover:bg-card'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-card transition-colors"
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-border transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white border-r border-border z-50">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
