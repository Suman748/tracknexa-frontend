import { Navigation } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-electric-400 to-electric-600 grid place-items-center shadow-lg shadow-electric-500/30">
        <Navigation className="h-5 w-5 text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight text-white">
        Track<span className="text-electric-400">Nexa</span>
      </span>
    </div>
  );
}
