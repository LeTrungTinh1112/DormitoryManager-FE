'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdvancedSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Khởi tạo state từ URL (nếu có)
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [minAcreage, setMinAcreage] = useState(searchParams.get('min_acreage') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Đưa các tham số lên URL
    const params = new URLSearchParams();
    if (maxPrice) params.set('max_price', maxPrice);
    if (minAcreage) params.set('min_acreage', minAcreage);
    
    // Push lên router không reload trang
    router.push(`/test-advanced-search?${params.toString()}`);
  };

  const handleReset = () => {
    setMaxPrice('');
    setMinAcreage('');
    router.push('/test-advanced-search');
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md border mb-8">
      <h2 className="text-xl font-bold mb-4">Tìm kiếm phòng nâng cao (Test)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Mức giá tối đa (VNĐ)</label>
          <input 
            type="number" 
            min="0"
            className="w-full border rounded-md p-2"
            placeholder="Ví dụ: 3000000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Diện tích tối thiểu (m2)</label>
          <input 
            type="number" 
            min="0"
            className="w-full border rounded-md p-2"
            placeholder="Ví dụ: 20"
            value={minAcreage}
            onChange={(e) => setMinAcreage(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          type="submit" 
          className="bg-primary text-primary-foreground bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Tìm kiếm
        </button>
        <button 
          type="button" 
          onClick={handleReset}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Xóa bộ lọc
        </button>
      </div>
    </form>
  );
}
