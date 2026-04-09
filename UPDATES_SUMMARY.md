# Website Ký Túc Xá - Cập Nhật Ưu Tiên 1

## Tổng Quan
Đã thêm hoàn chỉnh các trang theo danh sách **Ưu Tiên 1** để website trở nên đầy đủ và professional hơn. Tất cả các trang mới đều:
- Responsive trên mobile/tablet/desktop
- Sử dụng font Inter
- Follow design system hiện tại (#ab3832, #f1f2ee, trắng, đen)
- Tích hợp CTA "Đăng ký ngay" rõ ràng

---

## 1. Trang Đăng Ký Thuê Phòng `/register`

### Tính Năng:
- **Form đầy đủ** với các trường:
  - Họ và tên (bắt buộc)
  - Số điện thoại (bắt buộc)
  - Email (bắt buộc)
  - Trường/Khoa (bắt buộc)
  - Loại phòng mong muốn (dropdown: Standard, Premium, VIP)
  - Ngày dự kiến nhận phòng (date picker)
  - Ghi chú (textarea tuỳ chọn)

- **UX tuyệt vời**:
  - Form validation hiện tại (required fields)
  - Submit button thay đổi trạng thái (loading)
  - Success page với animation khi submit thành công
  - Auto reset form sau 3 giây
  - Info box nhắc nhở về fields bắt buộc

### Tích Hợp:
```typescript
// API endpoint sẽ nhận POST request tại:
POST /api/registrations
{
  fullName: string
  phone: string
  email: string
  school: string
  roomType: 'Standard' | 'Premium' | 'VIP'
  checkInDate: string (YYYY-MM-DD)
  notes?: string
}
```

---

## 2. Trang Tiện Ích Ký Túc Xá `/facilities`

### Tính Năng:
- **Grid tiện ích** 4 cột (responsive: 1 cột mobile, 2 cột tablet, 4 cột desktop):
  - Wifi tốc độ cao (100Mbps 24/7)
  - Bảo vệ 24/7 (camera + tuần tra)
  - Bãi giữ xe (an toàn, camera)
  - Khu tự học (yên tĩnh, có điều hòa)
  - Máy giặt tự động (giá rẻ)
  - Căn tin (đa dạng, giá hợp lý)
  - Khu sinh hoạt chung (sân bóng, billiard)
  - Hệ thống giám sát (camera HD)

- **Mỗi tiện ích** có:
  - Icon minh họa với màu sắc riêng
  - Tiêu đề + mô tả chi tiết
  - Hover effect (scale + shadow)

- **Phần lợi ích bổ sung**: 
  - 6 benefits khác được hiển thị trong grid 2 cột
  - Checkmark icon cho mỗi item

- **CTA Section**:
  - 2 nút: "Đăng ký ngay" + "Xem các phòng"

---

## 3. Trang FAQ & Nội Quy `/faq`

### Tính Năng:
- **20 câu hỏi** được phân loại thành 4 category:
  1. **Thanh toán & Chi phí** (4 Q&A)
     - Giá thuê bao gồm gì?
     - Phí đặt cọc là bao nhiêu?
     - Phương thức thanh toán?
     - Chính sách hoàn cọc?

  2. **Đăng ký & Hợp đồng** (4 Q&A)
     - Quy trình đăng ký?
     - Hồ sơ cần chuẩn bị?
     - Thời hạn hợp đồng?
     - Điều kiện nhận phòng?

  3. **Nội quy & Quy định** (6 Q&A)
     - Giờ đóng mở cổng?
     - Có được chuyển phòng không?
     - Chính sách trả phòng?
     - Khách có được thăm không?
     - Những gì cấm?
     - Bảo vệ làm việc như nào?

  4. **Tiện ích & Dịch vụ** (4 Q&A)
     - Tốc độ wifi?
     - Dịch vụ vệ sinh?
     - Điều hòa mấy độ?
     - Máy giặt ở đâu?

- **UI Component**: Accordion (sử dụng shadcn/ui)
  - Một lúc chỉ mở 1 câu hỏi
  - Smooth animation
  - Hover highlight

- **CTA Section**: Link đến Contact hoặc Register

---

## 4. Nút "Đăng Ký Ngay" - Được Thêm Vào:

### 4.1. Header Navigation
- **Desktop**: 
  - Nút primary "Đăng ký ngay" (màu #ab3832)
  - Nút secondary "Xem phòng" (outline)
  - Badge số lượng yêu thích trên icon Heart

- **Mobile**:
  - Menu dropdown chứa "Đăng ký ngay" + "Xem phòng"
  - Cùng một component, responsive thích hợp

### 4.2. Trang Chủ (Home `/`)
- **Hero section**: Đổi CTA chính từ "Xem phòng" → "Đăng ký thuê phòng"
- Button secondary: "Xem phòng"

### 4.3. Trang Bảng Giá (`/pricing`)
- **CTA section** cuối trang:
  - Nút chính: "Đăng ký ngay" (white background, primary text)
  - Nút phụ: "Duyệt phòng trống"

### 4.4. Trang Facilities & FAQ
- **CTA section** cuối mỗi trang:
  - "Đăng ký ngay" (primary)
  - "Xem phòng" / "Liên hệ chúng tôi" (outline)

---

## 5. Navigation Updates

### Header Links Mới:
```
[Logo] [Home] [Phòng] [Bảng Giá] [Tiện Ích] [FAQ] [Liên Hệ]
       [Yêu Thích] [Đăng Ký Ngay] [Xem Phòng]
```

### Mobile Menu:
```
[Back Button] [Logo]
Menu Items:
- Trang chủ
- Phòng
- Bảng giá
- Tiện ích
- FAQ
- Liên hệ
- Yêu thích
- [Đăng Ký Ngay] (primary button)
- [Xem Phòng] (outline button)
```

---

## 6. File Structure

```
/app
├── register/
│   └── page.tsx (242 lines)
├── facilities/
│   └── page.tsx (159 lines)
├── faq/
│   └── page.tsx (209 lines)
├── page.tsx (updated)
├── pricing/page.tsx (updated)
└── (other existing pages)

/components
├── header.tsx (updated - navigation + CTA)
└── (other existing components)
```

---

## 7. Refactor: Tách Biệt Data, API & UI

### Mục Tiêu:
Tạo ra kiến trúc rõ ràng hơn, tách rời Mock Data khỏi Component, và sử dụng API Routes để phục vụ dữ liệu động.

### Thay Đổi Chính:
1. **Mock Data Centralization (`lib/data.ts`)**:
   - Di chuyển toàn bộ dữ liệu mẫu vào một file duy nhất.
   - Định nghĩa interface `Room`, `Manager`.
   - Update `Room` interface với các trường mới: `slug`, `floor`, `amenities`, `images`.

2. **API Routes (`app/api/rooms`)**:
   - `GET /api/rooms`: Trả về danh sách phòng. Hỗ trợ query parameters: `search`, `type`, `status`, `minPrice`, `maxPrice`, `page`, `limit`.
   - `GET /api/rooms/[slug]`: Trả về chi tiết một phòng dựa trên slug.

3. **Refactor Danh Sách Phòng (`app/rooms/page.tsx`)**:
   - Chuyển logic lấy dữ liệu sang `fetch('/api/rooms')`.
   - Xử lý Loading state khi đang fetch data.

4. **Refactor Chi Tiết Phòng (`app/rooms/[slug]/page.tsx`)**:
   - Chuyển sang **Server Component** để tối ưu SEO và xử lý logic `notFound()`.
   - **Client Component (`components/room-detail.tsx`)**: Tách phần UI tương tác (booking form, favorite toggle) ra component riêng.
   - Thêm phần "Phòng tương tự" ở cuối trang.
   - Thêm `loading.tsx` cho UX mượt mà khi chuyển trang.

---

## 8. Tiếp Theo (Ưu Tiên 2) - Có Thể Thêm

Nếu muốn website hoàn thiện hơn, các trang sau có thể được thêm:

1. **`/contracts-guide`** - Hợp đồng & Thủ tục
   - Quy trình ký hợp đồng
   - Hồ sơ cần chuẩn bị
   - Timeline

2. **`/payments-info`** - Thanh toán & Chi phí (mở rộng)
   - Hạn thanh toán
   - Phương thức (tiền mặt, chuyển khoản, ví)
   - Phí điện nước
   - Hoàn cọc

3. **`/announcements`** - Thông báo
   - Lịch bảo trì
   - Thông báo tăng/giảm phí
   - Sự kiện sinh viên
   - Lịch nghỉ lễ

---

## 8. API Endpoints Cần Xây Dựng

```
POST /api/registrations
- Body: form data từ /register
- Response: { success: boolean, id: string }

GET /api/faq
- Return: danh sách FAQ (có thể động từ DB)

GET /api/facilities
- Return: danh sách tiện ích

GET /api/announcements (tùy chọn)
GET /api/contracts-guide (tùy chọn)
```

---

## 9. UX Improvements Thêm

- ✅ Back button trên header (mobile)
- ✅ Favorites counter badge
- ✅ "Thêm vào danh sách yêu thích" text indicator
- ✅ Slideshow hình ảnh trên room detail
- ✅ Manager modal với QR code support
- ✅ Font Inter cho toàn bộ
- ✅ Dynamic layout (grid auto-rows)
- ✅ Responsive design (mobile-first)

---

## 10. Testing Checklist

- [ ] Test tất cả forms trên mobile/desktop
- [ ] Verify API calls khi submit
- [ ] Check responsive design (320px, 768px, 1024px+)
- [ ] Test FAQ accordion interactions
- [ ] Verify all CTA buttons lead to correct pages
- [ ] Test header navigation on mobile menu
- [ ] Verify favorites counter updates

---

**Website bây giờ đã có đầy đủ CTA rõ ràng cho khách hàng đăng ký, cùng với thông tin chi tiết về tiện ích, nội quy và quy trình!**
