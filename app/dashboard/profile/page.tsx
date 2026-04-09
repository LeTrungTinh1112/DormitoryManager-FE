'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Heart, Calendar, FileText, CreditCard, LogOut, Edit2, Lock } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from 'next/image'

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [userData, setUserData] = useState<any>({
    id: '',
    name: 'Đang tải...',
    email: 'loading...',
    phone: '',
    birthDate: '',
    gender: '',
    school: '',
    major: '',
    studentId: '',
    address: '',
    avatar: '/placeholder-user.jpg',
    accountStatus: 'active',
    joinDate: '',
  })

  const [editData, setEditData] = useState(userData)
  const [stats] = useState({
    favorites: 3,
    bookings: 2,
    inquiries: 1,
    lastPayment: '500,000 VND',
  })

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setUserData(data.data);
            setEditData({
              ...data.data,
              // Ensure fields have defaults if missing to avoid uncontrolled inputs warning
              phone: data.data.phone || '',
              birthDate: data.data.birthDate || '',
              studentId: data.data.studentId || '',
              address: data.data.address || '',
              school: data.data.school || '',
              major: data.data.major || ''
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUserData();
  }, [])

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        setUserData(editData);
        setIsEditing(false);
        toast({
          title: 'Thành công',
          description: 'Cập nhật thông tin thành công!',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Thất bại',
          description: 'Cập nhật thất bại. Vui lòng thử lại.',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi khi cập nhật.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e)
    }
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    document.cookie = 'auth_token=; path=/; max-age=0' // Xóa cookie ở phía client
    router.push('/')
    // Reload to refresh auth state
    window.location.href = '/'
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">Đăng xuất</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content */}
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 space-y-6 sticky top-24">
                {/* Avatar & Name */}
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full border-2 border-primary/10">
                    <Image
                      src={userData.avatar || '/placeholder-user.jpg'} // Fallback if API returns empty/null
                      alt={userData.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{userData.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{userData.email}</p>
                  <div className="mt-3 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {userData.accountStatus === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Phòng yêu thích</span>
                    <span className="font-bold text-foreground">{stats.favorites}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lịch hẹn</span>
                    <span className="font-bold text-foreground">{stats.bookings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Yêu cầu gửi</span>
                    <span className="font-bold text-foreground">{stats.inquiries}</span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="space-y-2 border-t border-border pt-6">
                  <Link
                    href="/payments"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 text-foreground hover:text-primary transition-colors"
                  >
                    <CreditCard size={20} />
                    <span className="text-sm font-medium">Thanh toán</span>
                  </Link>
                  <Link
                    href="/payments/history"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 text-foreground hover:text-primary transition-colors"
                  >
                    <FileText size={20} />
                    <span className="text-sm font-medium">Lịch sử thanh toán</span>
                  </Link>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border-t border-border pt-6"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </div>
            </div>

            {/* Right Content - Profile Info */}
            <div className="lg:col-span-3 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Thông tin cá nhân</h1>
                {!isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setEditData(userData)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#922d28] transition-colors font-medium"
                  >
                    <Edit2 size={18} />
                    Chỉnh sửa
                  </button>
                )}
              </div>

              {/* Profile Form */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                {isEditing ? (
                  <>
                    {/* Edit Mode */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground font-medium">
                          Họ và tên
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={editData.name}
                          onChange={handleEditChange}
                          className="bg-white border-border focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={editData.email}
                          onChange={handleEditChange}
                          className="bg-white border-border focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground font-medium">
                          Số điện thoại
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={editData.phone}
                          onChange={handleEditChange}
                          className="bg-white border-border focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthDate" className="text-foreground font-medium">
                          Ngày sinh
                        </Label>
                        <Input
                          id="birthDate"
                          name="birthDate"
                          type="date"
                          value={editData.birthDate}
                          onChange={handleEditChange}
                          className="bg-white border-border focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-foreground font-medium">
                          Giới tính
                        </Label>
                        <Select value={editData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                          <SelectTrigger className="bg-white border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Nam</SelectItem>
                            <SelectItem value="female">Nữ</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="school" className="text-foreground font-medium">
                          Trường / Khoa
                        </Label>
                        <Input
                          id="school"
                          name="school"
                          value={editData.school}
                          onChange={handleEditChange}
                          className="bg-white border-border focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentId" className="text-foreground font-medium">
                          MSSV
                        </Label>
                        <Input
                          id="studentId"
                          name="studentId"
                          value={editData.studentId}
                          onChange={handleEditChange}
                          className="bg-white border-border focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="address" className="text-foreground font-medium">
                          Địa chỉ thường trú
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={editData.address}
                          onChange={handleEditChange}
                          className="bg-white border-border focus:ring-primary"
                        />
                      </div>
                    </div>

                    {/* Edit Buttons */}
                    <div className="flex gap-3 justify-end pt-6 border-t border-border">
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="border-border bg-white hover:bg-primary/5"
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="bg-primary hover:bg-[#922d28] text-white"
                      >
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* View Mode */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Họ và tên</p>
                        <p className="font-semibold text-foreground">{userData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <p className="font-semibold text-foreground">{userData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Số điện thoại</p>
                        <p className="font-semibold text-foreground">{userData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Ngày sinh</p>
                        <p className="font-semibold text-foreground">
                          {userData.birthDate ? new Date(userData.birthDate).toLocaleDateString('vi-VN') : '---'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Giới tính</p>
                        <p className="font-semibold text-foreground">
                          {userData.gender === 'male' ? 'Nam' : userData.gender === 'female' ? 'Nữ' : 'Khác'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Trường / Khoa</p>
                        <p className="font-semibold text-foreground">{userData.school}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">MSSV</p>
                        <p className="font-semibold text-foreground">{userData.studentId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tham gia từ</p>
                        <p className="font-semibold text-foreground">
                          {userData.joinDate ? new Date(userData.joinDate).toLocaleDateString('vi-VN') : '---'}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">Địa chỉ thường trú</p>
                        <p className="font-semibold text-foreground">{userData.address}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Change Password Card */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Lock size={24} className="text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Đổi mật khẩu</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Để bảo vệ tài khoản của bạn, vui lòng sử dụng mật khẩu mạnh và duy nhất.
                </p>
                <Button className="bg-primary hover:bg-[#922d28] text-white w-full sm:w-auto">
                  Đổi mật khẩu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  )
}
