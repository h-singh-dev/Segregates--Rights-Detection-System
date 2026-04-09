import { Aperture, BarChart3, History, BookOpen, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: Aperture, label: "Classify", id: "classify", path: "/" },
  { icon: BarChart3, label: "Analytics", id: "analytics", path: "/analytics" },
  { icon: History, label: "History", id: "history", path: "/history" },
  { icon: BookOpen, label: "Guide", id: "guide", path: "/guide" },
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      <aside className={`fixed left-0 top-0 h-screen w-64 z-40 flex flex-col bg-surface-container-low border-r border-on-surface/10 pt-24 pb-8 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="px-6 mb-10">
        <h2 className="text-primary font-bold font-headline">Intelligent Guardian</h2>
        <p className="text-[10px] uppercase tracking-widest font-headline text-on-surface/40">Precision Waste Logic</p>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => `px-4 py-3 mx-4 flex items-center gap-4 transition-all rounded-r-full hover:translate-x-1 active:scale-95 ${
              isActive 
                ? "bg-surface-container-high text-primary" 
                : "text-on-surface/50 hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <item.icon size={20} />
            <span className="font-headline uppercase tracking-widest text-[10px]">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 flex items-center gap-3 pt-6 border-t border-outline-variant/20">
        <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
          <img
            src="/avatar.jpg"
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs font-semibold">Alex Rivera</p>
          <p className="text-[10px] text-on-surface-variant">Pro Guardian</p>
        </div>
      </div>
    </aside>
    </>
  );
}
