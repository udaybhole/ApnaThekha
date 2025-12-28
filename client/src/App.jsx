import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CategoryCard from './components/CategoryCard';
import ProductCard from './components/ProductCard';
import DisclaimerModal from './components/DisclaimerModal';
import Footer from './components/Footer';
import { Filter, ArrowDownUp, Beer, Wine, GlassWater, Martini, Sparkles, Star, Quote, ArrowRight, Barrel } from 'lucide-react';
import { motion } from 'framer-motion';
import ChatInterface from './components/ChatInterface';
const API_BASE = '';
function App() {
  const [view, setView] = useState('home');
  const [activeCategory, setActiveCategory] = useState('Beer');
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [sortOrder, setSortOrder] = useState('lowToHigh');

  // --- CONFIG ---
  const categories = [
    { id: 'Beer', icon: Beer, color: 'amber', desc: 'Lagers, Ales & Craft', image: '/beer.jfif' },
    { id: 'Whisky', icon: GlassWater, color: 'orange', desc: 'Single Malts & Blends', image: '/whisky.webp' },
    { id: 'Vodka', icon: Martini, color: 'cyan', desc: 'Clean & Flavored', image: '/vodka.webp' },
    { id: 'Rum', icon: Barrel, color: 'rose', desc: 'Dark, White & Spiced', image: '/rum.jpg' }
  ];

  const whiskySubCategories = ['All', 'Single Malts', 'World Whisky', 'Made in India Whisky', 'Blended Scotch'];

  // --- HUMBLE RECOMMENDS DATA ---
  const humblePicks = [
    "Black Buck Premium Strong Beer", 
    "London Pilsner Beer", 
    "Corona Extra",
    "ICONiQ White", 
    "Royal Challenge Play Beer Flavoured Whisky", 
    "Fireball Whiskey",
    "Budweiser Magnum Double Barrel", 
    "Magic Moment Verve Cranberry", 
    "Short Story Grain Vodka",
    "Absolut Vodka", 
    "Bacardi Limon Citrus", 
    "Old Monk XXX Dark Rum",
    "Bacardi Premium + Cranberry" 
  ];

  const humbleDescriptions = {
    "London Pilsner Beer": "Month End Wali",
    "Corona Extra": "Nimbhu Dalke Peena",
    "ICONiQ White": "Smooth Hai Bilkul",
    "Royal Challenge Play Beer Flavoured Whisky": "Go 2 Cheez",
    "Fireball Whiskey": "Pagal Ho Jaughe",
    "Budweiser Magnum Double Barrel": "Pagal Ho Jaughe 2",
    "Magic Moment Verve Cranberry": "Cocktail ya Neat",
    "Short Story Grain Vodka": "Bottle Mast Hai",
    "Absolut Vodka": "Hands Down Best",
    "Bacardi Limon Citrus": "Maja Ayega",
    "Old Monk XXX Dark Rum": "Aram se Pinna",
    "Bacardi Premium + Lemonade": "Chadhegi nahi",
    "Bira Boom Can": "Mast hai",
    "Bira 91 Light Low Calorie Lager": "Kabhi Kabhi Achi Lagegi",
    "Budweiser Strong Can": "Naam Hi Kafhi hai",
    "Kingfisher Ultra Max Can": "Chilled Peena",
    "Bro Code Strong Pint": "Mat Piyo Please",
    "Royal Green Whisky": "Go to",
    "Oaksmith International Whisky": "Jalti h Bahut Gaale mei",
    "Bacardi Black": "Coke Kam Dalna",
    "Teachers Highland Cream": "Neat Pinna",
    "Jameson Triple Distilled": "Hands Down Best"
  };

  // --- FETCHING LOGIC ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        if (activeCategory === 'Humble Recommends') {
          // 1. Fetch ALL data
          const [beers, vodka, rum, whisky] = await Promise.all([
            fetch(`${API_BASE}/api/beers`).then(res => res.json()),
            fetch(`${API_BASE}/api/vodka`).then(res => res.json()),
            fetch(`${API_BASE}/api/rum`).then(res => res.json()),
            fetch(`${API_BASE}/api/whisky`).then(res => res.json())
          ]);

          const allDrinks = [...beers, ...vodka, ...rum, ...whisky];
          
          // 2. Filter & Map
          const recommended = allDrinks.filter(item => 
             humblePicks.some(pick => item.name.toLowerCase().includes(pick.toLowerCase()))
          ).map(item => ({
            ...item,
            customDesc: humbleDescriptions[Object.keys(humbleDescriptions).find(key => item.name.includes(key))] || "GC Approved."
          }));

          setProducts(recommended);

        } else {
          // Standard Fetch
          let url = '';
          if (activeCategory === 'Beer') url = `${API_BASE}/api/beers`;
          else if (activeCategory === 'Vodka') url = `${API_BASE}/api/vodka`;
          else if (activeCategory === 'Rum') url = `${API_BASE}/api/rum`;
          else if (activeCategory === 'Whisky') url = `${API_BASE}/api/whisky`;

          if (url) {
            fetch(url).then(res => res.json()).then(data => setProducts(data));
          }
        }
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };

    if (view === 'products') {
      setProducts([]); 
      fetchAllData();
    }
  }, [activeCategory, view]);

  // --- SORT & FILTER ---
  const getProcessedProducts = () => {
    let filtered = [...products];

    // 1. Whisky Sub-Filter
    if (activeCategory === 'Whisky' && activeSubCategory !== 'All') {
      filtered = filtered.filter(item => 
        item.category && item.category.toLowerCase().trim() === activeSubCategory.toLowerCase().trim()
      );
    }

    // 2. Sorting Logic (DISABLED for Humble Recommends)
    if (activeCategory !== 'Humble Recommends') {
      return filtered.sort((a, b) => {
        const priceA = parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0;
        return sortOrder === 'lowToHigh' ? priceA - priceB : priceB - priceA;
      });
    }
    
    // For Humble Recommends, return as is (Curated Order)
    return filtered;
  };

  const displayedProducts = getProcessedProducts();

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setView('products');
    setActiveSubCategory('All'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen relative text-slate-200 selection:bg-pink-500 selection:text-white">
      {/* Background Blobs */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-black">
         <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
         <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000" />
         <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000" />
      </div>

      {showDisclaimer && <DisclaimerModal onAccept={() => setShowDisclaimer(false)} />}
      
      <Navbar view={view} setView={setView} />

      <ChatInterface />

      {/* --- HOME VIEW --- */}
      {view === 'home' && (
        <div className="grow flex flex-col items-center justify-center w-full">
          <div className="relative py-12 text-center px-4 w-full">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6 relative inline-block"
            >
               <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-white via-slate-200 to-slate-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                "KYU PINNI HAI <br/>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 animate-pulse">DARU?"</span>
              </h1>
              <Sparkles className="absolute -top-6 -right-6 text-yellow-400 w-12 h-12 animate-bounce" />
            </motion.div>
          </div>

          <div className="max-w-7xl w-full px-6 pb-20 space-y-8">
            
          
            {/* --- MAIN CATEGORIES GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat, index) => (
                <CategoryCard 
                  key={cat.id} 
                  index={index}
                  category={cat} 
                  onClick={() => handleCategoryClick(cat.id)} 
                />
              ))}
            </div>

              {/* --- HUMBLE RECOMMENDS SECTION --- */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div 
                onClick={() => handleCategoryClick('Humble Recommends')}
                className="col-span-1 relative h-72 rounded-3xl overflow-hidden cursor-pointer group border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_50px_rgba(245,158,11,0.3)] transition-all bg-black"
              >
                <img 
                  src="/Humble.png" 
                  alt="Humble Recommends" 
                  className="absolute inset-0 w-150 h-80 " 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-0 left-0 p-6 z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="text-amber-400 fill-amber-400 animate-pulse w-4 h-4" />
                    <span className="text-blue-400 font-bold tracking-[0.2em] text-[10px] uppercase">Curated Selection</span>
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg leading-none">
                    Humble <br/>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-yellow-200">Recommends</span>
                  </h2>
                </div>
              </div>

              <div className="col-span-1 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 p-8 flex flex-col justify-center relative overflow-hidden h-72 group">
                <Quote className="absolute top-4 right-4 text-white/5 w-24 h-24 rotate-12 group-hover:text-amber-500/10 transition-colors" />
                <h3 className="text-2xl font-bold text-white mb-3">The GC Approved List </h3>
                <p className="text-slate-400 leading-relaxed mb-6 text-sm">
                  These are the bottles that made it to our Group Chat's Hall of Fame.
                </p>
                <button 
                   onClick={() => handleCategoryClick('Humble Recommends')}
                   className="mt-auto self-start px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-lg"
                >
                  View The List <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      )}

      

      {/* --- PRODUCTS VIEW --- */}
      {view === 'products' && (
        <main className="max-w-7xl mx-auto px-6 py-8 w-full grow">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-end mb-10 border-b border-white/10 pb-6">
            <div>
              <motion.h2 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-5xl font-black text-white flex items-center gap-4 tracking-tighter"
              >
                {activeCategory === 'Humble Recommends' ? (
                  <span className="text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                    Humble Recommends
                  </span>
                ) : (
                  <span className={`text-${categories.find(c => c.id === activeCategory)?.color || 'pink'}-500`}>
                    {activeCategory}
                  </span>
                )}
              </motion.h2>
              <p className="text-slate-400 mt-2 font-medium text-sm uppercase tracking-widest">
                {activeCategory === 'Humble Recommends' ? 'Verified by The Boys • 100% Quality' : `Menu • ${displayedProducts.length} Selections`}
              </p>
            </div>

            {/* Sort Control - HIDDEN for Humble Recommends */}
            {activeCategory !== 'Humble Recommends' && (
              <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/10">
                <div className="pl-3 text-pink-500">
                  <ArrowDownUp size={16} />
                </div>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent text-white text-xs font-bold uppercase rounded-lg py-2 px-2 outline-none cursor-pointer"
                >
                  <option value="lowToHigh" className="bg-black">Price: Low to High</option>
                  <option value="highToLow" className="bg-black">Price: High to Low</option>
                </select>
              </div>
            )}
          </div>

          {/* Whisky Sub-Filters */}
          {activeCategory === 'Whisky' && (
            <div className="flex flex-wrap gap-3 mb-12">
              <div className="flex items-center justify-center w-10 h-10 text-amber-500 bg-amber-500/10 rounded-full border border-amber-500/20">
                <Filter size={18} />
              </div>
              {whiskySubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubCategory(sub)}
                  className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 border
                    ${activeSubCategory === sub
                      ? 'bg-amber-500 border-amber-500 text-black'
                      : 'bg-black/40 text-slate-400 border-white/10 hover:border-amber-500/50 hover:text-white'}
                  `}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Product Grid - Fixed Keys to prevent crash */}
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
              {displayedProducts.map((item, index) => (
                <ProductCard 
                  // KEY FIX: Using name+index ensures keys are unique across mixed categories
                  key={`${item.name}-${index}`} 
                  item={item} 
                  isHumble={activeCategory === 'Humble Recommends'}
                />
              ))}
            </div>
          ) : (
             <div className="py-32 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
              <div className="text-6xl mb-6 opacity-50 grayscale">🍸</div>
              <h3 className="text-2xl font-bold text-white mb-2">Out of Stock</h3>
              <p className="text-slate-400 mt-2">Check back later or try another category.</p>
            </div>
          )}
        </main>
      )}

      <Footer />
    </div>
  );
}

export default App;