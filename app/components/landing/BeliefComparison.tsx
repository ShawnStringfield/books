export function BeliefComparison() {
  const beliefs = [
    {
      commonBelief: "I must finish every book I start",
      ourTake: "Books are idea mines. Some gems are in chapter one.",
    },
    {
      commonBelief: "Reading more books = More knowledge",
      ourTake: "Deep insights > Page counts",
    },
    {
      commonBelief: "I'm behind on my reading goals",
      ourTake: "Quality highlights beat reading streaks",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Rethink Your Reading Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {beliefs.map((belief, index) => (
            <div
              key={index}
              className="group p-8 text-center border border-gray-200 dark:border-gray-800 rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <div>
                <p className="text-lg font-medium">
                  &ldquo;{belief.commonBelief}&rdquo;
                </p>
                <p className="mt-4 text-xs uppercase tracking-wider">
                  Common Belief
                </p>
              </div>

              <div>
                <p className="font-medium leading-tight my-4">
                  &ldquo;{belief.ourTake}&rdquo;
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider">
                  Our Take
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
