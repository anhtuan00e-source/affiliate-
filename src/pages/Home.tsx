import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchData, SHEETS } from '../services/api';
import { Outfit } from '../types';

export default function Home() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

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
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">K-Style Curator</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Premium Outfit Selection</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {outfits.map((outfit, index) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/outfit/${outfit.id}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-zinc-900 rounded-3xl mb-4 border border-zinc-800 group-hover:border-zinc-700 transition-all">
                  <img 
                    src={outfit['ảnh']} 
                    alt={outfit['tên_outfit']} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="px-2">
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1">#{outfit.id}</p>
                  <h3 className="text-sm font-bold uppercase tracking-tight group-hover:text-zinc-400 transition-colors">{outfit['tên_outfit']}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
