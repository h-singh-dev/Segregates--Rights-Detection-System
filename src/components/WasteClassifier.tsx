import React, { useState, useRef } from 'react';
import { Search, Camera, QrCode, ArrowRight, Leaf, Recycle, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { classifyWasteByText, classifyWasteByImage } from '../services/geminiService';
import { WasteResult, WasteCategory, ClassificationHistory } from '../types';

const suggestions = ["Banana Peel", "Glass Bottle", "Lithium Battery", "Cardboard Box"];

export default function WasteClassifier() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WasteResult | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [history, setHistory] = useState<ClassificationHistory[]>(() => {
    try {
      const saved = localStorage.getItem('segregate_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const saveToHistory = (item: WasteResult, imageUrl?: string) => {
    setHistory(prev => {
      const newHistory = [{ id: crypto.randomUUID(), timestamp: Date.now(), item, imageUrl }, ...prev].slice(0, 50);
      localStorage.setItem('segregate_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const avgConfidence = history.length > 0 
    ? (history.reduce((sum, curr) => sum + curr.item.confidence, 0) / history.length * 100).toFixed(1)
    : "---";

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const activeQuery = overrideQuery ?? query;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await classifyWasteByText(activeQuery);
      setResult(data);
      saveToHistory(data);
    } catch (err) {
      setError("Failed to classify item. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Camera access denied.");
      setShowCamera(false);
    }
  };

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const base64Image = canvasRef.current.toDataURL('image/jpeg');
        
        // Stop stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setShowCamera(false);

        setLoading(true);
        setError(null);
        try {
          const data = await classifyWasteByImage(base64Image);
          setResult(data);
          // Only save the thumbnail format if desired; base64 can be large, 
          // but we save it to the history for display later.
          saveToHistory(data, base64Image);
        } catch (err) {
          setError("Failed to identify item from image.");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const getCategoryColor = (category: WasteCategory) => {
    switch (category) {
      case 'WET': return 'text-primary';
      case 'DRY': return 'text-secondary';
      case 'HAZARD': return 'text-tertiary';
      default: return 'text-on-surface';
    }
  };

  const getCategoryIcon = (category: WasteCategory) => {
    switch (category) {
      case 'WET': return <Leaf className="text-primary" size={40} />;
      case 'DRY': return <Recycle className="text-secondary" size={40} />;
      case 'HAZARD': return <AlertTriangle className="text-tertiary" size={40} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="max-w-2xl">
          <p className="text-primary font-headline text-[0.6875rem] font-semibold uppercase tracking-[0.2em] mb-4">Intelligent Sorter v2.4</p>
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter leading-tight text-on-surface">
            Where does it <span className="text-primary italic">belong?</span>
          </h1>
        </div>
        <div className="hidden lg:block text-right">
          <div className="flex items-center gap-2 justify-end mb-1">
            <span className="text-secondary text-3xl font-headline font-bold">{avgConfidence}%</span>
            <div className="bg-secondary/20 p-1 rounded-full">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-on-surface-variant text-xs font-headline uppercase tracking-widest">Avg Model Confidence</p>
        </div>
      </section>

      {/* Search Interaction */}
      <section className="mb-20 relative">
        <form onSubmit={handleSearch} className="bg-surface-container-high rounded-xl p-2 shadow-2xl shadow-black/40 border-l-4 border-primary">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-surface-container-lowest border-none rounded-lg pl-12 pr-4 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 focus:bg-surface-container-highest transition-colors font-sans text-base"
                placeholder="Enter waste item (e.g., banana peel, battery)"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={startCamera}
                className="p-4 bg-surface-container-highest text-on-surface rounded-lg hover:bg-surface-bright transition-all"
                title="Identify by Camera"
              >
                <Camera size={24} />
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 md:flex-none bg-primary-container text-on-primary-container px-8 py-4 rounded-lg font-headline font-bold text-sm tracking-tight hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Check Category"}
              </button>
            </div>
          </div>
        </form>

        {/* Suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => { setQuery(s); handleSearch(undefined, s); }}
              className="px-4 py-2 bg-surface-container-low hover:bg-surface-bright rounded-full text-xs transition-colors text-on-surface-variant"
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Camera Overlay */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center p-4"
          >
            <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => {
                  if (videoRef.current?.srcObject) {
                    const stream = videoRef.current.srcObject as MediaStream;
                    stream.getTracks().forEach(track => track.stop());
                  }
                  setShowCamera(false);
                }}
                className="px-8 py-4 bg-surface-container-highest text-on-surface rounded-full font-bold"
              >
                Cancel
              </button>
              <button
                onClick={captureImage}
                className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-xl"
              >
                <Camera size={32} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-surface-container-low rounded-xl p-6 flex items-center justify-center gap-4 border border-outline-variant/5"
          >
            <Loader2 className="animate-spin text-primary" size={20} />
            <span className="text-sm font-headline uppercase tracking-widest font-semibold text-primary">Analyzing Item...</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-surface-container-low rounded-xl p-6 flex items-center justify-between gap-4 border border-error/20"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="text-error" size={20} />
              <span className="text-xs text-on-surface-variant">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-[10px] uppercase font-bold tracking-widest text-error hover:underline transition-all">Try Again</button>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-surface-container-high rounded-xl p-8 relative overflow-hidden group border border-outline-variant/10">
              <div className={`absolute top-0 left-0 w-1 h-full ${result.category === 'WET' ? 'bg-primary' : result.category === 'DRY' ? 'bg-secondary' : 'bg-tertiary'}`}></div>
              <div className="flex justify-between items-start mb-12">
                {getCategoryIcon(result.category)}
                <span className={`font-headline text-[10px] px-3 py-1 rounded-full uppercase tracking-widest ${
                  result.category === 'WET' ? 'bg-primary/10 text-primary' : 
                  result.category === 'DRY' ? 'bg-secondary/10 text-secondary' : 
                  'bg-tertiary/10 text-tertiary'
                }`}>
                  Identified
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-3xl font-headline font-bold tracking-tight text-on-surface">{result.name}</h3>
                <ArrowRight className="text-on-surface-variant" size={16} />
              </div>
              <p className={`${getCategoryColor(result.category)} text-5xl font-headline font-extrabold tracking-tighter uppercase`}>
                {result.category}
              </p>
              <div className="mt-8 pt-6 border-t border-outline-variant/10">
                <p className="text-on-surface-variant text-xs leading-relaxed">{result.description}</p>
              </div>
            </div>

            <div className="bg-surface-container-high rounded-xl p-8 border border-outline-variant/10 flex flex-col justify-center">
              <h4 className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold mb-4">Disposal Instructions</h4>
              <p className="text-xl font-headline font-semibold text-on-surface mb-6">
                {result.disposalMethod}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence * 100}%` }}
                    className={`h-full ${getCategoryColor(result.category).replace('text-', 'bg-')}`}
                  />
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant">{(result.confidence * 100).toFixed(1)}% Confidence</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Anchor */}
      <section className="mt-20">
        <div className="relative h-64 rounded-3xl overflow-hidden group border border-outline-variant/10">
          <img
            src="/hero.jpg"
            alt="Sustainability"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8">
            <h2 className="text-3xl font-headline font-bold mb-2 text-on-surface">Sustainable AI</h2>
            <p className="text-on-surface-variant max-w-md">Reducing landfill waste through hyper-accurate classification and real-time guidance.</p>
          </div>
        </div>
      </section>

      {/* Floating Action Button (Mobile) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 bg-primary text-on-primary w-14 h-14 rounded-full shadow-2xl shadow-black/60 flex items-center justify-center z-50 md:hidden"
        onClick={startCamera}
      >
        <Camera size={24} />
      </motion.button>
    </div>
  );
}
