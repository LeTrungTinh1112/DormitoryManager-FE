'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, Phone, MessageCircle, Copy, Check } from 'lucide-react'

interface ManagerInfo {
  name: string
  phone: string
  email?: string
  zaloUrl?: string
  qrCodes?: {
    type: 'zalo' | 'phone' | 'viber' | 'telegram'
    url: string
    label: string
  }[]
}

interface ManagerModalProps {
  isOpen: boolean
  onClose: () => void
  manager: ManagerInfo
}

export function ManagerModal({ isOpen, onClose, manager }: ManagerModalProps) {
  const [copiedPhone, setCopiedPhone] = useState(false)

  const copyPhoneToClipboard = () => {
    navigator.clipboard.writeText(manager.phone)
    setCopiedPhone(true)
    setTimeout(() => setCopiedPhone(false), 2000)
  }

  if (!isOpen) return null

  // Determine number of QR codes to calculate grid columns
  const qrCount = manager.qrCodes?.length || 0
  const gridCols = qrCount === 1 ? 'grid-cols-1' : qrCount === 2 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full shadow-xl overflow-hidden max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-primary text-white p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Thông tin quản lý</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Đóng"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Manager Name */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Tên quản lý</p>
              <p className="text-lg font-bold text-foreground">{manager.name}</p>
            </div>

            {/* Phone */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground font-medium">Số điện thoại</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-mono text-foreground flex-1">{manager.phone}</p>
                <button
                  onClick={copyPhoneToClipboard}
                  className="p-2 hover:bg-card rounded-lg transition-colors"
                  aria-label="Sao chép số điện thoại"
                >
                  {copiedPhone ? (
                    <Check size={20} className="text-green-600" />
                  ) : (
                    <Copy size={20} className="text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-col sm:flex-row">
              <Button
                asChild
                className="flex-1 bg-primary hover:bg-[#922d28] text-white rounded-lg"
              >
                <a href={`tel:${manager.phone}`} className="flex items-center justify-center gap-2">
                  <Phone size={18} />
                  <span>Gọi ngay</span>
                </a>
              </Button>
              {manager.zaloUrl && (
                <Button
                  asChild
                  className="flex-1 bg-[#0084FF] hover:bg-[#0073E6] text-white rounded-lg"
                >
                  <a
                    href={manager.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    <span>Zalo</span>
                  </a>
                </Button>
              )}
            </div>

            {/* QR Codes */}
            {qrCount > 0 && (
              <div className="space-y-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground font-medium">Liên lạc qua QR Code</p>
                <div className={`grid ${gridCols} gap-4`}>
                  {manager.qrCodes?.map((qr, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div className="w-full aspect-square bg-card rounded-lg p-2 border border-border">
                        <Image
                          src={qr.url || '/placeholder.svg'}
                          alt={`QR Code - ${qr.label}`}
                          width={150}
                          height={150}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">{qr.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email */}
            {manager.email && (
              <div className="space-y-2 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground font-medium">Email</p>
                <a
                  href={`mailto:${manager.email}`}
                  className="text-primary hover:underline break-all"
                >
                  {manager.email}
                </a>
              </div>
            )}

            {/* Close Button */}
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-border bg-transparent"
            >
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
