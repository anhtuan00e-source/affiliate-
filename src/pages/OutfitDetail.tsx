import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Share2, ArrowLeft, ArrowRight, RefreshCcw } from 'lucide-react';
import { useStore } from '../lib/store';
import { useEffect, useState } from 'react';
import { fetchData, SHEETS } from '../services/api';
import { Outfit, Item } from '../types';

export default function OutfitDetail() {
  const { id } = useParams();
  const { toggleSave, savedOutfits } = useStore();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    
    try {
      // Fetch both APIs as requested
      const outfitsData = await fetchData(SHEETS.OUTFITS);
      const itemsData = await fetchData(SHEETS.ITEMS);
      
      // Logic: Use String() for reliable comparison as requested
      const foundOutfit = outfitsData.find((o: any) => String(o.id) === String(id));
      const filteredItems = itemsData.filter((item: any) => String(item.outfit_id) === String(id));
      
      // Debugging as requested
      console.log('All Items:', itemsData);
      console.log('Items filtered by Outfit ID:', filteredItems);

      setOutfit(foundOutfit || null);
      setItems(filteredItems);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu sản phẩm.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      loadData(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Đang tải chi tiết...</p>
      </div>
    );
  }

  if (error || !outfit) {
    return (
      <div className="pt-32 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs px-6">
        {error || 'Không tìm thấy Outfit'}
      </div>
    );
  }

  const isSaved = savedOutfits.includes(outfit.id);

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3" />
          Quay lại
        </Link>
        
        <button 
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
        >
          <RefreshCcw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Đang cập nhật...' : 'Làm mới dữ liệu'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
        {/* Left: Image */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[3/4] overflow-hidden bg-zinc-900 rounded-3xl"
          >
            <img 
              src={outfit.ảnh || 'https://picsum.photos/seed/outfit/1200/1600'} 
              alt={outfit.tên_outfit || `Outfit #${outfit.id}`} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          </motion.div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Mã số #{outfit.id}</span>
              <div className="flex items-center gap-4">
                <button onClick={() => toggleSave(outfit.id)} className="text-zinc-500 hover:text-white transition-colors">
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-white text-white' : ''}`} />
                </button>
                <button className="text-zinc-500 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 leading-none">Mã: #{outfit.id}</h1>
            
            {/* Items List */}
            <div className="space-y-4 mb-12">
              <h3 className="text-[10px] font-bold uppercase text-white tracking-[0.3em] border-b border-zinc-800 pb-4 mb-6">Sản phẩm trong set</h3>
              {items.length > 0 ? (
                items.map(item => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between group py-4 px-4 bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800/50 hover:border-zinc-700 transition-all rounded-2xl"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-20 bg-zinc-900 overflow-hidden rounded-xl border border-zinc-800">
                        <img 
                          src={item.ảnh_sp || 'https://picsum.photos/seed/product/200/300'} 
                          alt={item.tên_sp} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1.5">{item.danh_mục || 'Sản phẩm'}</p>
                        <p className="font-bold text-sm tracking-tight text-zinc-200 group-hover:text-white transition-colors">
                          {item.tên_sp || `Sản phẩm lẻ #${item.id}`}
                        </p>
                      </div>
                    </div>
                    
                    {item.link_mua ? (
                      <a 
                        href={item.link_mua} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all transform active:scale-95"
                      >
                        MUA LẺ
                      </a>
                    ) : (
                      <div className="px-4 py-2 border border-zinc-800 rounded-full">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Chưa có link</span>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="py-12 text-center border border-dashed border-zinc-800 rounded-3xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-2">Đang cập nhật sản phẩm lẻ cho set này...</p>
                  <p className="text-[8px] text-zinc-700 uppercase tracking-widest">Đảm bảo Trang_tính_2 có cột outfit_id khớp với mã set</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
