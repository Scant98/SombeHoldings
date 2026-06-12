import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react"

import { PageHero } from "@/components/site/page-hero"
import { Reveal } from "@/components/site/reveal"
import { ServiceIcon } from "@/components/site/service-icon"
import { services } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Construction, building materials supply, timber and wood doors, project management, logistics and maintenance from Sombe Holding Company Limited.",
}

const materials = [
  "Cement & aggregates",
  "Steel & reinforcement bars",
  "Timber & formwork",
  "Roofing sheets & tiles",
  "Blocks & bricks",
  "Paints & finishes",
  "Plumbing & sanitary ware",
  "Electrical fittings",
]

const doorServices = [
  {
    title: "Design considerations",
    description:
      "The design of a wood door shapes the look and feel of a space. We advise on traditional panel, modern flush and barn styles for interior and exterior use.",
  },
  {
    title: "Installation",
    description:
      "Proper installation is crucial for doors that function correctly: measuring, fitting, attaching hardware and sealing gaps, done by our own crews.",
  },
  {
    title: "Maintenance and care",
    description:
      "After installation we help preserve the beauty and structural integrity of your doors over time with practical maintenance support.",
  },
]

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our"
        highlight="services"
        description="Comprehensive construction and supply solutions tailored to your project requirements, from groundworks to the final coat of varnish."
      />

      {/* Service grid */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const img = "image" in service ? service.image : undefined
              return (
                <Reveal key={service.slug} delay={(i % 3) * 100}>
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/8 bg-white">
                    {img && (
                      <div className="relative h-44">
                        <Image
                          src={img}
                          alt={service.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-7">
                      {!img && (
                        <div className="bg-brand/15 mb-5 flex size-12 items-center justify-center rounded-xl">
                          <ServiceIcon
                            name={service.icon}
                            className="text-brand-strong size-6"
                          />
                        </div>
                      )}
                      <h2 className="text-ink text-lg font-bold">
                        {service.title}
                      </h2>
                      <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                        {service.description}
                      </p>
                      <ul className="mt-5 space-y-2 border-t border-black/8 pt-5">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="text-ink flex items-center gap-2.5 text-sm"
                          >
                            <CheckCircle2Icon className="text-brand-strong size-4 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Wood doors specialisation */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <h2 className="text-ink text-3xl font-bold tracking-tighter md:text-4xl">
                The wood door specialists
              </h2>
              <p className="text-ink-soft mt-5 leading-relaxed">
                Solid hardwood doors are our signature. We supply and fit doors
                with timeless aesthetic appeal, durability and versatility, for
                hospitals, schools, offices and homes.
              </p>
              <div className="mt-8 flex flex-col gap-6">
                {doorServices.map((item) => (
                  <div key={item.title} className="border-l-2 border-brand pl-5">
                    <h3 className="text-ink font-bold">{item.title}</h3>
                    <p className="text-ink-soft mt-1.5 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="grid grid-cols-2 gap-4">
                <Image
                  src="/projects/kivule-doors.jpg"
                  alt="Finished double hardwood doors at Kivule Hospital"
                  width={960}
                  height={1280}
                  className="h-80 w-full rounded-2xl object-cover md:h-105"
                />
                <Image
                  src="/projects/door-installation.jpg"
                  alt="Sombe Holdings carpenters fitting a hardwood door"
                  width={954}
                  height={1280}
                  className="mt-8 h-80 w-full rounded-2xl object-cover md:h-105"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Materials we supply */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <Reveal>
              <h2 className="text-ink text-3xl font-bold tracking-tighter md:text-4xl">
                Materials we supply
              </h2>
              <p className="text-ink-soft mt-5 leading-relaxed">
                Sourced from trusted manufacturers, quality checked, and
                delivered to site when you need them. If it is not on the list,
                ask: our network is wide.
              </p>
              <Link
                href="/contact"
                className="bg-ink hover:bg-steel mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-[15px] font-semibold text-white transition-all duration-200 [transition-timing-function:var(--ease-snap)] active:scale-[0.98]"
              >
                Get a Quote
                <ArrowRightIcon className="size-4" />
              </Link>
            </Reveal>
            <Reveal delay={120}>
              <div className="grid gap-3 sm:grid-cols-2">
                {materials.map((material) => (
                  <div
                    key={material}
                    className="text-ink flex items-center gap-3 rounded-xl border border-black/8 bg-white px-5 py-4 text-sm font-medium"
                  >
                    <span className="bg-brand-strong size-1.5 shrink-0 rounded-full" />
                    {material}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
