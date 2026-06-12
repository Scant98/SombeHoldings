import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightIcon,
  HandshakeIcon,
  ShieldCheckIcon,
  TargetIcon,
  UsersIcon,
} from "lucide-react"

import { Counter } from "@/components/site/counter"
import { PageHero } from "@/components/site/page-hero"
import { Reveal } from "@/components/site/reveal"
import { stats } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Sombe Holding Company Limited is a construction and building materials supply company based in Dar es Salaam, Tanzania.",
}

const values = [
  {
    icon: ShieldCheckIcon,
    title: "Quality and reliability",
    description:
      "We evaluate every supplier and material on price, quality and reliability, so what we build and what we deliver lasts.",
  },
  {
    icon: HandshakeIcon,
    title: "Lasting relationships",
    description:
      "We negotiate fair contracts and build long-term relationships with clients and suppliers, ensuring mutual success.",
  },
  {
    icon: TargetIcon,
    title: "Precision planning",
    description:
      "Every project starts with exact requirements: quantity, quality and specification, settled before work begins.",
  },
  {
    icon: UsersIcon,
    title: "People first",
    description:
      "From students in the schools we build to patients behind the doors we fit, our work serves people first.",
  },
]

const process = [
  {
    step: "01",
    title: "Identify requirements",
    description:
      "We determine the quantity, quality and specifications of materials needed for your specific project or operation.",
  },
  {
    step: "02",
    title: "Source and negotiate",
    description:
      "We source supplies, negotiate contracts and evaluate suppliers on price, quality and reliability.",
  },
  {
    step: "03",
    title: "Procure and transport",
    description:
      "Procurement, transportation and storage are managed end to end so materials move safely and efficiently.",
  },
  {
    step: "04",
    title: "Deliver and support",
    description:
      "Materials arrive exactly when needed, supporting production efficiency, cost control and client satisfaction.",
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About"
        highlight="Sombe Holdings"
        description="A construction and building materials supply company in Dar es Salaam, dedicated to transforming visions into reality through superior craftsmanship and reliable resource provision."
      />

      {/* Story */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <h2 className="text-ink text-3xl font-bold tracking-tighter md:text-4xl">
                Our story
              </h2>
              <div className="text-ink-soft mt-6 space-y-5 leading-relaxed">
                <p>
                  We supply goods, resources and materials to meet the demands
                  of particular projects, industries and markets. Our process
                  involves sourcing, procurement, transportation, storage and
                  distribution of materials to ensure they are available when
                  needed.
                </p>
                <p>
                  Effective material supply management is crucial for the
                  success of any organisation. It shapes production efficiency,
                  cost control and customer satisfaction, so we treat supply
                  with the same rigour we bring to construction.
                </p>
                <p>
                  As proficient professionals, we begin by identifying the
                  requirements for a specific project or operation: the
                  quantity, quality and specifications of materials needed.
                  Once requirements are established, we source the necessary
                  materials, negotiate contracts, evaluate suppliers on price,
                  quality and reliability, and build relationships with key
                  clients.
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <Image
                src="/projects/pugu-seminar.png"
                alt="Sombe Holdings crew constructing the seminar building at Pugu Secondary School"
                width={841}
                height={634}
                className="w-full rounded-2xl object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Team photo */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <Image
                src="/team.jpg"
                alt="Four Sombe Holdings team members in branded shirts in front of hardwood doors"
                width={960}
                height={1280}
                className="max-h-[520px] w-full rounded-2xl object-cover object-top"
              />
            </Reveal>
            <Reveal delay={150}>
              <h2 className="text-ink text-3xl font-bold tracking-tighter md:text-4xl">
                Small team, full accountability
              </h2>
              <p className="text-ink-soft mt-5 leading-relaxed">
                Our carpenters, fitters and site supervisors are our own. The
                people who quote your project are the people who stand on site,
                which keeps quality decisions fast and honest.
              </p>
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-black/8 pt-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <Counter
                      value={stat.value}
                      suffix={stat.suffix}
                      className="text-ink block text-3xl font-bold tracking-tight md:text-4xl"
                    />
                    <p className="text-ink-soft mt-1 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-12 max-w-2xl">
            <h2 className="text-ink text-3xl font-bold tracking-tighter md:text-4xl">
              What we stand for
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 90}>
                <div className="h-full rounded-2xl border border-black/8 bg-white p-7">
                  <div className="bg-brand/15 mb-5 flex size-12 items-center justify-center rounded-xl">
                    <value.icon className="text-brand-strong size-6" />
                  </div>
                  <h3 className="text-ink text-lg font-bold">{value.title}</h3>
                  <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process: numbered list */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <Reveal className="mb-12">
            <h2 className="text-ink text-3xl font-bold tracking-tighter md:text-4xl">
              How a project runs
            </h2>
          </Reveal>
          <div className="flex flex-col">
            {process.map((item, i) => (
              <Reveal key={item.step} delay={i * 80}>
                <div className="flex gap-6 border-t border-black/8 py-8 md:gap-12">
                  <span className="text-brand-strong text-xl font-bold tabular-nums md:text-2xl">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-ink text-xl font-bold">{item.title}</h3>
                    <p className="text-ink-soft mt-2 max-w-xl leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <Link
              href="/contact"
              className="bg-ink hover:bg-steel inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-[15px] font-semibold text-white transition-all duration-200 [transition-timing-function:var(--ease-snap)] active:scale-[0.98]"
            >
              Get a Quote
              <ArrowRightIcon className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
