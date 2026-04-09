'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Check, Search } from 'lucide-react'

const pricingTiers = [
  {
    name: 'Standard',
    capacity: '4 người',
    price: 500000,
    description: 'Phòng lý tưởng cho nhóm bạn',
    features: [
      'Sức chứa 4 người',
      'Máy lạnh',
      'WC chung',
      'Wifi chung',
      'Giường tầng',
      'Bàn học',
      'Tủ đồ',
    ],
    popular: false,
  },
  {
    name: 'Premium',
    capacity: '2 người',
    price: 800000,
    description: 'Cân bằng giữa giá và tiện ích',
    features: [
      'Sức chứa 2 người',
      'Máy lạnh',
      'WC riêng',
      'Wifi 100Mbps',
      'Giường thoải mái',
      'Bàn làm việc',
      'Gương soi',
      'Không gian yên tĩnh',
    ],
    popular: true,
  },
  {
    name: 'VIP',
    capacity: '1 người',
    price: 1200000,
    description: 'Tiện ích tối đa, không gian riêng',
    features: [
      'Sức chứa 1 người',
      'Máy lạnh hiện đại',
      'WC riêng',
      'Wifi 100Mbps',
      'Giường đôi',
      'Bàn học rộng',
      'Tủ đồ lớn',
      'Cửa sổ rộng',
      'Khóa an toàn',
    ],
    popular: false,
  },
]

const comparisonTable = [
  { feature: 'Sức chứa', standard: '4 người', premium: '2 người', vip: '1 người' },
  { feature: 'Giá mỗi tháng', standard: '500.000đ', premium: '800.000đ', vip: '1.200.000đ' },
  { feature: 'Máy lạnh', standard: '✓', premium: '✓', vip: '✓' },
  { feature: 'WC riêng', standard: '✗', premium: '✓', vip: '✓' },
  { feature: 'Wifi', standard: 'Cơ bản', premium: '100Mbps', vip: '100Mbps' },
  { feature: 'Giường', standard: 'Tầng', premium: 'Thoải mái', vip: 'Cao cấp' },
  { feature: 'Bàn học', standard: '✓', premium: '✓', vip: '✓' },
  { feature: 'Tủ đồ', standard: 'Chia sẻ', premium: 'Riêng', vip: 'Riêng lớn' },
  { feature: 'Không gian', standard: 'Vừa phải', premium: 'Rộng', vip: 'Rất rộng' },
  { feature: 'An ninh 24/7', standard: '✓', premium: '✓', vip: '✓' },
]

export default function PricingPage() {
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filter pricing tiers based on search
  const filteredTiers = useMemo(() => {
    if (!searchQuery.trim()) return pricingTiers

    const query = searchQuery.toLowerCase()
    return pricingTiers.filter((tier) => {
      const matchesName = tier.name.toLowerCase().includes(query)
      const matchesCapacity = tier.capacity.toLowerCase().includes(query)
      const matchesDescription = tier.description.toLowerCase().includes(query)
      const matchesFeatures = tier.features.some((f) =>
        f.toLowerCase().includes(query)
      )

      return matchesName || matchesCapacity || matchesDescription || matchesFeatures
    })
  }, [searchQuery])

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Page Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">Bảng giá</h1>
          <p className="text-lg text-muted-foreground">
            Chọn loại phòng phù hợp với nhu cầu và ngân sách của bạn
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Tìm kiếm loại phòng, tiện nghi, sức chứa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredTiers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {filteredTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative rounded-lg border overflow-hidden transition-all ${
                    tier.popular
                      ? 'border-primary bg-white shadow-xl scale-105 md:scale-110'
                      : 'border-border bg-white hover:shadow-lg'
                  }`}
                >
                  {/* Popular Badge */}
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                      PHỔ BIẾN
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-8 space-y-6 h-full flex flex-col">
                    {/* Header */}
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                    </div>

                    {/* Capacity */}
                    <div className="bg-card p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Sức chứa</p>
                      <p className="font-semibold text-foreground">{tier.capacity}</p>
                    </div>

                    {/* Price */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Giá mỗi tháng</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-primary">
                          {(tier.price / 1000000).toLocaleString('vi-VN', {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          })}
                        </span>
                        <span className="text-muted-foreground">triệu</span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 flex-1">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check size={20} className="text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      asChild
                      className={`w-full h-12 font-semibold ${
                        tier.popular
                          ? 'bg-primary hover:bg-[#922d28] text-white'
                          : 'border-primary text-primary hover:bg-[#922d28]'
                      }`}
                      variant={tier.popular ? 'default' : 'outline'}
                    >
                      <Link href="/rooms">Xem phòng {tier.name}</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-2xl font-bold text-foreground mb-16">
              Không tìm thấy kết quả phù hợp
            </div>
          )}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">So sánh chi tiết</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Tính năng</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">Standard</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">
                    Premium <span className="text-primary">(Phổ biến)</span>
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">VIP</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border ${
                      index % 2 === 0 ? 'bg-white' : 'bg-card'
                    } hover:bg-primary/5 transition-colors`}
                  >
                    <td className="py-4 px-4 font-medium text-foreground">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-muted-foreground">
                      {row.standard}
                    </td>
                    <td className="py-4 px-4 text-center text-foreground font-semibold">
                      {row.premium}
                    </td>
                    <td className="py-4 px-4 text-center text-muted-foreground">{row.vip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Sẵn sàng tìm phòng của bạn?</h2>
          <p className="text-lg opacity-90">
            Chọn loại phòng và liên hệ ngay hôm nay. Chúng tôi sẽ giúp bạn tìm phòng lý tưởng!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 font-semibold"
            >
              <Link href="/register">Đăng ký ngay</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/rooms">Duyệt phòng trống</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
