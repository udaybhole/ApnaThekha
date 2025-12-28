import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const colorMap = {
  amber: { 
    border: 'group-hover:border-amber-500', 
    shadow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]',
    iconBg: 'bg-amber-500',
  },
  orange: { 
    border: 'group-hover:border-orange-500', 
    shadow: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]',
    iconBg: 'bg-orange-500',
  },
  cyan: { 
    border: 'group-hover:border-cyan-500', 
    shadow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]',
    iconBg: 'bg-cyan-500',
  },
  rose: { 
    border: 'group-hover:border-rose-600', 
    shadow: 'group-hover:shadow-[0_0_30px_rgba(225,29,72,0.5)]',
    iconBg: 'bg-rose-600',
  },
};

const CategoryCard = ({ category, onClick, index }) => {
  const Icon = category.icon;
  const theme = colorMap[category.color] || colorMap.amber;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-3xl h-64 cursor-pointer group
        bg-black border border-white/10 ${theme.border}
        transition-all duration-500 ease-out shadow-lg
        ${theme.shadow}
      `}
    >
      {/* --- 1. BACKGROUND IMAGE --- */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={category.image} 
          alt={category.id}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
        />
        {/* Dark Overlay (Gradient) so text pops out */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
      </div>
      
      {/* --- 2. CONTENT (Stacked on top using z-10) --- */}
      <div className="relative h-full p-6 flex flex-col justify-between z-10">
        
        {/* Top Row: Icon & Arrow */}
        <div className="flex justify-between items-start">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            backdrop-blur-md bg-white/10 border border-white/20 text-white
            group-hover:bg-${category.color}-500 group-hover:border-${category.color}-400
            transition-all duration-300 shadow-lg
          `}>
            <Icon size={24} strokeWidth={2} />
          </div>

          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:bg-pink-500 group-hover:border-pink-500 transition-all duration-300">
            <ArrowUpRight size={20} />
          </div>
        </div>
        
        <div>
          <h3 className="text-4xl font-black text-white mb-1 tracking-tighter uppercase italic drop-shadow-xl">
            {category.id}
          </h3>
          <p className="text-white/70 text-xs font-bold tracking-widest uppercase group-hover:text-white transition-colors drop-shadow-md">
            {category.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;