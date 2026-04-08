'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gift, Tag, Copy, Percent, Ticket } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Discount {
  code: string;
  description: string;
  value: number;
  type: 'fixed' | 'percentage';
  expirationDate: string;
  isSingleUse: boolean;
}

const typeIcons = {
  fixed: <Ticket size={16} className="mr-1" />,
  percentage: <Percent size={16} className="mr-1" />,
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/discounts');
        if (!response.ok) {
          throw new Error('Failed to fetch promotions');
        }
        const data = await response.json();
        setPromotions(data.data || []);
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không thể tải danh sách khuyến mãi.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Đã sao chép!',
      description: `Mã "${code}" đã được sao chép vào clipboard.`,
    });
  };

  const now = new Date();
  const activePromos = promotions.filter(p => new Date(p.expirationDate) >= now);
  const expiredPromos = promotions.filter(p => new Date(p.expirationDate) < now);

  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <section className="mb-12">
          <div className="bg-linear-to-r from-primary to-[#922d28] rounded-lg p-8 sm:p-12 mb-12 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Gift size={40} />
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ưu Đãi & Khuyến Mãi</h1>
                <p className="text-lg opacity-90 mt-1">Các mã giảm giá và ưu đãi độc quyền dành cho bạn.</p>
              </div>
            </div>
            <p className="max-w-2xl">
              Sử dụng các mã giảm giá này khi thanh toán hóa đơn để được hưởng ưu đãi. 
              Mỗi mã có thể có điều kiện sử dụng riêng.
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <p>Đang tải khuyến mãi...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePromos.map((promo) => (
                <div key={promo.code} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 grow">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                        {typeIcons[promo.type]} {promo.type === 'fixed' ? 'Giảm giá trực tiếp' : 'Giảm theo %'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Hết hạn: {new Date(promo.expirationDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{promo.description}</h3>
                    <p className="text-4xl font-bold text-primary mb-4">
                      {promo.type === 'fixed' ? `${promo.value.toLocaleString('vi-VN')}đ` : `${promo.value}%`}
                    </p>
                    <div className="flex items-center gap-2 bg-primary/5 border border-dashed border-primary/30 rounded-lg px-3 py-2">
                      <Tag size={16} className="text-primary" />
                      <span className="font-mono text-primary font-semibold tracking-wider">{promo.code}</span>
                      <button
                        onClick={() => handleCopyCode(promo.code)}
                        className="ml-auto p-1.5 hover:bg-primary/20 rounded-md transition-colors"
                        aria-label="Copy code"
                      >
                        <Copy size={16} className="text-primary" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-card-foreground/5 p-4 text-sm text-muted-foreground">
                    <p><strong>Sử dụng một lần:</strong> {promo.isSingleUse ? 'Có' : 'Không'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {expiredPromos.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-muted-foreground/80 mb-6">Khuyến mãi đã hết hạn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiredPromos.map((promo) => (
                <div key={promo.code} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden opacity-60">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">
                        {typeIcons[promo.type]} {promo.type === 'fixed' ? 'Giảm giá trực tiếp' : 'Giảm theo %'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Đã hết hạn: {new Date(promo.expirationDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-muted-foreground mb-2">{promo.description}</h3>
                    <p className="text-4xl font-bold text-muted-foreground/70 mb-4">
                      {promo.type === 'fixed' ? `${promo.value.toLocaleString('vi-VN')}đ` : `${promo.value}%`}
                    </p>
                    <div className="flex items-center gap-2 bg-muted/50 border border-dashed rounded-lg px-3 py-2">
                      <Tag size={16} className="text-muted-foreground" />
                      <span className="font-mono text-muted-foreground font-semibold tracking-wider">{promo.code}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
