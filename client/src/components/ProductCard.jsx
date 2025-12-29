import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const API_BASE = "http://localhost:8000";

const ProductCard = ({ item, isHumble }) => {
  const [ratings, setRatings] = useState({ '👍': 0, '👎': 0, '❤️': 0, '🔥': 0 });
  
  const getProductKey = () => {
    return item.id ? String(item.id) : item.name;
  };

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/ratings`);
        const allRatings = await response.json();
        const productKey = getProductKey();
        if (allRatings[productKey]) {
          setRatings(allRatings[productKey]);
        } else {
          setRatings({ '👍': 0, '👎': 0, '❤️': 0, '🔥': 0 });
        }
      } catch (error) {
        console.error('Failed to fetch ratings:', error);
      }
    };
    fetchRatings();
  }, [item.id, item.name]);

  const handleRatingClick = async (emoji) => {
    try {
      const productKey = getProductKey();
      const response = await fetch(`${API_BASE}/api/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productKey: productKey,
          emoji: emoji,
        }),
      });
      
      if (response.ok) {
        const updatedRatings = await response.json();
        setRatings(updatedRatings);
      }
    } catch (error) {
      console.error('Failed to update rating:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={`
        group relative backdrop-blur-md rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col
        ${isHumble 
          ? 'bg-slate-900/80 border-amber-500/50 hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]' 
          : 'bg-black/40 border-white/5 hover:border-pink-500/30 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]'
        }
      `}
    >
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-linear-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isHumble ? 'from-amber-500/10' : 'from-pink-500/5'}`} />

      {/* Image Section */}
      <div className="h-48 p-6 flex items-center justify-center relative overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.15, rotate: 3 }}
          transition={{ type: "spring", stiffness: 200 }}
          src={item.image}
          alt={item.name}
          className="h-full w-auto object-contain z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col grow relative z-10 bg-black/20">
        <div className="mb-2 flex justify-between items-start">
           <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-full border ${isHumble ? 'text-amber-400 border-amber-500/20' : 'text-pink-400 border-pink-500/20'}`}>
             {item.category}
           </span>
        </div>

        <h3 className="text-sm font-bold text-slate-200 line-clamp-2 mb-1 leading-relaxed group-hover:text-white transition-colors">
          {item.name}
        </h3>

        {/* --- SPECIAL HUMBLE DESCRIPTION --- */}
        {isHumble && item.customDesc && (
          <div className="mb-3">
            <p className="text-[10px] text-amber-200 italic font-medium leading-tight">
              "{item.customDesc}"
            </p>
          </div>
        )}

        {/* Rating Section */}
        <div className="mb-3 flex items-center gap-2">
          {['👍', '👎', '❤️', '🔥'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleRatingClick(emoji)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-white/20 group"
            >
              <span className="text-sm">{emoji}</span>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">
                {ratings[emoji] || 0}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-slate-500 font-bold">MRP</span>
            <span className="text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400">
              ₹{item.price}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-slate-400 bg-white/5 px-2 py-1 rounded-md">
              {item.volume}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;