import React, { Suspense } from 'react';

/**
 * ============================================================================
 * 📖 HƯỚNG DẪN CÁCH CODE TRANG NÀY KHI THẦY HỎI (TRANG ULTIMATE)
 * ============================================================================
 * 1. MỤC ĐÍCH: 
 *    Trang này hứng dữ liệu từ thanh URL (do form đẩy lên) để tiến hành filter 
 *    nhiều điều kiện (Giá, Diện tích, Trạng thái).
 * 
 * 2. CÂU HỎI THƯỜNG GẶP TỪ GIẢNG VIÊN:
 *    - Thầy: "Tại sao em phải bọc Form trong <Suspense> (dòng 58)?"
 *      => Trả lời: "Dạ thưa thầy, form có đoạn đọc thông tin từ thanh địa chỉ (URL) bằng `useSearchParams()`. Next.js bắt buộc phải nhét form vào thẻ `<Suspense>` để trong kịch bản Server-Side Rendering (SSR), nó không lỗi khi tải URL động."
 *    
 *    - Thầy: "Đoạn code nào em tiến hành lọc (Filter) dữ liệu?"
 *      => Trả lời: "Dạ em đọc tham số URL ở dòng 40, ép về kiểu Số (Number), rồi chạy hàm `.filter()` ở dòng 46 ạ. Hàm này phải thỏa mãn 3 chữ '&&' là lọc đúng giá, đúng diện tích và đúng trạng thái phòng mới in ra giao diện."
 * 
 *    - Thầy: "Cái mock data `MOCK_ROOMS` lấy từ đâu?"
 *      => Trả lời: "Trong bài thực tế, em sẽ thay `MOCK_ROOMS` thành câu lệnh `const allRooms = await db.room.findMany()` (gọi DB thực tế) ạ."
 */

import UltimateSearchForm from '@/components/exam-practice/UltimateSearchForm';

// MOCK DATA Nhiều phòng hơn để kiểm tra tính năng Lọc Trạng Thái
const MOCK_ROOMS = [
  { id: "1", houseName: "Trọ Tự Do 1", roomNumber: "10A", price: 2000000, acreage: 15, status: "TRỐNG" },
  { id: "2", houseName: "Trọ Tự Do 2", roomNumber: "10B", price: 1500000, acreage: 12, status: "TRỐNG" },
  { id: "3", houseName: "Nhà Hạnh Phúc", roomNumber: "101", price: 5000000, acreage: 30, status: "ĐÃ_THUÊ" }, // Cố tình để Đã thuê
  { id: "4", houseName: "Nhà Hạnh Phúc", roomNumber: "102", price: 3000000, acreage: 20, status: "TRỐNG" },
  { id: "5", houseName: "Nhà Hạnh Phúc", roomNumber: "103", price: 1800000, acreage: 15, status: "TRỐNG" },
  { id: "6", houseName: "Biệt thự mini", roomNumber: "20A", price: 6000000, acreage: 40, status: "ĐÃ_THUÊ" }, // Cố tình để Đã thuê
];

export default async function UltimateTestPage({
  searchParams,
}: {
  // Lấy 3 tham số từ URL
  searchParams: Promise<{ max_price?: string; min_acreage?: string; status?: string }>;
}) {
  const resolvedParams = await searchParams;
  
  const maxPrice = Number(resolvedParams.max_price || 0);
  const minAcreage = Number(resolvedParams.min_acreage || 0);
  const currentStatus = resolvedParams.status || 'all';

  // --- BƯỚC 1: LỌC DỮ LIỆU TỔNG HỢP ---
  const filteredRooms = MOCK_ROOMS.filter((room) => {
    // Nếu status là 'all' thì luôn đúng, nếu không thì phải khớp với URL
    const isValidStatus = currentStatus === 'all' ? true : room.status === currentStatus;
    const isValidPrice = maxPrice > 0 ? room.price <= maxPrice : true;
    const isValidAcreage = minAcreage > 0 ? room.acreage >= minAcreage : true;
    
    return isValidStatus && isValidPrice && isValidAcreage;
  });

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6 py-10 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-950 mb-2">ĐỀ ULTIMATE: RESET & LOADING & TAGS</h1>
      
      {/* Tính năng Loading Transition và Tag Bắt Buộc Đặt Trong Suspense của Next.js */}
      <Suspense fallback={<div className="h-64 flex items-center justify-center">Đang tải form...</div>}>
         <UltimateSearchForm />
      </Suspense>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 flex justify-between items-center">
          Danh sách phòng
          <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            {filteredRooms.length} kết quả
          </span>
        </h2>

        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div key={room.id} className="border p-4 bg-white rounded-lg hover:-translate-y-1 transition duration-200 relative overflow-hidden group">
                   <h3 className="font-bold text-lg text-slate-800">{room.houseName}</h3>
                   <span className="text-sm text-slate-500 block">Số phòng: {room.roomNumber}</span>
                   <p className="text-blue-600 mt-2 font-bold text-xl">{room.price.toLocaleString('vi-VN')} đ</p>
                   <p className="text-gray-500 text-sm mt-0.5">Diện tích: {room.acreage} m²</p>
                   <div className={`mt-4 text-xs font-bold px-3 py-1 rounded-full inline-block ${
                      room.status === 'TRỐNG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                   }`}>
                    {room.status === 'TRỐNG' ? 'Đang trống' : 'Đã cho thuê'}
                   </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-200 rounded-lg">
             <p className="text-center font-semibold text-slate-500 text-lg">
               Ôi không! Chẳng có phòng nào khớp với các bộ lọc bạn đã chọn.
             </p>
             <p className="text-center text-sm text-slate-400 mt-2">
               Hãy thử tắt bớt các Tags Lọc ở bên trên.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
