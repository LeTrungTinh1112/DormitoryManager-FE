
export type RoomStatus = 'available' | 'soon' | 'full';

export interface Manager {
  name: string;
  phone: string;
}

export interface Room {
  id: string;
  name: string;
  slug: string; // Add slug for routing consistency
  type: 'Standard' | 'Premium' | 'VIP';
  capacity: number;
  price: number;
  status: RoomStatus;
  manager: Manager;
  description: string;
  amenities: string[];
  totalBeds: number;
  availableBeds: number;
  soonBeds: number;
  floor: number; // Add floor info since it was in names
  image?: string; // Optional image URL
}

export const rooms: Room[] = [
  {
    id: 'standard-1',
    slug: 'standard-1',
    name: 'Phòng Standard 4 Người - Tầng 1',
    type: 'Standard',
    capacity: 4,
    price: 500000,
    status: 'available',
    manager: { name: 'Nguyễn Văn A', phone: '0908 123 456' },
    description: 'Phòng Standard 4 người là lựa chọn kinh tế cho sinh viên. Phòng rộng rãi, thoáng mát, được trang bị giường tầng và các tiện nghi cơ bản đầy đủ. Nằm ở tầng 1 thuận tiện đi lại.',
    amenities: ['Máy lạnh', 'WC chung', 'Wifi', 'Bàn học', 'Tủ đồ', 'Giường tầng', 'Bàn ghế', 'Cửa sổ'],
    totalBeds: 4,
    availableBeds: 3,
    soonBeds: 1,
    floor: 1,
    image: '/placeholder.svg'
  },
  {
    id: 'standard-2',
    slug: 'standard-2',
    name: 'Phòng Standard 4 Người - Tầng 2',
    type: 'Standard',
    capacity: 4,
    price: 500000,
    status: 'available',
    manager: { name: 'Nguyễn Văn A', phone: '0908 123 456' },
    description: 'Phòng Standard 4 người với không gian thoáng đãng tại tầng 2. Tiện nghi đầy đủ, an ninh đảm bảo.',
    amenities: ['Máy lạnh', 'WC chung', 'Wifi', 'Bàn học', 'Tủ đồ', 'Giường tầng', 'Camera hành lang'],
    totalBeds: 4,
    availableBeds: 4,
    soonBeds: 0,
    floor: 2,
    image: '/placeholder.svg'
  },
  {
    id: 'standard-3',
    slug: 'standard-3',
    name: 'Phòng Standard 4 Người - Tầng 3',
    type: 'Standard',
    capacity: 4,
    price: 500000,
    status: 'soon',
    manager: { name: 'Nguyễn Văn A', phone: '0908 123 456' },
    description: 'Phòng Standard yên tĩnh tại tầng 3, sắp có giường trống. Phù hợp cho nhóm bạn.',
    amenities: ['Máy lạnh', 'WC chung', 'Wifi', 'Bàn học', 'Tủ đồ', 'Giường tầng'],
    totalBeds: 4,
    availableBeds: 0,
    soonBeds: 2,
    floor: 3,
    image: '/placeholder.svg'
  },
  {
    id: 'standard-4',
    slug: 'standard-4',
    name: 'Phòng Standard 4 Người - Tầng 4',
    type: 'Standard',
    capacity: 4,
    price: 520000,
    status: 'available',
    manager: { name: 'Phạm Thị D', phone: '0911 456 789' },
    description: 'Phòng Standard tầng 4 với view đẹp, không khí trong lành.',
    amenities: ['Máy lạnh', 'WC chung', 'Wifi', 'Bàn học', 'Tủ đồ', 'Giường tầng', 'Ban công chung'],
    totalBeds: 4,
    availableBeds: 2,
    soonBeds: 0,
    floor: 4,
    image: '/placeholder.svg'
  },
  {
    id: 'premium-1',
    slug: 'premium-1',
    name: 'Phòng Premium 2 Người - Tầng 1',
    type: 'Premium',
    capacity: 2,
    price: 800000,
    status: 'available',
    manager: { name: 'Trần Thị B', phone: '0909 234 567' },
    description: 'Phòng Premium 2 người kết hợp tiện ích và thoải mái. Phòng có WC riêng, máy lạnh, không gian yên tĩnh để học tập và nghỉ ngơi.',
    amenities: ['Máy lạnh', 'WC riêng', 'Wifi 100Mbps', 'Bàn học rộng', 'Tủ đồ riêng', 'Giường đơn', 'Gương soi'],
    totalBeds: 2,
    availableBeds: 1,
    soonBeds: 0,
    floor: 1,
    image: '/placeholder.svg'
  },
  {
    id: 'premium-2',
    slug: 'premium-2',
    name: 'Phòng Premium 2 Người - Tầng 2',
    type: 'Premium',
    capacity: 2,
    price: 800000,
    status: 'available',
    manager: { name: 'Trần Thị B', phone: '0909 234 567' },
    description: 'Phòng Premium cao cấp tại tầng 2, không gian riêng tư tối ưu.',
    amenities: ['Máy lạnh', 'WC riêng', 'Wifi 100Mbps', 'Bàn học', 'Tủ đồ', 'Giường đơn'],
    totalBeds: 2,
    availableBeds: 2,
    soonBeds: 0,
    floor: 2,
    image: '/placeholder.svg'
  },
  {
    id: 'premium-3',
    slug: 'premium-3',
    name: 'Phòng Premium 2 Người - Tầng 3',
    type: 'Premium',
    capacity: 2,
    price: 850000,
    status: 'soon',
    manager: { name: 'Trần Thị B', phone: '0909 234 567' },
    description: 'Phòng Premium tầng 3, yên tĩnh tuyệt đối, sắp có chỗ.',
    amenities: ['Máy lạnh', 'WC riêng', 'Wifi 100Mbps', 'Bàn học', 'Tủ đồ', 'Giường đơn', 'Cửa sổ lớn'],
    totalBeds: 2,
    availableBeds: 0,
    soonBeds: 1,
    floor: 3,
    image: '/placeholder.svg'
  },
  {
    id: 'vip-1',
    slug: 'vip-1',
    name: 'Phòng VIP 1 Người - Tầng 4',
    type: 'VIP',
    capacity: 1,
    price: 1200000,
    status: 'available',
    manager: { name: 'Lê Văn C', phone: '0910 345 678' },
    description: 'Phòng VIP 1 người phù hợp sinh viên hoặc người đi làm, có WC riêng, máy lạnh, không gian yên tĩnh, đảm bảo riêng tư. Phòng được trang bị đầy đủ tiện nghi hiện đại.',
    amenities: ['Máy lạnh', 'WC riêng', 'Wifi 100Mbps', 'Bàn học', 'Tủ đồ', 'Đèn LED', 'Cửa sổ rộng', 'Khóa an toàn', 'Tủ lạnh mini'],
    totalBeds: 1,
    availableBeds: 1,
    soonBeds: 0,
    floor: 4,
    image: '/placeholder.svg'
  },
  {
    id: 'vip-2',
    slug: 'vip-2',
    name: 'Phòng VIP 1 Người - Tầng 5',
    type: 'VIP',
    capacity: 1,
    price: 1200000,
    status: 'full',
    manager: { name: 'Lê Văn C', phone: '0910 345 678' },
    description: 'Phòng VIP tầng thượng, view toàn cảnh thành phố.',
    amenities: ['Máy lạnh', 'WC riêng', 'Wifi 100Mbps', 'Bàn học', 'Tủ đồ', 'Đèn LED', 'Ban công riêng'],
    totalBeds: 1,
    availableBeds: 0,
    soonBeds: 0,
    floor: 5,
    image: '/placeholder.svg'
  },
];
