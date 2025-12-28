const Footer = () => {
  return (
    <footer className="mt-auto py-12 border-t border-white/5 bg-slate-950 text-center relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-black mb-4 tracking-tighter">
          Apna<span className="text-slate-600">Thekha</span>
        </h2>
        <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
        We do not sell alcohol. Prices are indicative and sourced from public domains.
        </p>
        <div className="text-xs text-slate-700">
          Data Source: <a href="https://livcheers.com" target="_blank" rel="noreferrer" className="underline hover:text-pink-500 transition-colors">LivCheers.com</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;