# Database Schema & API Design Documentation

## Tổng Quan
Hệ thống ký túc xá cho sinh viên với các chức năng: quản lý phòng, quản lý người dùng, hệ thống yêu thích, và quản lý liên hệ.

---

## 1. Database Schema

### 1.1 Bảng Users (Người dùng)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'manager', 'admin') NOT NULL DEFAULT 'student',
  status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  avatar_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);

INDEXES:
- email (UNIQUE)
- phone
- created_at
- role
```

### 1.2 Bảng Rooms (Phòng)
```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  type ENUM('VIP', 'Premium', 'Standard') NOT NULL,
  description TEXT,
  capacity INT NOT NULL,
  price_per_month INT NOT NULL,
  status ENUM('available', 'soon', 'full') NOT NULL DEFAULT 'available',
  
  -- Thông tin giường
  total_beds INT NOT NULL,
  available_beds INT NOT NULL,
  soon_beds INT NOT NULL DEFAULT 0,
  
  -- Quản lý
  manager_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  
  -- Địa chỉ
  address VARCHAR(500),
  city VARCHAR(100),
  district VARCHAR(100),
  ward VARCHAR(100),
  
  -- Tiện nghi
  amenities JSONB, -- ['Máy lạnh', 'WC riêng', 'Wifi 100Mbps', ...]
  
  -- Hình ảnh
  image_urls JSONB, -- ['url1', 'url2', ...]
  
  -- Dữ liệu theo dõi
  view_count INT DEFAULT 0,
  favorite_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT price_positive CHECK (price_per_month > 0),
  CONSTRAINT capacity_positive CHECK (capacity > 0),
  CONSTRAINT total_beds_positive CHECK (total_beds > 0),
  CONSTRAINT available_beds_valid CHECK (available_beds >= 0 AND available_beds <= total_beds),
  CONSTRAINT soon_beds_valid CHECK (soon_beds >= 0)
);

INDEXES:
- type
- status
- manager_id
- city
- price_per_month
- favorite_count
- view_count
- created_at
- (type, status, price_per_month) COMPOSITE
```

### 1.3 Bảng RoomImages (Hình ảnh phòng - Optional nếu cần chi tiết)
```sql
CREATE TABLE room_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  display_order INT NOT NULL,
  is_thumbnail BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INDEXES:
- room_id, display_order
```

### 1.4 Bảng RoomAmenities (Tiện nghi - Optional nếu cần quản lý riêng)
```sql
CREATE TABLE room_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  amenity_name VARCHAR(100) NOT NULL,
  icon_code VARCHAR(50)
);

INDEXES:
- room_id
```

### 1.5 Bảng Favorites (Danh sách yêu thích)
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, room_id)
);

INDEXES:
- user_id
- room_id
- (user_id, added_at DESC) -- Để sắp xếp theo thời gian thêm
```

### 1.6 Bảng Inquiries (Yêu cầu thuê phòng)
```sql
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  message TEXT,
  status ENUM('pending', 'contacted', 'confirmed', 'rejected', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INDEXES:
- user_id
- room_id
- status
- created_at DESC
- (room_id, status, created_at)
```

### 1.7 Bảng RoomViews (Theo dõi lượt xem phòng)
```sql
CREATE TABLE room_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45), -- IPv6 support
  user_agent VARCHAR(500)
);

INDEXES:
- room_id, viewed_at DESC
- viewed_at
- user_id
```

### 1.8 Bảng ManagerContacts (Thông tin liên hệ quản lý - Extend bảng users)
```sql
CREATE TABLE manager_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  zalo_url VARCHAR(500),
  viber_url VARCHAR(500),
  telegram_url VARCHAR(500),
  qr_code_zalo VARCHAR(500),
  qr_code_phone VARCHAR(500),
  qr_code_viber VARCHAR(500),
  qr_code_telegram VARCHAR(500),
  phone_visible BOOLEAN DEFAULT TRUE,
  email_visible BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INDEXES:
- manager_id (UNIQUE)
```

### 1.9 Bảng Ratings (Đánh giá phòng - Optional cho phiên bản nâng cao)
```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, room_id)
);

INDEXES:
- room_id, created_at DESC
- (room_id, rating)
```

---

## 2. API Endpoints

### 2.1 Authentication APIs

#### POST /api/auth/register
**Mục đích**: Đăng ký tài khoản mới
```json
REQUEST:
{
  "email": "student@example.com",
  "password": "securePassword123!",
  "full_name": "Nguyễn Văn A",
  "phone": "0908123456",
  "role": "student"
}

RESPONSE (201):
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "full_name": "Nguyễn Văn A",
    "role": "student"
  },
  "token": "jwt_token"
}
```

#### POST /api/auth/login
**Mục đích**: Đăng nhập
```json
REQUEST:
{
  "email": "student@example.com",
  "password": "securePassword123!"
}

RESPONSE (200):
{
  "success": true,
  "user": { ... },
  "token": "jwt_token"
}
```

#### POST /api/auth/logout
**Mục đích**: Đăng xuất

#### GET /api/auth/me
**Mục đích**: Lấy thông tin người dùng hiện tại (Bearer token required)

---

### 2.2 Room APIs

#### GET /api/rooms
**Mục đích**: Danh sách phòng với lọc, sắp xếp, tìm kiếm
```json
QUERY PARAMS:
- type: VIP,Premium,Standard (comma-separated)
- status: available,soon,full
- minPrice: số (VNĐ)
- maxPrice: số (VNĐ)
- capacity: số người
- city: tên thành phố
- search: từ khóa tìm kiếm
- sortBy: price_asc, price_desc, newest, popular, availability
- page: số trang (default 1)
- limit: số kết quả trên trang (default 20, max 100)

RESPONSE (200):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "code": "VIP-001",
      "name": "Phòng VIP 1 Người",
      "type": "VIP",
      "capacity": 1,
      "price_per_month": 1200000,
      "status": "available",
      "total_beds": 1,
      "available_beds": 1,
      "soon_beds": 0,
      "amenities": ["Máy lạnh", "WC riêng", "Wifi 100Mbps", ...],
      "image_urls": ["url1", "url2", ...],
      "manager": {
        "id": "uuid",
        "name": "Lê Văn C",
        "phone": "0910345678"
      },
      "favorite_count": 12,
      "view_count": 245,
      "is_favorited": false // Nếu user đã login
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### GET /api/rooms/:id
**Mục đích**: Chi tiết phòng
```json
RESPONSE (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "VIP-001",
    "name": "Phòng VIP 1 Người",
    "type": "VIP",
    "description": "Mô tả chi tiết...",
    "capacity": 1,
    "price_per_month": 1200000,
    "status": "available",
    "total_beds": 1,
    "available_beds": 1,
    "soon_beds": 0,
    "amenities": [...],
    "image_urls": [...],
    "address": "123 Đường ABC",
    "city": "Hà Nội",
    "district": "Thanh Xuân",
    "ward": "Khương Thượng",
    "manager": {
      "id": "uuid",
      "full_name": "Lê Văn C",
      "phone": "0910345678",
      "email": "levanc@ktx.com",
      "avatar_url": "url"
    },
    "manager_contact": {
      "zalo_url": "https://zalo.me/0910345678",
      "qr_codes": {
        "zalo": "url_to_qr",
        "phone": "url_to_qr"
      }
    },
    "is_favorited": false,
    "favorite_count": 12,
    "view_count": 245,
    "rating": 4.5,
    "rating_count": 42,
    "related_rooms": [...]
  }
}
```

#### POST /api/rooms (Admin/Manager only)
**Mục đích**: Tạo phòng mới

#### PUT /api/rooms/:id (Admin/Manager only)
**Mục đích**: Cập nhật thông tin phòng

#### DELETE /api/rooms/:id (Admin only)
**Mục đích**: Xóa phòng

#### POST /api/rooms/:id/views
**Mục đích**: Ghi nhận lượt xem phòng
```json
RESPONSE (200):
{
  "success": true,
  "view_count": 246
}
```

---

### 2.3 Favorites APIs

#### GET /api/favorites
**Mục đích**: Danh sách phòng yêu thích của người dùng (Auth required)
```json
QUERY PARAMS:
- page: số trang
- limit: kết quả trên trang
- sortBy: newest, price_asc, price_desc

RESPONSE (200):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Phòng VIP 1 Người",
      "price_per_month": 1200000,
      "added_at": "2024-01-15T10:30:00Z",
      ...
    }
  ],
  "pagination": { ... },
  "count": 5
}
```

#### POST /api/favorites/:roomId
**Mục đích**: Thêm phòng vào danh sách yêu thích (Auth required)
```json
RESPONSE (201):
{
  "success": true,
  "message": "Đã thêm vào danh sách yêu thích",
  "is_favorited": true,
  "favorite_count": 13
}
```

#### DELETE /api/favorites/:roomId
**Mục đích**: Xóa phòng khỏi danh sách yêu thích (Auth required)
```json
RESPONSE (200):
{
  "success": true,
  "message": "Đã xóa khỏi danh sách yêu thích",
  "is_favorited": false,
  "favorite_count": 12
}
```

#### GET /api/favorites/count
**Mục đích**: Lấy số lượng phòng yêu thích (Auth required)
```json
RESPONSE (200):
{
  "success": true,
  "count": 5
}
```

---

### 2.4 Inquiry APIs

#### POST /api/inquiries
**Mục đích**: Gửi yêu cầu thuê phòng
```json
REQUEST:
{
  "room_id": "uuid",
  "full_name": "Nguyễn Văn B",
  "phone": "0909999999",
  "email": "nguyenvanb@example.com",
  "message": "Tôi muốn thuê phòng này"
}

RESPONSE (201):
{
  "success": true,
  "inquiry": {
    "id": "uuid",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Yêu cầu của bạn đã được gửi. Quản lý sẽ liên hệ sớm nhất!"
}
```

#### GET /api/inquiries (Auth required)
**Mục đích**: Danh sách yêu cầu của người dùng

#### GET /api/inquiries/:id (Auth required)
**Mục đích**: Chi tiết yêu cầu

---

### 2.5 Manager APIs

#### GET /api/managers/:id
**Mục đích**: Lấy thông tin quản lý
```json
RESPONSE (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "full_name": "Lê Văn C",
    "phone": "0910345678",
    "email": "levanc@ktx.com",
    "avatar_url": "url",
    "rooms_count": 15,
    "contacts": {
      "zalo_url": "https://zalo.me/0910345678",
      "viber_url": "https://viber.click/0910345678",
      "qr_codes": {
        "zalo": "url_to_qr",
        "phone": "url_to_qr",
        "viber": "url_to_qr"
      }
    }
  }
}
```

#### PUT /api/managers/:id/contacts (Manager auth required)
**Mục đích**: Cập nhật thông tin liên hệ

---

### 2.6 Search APIs

#### GET /api/search
**Mục đích**: Tìm kiếm toàn cục
```json
QUERY PARAMS:
- q: từ khóa
- type: room,manager,amenity
- limit: số kết quả (default 10)

RESPONSE (200):
{
  "success": true,
  "results": {
    "rooms": [...],
    "managers": [...],
    "amenities": [...]
  }
}
```

---

## 3. Authentication & Security

### Token Structure
- **JWT Token** với thời hạn 24 giờ
- **Refresh Token** với thời hạn 30 ngày
- Lưu token trong **HTTP-only cookies** (không accessible từ JavaScript)

### Roles & Permissions
- **Student**: Xem phòng, yêu thích, gửi yêu cầu thuê
- **Manager**: Quản lý phòng của mình, xem yêu cầu thuê, cập nhật thông tin liên hệ
- **Admin**: Quản lý toàn bộ hệ thống

### Security Headers
```
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000
- Content-Security-Policy: strict
```

---

## 4. Caching Strategy

### Redis Keys
```
- rooms:list:{filter_hash} - Danh sách phòng (TTL: 1 hour)
- room:{id}:detail - Chi tiết phòng (TTL: 30 min)
- room:{id}:favorites_count - Số lượng yêu thích (TTL: 5 min)
- room:{id}:view_count - Số lượng xem (TTL: 5 min)
- user:{id}:favorites - Danh sách yêu thích người dùng (TTL: 1 hour)
- user:{id}:inquiries - Danh sách yêu cầu (TTL: 30 min)
- search:{query}:{timestamp} - Kết quả tìm kiếm (TTL: 1 hour)
```

---

## 5. Performance Optimization

### Database Optimization
- Sử dụng **pagination** cho tất cả danh sách
- **Composite indexes** cho query phổ biến
- **JSONB columns** cho flexible data (amenities, QR codes)
- **View materialization** cho thống kê

### API Optimization
- **Response compression** (gzip)
- **Rate limiting**: 100 requests/minute per IP
- **Batch operations** để giảm API calls
- **GraphQL optional** cho advanced queries

### Frontend Optimization
- **SWR/React Query** caching
- **Image optimization** với CDN
- **Lazy loading** cho images
- **Code splitting** theo route

---

## 6. Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "ROOM_NOT_FOUND",
    "message": "Phòng không tồn tại",
    "statusCode": 404,
    "details": {}
  }
}
```

### Common Error Codes
- `INVALID_INPUT` - Dữ liệu đầu vào không hợp lệ (400)
- `UNAUTHORIZED` - Cần xác thực (401)
- `FORBIDDEN` - Không có quyền truy cập (403)
- `NOT_FOUND` - Tài nguyên không tìm thấy (404)
- `CONFLICT` - Xung đột dữ liệu (409)
- `RATE_LIMITED` - Vượt quá giới hạn request (429)
- `INTERNAL_ERROR` - Lỗi server (500)

---

## 7. Data Validation

### Frontend Validation
- Email format
- Phone number format (Việt Nam)
- Price range (0 - 50,000,000 VNĐ)
- Capacity (1 - 20 người)
- Amenities list

### Backend Validation
- Duplicate email/phone
- Manager role for room creation
- Bed count constraints
- Price constraints
- SQL injection prevention
- XSS prevention

---

## 8. Monitoring & Analytics

### Metrics to Track
- **Room popularity**: view_count, favorite_count
- **User behavior**: search patterns, filter usage
- **Conversion**: inquiries per room view
- **Performance**: API response times, database query times
- **Errors**: API error rates, failed requests

### Logging
- All API requests (request/response)
- All database queries (slow queries > 1s)
- All authentication events
- All critical operations

---

## 9. Future Enhancements

### Phase 2
- Hệ thống booking/payment
- User reviews & ratings
- Room comparison tool
- Virtual tour (360°/video)
- Push notifications
- SMS notifications

### Phase 3
- AI-powered recommendations
- Advanced filtering (map-based)
- Video calling with managers
- Contract management
- Maintenance requests
- Utility payment tracking

---

## 10. Database Migration Strategy

### Initial Setup
```sql
-- Migration 001: Initial schema
-- Migration 002: Add indexes
-- Migration 003: Add constraints
-- Migration 004: Add manager_contacts table
-- Migration 005: Add room_views table
-- Migration 006: Add ratings table
```

### Backup Strategy
- Daily incremental backups
- Weekly full backups
- Point-in-time recovery (PITR) enabled
- Test restore monthly

---

## Implementation Priority

### MVP (Must-Have)
- Users + Auth
- Rooms (CRUD)
- Favorites (Add/Remove/List)
- Inquiries
- Manager Modal with Contact Info

### Phase 1 (Nice-to-Have)
- Search optimization
- Advanced filtering
- View tracking
- Manager contacts (QR codes, Zalo)
- Ratings

### Phase 2+ (Future)
- Payment integration
- Booking system
- Virtual tours
- Notifications
