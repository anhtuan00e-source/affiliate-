import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, X } from 'lucide-react';
import { useStore } from '../lib/store';
import { useState, useRef, useEffect, FormEvent } from 'react';
import CartDrawer from './CartDrawer';
import { fetchData, SHEETS } from '../services/api';
import { Outfit } from '../types';

export default function Navbar() {
  const { cart, savedOutfits } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [searchError, setSearchError] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    async function loadOutfits() {
      const data = await fetchData(SHEETS.OUTFITS) as any[];
      setOutfits(data);
    }
    loadOutfits();
  }, []);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const cleanId = searchId.replace('#', '').trim();
    const exists = outfits.some(o => o.id === cleanId);

    if (exists) {
      navigate(`/outfit/${cleanId}`);
      setIsSearchOpen(false);
      setSearchId('');
      setSearchError(false);
    } else {
      setSearchError(true);
      setTimeout(() => setSearchError(false), 2000);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
          <Link to="/" className={`flex items-center gap-2 transition-opacity ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <span className="font-black text-lg tracking-tighter uppercase">OUTFITHANQUOC</span>
          </Link>

          {/* Expandable Search Bar */}
          <div className={`absolute inset-x-6 h-full flex items-center transition-all duration-300 ${isSearchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
            <form onSubmit={handleSearch} className="w-full flex items-center gap-4">
              <Search className="w-4 h-4 text-zinc-500" />
              <input
                ref={inputRef}
                type="text"
                placeholder="NHẬP MÃ SỐ (VD: 512)..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className={`flex-1 bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest placeholder:text-zinc-700 ${searchError ? 'text-red-500' : 'text-white'}`}
              />
              <button 
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-zinc-900 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </form>
          </div>

          <div className={`flex items-center gap-8 transition-opacity ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
              <Link to="/" className="hover:text-white transition-colors">Mới nhất</Link>
              <Link to="/" className="hover:text-white transition-colors">Bộ sưu tập</Link>
              <Link to="/" className="hover:text-white transition-colors">Bán chạy</Link>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-zinc-900 rounded-full transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-zinc-900 rounded-full transition-colors relative">
                <Heart className="w-4 h-4" />
                {savedOutfits.length > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-white text-black text-[8px] font-bold rounded-full flex items-center justify-center">
                    {savedOutfits.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:bg-zinc-900 rounded-full transition-colors relative"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-white text-black text-[8px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
