import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";
import { LogOut, Radio, Square, UserPlus, Eye, Check, X } from "lucide-react";
import Logo from "../components/Logo.jsx";
import { api, API_URL } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const dot = L.divIcon({
  className: "",
  html: '<div style="width:16px;height:16px;border-radius:9999px;background:#4d94ff;box-shadow:0 0 0 6px rgba(77,148,255,.3)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function Follow({ pos }) {
  const map = useMap();
  useEffect(() => { if (pos) map.setView(pos, Math.max(map.getZoom(), 16)); }, [pos, map]);
  return null;
}

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [rel, setRel] = useState({ incoming: [], outgoing: [] });
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [sharing, setSharing] = useState(false);
  const [watching, setWatching] = useState(null);
  const [tracks, setTracks] = useState({});
  const sock = useRef(null);
  const geo = useRef(null);
  const last = useRef(0);

  const loadRel = useCallback(async () => {
    try { const { data } = await api.get("/sharing"); setRel(data); } catch {}
  }, []);

  const addPoint = useCallback((p) => setTracks((t) => {
    const cur = t[p.userId] || { path: [] };
    return { ...t, [p.userId]: { ...cur, path: [...cur.path, [p.latitude, p.longitude]].slice(-500), at: p.recordedAt, active: true } };
  }), []);

  useEffect(() => {
    loadRel();
    const s = io(API_URL, { auth: { token } });
    sock.current = s;
    s.on("sharing:changed", loadRel);
    s.on("location", addPoint);
    s.on("sharing:status", ({ userId, active }) =>
      setTracks((t) => (t[userId] ? { ...t, [userId]: { ...t[userId], active } } : t)));
    s.on("presence", ({ userId, online }) =>
      setTracks((t) => ({ ...t, [userId]: { path: [], ...t[userId], online } })));
    s.on("access:revoked", ({ sharerId }) => { setWatching((w) => (w === sharerId ? null : w)); loadRel(); });
    return () => s.disconnect();
  }, [token, loadRel, addPoint]);

  async function sendRequest(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/sharing/request", { phone });
      setMsg(data.message);
      setPhone("");
    } catch (e) { setMsg(e.response?.data?.error || "Request failed"); }
  }
  const act = (path, id) => api.post(`/sharing/${path}`, { id }).then(loadRel);

  function watch(id) {
    sock.current.emit("watch", id, async (r) => {
      if (!r?.ok) return setMsg("You are not allowed to watch this person.");
      setWatching(id);
      const { data } = await api.get(`/location/history/${id}`);
      const path = data.points.map((p) => [p.latitude, p.longitude]);
      setTracks((t) => ({ ...t, [id]: { ...t[id], path, at: data.points.at(-1)?.recordedAt, active: path.length > 0 } }));
    });
  }

  async function startSharing() {
    if (!navigator.geolocation) return setMsg("This browser has no geolocation.");
    try { await api.post("/location/start"); } catch { return setMsg("Could not start a session."); }
    geo.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const now = Date.now();
        if (now - last.current < 3000) return;
        last.current = now;
        const { latitude, longitude, accuracy } = pos.coords;
        addPoint({ userId: user.id, latitude, longitude, recordedAt: new Date().toISOString() });
        try { await api.post("/location/update", { latitude, longitude, accuracy }); } catch {}
      },
      (err) => setMsg(err.code === 1 ? "Location permission denied. Allow it in the browser." : "Could not get your location."),
      { enableHighAccuracy: true, maximumAge: 0 }
    );
    setSharing(true);
  }
  async function stopSharing() {
    navigator.geolocation.clearWatch(geo.current);
    setSharing(false);
    await api.post("/location/stop");
    setTracks((t) => ({ ...t, [user.id]: { ...t[user.id], active: false } }));
  }

  const focus = watching ?? (sharing ? user.id : null);
  const tr = focus ? tracks[focus] : null;
  const pos = tr?.path?.length ? tr.path[tr.path.length - 1] : null;
  const card = "rounded-2xl glass p-5";
  const btn = "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition";

  return (
    <div className="min-h-screen">
      <header className="h-16 px-5 flex items-center justify-between border-b border-white/10 bg-navy-900">
        <Logo />
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-300 hidden sm:block">{user.name} · {user.phone}</span>
          <button onClick={logout} className="flex items-center gap-1 text-slate-400 hover:text-white"><LogOut className="h-4 w-4" /> Log out</button>
        </div>
      </header>

      <main className="p-5 grid gap-5 lg:grid-cols-[380px_1fr]">
        <div className="space-y-5">
          <section className={card}>
            <h2 className="font-semibold text-white">My location sharing</h2>
            <p className={`mt-1 text-sm ${sharing ? "text-emerald-400" : "text-slate-400"}`}>{sharing ? "● Sharing live with approved contacts" : "Not sharing"}</p>
            {sharing
              ? <button onClick={stopSharing} className={`${btn} mt-4 bg-red-500/90 hover:bg-red-500 text-white`}><Square className="h-4 w-4" /> Stop sharing</button>
              : <button onClick={startSharing} className={`${btn} mt-4 bg-electric-500 hover:bg-electric-600 text-white`}><Radio className="h-4 w-4" /> Start sharing</button>}
          </section>

          <section className={card}>
            <h2 className="font-semibold text-white">Request to track a number</h2>
            <form onSubmit={sendRequest} className="mt-3 flex gap-2">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Their mobile number" required
                className="flex-1 min-w-0 rounded-lg bg-navy-800 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-electric-500" />
              <button className={`${btn} bg-electric-500 hover:bg-electric-600 text-white`}><UserPlus className="h-4 w-4" /> Ask</button>
            </form>
            <p className="mt-2 text-xs text-slate-500">They must approve before you see anything.</p>
            {msg && <p className="mt-2 text-sm text-electric-400">{msg}</p>}
          </section>

          <section className={card}>
            <h2 className="font-semibold text-white">People I can track</h2>
            <ul className="mt-3 space-y-2">
              {rel.outgoing.length === 0 && <li className="text-sm text-slate-500">No requests yet.</li>}
              {rel.outgoing.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 text-sm">
                  <div><p className="text-white">{r.sharer.name}</p><p className="text-xs text-slate-500">{r.sharer.phone} · {r.status === "APPROVED" ? "approved" : "waiting for approval"}</p></div>
                  <div className="flex gap-2">
                    {r.status === "APPROVED" && <button onClick={() => watch(r.sharer.id)} className={`${btn} bg-electric-500/20 text-electric-400 hover:bg-electric-500/30`}><Eye className="h-4 w-4" /> Watch</button>}
                    <button onClick={() => act("revoke", r.id)} className={`${btn} bg-white/5 text-slate-300 hover:bg-white/10`}><X className="h-4 w-4" /></button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className={card}>
            <h2 className="font-semibold text-white">People who asked to track me</h2>
            <ul className="mt-3 space-y-2">
              {rel.incoming.length === 0 && <li className="text-sm text-slate-500">No requests.</li>}
              {rel.incoming.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 text-sm">
                  <div><p className="text-white">{r.viewer.name}</p><p className="text-xs text-slate-500">{r.viewer.phone} · {r.status.toLowerCase()}</p></div>
                  <div className="flex gap-2">
                    {r.status === "PENDING" && <button onClick={() => act("approve", r.id)} className={`${btn} bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30`}><Check className="h-4 w-4" /> Approve</button>}
                    <button onClick={() => act("revoke", r.id)} className={`${btn} bg-red-500/15 text-red-400 hover:bg-red-500/25`}>{r.status === "APPROVED" ? "Revoke" : "Decline"}</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-2xl glass p-3 flex flex-col">
          <div className="px-2 pb-3 text-sm flex flex-wrap gap-x-6 gap-y-1 text-slate-300">
            <span>Status: <b className={tr?.active ? "text-emerald-400" : "text-slate-400"}>{focus ? (tr?.active ? "Live" : "Not sharing") : "Pick someone to watch"}</b></span>
            {pos && <span>Lat/Lng: {pos[0].toFixed(5)}, {pos[1].toFixed(5)}</span>}
            {tr?.at && <span>Updated: {new Date(tr.at).toLocaleTimeString()}</span>}
            {watching && <span>{tr?.online ? "● Online" : "○ Offline"}</span>}
          </div>
          <div className="h-[60vh] lg:h-[calc(100vh-10rem)] rounded-xl overflow-hidden">
            <MapContainer center={pos || [20.5937, 78.9629]} zoom={pos ? 16 : 5} className="h-full w-full">
              <TileLayer attribution='&copy; OpenStreetMap &copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              {tr?.path?.length > 1 && <Polyline positions={tr.path} pathOptions={{ color: "#4d94ff", weight: 4 }} />}
              {pos && <Marker position={pos} icon={dot} />}
              <Follow pos={pos} />
            </MapContainer>
          </div>
        </section>
      </main>
    </div>
  );
}
