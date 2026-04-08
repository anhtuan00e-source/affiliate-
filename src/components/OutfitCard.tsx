import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Outfit } from '../types';
import { useStore } from '../lib/store';

interface Props {
  outfit: Outfit;
  key?: string | number;
}

export default function OutfitCard({ outfit }: Props) {
  const { savedOutfits, toggleSave } = useStore();
  const isSaved = savedOutfits.includes(outfit.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link to={`/outfit/${outfit.id}`} className="block relative aspect-[3/4] overflow-hidden bg-zinc-900 rounded-2xl">
        <img
          src={outfit.ảnh || 'https://picsum.photos/seed/outfit/600/800'}
          alt={outfit.tên_outfit || `Outfit #${outfit.id}`}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="border border-white/30 px-6 py-3 backdrop-blur-sm rounded-full">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
              Chi tiết
            </span>
          </div>
        </div>
        
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          <span className="text-[9px] font-mono text-white/50 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md">#{outfit.id}</span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSave(outfit.id);
          }}
          className="absolute top-4 right-4 p-2 transition-all opacity-0 group-hover:opacity-100"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-white text-white' : 'text-zinc-500'}`} />
        </button>
      </Link>

      <div className="pt-4 px-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Mã: #{outfit.id}</span>
        </div>
      </div>
    </motion.div>
  );
}
