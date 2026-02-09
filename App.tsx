
import React, { useState } from 'react';
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import RoastReport from './components/RoastReport';
import { RoastReportData, InputMode } from './types';
import { analyzeLandingPage } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'tool'>('landing');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<RoastReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>('URL');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartRoast = async () => {
    if (inputMode === 'URL' && !url) return;
    if (inputMode === 'FILE' && !image) return;

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeLandingPage(
        inputMode === 'URL' ? url : image!,
        inputMode === 'FILE'
      );
      setReport(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong during the roast.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setReport(null);
    setLoading(false);
    setError(null);
    setUrl('');
    setImage(null);
    setView('landing');
  };

  const startNewRoast = () => {
    setReport(null);
    setError(null);
    setView('tool');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateHome = () => {
    setView('landing');
    setReport(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header onStartRoast={startNewRoast} onNavigateHome={navigateHome} />
      <LoadingScreen />
    </div>
  );

  if (report) return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header onStartRoast={startNewRoast} onNavigateHome={navigateHome} />
      <RoastReport report={report} onReset={reset} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-orange-500 selection:text-white">
      <Header onStartRoast={startNewRoast} onNavigateHome={navigateHome} />

      <main>
        {view === 'landing' ? (
          <div className="animate-in fade-in duration-700">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
                Is Your Landing Page <br />
                <span className="text-orange-500">Underperforming?</span>
              </h1>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Most websites look pretty but convert poorly. Our AI shreds your layout and SEO, giving you the brutal truth you need to hear.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={startNewRoast}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-2xl text-xl font-black tracking-wide transition-all shadow-2xl shadow-orange-600/30 hover:scale-105 active:scale-95"
                >
                  Start my roast
                </button>
                <button 
                   onClick={() => document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' })}
                   className="bg-[#111111] hover:bg-[#1a1a1a] border border-white/5 text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all"
                >
                  See Examples
                </button>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-4 py-32 border-t border-white/5">
              <div className="text-center mb-20">
                <h2 className="text-4xl font-black mb-4">Brutal Features</h2>
                <p className="text-gray-500">Everything you need to stop losing customers.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: 'fa-brain', title: 'Cynical AI Logic', text: 'Powered by Gemini 3 Flash, our model is trained on thousands of high-converting pages.' },
                  { icon: 'fa-search', title: 'Technical SEO Crawl', text: 'We find hidden semantic errors that are tanking your Google rankings.' },
                  { icon: 'fa-bolt', title: 'Instant Feedback', text: 'No waiting for human audits. Get a comprehensive roast in under 30 seconds.' },
                  { icon: 'fa-user-secret', title: 'UX Friction Finders', text: 'Discover exactly where users get confused and leave your site.' },
                  { icon: 'fa-chart-line', title: 'Conversion Killers', text: 'Identify the exact copy changes needed to boost your ROI immediately.' },
                  { icon: 'fa-mobile-alt', title: 'Mobile Audit', text: 'Because if it doesnt work on a phone, it doesnt work at all.' },
                ].map((f, i) => (
                  <div key={i} className="bg-[#111111] p-8 rounded-3xl border border-white/5 hover:border-orange-500/30 transition-all group">
                    <div className="w-12 h-12 bg-orange-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <i className={`fas ${f.icon} text-orange-500 text-xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="bg-[#0f0f0f] py-32">
              <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                  <h2 className="text-4xl font-black mb-4">How It Works</h2>
                  <p className="text-gray-500">Three steps to a better landing page.</p>
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-12 max-w-5xl mx-auto">
                  {[
                    { step: '01', title: 'Submit', text: 'Drop your URL or upload a high-res screenshot of your current landing page.' },
                    { step: '02', title: 'The Roast', text: 'Our AI analyzes the layout, copy, and SEO signals with brutal honesty.' },
                    { step: '03', title: 'Improve', text: 'Get an itemized report with technical steps to fix your mess and rank higher.' },
                  ].map((s, i) => (
                    <div key={i} className="flex-1 relative">
                      <div className="text-8xl font-black text-white/5 absolute -top-10 -left-4 select-none">{s.step}</div>
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{s.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Examples Section */}
            <section id="examples" className="container mx-auto px-4 py-32">
              <div className="text-center mb-20">
                <h2 className="text-4xl font-black mb-4">Hall of Shame</h2>
                <p className="text-gray-500">Actual pages we've cooked to perfection.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {[
                  { score: 38, label: 'Absolute Disaster', site: 'fashion-store.com', roast: 'Your navigation menu is a labyrinth designed by someone who hates navigation.' },
                  { score: 55, label: 'Needs Work', site: 'SaaS-startup.io', roast: 'Great hero section, but your testimonials look like they were written by your mom.' },
                ].map((ex, i) => (
                  <div key={i} className="bg-[#111111] rounded-3xl overflow-hidden border border-white/5 flex flex-col">
                    <div className="p-8 border-b border-white/5">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full border-2 border-orange-500 flex items-center justify-center font-black text-orange-500">{ex.score}</div>
                        <div>
                          <div className="text-[10px] uppercase font-black text-orange-500 tracking-widest">{ex.label}</div>
                          <div className="font-bold">{ex.site}</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 italic">"{ex.roast}"</p>
                    </div>
                    <div className="p-4 bg-black/40 flex justify-center">
                      <span className="text-xs text-gray-600">Sample Analysis Data</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom CTA */}
            <section className="container mx-auto px-4 py-32 text-center">
              <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/20 p-16 rounded-[40px]">
                <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to get roasted?</h2>
                <p className="text-gray-400 mb-10 max-w-xl mx-auto">Join 10,000+ marketers who realized their websites were actually bad.</p>
                <button 
                  onClick={startNewRoast}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-5 rounded-2xl text-xl font-black transition-all shadow-xl shadow-orange-600/40"
                >
                  Start my roast
                </button>
              </div>
            </section>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center pt-10 animate-in slide-in-from-bottom-8 duration-500">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              Submit Your Page
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Drop a link or a screenshot. Be prepared to hurt your own feelings.
            </p>

            <div className="bg-[#111111] border border-white/5 rounded-[32px] p-10 shadow-2xl relative max-w-3xl mx-auto">
              <div className="flex justify-center mb-10 gap-4">
                <button 
                  onClick={() => setInputMode('URL')}
                  className={`px-6 py-2.5 rounded-full font-bold transition-all text-sm ${inputMode === 'URL' ? 'bg-orange-600 text-white' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}
                >
                  Website URL
                </button>
                <button 
                  onClick={() => setInputMode('FILE')}
                  className={`px-6 py-2.5 rounded-full font-bold transition-all text-sm ${inputMode === 'FILE' ? 'bg-orange-600 text-white' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}
                >
                  Upload Screenshot
                </button>
              </div>

              {inputMode === 'URL' ? (
                <div className="flex flex-col md:flex-row gap-4">
                  <input 
                    type="text" 
                    placeholder="https://example.com" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 bg-black border border-white/10 rounded-2xl px-6 py-4 text-lg focus:border-orange-500 outline-none transition-all placeholder:text-gray-700"
                  />
                  <button 
                    onClick={handleStartRoast}
                    disabled={!url}
                    className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl text-lg font-black tracking-wide transition-all shadow-xl shadow-orange-600/20"
                  >
                    ROAST!
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer ${image ? 'border-orange-500 bg-orange-500/5' : 'border-white/5 hover:border-white/10 bg-black/20'}`}>
                    <label className="flex flex-col items-center gap-4 cursor-pointer">
                      {image ? (
                        <div className="relative group">
                          <img src={image} alt="Upload preview" className="max-h-64 rounded-xl" />
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-500 text-2xl">
                            <i className="fas fa-image"></i>
                          </div>
                          <p className="text-gray-400 font-medium">Click to select screenshot</p>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                  {image && (
                    <button 
                      onClick={handleStartRoast}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-2xl text-lg font-black transition-all shadow-xl shadow-orange-600/20"
                    >
                      ROAST THIS IMAGE!
                    </button>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-3 text-sm">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{error}</span>
                </div>
              )}
              
              <button 
                onClick={navigateHome}
                className="mt-8 text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <i className="fas fa-arrow-left"></i> Back to Home
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-20 py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Landing Page Roaster AI. All rights roasted.</p>
      </footer>
    </div>
  );
};

export default App;
