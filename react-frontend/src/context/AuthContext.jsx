import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";


export function AuthProvider({ children }) {
  const [authMessage, setAuthMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const loggedIn = Boolean(token);

  async function register({ email, password }) {
    setAuthMessage("");

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthMessage(data.error || "Registration failed");
        return false;
      }

      setAuthMessage("Registered successfully! You can now log in.");
      return true;
    } catch (err) {
      console.error(err);
      setAuthMessage("Network error during registration");
      return false;
    }
  }

  async function login({ email, password }) {
    setAuthMessage("");

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthMessage(data.error || "Login failed");
        return false;
      }

      setToken(data.token);
      localStorage.setItem("token", data.token);
      setAuthMessage("");
      return true;
    } catch (err) {
      console.error(err);
      setAuthMessage("Network error during login");
      return false;
    }
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("token");
    setAuthMessage("");
  }

  return (
    <AuthContext.Provider
      value={{ token, loggedIn, authMessage, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
