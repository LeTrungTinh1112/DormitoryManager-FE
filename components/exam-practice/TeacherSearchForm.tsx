'use client';

/**
 * ============================================================================
 * 📖 HƯỚNG DẪN CÁCH NHÚNG FORM NÀY VÀO DỰ ÁN THỰC TẾ (VD: Trang Danh sách phòng)
 * ============================================================================
 * 
 * Xin chào! Nếu thầy yêu cầu bạn mang Form tìm kiếm này áp dụng thẳng vào một trang 
 * có sẵn trong dự án (ví dụ như `app/rooms/page.tsx`), bạn chỉ cần làm đúng 3 bước sau:
 * 
 * BƯỚC 1: IMPORT COMPONENT FORM NÀY VÀO FILE PAGE ĐÓ
 * Ở trên cùng của file `app/rooms/page.tsx`, bạn dán dòng này vào:
 * ```tsx
 * import TeacherSearchForm from '@/components/exam-practice/TeacherSearchForm';
 * ```
 * 
 * BƯỚC 2: HIỂN THỊ FORM RA GIAO DIỆN
 * Kéo xuống dưới phần `return ( ... )` của file đó, đặt thẻ Form vào nơi bạn muốn hiện 
 * (thường là để ở trên cùng, phía trên danh sách phòng):
 * ```tsx
 * return (
 *   <div>
 *     <TeacherSearchForm />   <--- Đặt ở đây
 *     
 *     <div className="grid...">
 *       {/*... code vòng lặp danh sách phòng của bạn ...* /}
 *     </div>
 *   </div>
 * )
 * ```
 * 
 * ================= CÂU HỎI BẢO VỆ ĐỒ ÁN ===================
 * - Thầy: "File này là Client hay Server Component?" 
 *   => Trả lời: "Dạ đây là Client Component (dòng 1), vì Form phải bắt sự kiện bấm nút `onSubmit` của người dùng."
 * 
 * - Thầy: "Cái `useRouter` em dùng để làm gì?"
 *   => Trả lời: "Em truyền biến dữ liệu người dùng gõ vào vào một chuỗi String param, rồi dùng `router.push()` (dòng 58) để nó nối chuỗi đó lên thanh địa chỉ (URL) của trình duyệt, từ đó giao diện thay đổi ạ."
 */
//  * 
//  * BƯỚC 3: HỨNG DỮ LIỆU TỪ URL ĐỂ LỌC DANH SÁCH (Quan trọng nhất)
//  * Sửa lại hàm Khai báo Component của trang `page.tsx` đó thành `async` và nhận tham số `searchParams`:
//  * ```tsx
//  * export default async function RoomsPage({ searchParams }: { searchParams: Promise<{ max_price?: string; min_acreage?: string }> }) {
//  *   
//  *   // 3.1: Đọc tham số URL mà Form này vừa PUSH lên (lưu ý dùng await cho Next.js 15+)
//  *   const resolvedParams = await searchParams; 
//  *   const maxPrice = Number(resolvedParams.max_price || 0);
//  *   const minAcreage = Number(resolvedParams.min_acreage || 0);
//  *   
//  *   // 3.2: Code lấy dữ liệu phòng từ Database của bạn... (giả sử bạn chứa trong mảng `allRooms`)
//  *   
//  *   // 3.3: Viết hàm tiến hành LỌC MẢNG theo điều kiện:
//  *   const filteredRooms = allRooms.filter(room => {
//  *     const isPriceValid = maxPrice > 0 ? room.price <= maxPrice : true;
//  *     const isAcreageValid = minAcreage > 0 ? room.acreage >= minAcreage : true;
//  *     return isPriceValid && isAcreageValid;
//  *   });
//  *   
//  *   // Cuối cùng: Chạy vòng lặp map() trên mảng `filteredRooms` mới này để render ra màn hình, 
//  *   // thay vì map() trên mảng `allRooms` cũ.
//  * }
//  * ```
//  */

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
// Import các UI component có sẵn trong dự án (Yêu cầu 1)
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TeacherSearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Yêu cầu 1: Quản lý state (useState)
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [minAcreage, setMinAcreage] = useState(searchParams.get('min_acreage') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Yêu cầu 2: Xử lý URL Parameters mà không reload trang web
    const params = new URLSearchParams(searchParams.toString());
    
    if (maxPrice) params.set('max_price', maxPrice);
    else params.delete('max_price');

    if (minAcreage) params.set('min_acreage', minAcreage);
    else params.delete('min_acreage');

    // Dùng useRouter để đẩy URL mới (Ví dụ: /exam-test?max_price=3000000&min_acreage=20)
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4 p-6 border rounded-lg bg-card shadow-sm">
      <h2 className="text-xl font-bold">Tìm kiếm phòng trọ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Mức giá tối đa (VNĐ)</label>
          <Input 
            type="number" 
            min="0"
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)} 
            placeholder="VD: 3000000"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Diện tích tối thiểu (m2)</label>
          <Input 
            type="number" 
            min="0"
            value={minAcreage} 
            onChange={(e) => setMinAcreage(e.target.value)} 
            placeholder="VD: 20"
          />
        </div>
      </div>
      <Button type="submit" className="w-full md:w-auto self-end">
        Tìm kiếm
      </Button>
    </form>
  );
}
