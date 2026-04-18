'use client';

/**
 * ============================================================================
 * 📖 HƯỚNG DẪN CÁCH NHÚNG BẢNG (TABLE) NÀY VÀO DỰ ÁN THỰC TẾ
 * ============================================================================
 * Nếu thầy yêu cầu đưa các chức năng Chọn Tất Cả / Nút Xóa vào màn hình Quản trị (Admin)
 * của bạn, bạn sử dụng toàn bộ logic trong file này. File này giải quyết mọi yêu cầu về Table.
 * 
 * BƯỚC 1: QUẢN LÝ DANH SÁCH BẰNG STATE
 * Trong component của bạn, thay vì gọi dữ liệu thụ động, hãy đưa nó vào `useState` 
 * để bảng có thể thay đổi (xóa) trên giao diện ngay lập tức mà không cần reload.
 * VD: const [data, setData] = useState(danhSachPhongTuBanDauLấyĐược);
 * 
 * BƯỚC 2: COPY 3 STATE CỐT LÕI
 * Copy 3 dòng này vứt vào component của bạn:
 * const [searchQuery, setSearchQuery] = useState(''); // Quản lý ô tìm kiếm
 * const [selectedIds, setSelectedIds] = useState<string[]>([]); // Quản lý các ô checkbox
 * 
 * BƯỚC 3: COPY CÁC HÀM XỬ LÝ (handleSelectAll, handleSelectOne, handleDeleteSelected)
 * Bạn có thể copy nguyên đoạn logic bên dưới paste vào dự án của bạn và điều chỉnh tên.
 */

import React, { useState, useMemo } from 'react';
import { Search, Trash2, CheckSquare, XSquare } from 'lucide-react';

// 1. DỮ LIỆU GIẢ LẬP BAN ĐẦU
const INITIAL_DATA = [
  { id: '1', name: 'Phòng 101', type: 'Phòng đơn', price: 2000000, status: 'Trống' },
  { id: '2', name: 'Phòng 102', type: 'Phòng đôi', price: 3500000, status: 'Đã thuê' },
  { id: '3', name: 'Phòng 201', type: 'Phòng đơn', price: 2200000, status: 'Trống' },
  { id: '4', name: 'Phòng 202', type: 'Phòng VIP', price: 5000000, status: 'Trống' },
  { id: '5', name: 'Phòng 305', type: 'Phòng đôi', price: 3000000, status: 'Đã thuê' },
];

export default function InteractiveTable() {
  // --- STATES QUẢN LÝ ---
  const [data, setData] = useState(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // --- LOGIC 1: TÌM KIẾM NHANH TỨC THỜI (LIVE SEARCH) ---
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    return data.filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  // --- LOGIC 2: CHECKBOX CÁ NHÂN & CHỌN TẤT CẢ ---
  const isAllSelected = filteredData.length > 0 && selectedIds.length === filteredData.length;
  // cờ hiệu: có ít nhất 1 cái được chọn
  const hasSelection = selectedIds.length > 0;

  // HÀM BẬT CHỌN TẤT CẢ
  const handleSelectAll = () => {
    setSelectedIds(filteredData.map((room) => room.id));
  };

  // HÀM BỎ CHỌN TẤT CẢ
  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  // HÀM CHO CÁI CHECKBOX TRÊN CÙNG CỦA RAW THEO NHƯ HIỆN TẠI (Tích vào checkbox header)
  const handleToggleAll = () => {
    if (isAllSelected) {
      handleDeselectAll();
    } else {
      handleSelectAll();
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // --- LOGIC 3 & 4: XÓA CÁC MỤC ĐÃ CHỌN ---
  const handleDeleteSelected = () => {
    const confirm = window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} phòng đã chọn không?`);
    if (confirm) {
      const newData = data.filter((room) => !selectedIds.includes(room.id));
      setData(newData);
      setSelectedIds([]);
      alert('Đã xóa thành công!');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
      
      {/* THANH CÔNG CỤ (Thanh tìm kiếm & Cụm nút bấm) */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Gõ tên phòng để tìm ngay..."
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Cụm Nút Bấm Thao Tác Bảng */}
        <div className="flex flex-wrap items-center gap-2">
          {/* NÚT CHỌN TẤT CẢ (Vô hiệu hóa khi đã chọn full) */}
          <button
            onClick={handleSelectAll}
            disabled={isAllSelected || filteredData.length === 0}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all font-medium border ${
              isAllSelected || filteredData.length === 0
                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            Chọn tất cả
          </button>

          {/* NÚT BỎ CHỌN TẤT CẢ (Vô hiệu hóa khi chưa có cái nào được chọn) */}
          <button
            onClick={handleDeselectAll}
            disabled={!hasSelection}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all font-medium border ${
              !hasSelection
                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <XSquare className="h-4 w-4" />
            Bỏ chọn
          </button>

          {/* NÚT XÓA (Vô hiệu hóa khi chưa có cái nào được chọn) */}
          <button
            onClick={handleDeleteSelected}
            disabled={!hasSelection}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all font-medium ${
              hasSelection
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Trash2 className="h-4 w-4" />
            Xóa ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* KHU VỰC BẢNG (TABLE) */}
      <div className="overflow-x-auto border rounded-md">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer accent-blue-600 rounded"
                  checked={isAllSelected}
                  onChange={handleToggleAll}
                />
              </th>
              <th className="p-4 font-semibold text-slate-700">Tên phòng</th>
              <th className="p-4 font-semibold text-slate-700">Loại</th>
              <th className="p-4 font-semibold text-slate-700">Mức giá</th>
              <th className="p-4 font-semibold text-slate-700">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((room) => (
                <tr 
                  key={room.id} 
                  className={`border-b hover:bg-slate-50 transition-colors ${
                    selectedIds.includes(room.id) ? 'bg-blue-50/50' : ''
                  }`}
                >
                  {/* Câu hỏi 2: Ô Checkbox Từng dòng */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer accent-blue-600 rounded"
                      checked={selectedIds.includes(room.id)}
                      onChange={() => handleSelectOne(room.id)}
                    />
                  </td>
                  <td className="p-4 font-medium text-slate-900">{room.name}</td>
                  <td className="p-4 text-slate-600">{room.type}</td>
                  <td className="p-4 text-slate-600">{room.price.toLocaleString('vi-VN')} đ</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      room.status === 'Trống' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {room.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Không tìm thấy phòng nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
