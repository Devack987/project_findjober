import { useState } from "react";
import { supabase } from "../../../core/storage/supabase";
import "./loginPage.css"

type Mode = "login" | "register" | "forgot";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage({ type: "success", text: "Connexion réussie !" });
      } else if (mode === "register") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ type: "success", text: "Vérifie ton email pour confirmer ton compte." });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage({ type: "success", text: "Email de réinitialisation envoyé." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        {/* Logo / Brand */}
        <div className="auth-brand">
          <div className="auth-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="currentColor" />
              <path d="M8 14h12M14 8v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="auth-brand-name">FindJober</span>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1>
            {mode === "login" && "Content de vous revoir !"}
            {mode === "register" && "Créer un compte"}
            {mode === "forgot" && "Mot de passe oublié"}
          </h1>
          <p>
            {mode === "login" && "Connecte-toi à ton espace."}
            {mode === "register" && "Commence gratuitement."}
            {mode === "forgot" && "On t'envoie un lien de réinitialisation."}
          </p>
        </div>

        {/* OAuth */}
        {mode !== "forgot" && (
          <>
            <button className="btn-google" onClick={handleGoogle} type="button">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continuer avec Google
            </button>

            <div className="auth-divider">
              <span>ou</span>
            </div>
          </>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="toi@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode !== "forgot" && (
            <div className="field">
              <label htmlFor="password">
                Mot de passe
                {mode === "login" && (
                  <button type="button" className="link-inline" onClick={() => setMode("forgot")}>
                    Oublié ?
                  </button>
                )}
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          )}

          {message && (
            <div className={`auth-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="spinner" /> : (
              <>
                {mode === "login" && "Se connecter"}
                {mode === "register" && "Créer mon compte"}
                {mode === "forgot" && "Envoyer le lien"}
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <p className="auth-footer">
          {mode === "login" && (
            <>Pas encore de compte ?{" "}
              <button className="link" onClick={() => setMode("register")}>S'inscrire</button>
            </>
          )}
          {mode === "register" && (
            <>Déjà inscrit ?{" "}
              <button className="link" onClick={() => setMode("login")}>Se connecter</button>
            </>
          )}
          {mode === "forgot" && (
            <button className="link" onClick={() => setMode("login")}>← Retour à la connexion</button>
          )}
        </p>
      </div>
    </div>
  );
}