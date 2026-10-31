import { Link } from "react-router-dom";
import {
  MapPin, ShieldCheck, Radio, Bell, History, Lock, Smartphone, UserCheck, Share2, ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const features = [
  { icon: Radio, title: "Live GPS updates", text: "Watch a marker move in real time over secure WebSockets, with a movement path and last-updated time." },
  { icon: UserCheck, title: "Consent first", text: "Nobody can see your location unless you approve them. Revoke access instantly, any time." },
  { icon: Bell, title: "Emergency SOS", text: "One tap sends your coordinates to your emergency contacts and tracks the request status." },
  { icon: History, title: "Sharing history", text: "Review who viewed your sessions and when, with access restricted to you and approved contacts." },
  { icon: Lock, title: "Secure by design", text: "OTP verification, hashed passwords, JWT auth, rate limiting and server-side permission checks." },
  { icon: ShieldCheck, title: "Admin oversight", text: "Audit logs, active sessions and alert monitoring for administrators." },
];

const steps = [
  { icon: Smartphone, title: "Register & verify", text: "Sign up with your mobile number and confirm it with a one-time SMS code." },
  { icon: Share2, title: "Invite your contacts", text: "Send a sharing request. Your contact must accept before anything is shared." },
  { icon: MapPin, title: "Share live location", text: "Allow browser location access, start a session, and stop whenever you like." },
];

function MapPreview() {
  return (
    <div className="relative rounded-2xl glass p-3 shadow-2xl shadow-electric-500/10">
      <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden bg-navy-800
        [background-image:linear-gradient(rgba(77,148,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(77,148,255,.08)_1px,transparent_1px)]
        [background-size:36px_36px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
          <path d="M30 250 C 100 200, 140 230, 190 160 S 300 120, 360 50" fill="none" stroke="#4d94ff" strokeWidth="3" strokeDasharray="6 6" />
        </svg>
        <div className="absolute" style={{ left: "90%", top: "17%" }}>
          <span className="absolute -inset-1 rounded-full bg-electric-500 animate-ping2" />
          <span className="relative block h-4 w-4 rounded-full bg-electric-400 ring-4 ring-electric-500/30" />
        </div>
        <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-2 text-xs">
          <p className="text-slate-400">Sharing session</p>
          <p className="font-semibold text-emerald-400">● Active (with consent)</p>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-slate-500">Illustrative preview, not live data</p>
    </div>
  );
}

export default function Landing() {
  return (
    <div id="top">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-electric-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 grid gap-12 lg:grid-cols-2 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-electric-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Consent-based. Always.
            </span>
            <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Share your live location with the people{" "}
              <span className="bg-gradient-to-r from-electric-400 to-cyan-300 bg-clip-text text-transparent">you trust</span>.
            </h1>
            <p className="mt-5 text-lg text-slate-400 max-w-xl">
              TrackNexa lets verified users voluntarily share real-time GPS location and movement with approved contacts, with instant revocation and one-tap emergency alerts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="inline-flex items-center gap-2 rounded-xl bg-electric-500 hover:bg-electric-600 px-6 py-3 font-semibold text-white transition shadow-lg shadow-electric-500/30">
                Start Tracking <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#how" className="rounded-xl glass px-6 py-3 font-semibold text-white hover:bg-white/10 transition">
                See how it works
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              A phone number alone can never reveal anyone's location. Sharing requires sign-in, approval and active location permission.
            </p>
          </div>
          <div className="animate-fade-up [animation-delay:150ms]"><MapPreview /></div>
        </div>
      </section>

      <section id="features" className="py-20 bg-navy-900/60">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center">Everything you need, nothing hidden</h2>
          <p className="mt-3 text-center text-slate-400 max-w-2xl mx-auto">Built for safety and transparency from the first line of code.</p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-navy-800/60 p-6 hover:border-electric-500/50 hover:-translate-y-1 transition">
                <div className="h-11 w-11 rounded-xl bg-electric-500/15 grid place-items-center text-electric-400"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-20">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center">How it works</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="relative rounded-2xl glass p-6">
                <span className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-electric-500 grid place-items-center text-sm font-bold text-white">{i + 1}</span>
                <Icon className="h-6 w-6 text-electric-400" />
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="privacy" className="pb-20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="rounded-2xl border border-electric-500/30 bg-gradient-to-br from-electric-500/10 to-transparent p-8 text-center">
            <ShieldCheck className="h-8 w-8 text-electric-400 mx-auto" />
            <h2 className="mt-3 text-2xl font-bold text-white">Your location is yours</h2>
            <p className="mt-3 text-slate-400">
              TrackNexa has no covert tracking and no phone-number lookup. Every share is opt-in, visible to you, revocable instantly, and recorded in an audit log.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
