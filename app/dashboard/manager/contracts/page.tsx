'use client'

import { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Eye,
    PenSquare,
    Trash2,
    Search,
    Filter,
    Download,
    Plus
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Contract } from '@/lib/mock-db'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ManagerContractsPage() {
    const [contracts, setContracts] = useState<Contract[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create')
    const [currentContract, setCurrentContract] = useState<Partial<Contract>>({})
    const [contractToDelete, setContractToDelete] = useState<string | null>(null)

    useEffect(() => {
        fetchContracts()
    }, [])

    const fetchContracts = async () => {
        try {
            const res = await fetch('/api/manager/contracts')
            const data = await res.json()
            if (data.data) {
                setContracts(data.data)
            }
        } catch (error) {
            console.error('Failed to fetch contracts:', error)
            toast.error('Không thể tải danh sách hợp đồng')
        } finally {
            setLoading(false)
        }
    }

    const executeDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/manager/contracts?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setContracts(prev => prev.filter(c => c.id !== id))
                toast.success('Đã xóa hợp đồng thành công')
            } else {
                toast.error('Xóa thất bại')
            }
        } catch (error) {
            toast.error('Lỗi hệ thống')
        }
    }

    const handleDelete = (id: string) => {
        setContractToDelete(id);
    }

    const handleOpenCreate = () => {
        setDialogMode('create');
        setCurrentContract({
            status: 'active',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            value: 0
        });
        setIsDialogOpen(true);
    }

    const handleOpenEdit = (contract: Contract) => {
        setDialogMode('edit');
        setCurrentContract({ ...contract });
        setIsDialogOpen(true);
    }

    const handleOpenView = (contract: Contract) => {
        setDialogMode('view');
        setCurrentContract({ ...contract });
        setIsDialogOpen(true);
    }

    const handleSave = async () => {
        try {
            if (!currentContract.studentName || !currentContract.roomName) {
                toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
                return;
            }

            const method = dialogMode === 'create' ? 'POST' : 'PUT';

            const res = await fetch('/api/manager/contracts', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentContract),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(dialogMode === 'create' ? 'Tạo hợp đồng thành công' : 'Cập nhật hợp đồng thành công');
                setIsDialogOpen(false);
                fetchContracts();
            } else {
                toast.error(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi hệ thống');
        }
    }

    const getStatusBadge = (status: Contract['status'] | undefined) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Hoạt động</Badge>
            case 'expired':
                return <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">Kết thúc</Badge>
            case 'terminated':
                return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Đã hủy</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const filteredContracts = contracts.filter(contract =>
        contract.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.roomName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const isViewMode = dialogMode === 'view';

    return (
        <div className="p-4 md:p-6 space-y-6">
            <AlertDialog open={!!contractToDelete} onOpenChange={(open) => !open && setContractToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa hợp đồng này? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (contractToDelete) {
                                    executeDelete(contractToDelete);
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý Hợp đồng</h1>
                    <p className="text-muted-foreground">Danh sách tất cả hợp đồng thuê phòng của cư dân</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download size={16} />
                        Xuất Excel
                    </Button>
                    <Button className="bg-primary hover:bg-[#922d28] text-white gap-2" onClick={handleOpenCreate}>
                        <Plus size={16} />
                        Tạo hợp đồng mới
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tên, mã HĐ, phòng..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            {/* Contracts Table */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[100px]">Mã HĐ</TableHead>
                            <TableHead>Khách hàng</TableHead>
                            <TableHead>Liên hệ</TableHead>
                            <TableHead>Phòng</TableHead>
                            <TableHead>Thời hạn</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">Đang tải...</TableCell>
                            </TableRow>
                        ) : filteredContracts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Không tìm thấy hợp đồng nào</TableCell>
                            </TableRow>
                        ) : (
                            filteredContracts.map((contract) => (
                                <TableRow key={contract.id}>
                                    <TableCell className="font-medium">{contract.id}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{contract.studentName}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-xs">
                                            <span>{contract.studentPhone}</span>
                                            <span className="text-muted-foreground">{contract.studentEmail}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal">
                                            {contract.roomName}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-xs">
                                            <span className="text-green-600">BĐ: {new Date(contract.startDate).toLocaleDateString('vi-VN')}</span>
                                            <span className="text-red-600">KT: {new Date(contract.endDate).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(contract.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                title="Xem chi tiết"
                                                onClick={() => handleOpenView(contract)}
                                            >
                                                <Eye size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                                title="Chỉnh sửa"
                                                onClick={() => handleOpenEdit(contract)}
                                            >
                                                <PenSquare size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                title="Xóa"
                                                onClick={() => handleDelete(contract.id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-[700px] overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>
                            {dialogMode === 'create' ? 'Tạo hợp đồng mới' : dialogMode === 'edit' ? 'Chỉnh sửa hợp đồng' : 'Chi tiết hợp đồng'}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogMode === 'create' ? 'Nhập thông tin hợp đồng mới' : dialogMode === 'edit' ? 'Cập nhật thông tin hợp đồng' : 'Xem thông tin chi tiết hợp đồng'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Họ tên sinh viên</Label>
                                <Input
                                    value={currentContract.studentName || ''}
                                    onChange={(e) => setCurrentContract({ ...currentContract, studentName: e.target.value })}
                                    disabled={isViewMode}
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Số điện thoại</Label>
                                <Input
                                    value={currentContract.studentPhone || ''}
                                    onChange={(e) => setCurrentContract({ ...currentContract, studentPhone: e.target.value })}
                                    disabled={isViewMode}
                                    placeholder="0912345678"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    value={currentContract.studentEmail || ''}
                                    onChange={(e) => setCurrentContract({ ...currentContract, studentEmail: e.target.value })}
                                    disabled={isViewMode}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phòng</Label>
                                <Input
                                    value={currentContract.roomName || ''}
                                    onChange={(e) => setCurrentContract({ ...currentContract, roomName: e.target.value })}
                                    disabled={isViewMode}
                                    placeholder="P.101"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ngày bắt đầu</Label>
                                <Input
                                    type="date"
                                    value={currentContract.startDate || ''}
                                    onChange={(e) => setCurrentContract({ ...currentContract, startDate: e.target.value })}
                                    disabled={isViewMode}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Ngày kết thúc</Label>
                                <Input
                                    type="date"
                                    value={currentContract.endDate || ''}
                                    onChange={(e) => setCurrentContract({ ...currentContract, endDate: e.target.value })}
                                    disabled={isViewMode}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Giá trị hợp đồng (VND)</Label>
                                <Input
                                    type="number"
                                    value={currentContract.value || ''}
                                    onChange={(e) => setCurrentContract({ ...currentContract, value: Number(e.target.value) })}
                                    disabled={isViewMode}
                                    placeholder="3000000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Trạng thái</Label>
                                <Select
                                    value={currentContract.status || 'active'}
                                    onValueChange={(val: any) => setCurrentContract({ ...currentContract, status: val })}
                                    disabled={isViewMode}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Hoạt động</SelectItem>
                                        <SelectItem value="expired">Kết thúc</SelectItem>
                                        <SelectItem value="terminated">Đã hủy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            {isViewMode ? 'Đóng' : 'Hủy bỏ'}
                        </Button>
                        {!isViewMode && (
                            <Button onClick={handleSave} className="bg-primary hover:bg-[#922d28] text-white">
                                {dialogMode === 'create' ? 'Tạo mới' : 'Lưu thay đổi'}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
