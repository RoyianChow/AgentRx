"use client"

import { useEffect } from "react"
import Script from "next/script"
import { CalendarDays, CheckCircle2, Clock, ShieldCheck } from "lucide-react"

const CALENDLY_URL = "https://calendly.com/rmanicorporate/new-meeting"

type CalendlyWindow = Window & {
  Calendly?: {
    initPopupWidget: (options: { url: string }) => void
  }
}

export function ContactForm() {
  useEffect(() => {
    const href = "https://assets.calendly.com/assets/external/widget.css"

    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = href
      document.head.appendChild(link)
    }
  }, [])

  function openCalendly() {
    const calendlyWindow = window as CalendlyWindow

    if (calendlyWindow.Calendly) {
      calendlyWindow.Calendly.initPopupWidget({
        url: CALENDLY_URL,
      })
      return
    }

    window.open(CALENDLY_URL, "_blank", "noopener,noreferrer")
  }

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
          <CalendarDays className="h-4 w-4" />
          Book a meeting
        </div>

        <div className="mt-6 space-y-3">
          <h3 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Schedule time with Royian
          </h3>

          <p className="text-sm leading-6 text-slate-600 sm:text-base">
            Pick a time that works for you to discuss AgentRx, pharmacy workflow
            automation, demos, partnerships, or implementation questions.
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Clock className="mt-0.5 h-5 w-5 text-slate-700" />
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Fast scheduling
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Choose an available time directly through Calendly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-slate-700" />
            <div>
              <p className="text-sm font-semibold text-slate-950">
                No email setup needed
              </p>
              <p className="mt-1 text-sm text-slate-600">
                This version does not use Resend or a contact API route.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-700" />
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Simple demo flow
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Visitors can book a meeting without submitting a separate form.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openCalendly}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
        >
          <CalendarDays className="h-4 w-4" />
          Schedule time with Royian
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-slate-500">
          You will be redirected to Calendly if the popup does not load.
        </p>
      </div>
    </>
  )
}