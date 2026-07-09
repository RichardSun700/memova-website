import {
  CalendarCheck,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const productCapabilities = [
  "Record or transcribe meeting notes",
  "Organize notes, photos, videos, and files into Projects",
  "Generate visual overviews and shareable webpages",
  "Ask Memova questions about personal workspace content",
  "Prepare approved actions such as emails and calendar events",
];

export default function AppDisclosureSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 text-[var(--memova-navy)] md:py-20">
      <div className="absolute left-1/2 top-0 h-64 w-[640px] -translate-x-1/2 rounded-full bg-blue-50/70 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:items-stretch">
        <div className="rounded-3xl border border-[#E8EEF7] bg-[#F8FAFF] p-6 shadow-sm md:p-8 lg:col-span-5">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
            <Sparkles className="h-3.5 w-3.5" />
            Product overview
          </div>

          <h2 className="font-display text-3xl font-bold tracking-tight text-[#0F172A] md:text-4xl">
            What Memova does
          </h2>

          <p className="mt-4 text-[13px] font-medium leading-relaxed text-[#475569]">
            Memova is an AI workspace for capturing notes, organizing project
            materials, and turning personal context into useful visual
            overviews, shareable webpages, and approved actions.
          </p>

          <div className="mt-6 space-y-3">
            {productCapabilities.map(capability => (
              <div
                key={capability}
                className="flex items-start gap-3 text-[12px] font-bold text-[#475569]"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <span>{capability}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8EEF7] bg-white p-6 shadow-sm md:p-8 lg:col-span-7">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Google data use
          </div>

          <h2 className="font-display text-3xl font-bold tracking-tight text-[#0F172A] md:text-4xl">
            Google account and Workspace access
          </h2>

          <p className="mt-4 text-[13px] font-medium leading-relaxed text-[#475569]">
            Memova uses Google sign-in to help users securely access their
            account and identify their workspace. When users choose to connect
            Google Workspace features, Memova may request access to Gmail and
            Google Calendar only for user-approved actions.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="text-[14px] font-bold text-[#0F172A]">Gmail</h3>
              <p className="mt-2 text-[11px] font-medium leading-relaxed text-[#64748B]">
                Gmail access is used to help users draft, review, and send
                emails from Memova when they choose that action.
              </p>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-white text-indigo-600">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <h3 className="text-[14px] font-bold text-[#0F172A]">
                Google Calendar
              </h3>
              <p className="mt-2 text-[11px] font-medium leading-relaxed text-[#64748B]">
                Calendar access is used to help users create or update calendar
                events from Memova when they choose that action.
              </p>
            </div>
          </div>

          <p className="mt-5 text-[12px] font-medium leading-relaxed text-[#64748B]">
            Memova does not use Google user data for advertising or unrelated
            purposes. Google data is used only to provide the requested Memova
            features, and actions such as sending an email or creating a
            calendar event require user authorization and user-confirmed intent.
          </p>
        </div>
      </div>
    </section>
  );
}
