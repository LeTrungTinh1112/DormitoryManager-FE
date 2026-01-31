'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold">
                KTX
              </div>
              <span className="font-bold text-lg">KTX Student Housing</span>
            </div>
            <p className="text-gray-300 text-sm">
              Ký túc xá hiện đại cho sinh viên với đầy đủ tiện nghi và an ninh 24/7
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Menu</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-primary transition-colors">
                  Danh sách phòng
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Bảng giá
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-1 flex-shrink-0 text-primary" />
                <a href="tel:0903123456" className="hover:text-primary transition-colors">
                  0903 123 456
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-1 flex-shrink-0 text-primary" />
                <a href="mailto:info@ktx.edu.vn" className="hover:text-primary transition-colors">
                  info@ktx.edu.vn
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-primary" />
                <span>123 Đường Lê Duẩn, Quận 1, TP.HCM</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold mb-4">Giờ làm việc</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Thứ 2 - Thứ 6: 08:00 - 18:00</li>
              <li>Thứ 7: 09:00 - 16:00</li>
              <li>Chủ nhật: Đóng cửa</li>
              <li className="mt-4 pt-4 border-t border-gray-600">
                Tư vấn 24/7 qua hotline
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {currentYear} KTX Student Housing. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0 text-sm text-gray-400">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
