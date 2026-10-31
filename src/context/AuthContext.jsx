import { createContext, useContext, useState } from "react";

const Ctx = createContext(null);
const read = () => { try { return JSON.parse(localStorage.getItem("tn_auth")); } catch { return null; } };

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(read);
  const login = (token, user) => {
    const a = { token, user };
    try { localStorage.setItem("tn_auth", JSON.stringify(a)); } catch {}
    setAuth(a);
  };
  const logout = () => {
    try { localStorage.removeItem("tn_auth"); } catch {}
    setAuth(null);
  };
  return <Ctx.Provider value={{ user: auth?.user, token: auth?.token, login, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
