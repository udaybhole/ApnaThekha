import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertOctagon } from 'lucide-react';

const DisclaimerModal = ({ onAccept }) => {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-3xl p-8 shadow-[0_0_50px_rgba(236,72,153,0.15)] relative overflow-hidden text-center"
        >
          {/* Animated Gradient Border Top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 animate-pulse" />

          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <AlertOctagon className="text-red-500 w-8 h-8" />
          </div>

          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">ID Check</h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            Welcome to <span className="text-white font-bold">ApnaThekha</span>. 
            We provide pricing info for educational purposes only.
            <br/><br/>
            <span className="text-red-400 font-bold uppercase text-xs tracking-widest border border-red-900/50 bg-red-950/30 px-3 py-1 rounded-full">21+ Only</span>
          </p>

          <button 
            onClick={onAccept}
            className="w-full py-4 bg-white text-black hover:bg-pink-500 hover:text-white font-black text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 uppercase tracking-wide"
          >
            <ShieldCheck size={20} />
            Enter Club
          </button>

          <p className="mt-6 text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
            Drink Responsibly • Don't Drink & Drive
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DisclaimerModal;