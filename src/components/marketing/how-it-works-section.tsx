import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

export function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="section-container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Three simple steps to start learning with the perfect tutor.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div key={step.step} className="relative">
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div
                  className="bg-border absolute top-8 right-0 hidden h-0.5 w-full translate-x-1/2 md:block"
                  aria-hidden="true"
                />
              )}
              <div className="relative">
                <span className="text-primary/20 text-6xl font-bold">{step.step}</span>
                <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
