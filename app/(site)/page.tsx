import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  CheckCircle2Icon,
  MapPinIcon,
} from "lucide-react"

import { Counter } from "@/components/site/counter"
import { Reveal } from "@/components/site/reveal"
import { ServiceIcon } from "@/components/site/service-icon"
import { clients, company, projects, services, stats } from "@/lib/site-data"

const featuredProject = projects[0]
const gridProjects = projects.slice(1, 5)

export default function HomePage() {
  return (
    <>
      {/* Hero: split text / photo */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-stretch gap-0 px-4 pt-16 md:px-6 md:pt-[72px] lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col justify-center py-16 pr-0 lg:py-24 lg:pr-16">
            <Reveal>
              <h1 className="text-ink text-[2.6rem] leading-[1.05] font-bold tracking-tighter md:text-6xl">
                Quality in every detail.{" "}
                <span className="text-brand-strong">
                  Efficiency in every delivery.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-ink-soft mt-6 max-w-xl text-lg leading-relaxed">
                We build schools, hospitals and homes across Dar es Salaam, and
                supply the materials that keep projects moving.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="bg-ink hover:bg-steel inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-[15px] font-semibold text-white transition-all duration-200 [transition-timing-function:var(--ease-snap)] active:scale-[0.98]"
                >
                  Get a Quote
                  <ArrowRightIcon className="size-4" />
                </Link>
                <Link
                  href="/projects"
                  className="text-ink hover:border-ink/40 inline-flex h-12 items-center justify-center rounded-lg border border-black/15 bg-white px-6 text-[15px] font-semibold transition-all duration-200 [transition-timing-function:var(--ease-snap)] active:scale-[0.98]"
                >
                  View Our Projects
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={150} className="relative hidden lg:block">
            <div className="absolute inset-0 my-10 overflow-hidden rounded-2xl">
              <Image
                src="/projects/door-installation.jpg"
                alt="Sombe Holdings carpenters installing a hardwood door at Kivule Hospital"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 0px"
                className="object-cover"
              />
              <div className="absolute right-4 bottom-4 left-4 rounded-xl bg-white/92 p-4 backdrop-blur-sm">
                <p className="text-ink text-sm font-semibold">
                  Hardwood door installation, Kivule Hospital
                </p>
                <p className="text-ink-soft mt-0.5 text-xs">
                  Supplied, fitted and finished by our own team
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Mobile hero image */}
        <div className="relative mx-4 mb-10 h-64 overflow-hidden rounded-2xl lg:hidden">
          <Image
            src="/projects/door-installation.jpg"
            alt="Sombe Holdings carpenters installing a hardwood door at Kivule Hospital"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Client logo wall */}
      <section className="border-y border-black/8 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-9 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6 md:justify-between">
            <p className="text-ink-soft text-sm font-medium">
              Trusted by institutions and industry
            </p>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
              {clients.map((client) => (
                <Image
                  key={client.name}
                  src={client.logo}
                  alt={client.name}
                  width={120}
                  height={48}
                  className="h-12 w-auto object-contain opacity-80 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services bento */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-12 max-w-2xl">
            <h2 className="text-ink text-3xl font-bold tracking-tighter md:text-5xl">
              Two sides of one promise
            </h2>
            <p className="text-ink-soft mt-4 text-lg leading-relaxed">
              We construct buildings and we supply the materials they are made
              of. Six services, one accountable partner.
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const img = "image" in service ? service.image : undefined
              return (
                <Reveal key={service.slug} delay={(i % 3) * 100}>
                  {img ? (
                    <Link
                      href="/services"
                      className="group relative block h-full min-h-72 overflow-hidden rounded-2xl"
                    >
                      <Image
                        src={img}
                        alt={service.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 [transition-timing-function:var(--ease-snap)] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                      <div className="absolute right-5 bottom-5 left-5">
                        <h3 className="flex items-center justify-between text-lg font-bold text-white">
                          {service.title}
                          <ArrowUpRightIcon className="size-5 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-white/80">
                          {service.description}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div className="h-full rounded-2xl border border-black/8 bg-white p-7">
                      <div className="bg-brand/15 mb-5 flex size-12 items-center justify-center rounded-xl">
                        <ServiceIcon
                          name={service.icon}
                          className="text-brand-strong size-6"
                        />
                      </div>
                      <h3 className="text-ink text-lg font-bold">
                        {service.title}
                      </h3>
                      <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                        {service.description}
                      </p>
                      <ul className="mt-4 space-y-1.5">
                        {service.features.slice(0, 3).map((feature) => (
                          <li
                            key={feature}
                            className="text-ink-soft flex items-center gap-2 text-sm"
                          >
                            <span className="bg-brand-strong size-1 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* About + team + stats */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <div className="relative">
                <Image
                  src="/team.jpg"
                  alt="The Sombe Holdings team on site, in front of newly installed hardwood doors"
                  width={960}
                  height={1280}
                  className="max-h-[560px] w-full rounded-2xl object-cover object-top"
                />
              </div>
            </Reveal>
            <Reveal delay={150}>
              <h2 className="text-ink text-3xl font-bold tracking-tighter md:text-5xl">
                The team behind the work
              </h2>
              <p className="text-ink-soft mt-5 leading-relaxed">
                Sombe Holding Company Limited is a Dar es Salaam construction
                and supply company. We begin every project by identifying the
                exact quantity, quality and specification of materials needed,
                then source, negotiate and deliver so the site never waits.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Own carpentry and fitting crews",
                  "Vetted supplier network",
                  "Transparent quotations",
                  "After-handover support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle2Icon className="text-brand-strong size-5 shrink-0" />
                    <span className="text-ink text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>

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

              <Link
                href="/about"
                className="text-ink mt-8 inline-flex items-center gap-2 text-[15px] font-semibold underline-offset-4 hover:underline"
              >
                More about us
                <ArrowRightIcon className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-ink text-3xl font-bold tracking-tighter md:text-5xl">
              Recent work
            </h2>
            <Link
              href="/projects"
              className="text-ink inline-flex items-center gap-2 text-[15px] font-semibold underline-offset-4 hover:underline"
            >
              All projects
              <ArrowRightIcon className="size-4" />
            </Link>
          </Reveal>

          <Reveal>
            <Link
              href="/projects"
              className="group relative mb-5 block h-105 overflow-hidden rounded-2xl"
            >
              <Image
                src={featuredProject.image}
                alt={featuredProject.title}
                fill
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-snap)] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="bg-brand text-ink absolute top-6 left-6 rounded-full px-3 py-1 text-xs font-bold">
                {featuredProject.status}
              </span>
              <div className="absolute right-6 bottom-6 left-6 md:right-10 md:bottom-8 md:left-10">
                <h3 className="text-2xl font-bold text-white md:text-3xl">
                  {featuredProject.title}
                </h3>
                <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80">
                  <span className="flex items-center gap-1.5">
                    <MapPinIcon className="size-4" />
                    {featuredProject.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="size-4" />
                    {featuredProject.year}
                  </span>
                  <span>{featuredProject.category}</span>
                </p>
              </div>
            </Link>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {gridProjects.map((project, i) => (
              <Reveal key={project.id} delay={i * 90}>
                <Link
                  href="/projects"
                  className="group relative block h-64 overflow-hidden rounded-2xl"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 [transition-timing-function:var(--ease-snap)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                  <div className="absolute right-4 bottom-4 left-4">
                    <h3 className="text-[15px] leading-snug font-bold text-white">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/75">
                      {project.category} · {project.year}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-steel py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tighter text-white md:text-5xl">
              Have a project or a supply list?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Send us the details and we will respond with a clear, itemised
              quotation. {company.hours[0].days}, {company.hours[0].time}.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="bg-brand text-ink inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-[15px] font-bold transition-all duration-200 [transition-timing-function:var(--ease-snap)] hover:brightness-105 active:scale-[0.98]"
              >
                Get a Quote
                <ArrowRightIcon className="size-4" />
              </Link>
              <a
                href={`tel:${company.phoneHref}`}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/25 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 active:scale-[0.98]"
              >
                Call {company.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
