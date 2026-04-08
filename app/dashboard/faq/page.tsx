'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function FAQDashboardPage() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  const faqItems = [
    {
      id: 1,
      category: 'Nội quy chung',
      question: 'Giờ hoạt động của ký túc xá là bao nhiêu?',
      answer: 'Ký túc xá hoạt động 24/7. Tuy nhiên, giờ yên tĩnh là từ 22:00 đến 06:00. Trong giờ này, vui lòng giữ im lặng để không làm ảnh hưởng tới các sinh viên khác.',
    },
    {
      id: 2,
      category: 'Nội quy chung',
      question: 'Chính sách hủy phòng là gì?',
      answer: 'Bạn có thể hủy phòng trước 30 ngày để được hoàn lại 100% tiền. Nếu hủy trong vòng 7 ngày, sẽ bị tính phí 50% giá phòng.',
    },
    {
      id: 3,
      category: 'Thanh toán',
      question: 'Khi nào cần thanh toán hóa đơn?',
      answer: 'Hóa đơn thường phát hành vào ngày 1 của mỗi tháng. Bạn có 15 ngày để thanh toán (hạn cuối là 15/tháng). Nếu quá hạn, sẽ bị tính phí phạt.',
    },
    {
      id: 4,
      category: 'Thanh toán',
      question: 'Có những phương thức thanh toán nào?',
      answer: 'Chúng tôi chấp nhận các phương thức: Chuyển khoản ngân hàng, ví điện tử (Momo, Zalo Pay), QR code, và thanh toán tại quầy.',
    },
    {
      id: 5,
      category: 'Đăng ký & Hợp đồng',
      question: 'Hợp đồng hạn mức tối thiểu là bao lâu?',
      answer: 'Hợp đồng hạn mức tối thiểu là 3 tháng. Bạn có thể gia hạn hoặc hủy hợp đồng sau kì hạn.',
    },
    {
      id: 6,
      category: 'Đăng ký & Hợp đồng',
      question: 'Cần chuẩn bị tài liệu gì để đăng ký?',
      answer: 'Bạn cần chuẩn bị: CMND/CCCD, bằng cấp, giấy xác nhận nhập học (nếu là sinh viên), và bằng chứng thanh toán tiền đặt cọc.',
    },
  ]

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const categories = ['Nội quy chung', 'Thanh toán', 'Đăng ký & Hợp đồng']

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">FAQ & Nội quy</h1>
        <p className="text-muted-foreground">Câu hỏi thường gặp và các quy định của ký túc xá</p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">{category}</h2>
            <div className="space-y-3">
              {faqItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleExpand(item.id)}
                    className="w-full text-left bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{item.question}</h3>
                      <ChevronDown
                        size={20}
                        className={`text-primary transition-transform flex-shrink-0 ${
                          expanded[item.id] ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    {expanded[item.id] && (
                      <div className="mt-4 pt-4 border-t border-border text-muted-foreground">
                        {item.answer}
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
