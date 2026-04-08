'use client'

import { useState, useEffect } from 'react'
import { Download, Eye, CheckCircle, XCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Contract {
  id: string
  roomName: string
  contractNo: string
  startDate: string
  endDate: string
  status: 'active' | 'ended'
  statusLabel: string
  statusColor: string
  studentName?: string
  studentEmail?: string
  studentPhone?: string
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      const res = await fetch('/api/contracts/mine')
      const data = await res.json()
      
      if (data.data) {
        const mappedContracts: Contract[] = data.data.map((c: any) => ({
          id: c.id,
          roomName: c.roomName,
          contractNo: c.id, // Use ID as Contract No for now
          startDate: c.startDate,
          endDate: c.endDate,
          status: c.status === 'active' ? 'active' : 'ended',
          statusLabel: c.status === 'active' ? 'Hoạt động' : 'Kết thúc',
          statusColor: c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
          studentName: c.studentName,
          studentEmail: c.studentEmail,
          studentPhone: c.studentPhone
        }))
        setContracts(mappedContracts)
      }
    } catch (error) {
      console.error('Failed to fetch contracts:', error)
      toast.error('Không thể tải hợp đồng')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadContract = (contractNo: string, roomName: string) => {
    if (!selectedContract) return // Should not happen if button clicked from modal

    // Create a simple PDF-like content (in real scenario, this would be a proper PDF file)
    const contractContent = `
HỢP ĐỒNG THUÊ PHÒNG KÝ TÚC XÁ
================================

Mã hợp đồng: ${contractNo}
Ngày lập: ${new Date().toLocaleDateString('vi-VN')}

THÔNG TIN PHÒNG:
- Tên phòng: ${roomName}
- Ngày bắt đầu: ${new Date(selectedContract?.startDate || '').toLocaleDateString('vi-VN')}
- Ngày kết thúc: ${new Date(selectedContract?.endDate || '').toLocaleDateString('vi-VN')}

THÔNG TIN KHÁCH HÀNG:
- Họ tên: ${selectedContract?.studentName || '...'}
- Email: ${selectedContract?.studentEmail || '...'}
- Số điện thoại: ${selectedContract?.studentPhone || '...'}
- Trường: ĐH Công Nghệ Thông Tin (Mặc định)

ĐIỀU KHOẢN HỢP ĐỒNG:
1. Bên thuê cam kết tuân thủ nội quy ký túc xá
2. Thanh toán tiền thuê phòng đầy đủ và đúng hạn
3. Bảo quản tài sản phòng ở
4. Không được phép tự ý cải tạo hoặc sửa chữa phòng

Hợp đồng này được lập với 2 bản có giá trị pháp lý như nhau.

Ngày ký: ${new Date().toLocaleDateString('vi-VN')}
    `
    
    // Create a blob and trigger download
    const blob = new Blob([contractContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${contractNo}_Hop_Dong_Thue_Phong.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (loading) {
     return <div className="p-8 text-center">Đang tải hợp đồng...</div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Hợp đồng & Thủ tục</h1>
        <p className="text-muted-foreground">Quản lý hợp đồng thuê phòng của bạn</p>

      </div>

      <div className="space-y-4">
        {contracts.map((contract) => (
          <div key={contract.id} className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{contract.roomName}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${contract.statusColor}`}>
                    {contract.statusLabel}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Mã hợp đồng: {contract.contractNo}</p>
              </div>
              {contract.status === 'active' && <CheckCircle className="text-green-600" size={24} />}
              {contract.status === 'ended' && <XCircle className="text-gray-600" size={24} />}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Ngày bắt đầu</p>
                <p className="font-semibold text-foreground">{contract.startDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Ngày kết thúc</p>
                <p className="font-semibold text-foreground">{contract.endDate}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => setSelectedContract(contract)}
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/5 bg-transparent flex-1"
              >
                <Eye size={16} className="mr-2" />
                Xem chi tiết
              </Button>
              <Button 
                onClick={() => handleDownloadContract(contract.contractNo, contract.roomName)}
                className="bg-primary hover:bg-[#922d28] text-white flex-1"
              >
                <Download size={16} className="mr-2" />
                Tải về
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Chi tiết hợp đồng</h2>
              <button
                onClick={() => setSelectedContract(null)}
                className="p-1 hover:bg-card rounded transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Mã hợp đồng</p>
                <p className="text-lg font-semibold text-foreground">{selectedContract.contractNo}</p>
              </div>

              {/* Contract Table */}
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="bg-card p-3 font-medium text-foreground w-1/3">Phòng thuê</td>
                      <td className="p-3 text-foreground">{selectedContract.roomName}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="bg-card p-3 font-medium text-foreground">Ngày bắt đầu</td>
                      <td className="p-3 text-foreground">{selectedContract.startDate}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="bg-card p-3 font-medium text-foreground">Ngày kết thúc</td>
                      <td className="p-3 text-foreground">{selectedContract.endDate}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="bg-card p-3 font-medium text-foreground">Trạng thái</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded ${selectedContract.statusColor}`}>
                          {selectedContract.statusLabel}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="bg-card p-3 font-medium text-foreground">Họ tên khách hàng</td>
                      <td className="p-3 text-foreground">{selectedContract.studentName || '...'}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="bg-card p-3 font-medium text-foreground">Email</td>
                      <td className="p-3 text-foreground">{selectedContract.studentEmail || '...'}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="bg-card p-3 font-medium text-foreground">Số điện thoại</td>
                      <td className="p-3 text-foreground">{selectedContract.studentPhone || '...'}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="bg-card p-3 font-medium text-foreground">Trường / Khoa</td>
                      <td className="p-3 text-foreground">ĐH Công Nghệ Thông Tin</td>
                    </tr>
                    <tr>
                      <td className="bg-card p-3 font-medium text-foreground">Chuyên ngành</td>
                      <td className="p-3 text-foreground">Công Nghệ Phần Mềm</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Terms Section */}
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Điều khoản chính:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Tuân thủ nội quy ký túc xá</li>
                  <li>Thanh toán tiền thuê đầy đủ và đúng hạn</li>
                  <li>Bảo quản tài sản phòng</li>
                  <li>Không tự ý cải tạo hoặc sửa chữa phòng</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setSelectedContract(null)}
                  variant="outline"
                  className="flex-1 border-border text-foreground hover:bg-card bg-transparent"
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => {
                    handleDownloadContract(selectedContract.contractNo, selectedContract.roomName)
                    setSelectedContract(null)
                  }}
                  className="flex-1 bg-primary hover:bg-[#922d28] text-white"
                >
                  <Download size={16} className="mr-2" />
                  Tải về PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
