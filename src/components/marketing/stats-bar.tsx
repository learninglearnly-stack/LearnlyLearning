import { STATS } from "@/lib/constants";

export function StatsBar() {
  return (
    <section className="bg-primary text-primary-foreground -mt-8 relative z-10">
      <div className="section-container py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center ${index < STATS.length - 1 ? "md:border-primary-foreground/20 md:border-r" : ""}`}
            >
              <p className="text-3xl font-bold tracking-tight sm:text-4xl">{stat.value}</p>
              <p className="text-primary-foreground/80 mt-1 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
