import Logo from "./Logo.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-900">
      <div className="mx-auto max-w-7xl px-5 py-12 grid gap-8 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-slate-400 max-w-xs">
            Consent-based, real-time location sharing for the people you trust.
          </p>
        </div>
        <div className="text-sm space-y-2">
          <h4 className="font-semibold text-white">Product</h4>
          <a href="#features" className="block text-slate-400 hover:text-white">Features</a>
          <a href="#how" className="block text-slate-400 hover:text-white">How it works</a>
          <a href="#privacy" className="block text-slate-400 hover:text-white">Privacy</a>
        </div>
        <div className="text-sm space-y-2">
          <h4 className="font-semibold text-white">Our promise</h4>
          <p className="text-slate-400">No covert tracking. No phone-number lookups. Sharing only with your explicit approval.</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} TrackNexa. All rights reserved.
      </div>
    </footer>
  );
}
