// This is a simple in-memory store for development purposes
// In a real application, this would be a database

export type Role = 'student' | 'resident' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for demo authentication
  roles: Role[];
  avatar?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  school?: string;
  major?: string;
  studentId?: string;
  address?: string;
  accountStatus?: string;
  joinDate?: string;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  title: string;
  amount: number; // Final amount after discount
  originalAmount: number; // Amount before discount
  discountAmount?: number;
  discountCode?: string;
  status: 'pending' | 'submitted' | 'paid' | 'rejected';
  dueDate: string;
  createdAt: string;
  submittedAt?: string;
  method?: 'transfer' | 'cash' | 'wallet';
  proofImage?: string;
  note?: string;
}

export interface Booking {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  school: string;
  roomType: string;
  checkInDate: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  
  // Fields for dashboard display compatibility
  roomName?: string;
  roomImage?: string;
  manager?: string;
  managerPhone?: string;
  appointmentTime?: string;
}

export interface Notification {
  id: string;
  userId: string; // 'all' or specific user ID
  title: string;
  description: string;
  type: 'booking' | 'payment' | 'contract' | 'system' | 'promo';
  read: boolean;
  createdAt: string;
}

export interface Contract {
  id: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  roomName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'terminated';
  value: number; // This is the monthly rent price
}

export interface Discount {
  code: string;
  description: string;
  value: number; // This is the monthly rent price
  type: 'fixed' | 'percentage';
  expirationDate: string;
  isSingleUse: boolean;
  usedBy: string[]; // Array of user IDs who have used it
}

const initialDiscounts: Discount[] = [
  {
    code: 'WELCOME2026',
    description: 'Giảm 10% cho sinh viên mới',
    value: 10,
    type: 'percentage',
    expirationDate: '2026-12-31',
    isSingleUse: true,
    usedBy: [],
  },
  {
    code: 'SUMMER50K',
    description: 'Giảm 50,000đ cho hóa đơn tháng hè',
    value: 50000,
    type: 'fixed',
    expirationDate: '2026-08-31',
    isSingleUse: false,
    usedBy: [],
  }
];

// Initial mock data
const initialContracts: Contract[] = [
  {
      id: 'HD001',
      studentName: 'Trần Thị Sinh Viên',
      studentPhone: '0901234567',
      studentEmail: 'sinhvien@ktx.edu.vn',
      roomName: 'P.101 - Standard',
      startDate: '2025-09-01',
      endDate: '2026-06-30',
      status: 'active',
      value: 1500000
  },
  {
      id: 'HD002',
      studentName: 'Lê Văn B',
      studentPhone: '0912345678',
      studentEmail: 'b.le@ktx.edu.vn',
      roomName: 'P.205 - VIP',
      startDate: '2025-08-15',
      endDate: '2026-08-15',
      status: 'active',
      value: 3000000
  },
   {
      id: 'HD003',
      studentName: 'Phạm Thị C',
      studentPhone: '0987654321',
      studentEmail: 'c.pham@ktx.edu.vn',
      roomName: 'P.102 - Standard',
      startDate: '2024-09-01',
      endDate: '2025-06-30',
      status: 'expired',
      value: 1500000
  },
  {
      id: 'HD004',
      studentName: 'Nguyễn Văn Quản Lý',
      studentPhone: '0909090909',
      studentEmail: 'admin@ktx.edu.vn', 
      roomName: 'P.501 - Penhouse (Manager)',
      startDate: '2020-01-01',
      endDate: '2030-12-31',
      status: 'active',
      value: 0
  },
  {
      id: 'HD005',
      studentName: 'Nguyễn Văn Demo',
      studentPhone: '0901 234 567',
      studentEmail: 'demo@example.com',
      roomName: 'P.105 - Standard',
      startDate: '2025-09-01',
      endDate: '2026-06-30',
      status: 'active',
      value: 1500000
  }
];

const initialBookings: Booking[] = [
  {
    id: 'BOOK001',
    fullName: 'Nguyễn Văn Test',
    phone: '0908123456',
    email: 'test@example.com',
    school: 'Đại học BK',
    roomType: 'Standard',
    checkInDate: '2025-12-10',
    notes: 'Hẹn xem phòng lần 2',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    roomName: 'Phòng Standard 4 Người - Tầng 1',
    roomImage: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500&h=300&fit=crop',
    manager: 'Nguyễn Văn A',
    managerPhone: '0908123456',
  }
];

const initialPayments: Payment[] = [
  {
    id: 'PAY001',
    userId: 'USER_RESIDENT',
    userName: 'Trần Thị Sinh Viên',
    title: 'Tiền phòng Tháng 4/2026',
    originalAmount: 1500000,
    amount: 1500000,
    status: 'pending',
    dueDate: '2026-04-05',
    createdAt: '2026-03-20',
  },
  {
    id: 'PAY002',
    userId: 'USER_RESIDENT',
    userName: 'Trần Thị Sinh Viên',
    title: 'Tiền điện Tháng 3/2026',
    originalAmount: 250000,
    amount: 250000,
    status: 'submitted',
    dueDate: '2026-04-05',
    createdAt: '2026-03-20',
    submittedAt: '2026-03-24',
    method: 'transfer',
    proofImage: 'https://placehold.co/300x500?text=Banking+Receipt',
    note: 'Đã chuyển khoản qua VCB',
  },
  {
    id: 'PAY003',
    userId: 'user_demo_001',
    userName: 'Nguyễn Văn Demo',
    title: 'Tiền phòng Tháng 4/2026',
    originalAmount: 1500000,
    amount: 1500000,
    status: 'pending',
    dueDate: '2026-04-05',
    createdAt: '2026-03-20',
  },
  {
    id: 'PAY004',
    userId: 'user_guest_001',
    userName: 'Trần Văn Khách',
    title: 'Tiền phòng Tháng 4/2026 - Đơn yêu cầu thanh toán',
    originalAmount: 1500000,
    amount: 1500000,
    status: 'pending',
    dueDate: '2026-04-05',
    createdAt: new Date().toISOString(),
  }
];

// Mock Users (For easy switching)
export const users: Record<string, User> = {
  manager: {
    id: 'USER_ADMIN',
    name: 'Nguyễn Văn Quản Lý',
    email: 'admin@ktx.edu.vn',
    roles: ['manager', 'resident'], // Has both roles for testing
    avatar: 'https://github.com/shadcn.png',
    phone: '0909090909',
    birthDate: '1995-01-01',
    gender: 'male',
    school: 'ĐH Bách Khoa',
    major: 'Quản lý Hệ thống',
    studentId: 'ADMIN_001',
    address: 'P.501 - Penhouse (Manager)',
    accountStatus: 'active',
    joinDate: '2020-01-01'
  },
  resident: {
    id: 'USER_RESIDENT',
    name: 'Trần Thị Sinh Viên',
    email: 'sinhvien@ktx.edu.vn',
    roles: ['resident'], // Only resident role
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    phone: '0901234567',
    birthDate: '2004-05-10',
    gender: 'female',
    school: 'ĐH Công Nghệ Thông Tin',
    major: 'Hệ thống Thông tin',
    studentId: '21520000',
    address: 'P.101 - Khu A',
    accountStatus: 'active',
    joinDate: '2025-09-01'
  }
};

// Use global to persist data across hot reloads in development
declare global {
  var mockBookingsStore: Booking[] | undefined;
  var mockPaymentsStore: Payment[] | undefined;
  var mockContractsStore: Contract[] | undefined;
  var mockNotificationsStore: Notification[] | undefined;
  var mockCurrentUser: User | undefined;
  var mockUsersStore: User[] | undefined;
  var mockDiscountsStore: Discount[] | undefined;
}


// Initialize mock users store if not exists
// Moved initialization logic inside getUsers() to ensure consistency

if (!global.mockBookingsStore) {
  global.mockBookingsStore = [...initialBookings];
}

if (!global.mockNotificationsStore) {
    global.mockNotificationsStore = [
        {
            id: 'NOTI001',
            userId: 'resident',
            title: 'Hệ thống đã sẵn sàng',
            description: 'Chào mừng bạn đến với hệ thống quản lý KTX',
            type: 'system',
            read: false,
            createdAt: new Date().toISOString()
        }
    ];
}

if (!global.mockPaymentsStore) {
  global.mockPaymentsStore = [...initialPayments];
}

if (!global.mockContractsStore) {
  global.mockContractsStore = [...initialContracts];
}

if (!global.mockDiscountsStore) {
  global.mockDiscountsStore = [...initialDiscounts];
}

// Initialize current user if not set
if (!global.mockCurrentUser) {
//   global.mockCurrentUser = users.manager;
}


export const getUsers = () => {
    if (!global.mockUsersStore || global.mockUsersStore.length === 0) {
        global.mockUsersStore = [
            { ...users.manager, password: 'admin123' },
            { ...users.resident, password: 'resident123' },
            {
                id: 'user_demo_001',
                email: 'demo@example.com',
                name: 'Nguyễn Văn Demo',
                phone: '0901 234 567',
                roles: ['resident'],
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                birthDate: '2004-01-01',
                gender: 'male',
                school: 'Đại học Sư phạm Kỹ thuật',
                major: 'Công nghệ thông tin',
                studentId: '22110123',
                address: 'Ký túc xá Khu A - ĐHQG', 
                accountStatus: 'active',
                joinDate: '2022-09-01',
                password: 'password123'
           },
           {
                id: 'user_guest_001',
                email: 'guest@example.com',
                name: 'Trần Văn Khách',
                phone: '0909876543',
                roles: ['student'], // Guest has only student role, no resident
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                birthDate: '2005-06-15',
                gender: 'male',
                school: 'Đại học Kinh tế Quốc dân',
                major: 'Quản lý Kinh tế',
                studentId: '23210456',
                address: 'Chưa có địa chỉ', 
                accountStatus: 'active',
                joinDate: new Date().toISOString(),
                password: 'guest123'
           }
        ];
    }
    return global.mockUsersStore;
};

export const addUser = (user: User) => {
    if (!global.mockUsersStore) {
        global.mockUsersStore = [];
    }
    global.mockUsersStore.push(user);
    return user;
};

// Start: Add missing findUser function
export const findUserByEmail = (email: string): User | undefined => {
    return (global.mockUsersStore || []).find(u => u.email === email);
}
// End: Add missing findUser function

// Export a getter to ensure we always get the latest value from global store
export const getCurrentUser = () => {
  return global.mockCurrentUser;
};

// Deprecated: prefer getCurrentUser()
// Keeping for backward compatibility but it might be stale in some contexts
export let currentUser = global.mockCurrentUser;

export const switchUser = (role: 'manager' | 'resident') => {
  if (users[role]) {
    global.mockCurrentUser = users[role];
    currentUser = users[role]; // Update local export too just in case
    return global.mockCurrentUser;
  }
  return getCurrentUser();
};

export const loginUser = (user: User) => {
    global.mockCurrentUser = user;
    currentUser = user;
    return user;
}

export const logoutUser = () => {
    global.mockCurrentUser = undefined;
    // @ts-ignore
    currentUser = undefined;
    return true;
}

export const updateUser = (updates: Partial<User>) => {
  if (global.mockCurrentUser) {
      global.mockCurrentUser = { ...global.mockCurrentUser, ...updates };
      // Also update the static users record so switching back and forth preserves edits (optional, but good for testing)
      // Find which user role this id belongs to
      const role = Object.keys(users).find(key => users[key].id === global.mockCurrentUser!.id);
      if (role) {
          users[role] = global.mockCurrentUser;
      }
      return global.mockCurrentUser;
  }
  return null;
};


export const getBookings = async () => {
  return global.mockBookingsStore || [];
};

export const getPayments = async () => {
  // Sync pending payments with active contracts
  syncPaymentsWithContracts();
  return global.mockPaymentsStore || [];
};

export const syncPaymentsWithContracts = () => {
    const contracts = global.mockContractsStore || [];
    let payments = global.mockPaymentsStore || [];
    const users = getUsers();

    // 1. Update existing pending payments
    payments.forEach(payment => {
        if (payment.status === 'pending') {
            const user = users.find(u => u.id === payment.userId);
            if (user) {
                // Find contract matching user's email
                const activeContract = contracts.find(c => c.studentEmail === user.email && c.status === 'active');
                if (activeContract && payment.originalAmount !== activeContract.value) {
                    // Update payment corresponding to contract value
                    payment.originalAmount = activeContract.value;
                    // If no discount is applied yet, also update amount
                    if (!payment.discountCode) {
                        payment.amount = activeContract.value;
                    }
                }
            }
        }
    });

    // 2. Ensure every active contract has a payment for the current month
    const currentDate = new Date();
    const currentMonthTitle = `Hóa đơn tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 5).toISOString();

    contracts.forEach(contract => {
        if (contract.status === 'active') {
            const user = users.find(u => u.email.toLowerCase() === contract.studentEmail.toLowerCase());
            if (user) {
                 // Check if there's already a payment for this month title
                 const hasCurrentMonthPayment = payments.some(p => p.userId === user.id && p.title.includes(currentMonthTitle));
                 
                 // Check if there are ANY pending/submitted payments at all (to avoid spamming)
                 const hasUnresolvedPayment = payments.some(p => p.userId === user.id && (p.status === 'pending' || p.status === 'submitted'));

                 if (!hasCurrentMonthPayment && !hasUnresolvedPayment) {
                      const newPayment: Payment = {
                          id: `INV${Math.floor(Math.random() * 100000).toString()}`,
                          userId: user.id,
                          userName: user.name,
                          title: currentMonthTitle,
                          amount: contract.value,
                          originalAmount: contract.value,
                          status: 'pending',
                          dueDate: nextMonth,
                          createdAt: new Date().toISOString()
                      };
                      payments.push(newPayment);
                 }
            }
        }
    });

    global.mockPaymentsStore = payments;
};
export const getDiscounts = async () => {
  return global.mockDiscountsStore || [];
};

export const applyDiscountToPayment = async (paymentId: string, discountCode: string, userId: string) => {
  const payments = global.mockPaymentsStore || [];
  const discounts = global.mockDiscountsStore || [];
  const paymentIndex = payments.findIndex(p => p.id === paymentId);

  if (paymentIndex === -1) {
    return { success: false, message: 'Payment not found' };
  }

  const discount = discounts.find(d => d.code === discountCode);
  if (!discount) {
    return { success: false, message: 'Invalid discount code' };
  }

  if (new Date(discount.expirationDate) < new Date()) {
    return { success: false, message: 'Discount code has expired' };
  }

  if (discount.isSingleUse && discount.usedBy.includes(userId)) {
    return { success: false, message: 'Discount code has already been used' };
  }

  const payment = payments[paymentIndex];
  let discountAmount = 0;
  if (discount.type === 'percentage') {
    discountAmount = (payment.originalAmount * discount.value) / 100;
  } else {
    discountAmount = discount.value;
  }

  payment.amount = Math.max(0, payment.originalAmount - discountAmount);
  payment.discountAmount = discountAmount;
  payment.discountCode = discountCode;

  if (discount.isSingleUse) {
    discount.usedBy.push(userId);
  }

  return { success: true, message: 'Discount applied successfully', payment };
};

export const getContracts = async () => {
    return global.mockContractsStore || [];
};


export const updatePaymentStatus = async (id: string, status: Payment['status'], role: Role, userId?: string) => {
   // Simple fake authorization
   if (role !== 'manager') throw new Error("Unauthorized");

   const payments = global.mockPaymentsStore || [];
   const index = payments.findIndex(p => p.id === id);
   if (index !== -1) {
     if (status === 'rejected') {
         // Reset payment for resident to pay again
         payments[index] = { 
            ...payments[index], 
            status: 'pending', // Revert to pending
            amount: payments[index].originalAmount, // Reset amount in case discount was applied
            discountAmount: undefined,
            discountCode: undefined,
            proofImage: undefined, 
            submittedAt: undefined,
            note: payments[index].note ? payments[index].note + " (Lý do từ chối: Vui lòng thanh toán lại)" : "Vui lòng thanh toán lại"
         };
     } else {
         payments[index] = { ...payments[index], status };
         
         // When payment is approved, transition user from 'student' to 'resident'
         if (status === 'paid' && userId) {
           transitionUserToResident(userId);
         }
     }
     
     return payments[index];
   }
   return null;
}

export const transitionUserToResidentByEmail = (email: string) => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex !== -1 && !users[userIndex].roles.includes('resident')) {
        // Add resident role if not already present, remove student role
        users[userIndex].roles = users[userIndex].roles.map(r => r === 'student' ? 'resident' : r);

        // If this is the current user, update global state
        if (global.mockCurrentUser && global.mockCurrentUser.email.toLowerCase() === email.toLowerCase()) {
            global.mockCurrentUser = { ...global.mockCurrentUser, roles: users[userIndex].roles };
            currentUser = global.mockCurrentUser;
        }

        return users[userIndex];
    }
    return null;
}

export const transitionUserToResident = (userId: string) => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1 && !users[userIndex].roles.includes('resident')) {
        // Add resident role if not already present, remove student role
        users[userIndex].roles = users[userIndex].roles.map(r => r === 'student' ? 'resident' : r);
        
        // If this is the current user, update global state
        if (global.mockCurrentUser && global.mockCurrentUser.id === userId) {
            global.mockCurrentUser = { ...global.mockCurrentUser, roles: users[userIndex].roles };
            currentUser = global.mockCurrentUser;
        }
        
        return users[userIndex];
    }
    return null;
}

export const submitPaymentProof = async (id: string, proof: Partial<Payment>) => {
    const payments = global.mockPaymentsStore || [];
    const index = payments.findIndex(p => p.id === id);
    if (index !== -1) {
      payments[index] = { 
          ...payments[index], 
          status: 'submitted',
          submittedAt: new Date().toISOString(),
          ...proof 
      };
      return payments[index];
    }
    return null;
}

export const updateBookingStatus = async (id: string, status: Booking['status']) => {
  const bookings = global.mockBookingsStore || [];
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
      bookings[index] = { ...bookings[index], status };
        
        // Logical: Khi quản lý duyệt yêu cầu thuê phòng, tài khoản guest thành resident
        if (status === 'confirmed') {
             transitionUserToResidentByEmail(bookings[index].email);
        }
        
        return bookings[index];
    }
}


export const addContract = async (contract: Omit<Contract, 'id'>) => {
  const newContract: Contract = {
      ...contract,
      id: `HD${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
  };
  global.mockContractsStore?.push(newContract);
  return newContract;
}

export const deleteContract = async (id: string) => {
  const contracts = global.mockContractsStore || [];
  global.mockContractsStore = contracts.filter(c => c.id !== id);
  return true;
}

export const updateContract = async (id: string, updates: Partial<Contract>) => {
  const contracts = global.mockContractsStore || [];
  const index = contracts.findIndex(c => c.id === id);
  if (index !== -1) {
      contracts[index] = { ...contracts[index], ...updates };
      return contracts[index];
  }
  return null;
}

export const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
  const newBooking: Booking = {
    ...booking,
    id: `BOOK${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
    // Default mock data for UI display
    roomName: `Phòng ${booking.roomType} (Đăng ký nhanh)`,
    roomImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=500&h=300&fit=crop', // Generic image
    manager: 'Đang phân công',
    managerPhone: '---',
  };
  
  if (global.mockBookingsStore) {
    global.mockBookingsStore.unshift(newBooking);
  }
  
  return newBooking;
};

export const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
        ...notification,
        id: `NOTI${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        createdAt: new Date().toISOString(),
        read: false
    };
    if (global.mockNotificationsStore) {
        global.mockNotificationsStore.unshift(newNotification);
    }
    return newNotification;
};

export const getNotifications = async (userId: string) => {
    const all = global.mockNotificationsStore || [];
    return all.filter(n => n.userId === userId || n.userId === 'all');
};

export const markNotificationRead = async (id: string) => {
    const notifs = global.mockNotificationsStore || [];
    const index = notifs.findIndex(n => n.id === id);
    if (index !== -1) {
        notifs[index] = { ...notifs[index], read: true };
        return true;
    }
    return false;
};
