import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircle2Icon,
  MapPinIcon,
} from "lucide-react"

import { PageHero } from "@/components/site/page-hero"
import { Reveal } from "@/components/site/reveal"
import { company, projects } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Construction and fit-out projects by Sombe Holding Company Limited, including schools and hospitals across Dar es Salaam.",
}

const [first, second, ...rest] = projects

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={
        status === "Completed"
          ? "rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white"
          : "bg-brand text-ink rounded-full px-3 py-1 text-xs font-bold"
      }
    >
      {status}
    </span>
  )
}

function SplitProject({
  project,
  flip,
}: {
  project: (typeof projects)[number]
  flip?: boolean
}) {
  const gallery = "gallery" in project ? project.gallery : undefined
  return (
    <article
      className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
        flip ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="relative">
        <Image
          src={project.image}
          alt={project.title}
          width={1280}
          height={960}
          className="h-80 w-full rounded-2xl object-cover md:h-105"
        />
        {gallery && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {gallery.slice(0, 2).map((src) => (
              <Image
                key={src}
                src={src}
                alt={`${project.title}, additional site photo`}
                width={640}
                height={480}
                className="h-36 w-full rounded-xl object-cover md:h-44"
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} />
          <span className="text-ink-soft text-sm">{project.category}</span>
        </div>
        <h2 className="text-ink mt-4 text-3xl font-bold tracking-tighter md:text-4xl">
          {project.title}
        </h2>
        <p className="text-ink-soft mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
          <span className="flex items-center gap-1.5">
            <MapPinIcon className="text-brand-strong size-4" />
            {project.location}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="text-brand-strong size-4" />
            {project.year}
          </span>
        </p>
        <p className="text-ink-soft mt-5 text-lg leading-relaxed">
          {project.description}
        </p>
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {project.features.map((feature) => (
            <li
              key={feature}
              className="text-ink flex items-center gap-2.5 text-sm font-medium"
            >
              <CheckCircle2Icon className="text-brand-strong size-4 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        title="Our"
        highlight="projects"
        description="Schools, hospitals and institutional buildings across Dar es Salaam, built, renovated and fitted out by our own teams."
      />

      {/* Two spotlighted projects */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4 md:gap-28 md:px-6">
          <Reveal>
            <SplitProject project={first} />
          </Reveal>
          <Reveal>
            <SplitProject project={second} flip />
          </Reveal>
        </div>
      </section>

      {/* Remaining projects as cards */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-12">
            <h2 className="text-ink text-3xl font-bold tracking-tighter md:text-4xl">
              More from our sites
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {rest.map((project, i) => (
              <Reveal key={project.id} delay={i * 100}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/8 bg-white">
                  <div className="relative h-56">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <StatusBadge status={project.status} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-ink text-lg leading-snug font-bold">
                      {project.title}
                    </h3>
                    <p className="text-ink-soft mt-1.5 text-sm">
                      {project.location} · {project.year}
                    </p>
                    <p className="text-ink-soft mt-3 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </article>
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
              Planning something similar?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Tell us about your school, hospital or commercial project and we
              will prepare an itemised quotation.
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
