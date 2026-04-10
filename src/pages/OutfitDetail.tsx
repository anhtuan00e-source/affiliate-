// Trích đoạn phần "Phối đồ tương tự" mới thêm vào:
<div className="mt-32 pt-24 border-t border-zinc-800">
  <div className="flex items-center justify-between mb-12">
    <h2 className="text-2xl font-black uppercase tracking-tighter">Phối đồ tương tự</h2>
    <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Xem tất cả</Link>
  </div>
  
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {similarOutfits.map((item, index) => (
      <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
        <Link to={`/outfit/${item.id}`} className="group block">
          <div className="aspect-[3/4] overflow-hidden bg-zinc-900 rounded-2xl mb-4 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
            <img src={item.ảnh} alt={item.tên_outfit} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
          </div>
          <div className="px-1">
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1.5">Mã: #{item.id}</p>
            <p className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors uppercase tracking-tight leading-tight">
              {item.tên_outfit || 'Outfit Gợi Ý'}
            </p>
          </div>
        </Link>
      </motion.div>
    ))}
  </div>
</div>
