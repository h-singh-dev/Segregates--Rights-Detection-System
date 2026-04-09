import { History as HistoryIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ClassificationHistory } from "../types";

export default function History() {
  const [history, setHistory] = useState<ClassificationHistory[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('segregate_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('segregate_history');
    setHistory([]);
  };

  const getCategoryColor = (cat: string) => {
    if (cat === 'WET') return 'bg-primary/10 text-primary border-primary/20';
    if (cat === 'DRY') return 'bg-secondary/10 text-secondary border-secondary/20';
    return 'bg-tertiary/10 text-tertiary border-tertiary/20';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <section className="mb-12 flex justify-between items-end">
        <div>
          <p className="text-primary font-headline text-[0.6875rem] font-semibold uppercase tracking-[0.2em] mb-4">Your log</p>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter leading-tight text-on-surface">
            Classification <span className="text-primary italic">History</span>
          </h1>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 text-error hover:bg-error/10 px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
          >
            <Trash2 size={16} />
            <span>Clear</span>
          </button>
        )}
      </section>

      {history.length === 0 ? (
        <div className="bg-surface-container-low rounded-xl p-16 flex flex-col items-center justify-center border border-outline-variant/10 text-center">
          <HistoryIcon className="text-on-surface-variant/50 mb-6" size={48} />
          <h2 className="text-xl font-headline font-semibold text-on-surface mb-2">No history yet</h2>
          <p className="text-on-surface-variant">Classify some items on the home page to see them here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(entry => (
            <div key={entry.id} className="bg-surface-container-high rounded-xl p-4 md:p-6 border border-outline-variant/10 flex flex-col md:flex-row gap-6 items-start md:items-center">
              {entry.imageUrl ? (
                <img src={entry.imageUrl} alt="Scanned item" className="w-20 h-20 rounded-lg object-cover" />
              ) : (
                <div className="w-20 h-20 bg-surface-container-lowest rounded-lg flex items-center justify-center font-headline font-bold text-2xl text-on-surface-variant">
                  {entry.item.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-headline font-bold text-on-surface">{entry.item.name}</h3>
                  <span className="text-xs text-on-surface-variant/60 font-mono">
                    {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className={`inline-block px-3 py-1 mb-3 rounded-full text-xs font-bold font-headline uppercase tracking-widest border ${getCategoryColor(entry.item.category)}`}>
                  {entry.item.category} ({(entry.item.confidence * 100).toFixed(0)}%)
                </div>
                <p className="text-sm text-on-surface-variant">{entry.item.disposalMethod}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
