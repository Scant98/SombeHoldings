import type { Metadata } from "next"
import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react"

import { PageHero } from "@/components/site/page-hero"
import { QuoteForm } from "@/components/site/quote-form"
import { Reveal } from "@/components/site/reveal"
import { company } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Sombe Holding Company Limited in Dar es Salaam for a construction or materials supply quotation.",
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Get a"
        highlight="quote"
        description="Send us your project details or supply list. We respond with a clear, itemised quotation within one working day."
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            {/* Contact details */}
            <Reveal>
              <div className="flex flex-col divide-y divide-black/8 rounded-2xl border border-black/8 bg-white px-7">
                <div className="flex items-start gap-4 py-6">
                  <PhoneIcon className="text-brand-strong mt-0.5 size-5 shrink-0" />
                  <div>
                    <h3 className="text-ink font-semibold">Call us</h3>
                    <a
                      href={`tel:${company.phoneHref}`}
                      className="text-ink-soft hover:text-ink mt-1 block text-sm transition-colors"
                    >
                      {company.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 py-6">
                  <MessageCircleIcon className="text-brand-strong mt-0.5 size-5 shrink-0" />
                  <div>
                    <h3 className="text-ink font-semibold">WhatsApp</h3>
                    <a
                      href={`https://wa.me/${company.phoneHref.replace("+", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-soft hover:text-ink mt-1 block text-sm transition-colors"
                    >
                      Message us on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 py-6">
                  <MailIcon className="text-brand-strong mt-0.5 size-5 shrink-0" />
                  <div>
                    <h3 className="text-ink font-semibold">Email</h3>
                    <a
                      href={`mailto:${company.email}`}
                      className="text-ink-soft hover:text-ink mt-1 block text-sm transition-colors"
                    >
                      {company.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 py-6">
                  <MapPinIcon className="text-brand-strong mt-0.5 size-5 shrink-0" />
                  <div>
                    <h3 className="text-ink font-semibold">Location</h3>
                    <p className="text-ink-soft mt-1 text-sm">
                      {company.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 py-6">
                  <ClockIcon className="text-brand-strong mt-0.5 size-5 shrink-0" />
                  <div>
                    <h3 className="text-ink font-semibold">Working hours</h3>
                    {company.hours.map((h) => (
                      <p key={h.days} className="text-ink-soft mt-1 text-sm">
                        {h.days}: {h.time}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Quote form */}
            <Reveal delay={120}>
              <div className="rounded-2xl border border-black/8 bg-white p-7 md:p-10">
                <h2 className="text-ink text-2xl font-bold tracking-tight">
                  Request a quotation
                </h2>
                <p className="text-ink-soft mt-1.5 mb-8 text-sm">
                  The more detail you share, the more accurate our first
                  estimate will be.
                </p>
                <QuoteForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
