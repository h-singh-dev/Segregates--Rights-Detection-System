import { BookOpen } from "lucide-react";

export default function Guide() {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="mb-16">
        <p className="text-primary font-headline text-[0.6875rem] font-semibold uppercase tracking-[0.2em] mb-4">Learn the rules</p>
        <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter leading-tight text-on-surface">
          Waste Disposal <span className="text-primary italic">Guide</span>
        </h1>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-high rounded-xl p-8 border-l-4 border-primary">
          <h3 className="text-2xl font-headline font-bold text-on-surface mb-4">WET</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
            Compostable organic waste (e.g., food scraps, banana peels, coffee grounds).
          </p>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">01</div>
        </div>
        
        <div className="bg-surface-container-high rounded-xl p-8 border-l-4 border-secondary">
          <h3 className="text-2xl font-headline font-bold text-on-surface mb-4">DRY</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
            Recyclable non-organic waste (e.g., paper, plastic bottles, cardboard).
          </p>
          <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">02</div>
        </div>

        <div className="bg-surface-container-high rounded-xl p-8 border-l-4 border-tertiary">
          <h3 className="text-2xl font-headline font-bold text-on-surface mb-4">HAZARD</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
            Toxic or chemical waste requiring special disposal (e.g., batteries, electronics).
          </p>
          <div className="h-12 w-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary font-bold">03</div>
        </div>
      </div>
    </div>
  );
}
