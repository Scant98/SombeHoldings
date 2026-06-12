import Image from "next/image"
import Link from "next/link"
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"

import { company, navLinks, services } from "@/lib/site-data"

export function Footer() {
  return (
    <footer className="bg-steel text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="Sombe Holdings logo"
                width={44}
                height={44}
                className="size-11 rounded-lg"
              />
              <span className="text-lg font-bold">Sombe Holdings</span>
            </div>
            <p className="text-sm leading-relaxed text-white/65">
              {company.slogan}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              {company.tagline}
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold tracking-wide text-white/90">
              Pages
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-brand text-sm text-white/65 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold tracking-wide text-white/90">
              Services
            </h3>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href="/services"
                    className="hover:text-brand text-sm text-white/65 transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold tracking-wide text-white/90">
              Contact
            </h3>
            <ul className="space-y-3.5 text-sm text-white/65">
              <li className="flex items-center gap-3">
                <PhoneIcon className="text-brand size-4 shrink-0" />
                <a
                  href={`tel:${company.phoneHref}`}
                  className="hover:text-brand transition-colors"
                >
                  {company.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon className="text-brand size-4 shrink-0" />
                <a
                  href={`mailto:${company.email}`}
                  className="hover:text-brand transition-colors"
                >
                  {company.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPinIcon className="text-brand size-4 shrink-0" />
                {company.location}
              </li>
              <li className="flex items-start gap-3">
                <ClockIcon className="text-brand mt-0.5 size-4 shrink-0" />
                <span>
                  {company.hours[0].days}
                  <br />
                  {company.hours[0].time}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 md:flex-row">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <Link
            href="/dashboard"
            className="hover:text-brand text-sm text-white/50 transition-colors"
          >
            Staff Dashboard
          </Link>
        </div>
      </div>
    </footer>
  )
}
