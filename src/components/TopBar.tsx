import { Aperture, User, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-outline-variant/10">
      <div className="flex items-center gap-2">
        <Aperture className="text-primary" size={24} />
        <span className="text-xl font-bold tracking-tighter text-on-surface font-headline">SegregateRight</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <nav className="flex gap-6 text-on-surface/60 font-headline tracking-tight">
          <NavLink to="/" className={({ isActive }) => `transition-colors hover:text-primary ${isActive ? 'text-primary font-semibold' : ''}`}>Classify</NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `transition-colors hover:text-primary ${isActive ? 'text-primary font-semibold' : ''}`}>Analytics</NavLink>
          <NavLink to="/history" className={({ isActive }) => `transition-colors hover:text-primary ${isActive ? 'text-primary font-semibold' : ''}`}>History</NavLink>
          <NavLink to="/guide" className={({ isActive }) => `transition-colors hover:text-primary ${isActive ? 'text-primary font-semibold' : ''}`}>Guide</NavLink>
        </nav>
        <div className="w-px h-6 bg-outline-variant/30"></div>
        <button className="text-on-surface/60 hover:text-primary transition-colors">
          <User size={24} />
        </button>
      </div>

      <div className="md:hidden">
        <button onClick={onMenuClick} className="p-2 -mr-2 text-on-surface hover:text-primary transition-colors">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
