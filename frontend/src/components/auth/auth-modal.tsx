"use client";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "motion/react";
import {
  type FormEvent,
  useState,
} from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

type AuthMode = "login" | "register";

interface AuthModalProps {
  open: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
}

export function AuthModal({
  open,
  initialMode = "login",
  onClose,
}: AuthModalProps) {
  const {
    login,
    register,
  } = useAuth();

  const [mode, setMode] =
    useState<AuthMode>(initialMode);

  const [name, setName] = useState("");
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setError(null);
    setShowPassword(false);
  }

  function handleClose() {
    if (loading) {
        return;
    }

    resetForm();
    setMode(initialMode);
    onClose();
    }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError(null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanedEmail =
      email.trim().toLowerCase();

    if (
      mode === "register" &&
      name.trim().length < 2
    ) {
      setError(
        "Please enter your full name.",
      );
      return;
    }

    if (!cleanedEmail) {
      setError(
        "Please enter your email address.",
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === "register") {
        await register({
          name: name.trim(),
          email: cleanedEmail,
          password,
        });

        toast.success(
          "Your PromptForge account is ready",
        );
      } else {
        await login({
          email: cleanedEmail,
          password,
        });

        toast.success(
          "Welcome back to PromptForge",
        );
      }

      resetForm();
      setMode(initialMode);
      onClose();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Authentication failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            aria-label="Close authentication"
            onClick={handleClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-heading"
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 16,
              scale: 0.98,
            }}
            transition={{
              duration: 0.24,
            }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d12] shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
          >
            <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              aria-label="Close authentication dialog"
              className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
            >
              <X className="size-4" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-violet-400/25 bg-violet-500/10">
                <Sparkles className="size-5 text-violet-200" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                PromptForge AI
              </p>

              <h2
                id="auth-heading"
                className="mt-2 text-2xl font-semibold tracking-tight text-white"
              >
                {mode === "login"
                  ? "Welcome back"
                  : "Create your account"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {mode === "login"
                  ? "Log in to access your private prompt history."
                  : "Save prompts, favorites, and transformations securely."}
              </p>

              <div className="mt-6 grid grid-cols-2 rounded-xl border border-white/[0.07] bg-black/25 p-1">
                <button
                  type="button"
                  onClick={() =>
                    switchMode("login")
                  }
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    mode === "login"
                      ? "bg-white/[0.08] text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Log in
                </button>

                <button
                  type="button"
                  onClick={() =>
                    switchMode("register")
                  }
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    mode === "register"
                      ? "bg-white/[0.08] text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Register
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
              >
                {mode === "register" ? (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-zinc-300">
                      Name
                    </span>

                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-600" />

                      <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                          setName(
                            event.target.value,
                          )
                        }
                        autoComplete="name"
                        disabled={loading}
                        placeholder="Your name"
                        className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-500/10"
                      />
                    </div>
                  </label>
                ) : null}

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-zinc-300">
                    Email
                  </span>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-600" />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value,
                        )
                      }
                      autoComplete="email"
                      disabled={loading}
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-zinc-300">
                    Password
                  </span>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-600" />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value,
                        )
                      }
                      autoComplete={
                        mode === "login"
                          ? "current-password"
                          : "new-password"
                      }
                      disabled={loading}
                      placeholder="Minimum 8 characters"
                      className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/30 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current,
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white/[0.05] hover:text-zinc-300"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </label>

                {error ? (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-400/20 bg-red-500/[0.07] p-3 text-sm leading-6 text-red-200"
                  >
                    {error}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  {mode === "login"
                    ? "Log in"
                    : "Create account"}
                </Button>
              </form>

              <p className="mt-5 text-center text-xs leading-5 text-zinc-600">
                Your password is securely hashed by the backend
                and is never stored as plain text.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}