import { useState } from "react";

function AuthForm({ onRegister, onLogin, message }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegisterClick() {
    await onRegister({ email, password });
  }

  async function handleLoginClick() {
    await onLogin({ email, password });
  }

  return (
    <div className="card">
      <h2>Login / Register</h2>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        placeholder="Password (min 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="row">
        <button type="button" onClick={handleRegisterClick}>
          Register
        </button>
        <button type="button" onClick={handleLoginClick}>
          Login
        </button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AuthForm;
