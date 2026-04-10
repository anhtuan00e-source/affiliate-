import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { fetchData, SHEETS } from '../services/api';
import { Outfit } from '../types';
import { useStore } from '../lib/store';

export default function Home() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const { savedOutfits, toggleSave } = useStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData(SHEETS.OUTFITS);
        setOutfits(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">OUTFITHANQUOC</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">PREMIUM K-STYLE CURATOR</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {outfits.map((outfit, index) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              <Link to={`/outfit/${outfit.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 rounded-[2.5rem] border border-zinc-800 group-hover:border-zinc-700 transition-all shadow-2xl">
                  <img 
                    src={outfit['ảnh']} 
                    alt={outfit['tên_outfit']} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Top Left Badge */}
                  <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-white/90">#{outfit.id}</span>
                  </div>

                  {/* Top Right Heart */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSave(outfit.id);
                    }}
                    className="absolute top-6 right-6 z-10 text-white/70 hover:text-white transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${savedOutfits.includes(outfit.id) ? 'fill-white text-white' : ''}`} />
                  </button>

                  {/* Center "CHI TIẾT" Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-black/20 backdrop-blur-xl px-10 py-4 rounded-full border border-white/20 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-xs font-black uppercase tracking-[0.4em] text-white">Chi tiết</span>
                    </div>
                  </div>

                  {/* Bottom Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="mt-6 px-4">
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1.5">Mã: #{outfit.id}</p>
                  <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-zinc-400 transition-colors leading-tight">
                    {outfit['tên_outfit']}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
