import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import OutfitDetail from './pages/OutfitDetail';
import AIStylist from './components/AIStylist';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-bg text-brand-text">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/outfit/:id" element={<OutfitDetail />} />
          </Routes>
        </main>
        <AIStylist />
        
        {/* Footer */}
        <footer className="py-20 px-6 border-t border-zinc-800 mt-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <span className="font-black uppercase tracking-tighter">OUTFITHANQUOC</span>
              </div>
              <p className="text-zinc-500 max-w-sm leading-relaxed text-xs font-medium uppercase tracking-widest">
                Thời trang tối giản từ Seoul.
              </p>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-[10px] mb-6 text-zinc-500">Cửa hàng</h4>
              <ul className="space-y-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                <li><a href="#" className="hover:text-white transition-colors">Mới nhất</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bán chạy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Giảm giá</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-[10px] mb-6 text-zinc-500">Hỗ trợ</h4>
              <ul className="space-y-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                <li><a href="#" className="hover:text-white transition-colors">Vận chuyển</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Đổi trả</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-20 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-zinc-800 mt-20">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">© 2026 OUTFITHANQUOC.</p>
            <div className="flex items-center gap-8 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
              <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
