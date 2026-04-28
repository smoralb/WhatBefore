export default function Home({ onStart }) {
  return (
    <div className="w-full min-h-screen relative overflow-x-hidden">
      <div className="neo-memphis-pattern" />
      
      {/* Navbar */}
      <nav className="w-full h-20 border-b-4 border-black flex items-center justify-between px-8 md:px-16 bg-white sticky top-0 z-50">
        <h2 className="text-2xl md:text-3xl font-black tracking-tighter">WHATBEFORE</h2>
        <div className="hidden md:flex gap-8 font-bold">
          <a href="#" className="hover:underline">DESIGN</a>
          <a href="#" className="hover:underline">RETRO</a>
          <a href="#" className="hover:underline">BRUTAL</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center px-8 md:px-16 py-12 md:py-24 gap-12 max-w-7xl mx-auto">
        <div className="flex-1 space-y-8">
          <h1 className="nb-title text-6xl md:text-8xl">
            NEO BRUTALISM <br /> 
            <span className="bg-nb-pink p-2 inline-block transform rotate-2">MEETS 90S</span> <br />
            RETRO
          </h1>
          
          <p className="text-xl md:text-2xl max-w-md font-medium border-l-8 border-nb-purple pl-4">
            Bold strokes, loud colors, and geometric chaos. The Memphis style redefined for the modern web.
          </p>

          <button
            onClick={onStart}
            className="nb-btn text-2xl"
          >
            EXPLORE THE CHAOS
          </button>
        </div>

        <div className="flex-1 relative">
          <div className="nb-card w-full aspect-square bg-white overflow-hidden p-2">
            <img 
              src="/design-references/memphis-pattern.webp" 
              alt="Memphis Pattern" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop";
              }}
            />
          </div>
          {/* Decorative shapes */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-nb-teal border-4 border-black rounded-full -z-10 shadow-[8px_8px_0px_black]" />
          <div className="absolute -bottom-6 -left-6 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[80px] border-b-nb-yellow -z-10 drop-shadow-[8px_8px_0px_black]" />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t-4 border-black py-20 px-8">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <h2 className="nb-title text-5xl md:text-7xl">RADICAL FEATURES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="nb-card bg-nb-teal p-10 space-y-4 text-left">
              <h3 className="text-3xl font-black">BOLD STROKES</h3>
              <p className="text-lg">Everything is defined by strong, black outlines that refuse to be ignored.</p>
            </div>
            
            <div className="nb-card bg-nb-pink p-10 space-y-4 text-left md:translate-y-8">
              <h3 className="text-3xl font-black">VIVID COLORS</h3>
              <p className="text-lg">A palette that screams 1992. High saturation, low hesitation.</p>
            </div>
            
            <div className="nb-card bg-nb-purple p-10 space-y-4 text-left">
              <h3 className="text-3xl font-black">HARD SHADOWS</h3>
              <p className="text-lg">No blurs. No gradients. Just solid, unapologetic geometry.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
