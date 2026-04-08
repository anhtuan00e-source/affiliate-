import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ArrowRight, Loader2 } from 'lucide-react';
import { getStylistRecommendation } from '../lib/gemini';
import { Link } from 'react-router-dom';
import { fetchData, SHEETS } from '../services/api';
import { Outfit } from '../types';

export default function AIStylist() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ outfitId: string; reason: string } | null>(null);
  const [style, setStyle] = useState('Minimal');
  const [occasion, setOccasion] = useState('Daily');
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  useEffect(() => {
    async function loadOutfits() {
      const data = await fetchData(SHEETS.OUTFITS) as any[];
      setOutfits(data);
    }
    loadOutfits();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await getStylistRecommendation(style, occasion, outfits);
    setResult(res);
    setLoading(false);
  };

  const recommendedOutfit = result ? outfits.find(o => o.id === result.outfitId) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 bg-white text-black font-bold py-4 px-8 rounded-full shadow-xl hover:bg-zinc-200 transition-all text-xs uppercase tracking-widest"
      >
        <Sparkles className="w-4 h-4" />
        AI STYLIST
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-black border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5" />
                    <h2 className="text-xl font-black uppercase tracking-tighter">Tư vấn phong cách AI</h2>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-900 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {!result ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Phong cách</label>
                        <div className="flex flex-wrap gap-2">
                          {['Minimal', 'Streetwear', 'Smart Casual', 'Vintage'].map(s => (
                            <button
                              key={s}
                              onClick={() => setStyle(s)}
                              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-full ${
                                style === s ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 hover:text-white'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Dịp sử dụng</label>
                        <div className="flex flex-wrap gap-2">
                          {['Daily', 'Date', 'Work', 'Party'].map(o => (
                            <button
                              key={o}
                              onClick={() => setOccasion(o)}
                              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-full ${
                                occasion === o ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 hover:text-white'
                              }`}
                            >
                              {o}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={loading}
                      className="w-full bg-white text-black py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang phân tích...
                        </>
                      ) : (
                        <>
                          Gợi ý cho tôi
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2 aspect-[3/4] bg-zinc-900 overflow-hidden rounded-2xl">
                      <img src={recommendedOutfit?.ảnh} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Gợi ý hoàn hảo</p>
                      <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{recommendedOutfit?.tên_outfit}</h3>
                      <p className="text-zinc-400 text-sm mb-8 italic leading-relaxed">"{result.reason}"</p>
                      
                      <div className="flex flex-col gap-3">
                        <Link
                          to={`/outfit/${recommendedOutfit?.id}`}
                          onClick={() => setIsOpen(false)}
                          className="bg-white text-black py-4 text-center text-xs font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                        <button
                          onClick={() => setResult(null)}
                          className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                        >
                          Thử lại
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
