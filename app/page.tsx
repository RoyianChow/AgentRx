import Link from "next/link"
import type { ReactNode } from "react"
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  HeartPulse,
  LockKeyhole,
  Mail,
  MessageSquareText,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Workflow,
  Zap,
} from "lucide-react"
import Image from "next/image"

import logo from "@/public/AgentRx.png"
const navItems = [
  { label: "Vision", href: "#vision" },
  { label: "Platform", href: "#platform" },
  { label: "Manifesto", href: "#manifesto" },
  { label: "Safety", href: "#safety" },
  { label: "Contact", href: "#contact" },
]

const problemCards = [
  {
    title: "Administrative overload",
    description:
      "Refills, intake, patient questions, insurance issues, and follow-ups consume valuable staff time every day.",
  },
  {
    title: "Delayed patient support",
    description:
      "Patients often wait for answers about medication availability, refill status, instructions, or next steps.",
  },
  {
    title: "Fragmented workflows",
    description:
      "Pharmacy teams work across disconnected systems, slowing down operations and increasing complexity.",
  },
  {
    title: "Limited scalability",
    description:
      "Traditional pharmacy operations struggle to grow without adding more staff, more manual work, and more cost.",
  },
]

const platformFeatures = [
  {
    icon: MessageSquareText,
    title: "AI Patient Intake",
    description:
      "Capture prescription requests, refill needs, medication questions, and support issues through web, chat, voice, or forms.",
  },
  {
    icon: ClipboardCheck,
    title: "Prescription Workflow Support",
    description:
      "Organize incoming requests, flag missing information, and prepare routine tasks for pharmacist review.",
  },
  {
    icon: Bot,
    title: "Patient Communication Agents",
    description:
      "Automate refill reminders, pickup updates, support responses, and post-visit follow-ups.",
  },
  {
    icon: ShieldCheck,
    title: "Human Review Queue",
    description:
      "Route clinical, sensitive, or high-risk tasks to licensed professionals before action is taken.",
  },
  {
    icon: Workflow,
    title: "Operational Automation",
    description:
      "Connect intake, triage, reminders, escalations, and reporting into one intelligent workflow layer.",
  },
  {
    icon: HeartPulse,
    title: "Public Health Insights",
    description:
      "Track recurring patient needs, medication access gaps, service bottlenecks, and workflow performance.",
  },
]

const safetyCards = [
  {
    icon: Users,
    title: "Human-in-the-loop",
    description:
      "AI agents support pharmacy teams while licensed professionals remain responsible for clinical decisions.",
  },
  {
    icon: LockKeyhole,
    title: "Privacy-conscious design",
    description:
      "Built with secure data handling, access control, and healthcare privacy expectations in mind.",
  },
  {
    icon: ClipboardCheck,
    title: "Audit-ready workflows",
    description:
      "Actions, messages, escalations, and workflow events can be logged for visibility and accountability.",
  },
  {
    icon: ShieldCheck,
    title: "Clear escalation paths",
    description:
      "Sensitive, urgent, or uncertain situations are designed to be routed to human review.",
  },
]

const investorPoints = [
  "Large healthcare operations problem",
  "Clear automation opportunity",
  "Human oversight remains central",
  "Expandable platform model",
]

function SectionBadge({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
      <Sparkles className="h-4 w-4" />
      {children}
    </div>
  )
}

function PrimaryButton({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  )
}

function SecondaryButton({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
    >
      {children}
    </Link>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Bot
  title: string
  description: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center  text-white shadow-slate-900/20">
            <Image
  src={logo}
  alt="AgentRx logo"
  width={80}
  height={80}
  className=""
/>
                        </div>
            <div>
              <p className="text-lg font-bold tracking-tight">AgentRx</p>
              <p className="text-xs font-medium text-slate-500">
                Agent-native pharmacy
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            >
              Login
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_30%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-32">
          <div>
            <SectionBadge>Building the future of pharmacy infrastructure</SectionBadge>

            <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Building the first{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                agent-native pharmacy.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              AgentRx is creating AI-powered pharmacy infrastructure designed to
              automate operational workflows, support patients faster, reduce
              administrative burden, and help pharmacy teams focus on safer,
              more accessible care.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="#contact">Book a Demo</PrimaryButton>
              <SecondaryButton href="#vision">Explore the Vision</SecondaryButton>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
                <p className="text-2xl font-bold text-slate-950">24/7</p>
                <p className="mt-1 text-sm text-slate-600">Patient support workflows</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
                <p className="text-2xl font-bold text-slate-950">Human-led</p>
                <p className="mt-1 text-sm text-slate-600">Clinical oversight</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
                <p className="text-2xl font-bold text-slate-950">AI-native</p>
                <p className="mt-1 text-sm text-slate-600">Operating layer</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-200/60 via-cyan-100/70 to-slate-200/70 blur-2xl" />

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
              <div className="border-b border-slate-200 bg-slate-950 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">AgentRx Console</p>
                    <h2 className="mt-1 text-xl font-semibold">
                      Pharmacy Workflow Intelligence
                    </h2>
                  </div>
                  <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    Live Preview
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-950">
                          AI Intake Agent
                        </h3>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          Ready
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        New refill request captured. Missing insurance detail
                        detected. Patient follow-up drafted for review.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <Stethoscope className="h-5 w-5 text-cyan-600" />
                      <p className="font-semibold">Review Queue</p>
                    </div>
                    <p className="text-3xl font-bold">18</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Items prepared for pharmacist review
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <Zap className="h-5 w-5 text-emerald-600" />
                      <p className="font-semibold">Automations</p>
                    </div>
                    <p className="text-3xl font-bold">72%</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Routine workflow coverage
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-300" />
                    <p className="font-semibold">Safety Escalation</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Sensitive medication question detected. Routed to licensed
                    professional before patient response.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="max-w-3xl">
          <SectionBadge>The problem</SectionBadge>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Pharmacies are becoming the front door of healthcare.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Pharmacy teams are being asked to handle more patients, more
            medication complexity, more communication, and more operational
            work. But the tools supporting them have not kept up.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {problemCards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-950">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="vision" className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-emerald-300">
                <Building2 className="h-4 w-4" />
                The vision
              </div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                From software-assisted pharmacy to agent-native pharmacy.
              </h2>
            </div>

            <div>
              <p className="text-lg leading-8 text-slate-300">
                An agent-native pharmacy is not just a pharmacy with a chatbot.
                It is a pharmacy operation where intelligent agents coordinate
                routine workflows, assist staff, communicate with patients,
                surface risks, and help every prescription move through the
                system with greater speed and clarity.
              </p>

              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="grid gap-3 text-sm font-medium text-slate-300 md:grid-cols-5">
                  {[
                    "Patient Request",
                    "AI Intake",
                    "Workflow Automation",
                    "Pharmacist Review",
                    "Patient Follow-Up",
                  ].map((step, index) => (
                    <div key={step} className="flex items-center gap-3 md:block">
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                        {index + 1}
                      </div>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-6 text-sm leading-6 text-slate-400">
                AgentRx is building the intelligence layer for this new model.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionBadge>The platform</SectionBadge>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            A pharmacy operating layer powered by AI agents.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            AgentRx helps pharmacies automate routine operational work while
            preserving human oversight for clinical and sensitive decisions.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section
        id="manifesto"
        className="relative overflow-hidden bg-emerald-50 py-24"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.16),transparent_35%)]" />

        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <SectionBadge>Public health manifesto</SectionBadge>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            The future of pharmacy should be faster, safer, more accessible, and
            more human.
          </h2>

          <div className="mx-auto mt-10 max-w-3xl space-y-6 text-left text-lg leading-8 text-slate-700">
            <p>
              We believe AI should not replace care. It should remove the
              friction that keeps care from reaching people on time.
            </p>
            <p>
              We believe patients deserve clear answers, timely support, and
              better access to medication guidance.
            </p>
            <p>
              We believe pharmacists should spend less time buried in repetitive
              administrative work and more time using their clinical judgment.
            </p>
            <p>
              We believe automation in healthcare must be responsible,
              transparent, privacy-conscious, and designed around human
              oversight.
            </p>
            <p className="font-semibold text-slate-950">
              AgentRx exists to build a new layer of public health
              infrastructure for medication access, pharmacy operations, and
              patient support.
            </p>
          </div>
        </div>
      </section>

      <section id="safety" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionBadge>Trust and safety</SectionBadge>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Built for oversight, accountability, and responsible automation.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              AgentRx is designed around a human-in-the-loop model where AI
              agents support pharmacy operations while professionals remain in
              control of clinical decisions, patient safety, and final review.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {safetyCards.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <SectionBadge>For partners and investors</SectionBadge>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Infrastructure for the next generation of pharmacy.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              AgentRx is not building another pharmacy tool. We are building the
              operating layer for agent-native pharmacy workflows: intake,
              communication, automation, review, and patient engagement.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
            <h3 className="text-xl font-bold text-slate-950">
              Why this matters now
            </h3>

            <div className="mt-6 space-y-4">
              {investorPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="font-medium text-slate-700">{point}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-sm leading-6 text-slate-300">
                Built for independent pharmacies, pharmacy chains, clinics,
                healthcare operators, and the future of community health
                infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionBadge>Contact</SectionBadge>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Partner with us to build the future of pharmacy.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              We are looking to connect with pharmacy operators, healthcare
              partners, investors, and early collaborators who believe pharmacy
              can become more intelligent, accessible, and patient-centered.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <Mail className="h-5 w-5 text-emerald-600" />
                <span className="font-medium">hello@agentrx.ai</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Building2 className="h-5 w-5 text-emerald-600" />
                <span className="font-medium">
                  Pharmacy pilots, partnerships, and investment conversations
                </span>
              </div>
            </div>
          </div>

          <form className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Work email
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Company name"
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Interest
                </label>
                <select className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-950">
                  <option>Book a demo</option>
                  <option>Pharmacy pilot</option>
                  <option>Partnership</option>
                  <option>Investment conversation</option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-slate-700">
                Message
              </label>
              <textarea
                placeholder="Tell us what you are interested in..."
                rows={5}
                className="mt-2 w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
              />
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
            >
              Request Intro
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              This form is ready for UI. Connect it to Resend, HubSpot,
              Calendly, or your CRM when your backend route is ready.
            </p>
          </form>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-950">
              <Image
  src={logo}
  alt="AgentRx logo"
  width={80}
  height={80}
  className=""
/>              </div>
              <div>
                <p className="text-lg font-bold tracking-tight">AgentRx</p>
                <p className="text-xs font-medium text-slate-400">
                  Agent-native pharmacy infrastructure
                </p>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              Building intelligent, human-supervised pharmacy infrastructure for
              safer operations and better patient access.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Product</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link href="#vision" className="block hover:text-white">
                Vision
              </Link>
              <Link href="#platform" className="block hover:text-white">
                Platform
              </Link>
              <Link href="#safety" className="block hover:text-white">
                Safety
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link href="#contact" className="block hover:text-white">
                Contact
              </Link>
              <Link href="#contact" className="block hover:text-white">
                Book a Demo
              </Link>
              <Link href="/login" className="block hover:text-white">
                Login
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link href="/privacy" className="block hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block hover:text-white">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} AgentRx. All rights reserved.
        </div>
      </footer>
    </main>
  )
}