import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ view, setView }) => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className=" top-4 z-50 mx-4"
    >
      <div className="backdrop-blur-xl bg-black/80 border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.8)] max-w-7xl mx-auto px-6 h-24 flex items-center justify-between relative overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-pink-500 to-transparent opacity-80" />

        <div 
          onClick={() => setView('home')}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-20 h-20">
            <div className="absolute inset-2 bg-pink-600 blur-md rounded-full opacity-50 group-hover:opacity-80 animate-pulse transition-opacity duration-500" />
            
            {/* Remove this line if your logo is already a circle or has a background */}
            <div className="absolute inset-4 bg-white/10 rounded-full blur-sm" />

            <img 
              src="/Logo.png" 
              alt="Logo" 
              className="h-full w-full object-contain relative z-10 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] group-hover:rotate-6 transition-transform duration-300"
            />
          </div>

          <h1 className="text-3xl font-black tracking-tighter italic hidden md:block">
            Apna<span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">Thekaa</span>
          </h1>
        </div>

        {/* RIGHT SIDE CONTROLS */}
        <div className="flex items-center gap-4">
          {view === 'products' && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white bg-white/5 border border-white/10 px-6 py-3 rounded-full hover:bg-white/10 hover:border-pink-500/50 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
              <ChevronLeft size={16} className="text-pink-500" />
              Back to Club
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;