import { useState } from "react";
import { api } from "../services/api";

const box = { maxWidth: 420, margin: "40px auto", padding: 32, borderRadius: 20, background: "#111827", color: "#fff", border: "1px solid #1f2937" };
const input = { width: "100%", padding: 14, marginBottom: 14, borderRadius: 10, border: "1px solid #1e293b", background: "#0b1a38", color: "#fff", boxSizing: "border-box" };
const btn = { width: "100%", padding: 14, borderRadius: 10, border: 0, background: "#2d7bff", color: "#fff", fontWeight: 700, cursor: "pointer", marginBottom: 12 };
const ghost = { ...btn, background: "transparent", border: "1px solid #2d7bff", color: "#2d7bff" };
const link = { background: "none", border: 0, color: "#4d90ff", cursor: "pointer", padding: 0 };

export default function Login() {
  const [mode, setMode] = useState("choose");
  const [f, setF] = useState({ name: "", phone: "", password: "", code: "" });
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const go = (m) => { setMode(m); setErr(""); setInfo(""); };

  const done = (data) => {
    localStorage.setItem("tn_auth", JSON.stringify(data));
    window.location.href = "/dashboard";
  };

  const run = (fn) => async (e) => {
    e.preventDefault();
    setErr("");
    try { await fn(); }
    catch (x) { setErr(x.response?.data?.message || "Cannot reach the server. Is the backend running?"); }
  };

  const login = run(async () => {
    const { data } = await api.post("/auth/login", { phone: f.phone, password: f.password });
    done(data);
  });
  const register = run(async () => {
    const { data } = await api.post("/auth/register", { name: f.name, phone: f.phone, password: f.password });
    setInfo("Demo OTP: " + data.otp); setMode("otp");
  });
  const verify = run(async () => {
    const { data } = await api.post("/auth/verify-otp", { phone: f.phone, code: f.code });
    done(data);
  });
  const forgot = run(async () => {
    const { data } = await api.post("/auth/forgot-password", { phone: f.phone });
    setInfo("Demo OTP: " + data.otp); setMode("reset");
  });
  const reset = run(async () => {
    await api.post("/auth/reset-password", { phone: f.phone, code: f.code, password: f.password });
    setF({ ...f, password: "", code: "" }); go("login"); setInfo("Password updated. Please sign in.");
  });

  const msg = (
    <div>
      {err && <p style={{ color: "#ff6b6b" }}>{err}</p>}
      {info && <p style={{ color: "#6ee7a8" }}>{info}</p>}
    </div>
  );
  const back = <p><button type="button" style={link} onClick={() => go("choose")}>← Back</button></p>;

  return (
    <div style={box}>
      <h1 style={{ marginTop: 0 }}>Track<span style={{ color: "#4d90ff" }}>Nexa</span></h1>

      {mode === "choose" && (
        <div>
          <h2>Welcome</h2>
          {msg}
          <button style={btn} onClick={() => go("login")}>Sign in</button>
          <button style={ghost} onClick={() => go("register")}>Sign up</button>
        </div>
      )}

      {mode === "login" && (
        <form onSubmit={login}>
          <h2>Sign in</h2>
          <input style={input} placeholder="Phone number" value={f.phone} onChange={set("phone")} />
          <input style={input} type="password" placeholder="Password" value={f.password} onChange={set("password")} />
          {msg}
          <button style={btn}>Sign in</button>
          <p><button type="button" style={link} onClick={() => go("forgot")}>Forgot password?</button></p>
          <p>No account? <button type="button" style={link} onClick={() => go("register")}>Sign up</button></p>
          {back}
        </form>
      )}

      {mode === "register" && (
        <form onSubmit={register}>
          <h2>Create your account</h2>
          <input style={input} placeholder="Name" value={f.name} onChange={set("name")} />
          <input style={input} placeholder="Phone number" value={f.phone} onChange={set("phone")} />
          <input style={input} type="password" placeholder="Password" value={f.password} onChange={set("password")} />
          {msg}
          <button style={btn}>Send OTP</button>
          <p>Already have an account? <button type="button" style={link} onClick={() => go("login")}>Sign in</button></p>
          {back}
        </form>
      )}

      {mode === "otp" && (
        <form onSubmit={verify}>
          <h2>Enter OTP</h2>
          <input style={input} placeholder="6-digit code" value={f.code} onChange={set("code")} />
          {msg}
          <button style={btn}>Verify</button>
        </form>
      )}

      {mode === "forgot" && (
        <form onSubmit={forgot}>
          <h2>Forgot password</h2>
          <input style={input} placeholder="Phone number" value={f.phone} onChange={set("phone")} />
          {msg}
          <button style={btn}>Send OTP</button>
          {back}
        </form>
      )}

      {mode === "reset" && (
        <form onSubmit={reset}>
          <h2>Reset password</h2>
          <input style={input} placeholder="6-digit code" value={f.code} onChange={set("code")} />
          <input style={input} type="password" placeholder="New password" value={f.password} onChange={set("password")} />
          {msg}
          <button style={btn}>Update password</button>
        </form>
      )}
    </div>
  );
}
