import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { fetchData, SHEETS } from '../services/api';
import { Outfit } from '../types';
import OutfitCard from '../components/OutfitCard';
import { RefreshCcw } from 'lucide-react';

export default function Home() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    
    try {
      const data = await fetchData(SHEETS.OUTFITS) as any[];
      setOutfits(data);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      loadData(true);
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 text-center text-red-500 font-bold uppercase tracking-widest text-xs px-6">
        {error}
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      {/* Hero Section - Minimal */}
      <section className="mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Mặc đẹp không cần nghĩ.
          </h1>
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
            Tuyển chọn Outfit Hàn Quốc tối giản
          </p>
          
          <button 
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
          >
            <RefreshCcw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Đang cập nhật...' : 'Cập nhật dữ liệu mới'}
          </button>
        </motion.div>
      </section>

      {/* Grid - Focus on Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {outfits.map(outfit => (
          <OutfitCard key={outfit.id} outfit={outfit} />
        ))}
      </div>
    </div>
  );
}
