'use client'

import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'
import AdvancedTeacherSearchForm from '@/components/exam-practice/AdvancedTeacherSearchForm'

const faqData = [
  {
    id: 'payment-1',
    category: 'Thanh toán & Chi phí',
    question: 'Giá thuê bao gồm những gì?',
    answer:
      'Giá thuê phòng bao gồm: phòng ở, nước sạch, điện, wifi, bảo vệ 24/7, bảo hiểm tài sản, và các dịch vụ cơ bản khác. Các chi phí như điện nước thêm, dịch vụ vệ sinh tăng thêm sẽ được tính riêng.',
  },
  {
    id: 'payment-2',
    category: 'Thanh toán & Chi phí',
    question: 'Có phải đặt cọc không? Bao nhiêu tiền?',
    answer:
      'Có, bạn cần đặt cọc 1 tháng tiền phòng khi ký hợp đồng. Cọc sẽ được hoàn trả khi bạn trả phòng (nếu phòng không hư hỏng). Ngoài ra còn phí kiểm tra ban đầu 500.000 đồng (không hoàn lại).',
  },
  {
    id: 'payment-3',
    category: 'Thanh toán & Chi phí',
    question: 'Phương thức thanh toán là gì?',
    answer:
      'Chúng tôi chấp nhận: (1) Tiền mặt tại văn phòng quản lý, (2) Chuyển khoản ngân hàng, (3) Ví điện tử (Momo, Zalopay). Hạn thanh toán hàng tháng là ngày 1-5 của tháng tiếp theo.',
  },
  {
    id: 'payment-4',
    category: 'Thanh toán & Chi phí',
    question: 'Chính sách hoàn cọc ra sao?',
    answer:
      'Cọc được hoàn 100% nếu phòng còn nguyên vẹn (không bẩn, không hư). Nếu có hư hỏng, chúng tôi sẽ tính phí sửa chữa trước khi hoàn. Hoàn cọc trong vòng 7 ngày làm việc sau khi trả phòng.',
  },
  {
    id: 'registration-1',
    category: 'Đăng ký & Hợp đồng',
    question: 'Quy trình đăng ký như thế nào?',
    answer:
      'Bước 1: Điền form đăng ký trực tuyến, Bước 2: Chúng tôi liên hệ xác nhận, Bước 3: Hẹn gặp và xem phòng, Bước 4: Ký hợp đồng, Bước 5: Đặt cọc, Bước 6: Nhận phòng. Toàn bộ quá trình mất 3-5 ngày.',
  },
  {
    id: 'registration-2',
    category: 'Đăng ký & Hợp đồng',
    question: 'Hồ sơ cần chuẩn bị gì?',
    answer:
      'Bạn cần chuẩn bị: CMND/CCCD + bản copy, Giấy xác nhận nhập học, Hộ chiếu (nếu là sinh viên nước ngoài), Thư giới thiệu từ trường. Tất cả phải rõ ràng, không nhòe, đủ bản số lượng yêu cầu.',
  },
  {
    id: 'registration-3',
    category: 'Đăng ký & Hợp đồng',
    question: 'Hợp đồng thuê phòng bao lâu?',
    answer:
      'Hợp đồng tiêu chuẩn là 12 tháng. Bạn có thể ký hợp đồng ngắn hạn (3-6 tháng) nhưng giá sẽ cao hơn 10-15%. Sau hết hạn, bạn có thể gia hạn thêm nếu còn phòng trống.',
  },
  {
    id: 'registration-4',
    category: 'Đăng ký & Hợp đồng',
    question: 'Điều kiện nhận phòng là gì?',
    answer:
      'Để nhận phòng, bạn phải: Đã ký đủ hợp đồng, Đã nộp đầy đủ tiền (tháng 1 + cọc + phí), Thuyết trình qui định nhà nước (an ninh, PCCC), Được kiểm tra y tế sơ bộ. Sau 24h mới chính thức nhập ký túc xá.',
  },
  {
    id: 'rules-1',
    category: 'Nội quy & Quy định',
    question: 'Giờ đóng mở cổng là mấy giờ?',
    answer:
      'Cổng chính mở từ 5h sáng đến 23h tối. Sau 23h, bạn vẫn vào được nhưng phải quét thẻ hoặc báo bảo vệ. Giờ vào ra được quản lý bằng camera và log hệ thống.',
  },
  {
    id: 'rules-2',
    category: 'Nội quy & Quy định',
    question: 'Có được chuyển phòng không?',
    answer:
      'Có, bạn có thể xin chuyển phòng trong 3 tháng đầu (chuyển 1 lần miễn phí). Sau 3 tháng, chuyển phòng phải trả phí 500.000 đồng. Quyền chuyển phòng tùy vào tình trạng phòng trống.',
  },
  {
    id: 'rules-3',
    category: 'Nội quy & Quy định',
    question: 'Chính sách trả phòng ra sao?',
    answer:
      'Bạn cần báo trước ít nhất 30 ngày. Trước khi rời phòng, phải: Dọn sạch, Trả khóa, Kiểm tra thiệt hại (nếu có). Trả phòng muộn sẽ bị tính phí 100.000 đồng/ngày. Tiền cọc sẽ được hoàn trong 7 ngày.',
  },
  {
    id: 'rules-4',
    category: 'Nội quy & Quy định',
    question: 'Có được phép khách thăm không?',
    answer:
      'Được phép có khách thăm từ 8h sáng đến 21h tối. Khách phải báo bảo vệ, nhận thẻ tạm. Không được để khách qua đêm (trừ cha mẹ, người thân gần). Vi phạm sẽ bị cảnh báo hoặc phạt.',
  },
  {
    id: 'rules-5',
    category: 'Nội quy & Quy định',
    question: 'Những gì cấm trong ký túc xá?',
    answer:
      'Cấm: Hút thuốc, uống rượu, chơi game xuyên đêm, gây tiếng ồn, giữ động vật, dùng bếp lửa, gây rối, mang chất gây nghiện. Vi phạm nhẹ cảnh báo, nặng sẽ bị đình chỉ hoặc buộc thôi học.',
  },
  {
    id: 'rules-6',
    category: 'Nội quy & Quy định',
    question: 'Bảo vệ làm việc như thế nào?',
    answer:
      'Có 2 ca bảo vệ 24/7, mỗi ca 12h. Họ tuần tra, giám sát camera, kiểm soát ra vào, giải quyết sự cố. Điểm liên hệ bảo vệ: 0903 123 456 (24/7). Bạn có thể gọi ngay khi có sự cố.',
  },
  {
    id: 'facility-1',
    category: 'Tiện ích & Dịch vụ',
    question: 'Wifi tốc độ bao nhiêu? Có ổn định không?',
    answer:
      'Wifi 100Mbps, ổn định 99,5% thời gian. Nếu mất kết nối, báo bảo vệ sẽ liên lạc công ty cung cấp. Mỗi phòng được cấp 2 quân wifi, có thể thêm quân phụ với giá 50k/tháng.',
  },
  {
    id: 'facility-2',
    category: 'Tiện ích & Dịch vụ',
    question: 'Có dịch vụ vệ sinh, giặt ủi không?',
    answer:
      'Có. Lịch dọn phòng mặc định 1 lần/tuần (có thể thêm thêm). Dịch vụ giặt ủi chuyên nghiệp có sẵn với giá 20k-30k/kg. Bạn cũng có thể dùng máy giặt tự động với giá 20k/lần.',
  },
  {
    id: 'facility-3',
    category: 'Tiện ích & Dịch vụ',
    question: 'Điều hòa mấy độ? Có mất tiền lạnh không?',
    answer:
      'Điều hòa được cài ở 25°C (có thể tự chỉnh). Tiền điều hòa đã được gộp vào giá. Nếu dùng ở mức lạnh cao hơn mức tiêu chuẩn, sẽ có phụ phí thêm.',
  },
  {
    id: 'facility-4',
    category: 'Tiện ích & Dịch vụ',
    question: 'Máy giặt ở đâu? Giá bao nhiêu?',
    answer:
      'Máy giặt tự động tại tầng hầm, mỗi tầng có 2 máy. Giá 20k/lần giặt, 10k/lần sấy. Nước rửa miễn phí. Bạn có thể đặt trước để tránh chờ đợi.',
  },
]

export default function FaqPage() {
  const categories = Array.from(new Set(faqData.map((item) => item.category)))

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Page Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">Câu hỏi thường gặp</h1>
          <p className="text-lg text-muted-foreground">
            Những thông tin cơ bản về thuê phòng, nội quy và tiện ích ký túc xá
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Suspense fallback={<div>Đang tải form...</div>}>
          <AdvancedTeacherSearchForm />
        </Suspense>
      </div>

      {/* FAQ Content */}
      <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          {categories.map((category) => (
            <div key={category} className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{category}</h2>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {faqData
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="border border-border rounded-lg px-4 data-[state=open]:bg-card"
                    >
                      <AccordionTrigger className="hover:text-primary text-left font-medium text-foreground py-4">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
