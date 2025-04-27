
export default function StatsSection() {
  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="flex flex-col items-center justify-center space-y-2 border-b pb-4 md:border-b-0 md:border-r md:pb-0">
            <h3 className="text-4xl font-bold text-primary">30+</h3>
            <p className="text-center text-muted-foreground">Free Tools</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 border-b pb-4 md:border-b-0 md:border-r md:pb-0">
            <h3 className="text-4xl font-bold text-primary">100%</h3>
            <p className="text-center text-muted-foreground">Free to Use</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 border-b pb-4 md:border-b-0 md:border-r md:pb-0">
            <h3 className="text-4xl font-bold text-primary">0</h3>
            <p className="text-center text-muted-foreground">Sign-ups Required</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold text-primary">24/7</h3>
            <p className="text-center text-muted-foreground">Availability</p>
          </div>
        </div>
      </div>
    </section>
  );
}
