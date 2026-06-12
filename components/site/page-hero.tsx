import { Reveal } from "@/components/site/reveal"

/** Typographic header for inner pages, below the fixed navbar. */
export function PageHero({
  title,
  highlight,
  description,
}: {
  title: string
  highlight?: string
  description: string
}) {
  return (
    <section className="border-b border-black/8 bg-white pt-32 pb-14 md:pt-40 md:pb-18">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal className="max-w-3xl">
          <h1 className="text-ink text-4xl font-bold tracking-tighter md:text-6xl">
            {title}{" "}
            {highlight && <span className="text-brand-strong">{highlight}</span>}
          </h1>
          <p className="text-ink-soft mt-5 max-w-2xl text-lg leading-relaxed">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
