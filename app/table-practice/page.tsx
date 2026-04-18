import React from 'react';
import InteractiveTable from '@/components/exam-practice/InteractiveTable';

export default function TablePracticePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER GIỚI THIỆU */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Thực Hành Nâng Cao: Tương Tác Bảng (Table)</h1>
          <p className="mt-2 text-lg text-slate-600 max-w-3xl">
            Bảng bên dưới mô phỏng đầy đủ các yêu cầu phức tạp nhất của Thầy Giáo về quản lý Admin: Chọn tất cả, Xóa nhiều dòng, Live-search (không cần Enter), và bật/tắt (disable) nút Xóa.
          </p>
        </div>

        {/* THÀNH PHẦN CHÍNH (Interactive Table Component) */}
        <InteractiveTable />

        {/* HƯỚNG DẪN ÔN TẬP */}
        <div className="mt-10 p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
          <h2 className="font-bold text-xl text-blue-800">✅ Câu Hỏi Thầy Thường Đặt & Cách Bạn Trả Lời:</h2>
          
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-md">
              <strong className="text-slate-900 block mb-1">1. "Làm sao chức năng Tìm Kiếm hoạt động ngay lúc gõ phím mà không cần bấm Enter?"</strong>
              <p className="text-slate-700 text-sm">
                <strong>Trả lời:</strong> Dạ thưa thầy, em sử dụng thẻ {'<input>'} kết hợp với sự kiện `onChange`. Mỗi khi gõ 1 ký tự, biến State `searchQuery` sẽ cập nhật ngay lập tức. Sau đó, em dùng hàm `Array.filter()` để tính toán lại giao diện, nên người dùng sẽ thấy kết quả nhảy ra ngay (gọi là Dữ liệu dẫn xuất / Derived State).
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-md">
              <strong className="text-slate-900 block mb-1">2. "Nút XÓA phải bị mờ (disable) nếu không có thẻ nào được check. Em code khúc đó ở đâu?"</strong>
              <p className="text-slate-700 text-sm">
                <strong>Trả lời:</strong> Em dùng thuộc tính `disabled` của thẻ button và gán logic `disabled={'{selectedIds.length === 0}'}`. Vì em tạo 1 mảng Array `selectedIds` để đếm số lượng dòng đang được click. Nếu mảng trống (=== 0) thì nút sẽ khóa và hiện màu xám.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-md">
              <strong className="text-slate-900 block mb-1">3. "Logic Chọn Tất Cả / Bỏ chọn Tất Cả hoạt động ra sao?"</strong>
              <p className="text-slate-700 text-sm">
                <strong>Trả lời:</strong> Em đếm độ dài của mảng dữ liệu đang hiển thị và so với độ dài của mảng `selectedIds`. 
                <br/>- Nếu bằng nhau = Nghĩa là đang chọn tất cả -&gt; Click vào sẽ `setSelectedIds([])` (Reset mảng về rỗng).
                <br/>- Ngược lại = Click vào sẽ bốc toàn bộ các chuỗi ID nhét chung vào một mảng.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-md">
              <strong className="text-slate-900 block mb-1">4. "Sau khi bấm Xóa, em cập nhật lại bảng mà không cần tải lại Database như thế nào?"</strong>
              <p className="text-slate-700 text-sm">
                <strong>Trả lời:</strong> Hay còn gọi là `Optimistic UI update`. Em dùng hàm `window.confirm` để lấy lệnh xác nhận (OK, Cancel). Nếu OK, em dùng hàm `data.filter()` lọc vứt bỏ những dòng có ID nằm trong danh sách đang được chọn. Xong em gọi setState ghi đè dữ liệu mới và hiện `alert("Thành công")`.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
