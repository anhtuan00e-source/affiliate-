import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import { useStore } from '../lib/store';
import { useEffect, useState } from 'react';
import { fetchData, SHEETS } from '../services/api';
import { Outfit, Item } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { cart, removeFromCart } = useStore();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (isOpen) {
      async function loadData() {
        const [oData, iData] = await Promise.all([
          fetchData(SHEETS.OUTFITS) as Promise<any[]>,
          fetchData(SHEETS.ITEMS) as Promise<any[]>
        ]);
        setOutfits(oData);
        setItems(iData);
      }
      loadData();
    }
  }, [isOpen]);

  const cartItems = cart.map(item => {
    const outfit = outfits.find(o => o.id === item.outfitId);
    const product = item.itemId 
      ? items.find(i => i.id === item.itemId)
      : null;
    
    return { 
      ...item, 
      name: product ? product.tên_sp : (outfit ? `${outfit.tên_outfit} (Trọn bộ)` : 'Sản phẩm'),
      image: product ? product.ảnh_sp : (outfit ? outfit.ảnh : ''),
      link: product ? product.link_mua : null
    };
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-black h-full shadow-2xl flex flex-col border-l border-zinc-800"
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <h2 className="text-sm font-black uppercase tracking-widest">Giỏ hàng</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Giỏ hàng trống</p>
                  <button onClick={onClose} className="text-[10px] font-black uppercase underline tracking-widest">Khám phá ngay</button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={`${item.outfitId}-${item.itemId}-${idx}`} className="flex gap-4 group">
                    <div className="w-16 h-20 bg-zinc-900 overflow-hidden rounded-xl">
                      <img src={item.image} alt="" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xs uppercase tracking-tighter mb-1">{item.name}</h3>
                      <p className="text-[10px] text-zinc-500 mb-2 uppercase font-bold">Số lượng: {item.quantity}</p>
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-white hover:underline"
                        >
                          Mua ngay <ExternalLink className="w-2 h-2" />
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.outfitId, item.itemId)}
                      className="p-2 text-zinc-600 hover:text-white transition-colors self-start"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-zinc-800">
                <button className="w-full bg-white text-black py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-colors">
                  Thanh toán
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
