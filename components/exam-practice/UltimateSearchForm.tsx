'use client';

/**
 * ============================================================================
 * 📖 HƯỚNG DẪN DÙNG FORM TÌM KIẾM TỐI THƯỢNG (UltimateSearchForm)
 * ============================================================================
 * NẾU BẠN CẦN GIẢI THÍCH CHO THẦY HOẶC COPY VÀO DỰ ÁN:
 * 
 * 1. Ý nghĩa file này: Form xịn nhất, giống Shopee/Agoda. Nó có "Tags (Nhãn)" 
 *    hiện ra bên dưới form để báo cho user biết họ đang lọc cái gì, và có dấu X 
 *    để "Xóa tag" (lọc ngay lập tức). Có icon xoay Loading chờ dữ liệu.
 * 
 * 2. Cách ráp vào bài của bạn: 
 *    - Tương tự, Import thẻ `<UltimateSearchForm />` vào trang chứa bảng/danh sách.
 * 
 * 3. Hướng dẫn giải thích code khi thầy hỏi:
 *    - Thầy: "Cái tag (nhãn màu xanh) tắt đi thì làm sao nó bỏ lọc được?"
 *      => Trả lời: "Khi bấm X trên tag, em gọi hàm `removeFilter(...)`. Hàm này xóa giá trị của cái đó trên URLSearchParams, rồi dùng `router.push` đẩy URL mới lên trình duyệt. Bảng bên dưới tự động update."
 *    - Thầy: "Cái xoay xoay Loading làm sao mà hiện ra mượt vậy?"
 *      => Trả lời: "Em xài Hook `useTransition` của React 18 (dòng 28). Nó bọc hàm `router.push`, khi nào Server chưa trả dữ liệu mới về xong thì `isPending = true`, em bắt biến đó hiện Icon Spinner."
 *    - Thầy: "Làm sao giữ được chữ trên thanh Input khi F5 browser?"
 *      => Trả lời: "State ban đầu em set bằng `searchParams.get('tên_param') || ''` (dòng 31). Tức là React vừa render ra là chộp luôn chữ từ URL đổ vô ô Input, nên F5 mất sao được thầy!"
 */

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Search, RefreshCcw } from 'lucide-react';

export default function UltimateSearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // useTransition giúp React quản lý hiệu ứng Loading mượt mà khi chuyển trang
  const [isPending, startTransition] = useTransition();

  // Đọc dữ liệu từ URL xuống các ô nhập liệu
  const currentMaxPrice = searchParams.get('max_price') || '';
  const currentMinAcreage = searchParams.get('min_acreage') || '';
  const currentStatus = searchParams.get('status') || 'all';

  // State quản lý giá trị đang gõ trong form
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [minAcreage, setMinAcreage] = useState(currentMinAcreage);
  const [status, setStatus] = useState(currentStatus);

  // HÀM 1: KHI BẤM NÚT TÌM KIẾM
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (maxPrice) params.set('max_price', maxPrice);
    else params.delete('max_price');

    if (minAcreage) params.set('min_acreage', minAcreage);
    else params.delete('min_acreage');

    if (status !== 'all') params.set('status', status);
    else params.delete('status');

    // Reset lại trang 1 nếu có đang dùng phân trang
    params.delete('page');

    // Bật hiệu ứng loading và đổi URL
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // HÀM 2: KHI BẤM NÚT XÓA BỘ LỌC (RESET)
  const handleReset = () => {
    setMaxPrice('');
    setMinAcreage('');
    setStatus('all');
    
    startTransition(() => {
      router.push(pathname); // Quay về URL gốc, sạch sẽ params
    });
  };

  // HÀM 3: XÓA TỪNG TAG BỘ LỌC (Khi bấm dấu X trên Tag)
  const removeFilter = (filterKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(filterKey);
    
    // Xóa state trên form luôn
    if (filterKey === 'max_price') setMaxPrice('');
    if (filterKey === 'min_acreage') setMinAcreage('');
    if (filterKey === 'status') setStatus('all');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm mb-8 space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          Tiêu chí tìm kiếm
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Mức giá tối đa (VNĐ)</label>
            <Input 
              type="number" 
              min="0"
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)} 
              placeholder="VD: 3000000"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Diện tích tối thiểu (m2)</label>
            <Input 
              type="number" 
              min="0"
              value={minAcreage} 
              onChange={(e) => setMinAcreage(e.target.value)} 
              placeholder="VD: 20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Trạng thái phòng</label>
            <select 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="TRỐNG">Chỉ tìm phòng trống</option>
              <option value="ĐÃ_THUÊ">Đã cho thuê</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button 
            type="submit" 
            disabled={isPending} // KHÓA NÚT KHI ĐANG LOADING
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? 'Đang xử lý...' : 'Áp dụng bộ lọc'}
          </Button>
          
          {/* NÚT XÓA BỘ LỌC (Chỉ hiện khi form có dữ liệu) */}
          {(maxPrice || minAcreage || status !== 'all') && (
            <Button 
               type="button" 
               variant="outline" 
               onClick={handleReset}
               disabled={isPending}
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Xóa bộ lọc
            </Button>
          )}
        </div>
      </form>

      {/* KHU VỰC HIỂN THỊ TAGS (BADGES) 
          Thầy hỏi: Làm sao khách biết đang lọc cái gì?
          Trả lời: Code đoạn này sẽ render các thẻ hiển thị.
      */}
      {(currentMaxPrice || currentMinAcreage || currentStatus !== 'all') && (
        <div className="pt-4 border-t flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-500 mr-2">Đang lọc theo:</span>
          
          {currentMaxPrice && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
              Giá {'<='} {Number(currentMaxPrice).toLocaleString('vi-VN')}đ
              <button type="button" onClick={() => removeFilter('max_price')} className="hover:bg-blue-200 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentMinAcreage && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200">
              Diện tích {'>='} {currentMinAcreage}m²
              <button type="button" onClick={() => removeFilter('min_acreage')} className="hover:bg-green-200 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 text-sm font-medium rounded-full border border-orange-200">
              {currentStatus === 'TRỐNG' ? 'Phòng Trống' : 'Phòng Đã Thuê'}
              <button type="button" onClick={() => removeFilter('status')} className="hover:bg-orange-200 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
