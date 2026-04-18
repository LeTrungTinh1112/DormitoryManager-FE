'use client';

/**
 * ============================================================================
 * 📖 HƯỚNG DẪN DÙNG FORM TÌM KIẾM NÂNG CAO (AdvancedTeacherSearchForm)
 * ============================================================================
 * NẾU BẠN CẦN GIẢI THÍCH CHO THẦY HOẶC COPY VÀO DỰ ÁN:
 * 
 * 1. Ý nghĩa file này: Form tìm kiếm nâng cao, chặn nhập số âm (validation),
 *    tích hợp sẵn chọn Sắp xếp (Sort) và tự động đẩy URL để trang khác hứng.
 * 
 * 2. Cách ráp vào bài của bạn: 
 *    - Import file này vào trang bạn muốn hiện form (`import AdvancedTeacherSearchForm from '...'`)
 *    - Gắn thẻ `<AdvancedTeacherSearchForm />` vào chỗ cần hiển thị.
 * 
 * 3. Hướng dẫn giải thích code khi thầy hỏi:
 *    - Thầy: "Làm sao chống nhập sai số âm?" 
 *      => Trả lời: "Em dùng State `error` (dòng 23), kiểm tra nếu giá trị rỗng hoặc nhỏ hơn 0 thì bung lỗi, sau đó `return` xẻ ngang hàm luôn (dòng 29) để không chạy xuống đẩy router.push"
 *    - Thầy: "Làm sao tự động tìm ngay khi vừa bấm ô Select Sắp Xếp?"
 *      => Trả lời: "Em gắn sự kiện `onChange` (dòng 52) trên thẻ Select, khi đổi giá trị thì cập nhật State và gọi hàm `handleSearch` luôn mà không cần chờ bấm nút."
 *    - Thầy: "Chuyển trang có bị mất số 1 đi không?"
 *      => Trả lời: "Dạ có, em ép params.set('page', '1') ngay khi Search (dòng 46), nên luôn reset về trang số 1 sau khi tìm."
 */

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdvancedTeacherSearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [minAcreage, setMinAcreage] = useState(searchParams.get('min_acreage') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'default');
  
  // DỰ TÍNH 5: State lưu thông báo lỗi Validation
  const [error, setError] = useState(''); 

  const handleSearch = (e?: React.FormEvent, customSort?: string) => {
    if (e) e.preventDefault();
    
    // YÊU CẦU DỰ TÍNH 5: Xử lý Validation chặn lỗi
    if (Number(maxPrice) < 0 || Number(minAcreage) < 0) {
      setError('Giá tiền và diện tích không được là số âm!');
      return; // Cố tình return để không chạy lệnh router.push bên dưới
    }
    setError(''); // Xóa lỗi nếu dữ liệu đã hợp lệ

    const params = new URLSearchParams(searchParams.toString());
    
    if (maxPrice) params.set('max_price', maxPrice);
    else params.delete('max_price');

    if (minAcreage) params.set('min_acreage', minAcreage);
    else params.delete('min_acreage');

    const currentSort = customSort || sort;
    if (currentSort && currentSort !== 'default') params.set('sort', currentSort);
    else params.delete('sort');

    // DỰ TÍNH 3: Khi có tìm kiếm mới, phải reset phân trang về trang 1
    params.set('page', '1'); 

    // Đẩy URL mới
    router.push(`${pathname}?${params.toString()}`);
  };

  // DỰ TÍNH 1 + DỰ TÍNH 2 (Kết hợp): Gửi URL ngay khi người dùng chọn option ở thẻ Select
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSort(newSort);
    handleSearch(undefined, newSort); // Kích hoạt Live-search cho thẻ select
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4 p-6 border rounded-lg bg-card shadow-sm mb-8">
      <h2 className="text-xl font-bold">Bộ lọc phòng trọ siêu cấp (Có Sắp Xếp & Báo Lỗi)</h2>
      
      {/* Hiển thị lỗi ra UI nếu state Error có nội dung */}
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm font-medium">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium">Mức giá tối đa (VNĐ)</label>
          <Input 
            type="number" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)} 
            placeholder="VD: 3000000"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Diện tích tối thiểu (m2)</label>
          <Input 
            type="number" 
            value={minAcreage} 
            onChange={(e) => setMinAcreage(e.target.value)} 
            placeholder="VD: 20"
          />
        </div>

        {/* DỰ TÍNH 1: Giao diện Sắp xếp Căn bản */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex gap-2 items-center">
            Sắp xếp kết quả 
            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Tự động chạy</span>
          </label>
          <select 
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={sort}
            onChange={handleSortChange}
          >
            <option value="default">Mặc định (Không sắp xếp)</option>
            <option value="price_asc">Giá: Từ Thấp đến Cao</option>
            <option value="price_desc">Giá: Từ Cao xuống Thấp</option>
          </select>
        </div>
      </div>
      
      <Button type="submit" className="w-full md:w-auto self-end px-8">
        Lọc danh sách ngay
      </Button>
    </form>
  );
}
