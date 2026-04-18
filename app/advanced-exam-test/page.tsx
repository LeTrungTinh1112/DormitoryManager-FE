import React from 'react';

/**
 * ============================================================================
 * 📖 HƯỚNG DẪN CÁCH CODE TRANG NÀY KHI THẦY HỎI (TRANG NÂNG CAO)
 * ============================================================================
 * 1. MỤC ĐÍCH FILE:
 *    Đây là Trang kết hợp Form Phức tạp + Phân Trang (Pagination) + Sắp xếp (Sorting).
 * 
 * 2. CÂU HỎI THƯỜNG GẶP TỪ GIẢNG VIÊN:
 *    - Thầy: "Giao diện Phân Trang (trang 1, trang 2) em chia ra như thế nào?"
 *      => Trả lời: "Dạ ở dòng 64, em tính xem tổng số trang là bao nhiêu bằng cách lấy (tổng số lượng phòng sau khi lọc) chia cho số lượng (3 phòng/trang) và làm tròn lên bằng Math.ceil()."
 * 
 *    - Thầy: "Làm sao em biết đang ở trang số mấy để cắt mảng phòng?"
 *      => Trả lời: "Em lấy biến `page` trên URL xuống (dòng 34). Sau đó em dùng hàm `Array.slice(điểm đầu, điểm cuối)` (dòng 53) để cắt đúng đoạn dữ liệu thuộc về trang đó ra hiển thị."
 * 
 *    - Thầy: "Phần code sắp xếp (sort) hoạt động nguyên lý ra sao?"
 *      => Trả lời: "Trước khi em cắt trang (Slice), em chạy hàm `Array.sort()` (dòng 42). Em bóc giá trị `sortType` trên URL (ví dụ: 'price-asc'). Khi đó hàm sort sẽ so sánh `roomA.price` trừ `roomB.price` để tự đảo vị trí."
 */

import Link from 'next/link';
import AdvancedTeacherSearchForm from '@/components/exam-practice/AdvancedTeacherSearchForm';

// MOCK DATA Nhiều phòng hơn để kiểm tra tính năng PHÂN TRANG (Dự tính 3)
const MOCK_ROOMS = [
  { id: "1", houseName: "Trọ Tự Do 1", roomNumber: "10A", price: 2000000, acreage: 15, status: "TRỐNG" },
  { id: "2", houseName: "Trọ Tự Do 2", roomNumber: "10B", price: 1500000, acreage: 12, status: "TRỐNG" },
  { id: "3", houseName: "Nhà Hạnh Phúc", roomNumber: "101", price: 5000000, acreage: 30, status: "TRỐNG" },
  { id: "4", houseName: "Nhà Hạnh Phúc", roomNumber: "102", price: 3000000, acreage: 20, status: "TRỐNG" },
  { id: "5", houseName: "Nhà Hạnh Phúc", roomNumber: "103", price: 1800000, acreage: 15, status: "TRỐNG" },
  { id: "6", houseName: "Biệt thự mini", roomNumber: "20A", price: 6000000, acreage: 40, status: "TRỐNG" },
  { id: "7", houseName: "Biệt thự mini", roomNumber: "20B", price: 2500000, acreage: 18, status: "TRỐNG" },
  { id: "8", houseName: "Chưng cư ma", roomNumber: "9", price: 1000000, acreage: 10, status: "TRỐNG" },
  { id: "9", houseName: "Chưng cư A", roomNumber: "401", price: 8000000, acreage: 40, status: "ĐÃ_THUÊ" }, // Bỏ qua
];

// Cấu hình phân trang: 3 phòng/1 trang
const ITEMS_PER_PAGE = 3;

export default async function AdvancedExamTestPage({
  searchParams,
}: {
  // Bổ sung thêm nhận diện param 'sort' và 'page'
  searchParams: Promise<{ max_price?: string; min_acreage?: string; sort?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const maxPrice = Number(resolvedParams.max_price || 0);
  const minAcreage = Number(resolvedParams.min_acreage || 0);
  const sortType = resolvedParams.sort || 'default';
  const currentPage = Number(resolvedParams.page || 1);

  // --- BƯỚC 1: LỌC DỮ LIỆU CĂN BẢN (Filtering) ---
  let resultRooms = MOCK_ROOMS.filter((room) => {
    const isAvailable = room.status === "TRỐNG";
    const isValidPrice = maxPrice > 0 ? room.price <= maxPrice : true;
    const isValidAcreage = minAcreage > 0 ? room.acreage >= minAcreage : true;
    return isAvailable && isValidPrice && isValidAcreage;
  });

  // --- BƯỚC 2: SẮP XẾP DỮ LIỆU LÊN XUỐNG (DỰ TÍNH 1) ---
  if (sortType === 'price_asc') {
    resultRooms.sort((a, b) => a.price - b.price); // Giá Thấp => Cao
  } else if (sortType === 'price_desc') {
    resultRooms.sort((a, b) => b.price - a.price); // Giá Cao => Thấp
  }

  // --- BƯỚC 3: PHÂN TRANG KẾT QUẢ ĐÃ LỌC & SORT (DỰ TÍNH 3) ---
  const totalItems = resultRooms.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  // Tính toán vị trí cắt mảng: Cắt mảng bắt đầu từ vị trí nào, kết thúc lúc nào
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
  // Mảng dùng để Render ra Giao Diện chính là mảng này
  const pagedRooms = resultRooms.slice(startIndex, endIndex);

  // --- HÀM BỔ TRỢ: Xây dựng Link Chuyển Trang ---
  const buildPageLink = (newPage: number) => {
    const params = new URLSearchParams();
    if (resolvedParams.max_price) params.set('max_price', resolvedParams.max_price);
    if (resolvedParams.min_acreage) params.set('min_acreage', resolvedParams.min_acreage);
    if (resolvedParams.sort) params.set('sort', resolvedParams.sort);
    params.set('page', newPage.toString()); // Ghi đè chỉ mục trang mới vào URL
    return `/advanced-exam-test?${params.toString()}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6 py-10 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-950 mb-2">ĐỀ ADVANCED: VALIDATION - SORT - PAGINATION</h1>
      
      {/* 1. Gọi Filter Component */}
      <AdvancedTeacherSearchForm />

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 flex justify-between">
          Kết quả tìm kiếm ({totalItems} phòng trống)
          <span className="text-sm font-normal text-muted-foreground">
            Trang {currentPage} / {totalPages === 0 ? 1 : totalPages}
          </span>
        </h2>

        {totalItems > 0 ? (
          <>
            {/* Lưới hiển thị Card Phòng (Sử dụng mảng pagedRooms thay vì resultRooms) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {pagedRooms.map((room) => (
                <div key={room.id} className="border p-4 bg-slate-50 rounded-lg hover:-translate-y-1 transition duration-200">
                   <h3 className="font-bold text-lg text-primary">{room.houseName} - Căn {room.roomNumber}</h3>
                   <p className="text-slate-800 mt-3 font-semibold text-lg">{room.price.toLocaleString('vi-VN')} VNĐ</p>
                   <p className="text-gray-500 text-sm mt-1">Diện tích sàn: {room.acreage} m²</p>
                   <div className="mt-4 text-xs font-bold text-green-700 bg-green-100 border border-green-200 inline-block px-3 py-1 rounded-full uppercase">
                    {room.status}
                   </div>
                </div>
              ))}
            </div>

            {/* DỰ TÍNH 3: Điều hướng Phân trang bằng UI */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t">
                {currentPage > 1 ? (
                  <Link href={buildPageLink(currentPage - 1)} className="px-4 py-2 border rounded hover:bg-slate-100 font-medium">
                    ← Trang trước
                  </Link>
                ) : (
                  <button disabled className="px-4 py-2 border rounded bg-slate-100 opacity-50 cursor-not-allowed">← Trang trước</button>
                )}

                {currentPage < totalPages ? (
                  <Link href={buildPageLink(currentPage + 1)} className="px-4 py-2 border border-slate-800 bg-slate-800 text-white rounded hover:bg-slate-700 font-medium transition">
                    Trang sau →
                  </Link>
                ) : (
                  <button disabled className="px-4 py-2 border rounded bg-slate-100 opacity-50 cursor-not-allowed">Trang sau →</button>
                )}
              </div>
            )}
          </>
        ) : (
          /* TRẠNG THÁI RỖNG */
          <div className="flex flex-col items-center justify-center p-12 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg">
             <p className="text-center font-semibold">
               Không tìm thấy phòng nào phù hợp với tầm giá và diện tích này. Vui lòng đặt lại bộ lọc.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
