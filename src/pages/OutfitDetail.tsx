import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, ArrowLeft, RefreshCcw, Sparkles } from 'lucide-react';
import { useStore } from '../lib/store';
import { useEffect, useState } from 'react';
import { fetchData, SHEETS } from '../services/api';
import { Outfit, Item } from '../types';

export default function OutfitDetail() {
  const { id } = useParams();
  const { toggleSave, savedOutfits } = useStore();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [similarOutfits, setSimilarOutfits] = useState<Outfit[]>([]);
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
      
      // Similar outfits: Filter out current and take 4
      const others = outfitsData
        .filter((o: any) => String(o.id) !== String(id))
        .sort(() => 0.5 - Math.random()) // Randomize for variety
        .slice(0, 4);

      // Debugging as requested
      console.log('All Items:', itemsData);
      console.log('Items filtered by Outfit ID:', filteredItems);

      setOutfit(foundOutfit || null);
      setItems(filteredItems);
      setSimilarOutfits(others);
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
      <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh] bg-black text-white">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Đang tải chi tiết...</p>
      </div>
    );
  }

  if (error || !outfit) {
    return (
      <div className="pt-32 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs px-6 bg-black min-h-screen">
        {error || 'Không tìm thấy Outfit'}
      </div>
    );
  }

  const isSaved = savedOutfits.includes(outfit.id);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black text-white"
    >
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
          {/* Left: Image with Hero Overlay */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[3/4] overflow-hidden bg-zinc-900 rounded-3xl group"
            >
              <img 
                src={outfit['ảnh'] || 'https://picsum.photos/seed/outfit/1200/1600'} 
                alt={outfit['tên_outfit'] || `Outfit #${outfit.id}`} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Hero ID Overlay - Styled like the screenshot */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="bg-black/40 backdrop-blur-md px-8 py-4 border border-white/20 rounded-2xl"
                >
                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">
                    OUTFIT #{outfit.id}
                  </h2>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="sticky top-24"
            >
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

              <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 leading-none">{outfit['tên_outfit'] || `Bộ phối #${outfit.id}`}</h1>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-12">{outfit['danh_mục'] || 'Premium Collection'}</p>
              
              {/* Items List */}
              <div className="space-y-4 mb-12">
                <h3 className="text-[10px] font-bold uppercase text-white tracking-[0.3em] border-b border-zinc-800 pb-4 mb-6">Sản phẩm trong set</h3>
                {items.length > 0 ? (
                  items.map((item, idx) => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (idx * 0.1) }}
                      className="flex items-center justify-between group py-4 px-4 bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800/50 hover:border-zinc-700 transition-all rounded-2xl"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-20 bg-zinc-900 overflow-hidden rounded-xl border border-zinc-800">
                          <img 
                            src={item['ảnh_sp'] || 'https://picsum.photos/seed/product/200/300'} 
                            alt={item['tên_sp']} 
                            className="w-full h-full object-cover transition-all duration-700" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1.5">{item['danh_mục'] || 'Sản phẩm'}</p>
                          <p className="font-bold text-sm tracking-tight text-zinc-200 group-hover:text-white transition-colors">
                            {item['tên_sp'] || `Sản phẩm lẻ #${item.id}`}
                          </p>
                        </div>
                      </div>
                      
                      {item['link_mua'] ? (
                        <a 
                          href={item['link_mua']} 
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

        {/* Similar Outfits Section */}
        <div className="mt-32 pt-24 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Phối đồ tương tự</h2>
            <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Xem tất cả</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {similarOutfits.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Link 
                  to={`/outfit/${item.id}`}
                  className="block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 rounded-[2rem] border border-zinc-800 group-hover:border-zinc-700 transition-all shadow-xl">
                    <img 
                      src={item['ảnh'] || `https://picsum.photos/seed/outfit-${item.id}/800/1200`} 
                      alt={item['tên_outfit']} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      referrerPolicy="no-referrer" 
                    />

                    {/* Top Left Badge */}
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                      <span className="text-[9px] font-black text-white/90">#{item.id}</span>
                    </div>

                    {/* Center "CHI TIẾT" Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="bg-black/20 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Chi tiết</span>
                      </div>
                    </div>

                    {/* Bottom Right "AI STYLIST" */}
                    <div className="absolute bottom-6 right-6">
                      <div className="bg-white text-black px-4 py-2.5 rounded-full flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        <Sparkles className="w-3 h-3 fill-black" />
                        <span className="text-[8px] font-black uppercase tracking-widest">AI Stylist</span>
                      </div>
                    </div>

                    {/* Bottom Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="mt-4 px-2">
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1">Mã: #{item.id}</p>
                    <p className="text-sm font-black text-zinc-300 group-hover:text-white transition-colors uppercase tracking-tight leading-tight">
                      {item['tên_outfit'] || 'Outfit Gợi Ý'}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
