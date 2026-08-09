import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Braces,
  Database,
  KeyRound,
  LockKeyhole,
  Server,
  Sparkles,
} from "lucide-react";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/health",
    description: "Check whether the FastAPI service is running.",
    auth: false,
  },
  {
    method: "GET",
    path: "/api/v1/ready",
    description:
      "Check whether the API can connect to PostgreSQL.",
    auth: false,
  },
  {
    method: "POST",
    path: "/api/v1/auth/register",
    description: "Create a new PromptForge account.",
    auth: false,
  },
  {
    method: "POST",
    path: "/api/v1/auth/login",
    description:
      "Authenticate a user and receive an access token.",
    auth: false,
  },
  {
    method: "GET",
    path: "/api/v1/auth/me",
    description: "Return the authenticated user profile.",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/v1/transform",
    description:
      "Transform a weak prompt and save it to user history.",
    auth: true,
  },
  {
    method: "GET",
    path: "/api/v1/history",
    description:
      "Return searchable prompt history for the current user.",
    auth: true,
  },
  {
    method: "GET",
    path: "/api/v1/history/{history_id}",
    description:
      "Return one complete saved transformation.",
    auth: true,
  },
  {
    method: "PATCH",
    path: "/api/v1/history/{history_id}/favorite",
    description:
      "Favorite or unfavorite an owned history record.",
    auth: true,
  },
  {
    method: "DELETE",
    path: "/api/v1/history/{history_id}",
    description:
      "Delete one history record owned by the user.",
    auth: true,
  },
];

function MethodBadge({
  method,
}: {
  method: string;
}) {
  const styles: Record<string, string> = {
    GET: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    POST: "border-blue-400/20 bg-blue-500/10 text-blue-300",
    PATCH:
      "border-amber-400/20 bg-amber-500/10 text-amber-300",
    DELETE:
      "border-red-400/20 bg-red-500/10 text-red-300",
  };

  return (
    <span
      className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${
        styles[method] ?? ""
      }`}
    >
      {method}
    </span>
  );
}

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#08080c] text-white">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to PromptForge
        </Link>

        <section className="pb-14 pt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-violet-300">
            <BookOpen className="size-3.5" />
            Developer Documentation
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            PromptForge API
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-500">
            The PromptForge backend is built with FastAPI and
            provides authentication, AI prompt transformation,
            user-specific history, favorites, health checks,
            and PostgreSQL persistence.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Server,
              label: "Backend",
              value: "FastAPI",
            },
            {
              icon: Database,
              label: "Database",
              value: "PostgreSQL",
            },
            {
              icon: Sparkles,
              label: "AI",
              value: "Gemini",
            },
            {
              icon: LockKeyhole,
              label: "Authentication",
              value: "JWT",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
              >
                <Icon className="size-5 text-violet-300" />

                <p className="mt-4 text-xs uppercase tracking-wider text-zinc-600">
                  {item.label}
                </p>

                <p className="mt-1 font-medium text-zinc-200">
                  {item.value}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mt-16">
          <div className="flex items-center gap-3">
            <Braces className="size-5 text-violet-300" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                Endpoints
              </p>

              <h2 className="mt-1 text-2xl font-medium">
                API Reference
              </h2>
            </div>
          </div>

          <div className="mt-7 overflow-hidden rounded-3xl border border-white/[0.07]">
            {endpoints.map((endpoint, index) => (
              <article
                key={`${endpoint.method}-${endpoint.path}`}
                className={`p-5 sm:p-6 ${
                  index !== endpoints.length - 1
                    ? "border-b border-white/[0.06]"
                    : ""
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-start gap-3 sm:items-center">
                    <MethodBadge method={endpoint.method} />

                    <code className="break-all text-sm text-zinc-200">
                      {endpoint.path}
                    </code>
                  </div>

                  {endpoint.auth ? (
                    <span className="flex shrink-0 items-center gap-1.5 text-xs text-amber-300">
                      <KeyRound className="size-3.5" />
                      Authentication required
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-600">
                      Public
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {endpoint.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              Authentication
            </p>

            <h2 className="mt-2 text-xl font-medium">
              Bearer authentication
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-500">
              Protected FastAPI endpoints expect a JWT in the
              Authorization header. In the PromptForge web
              application, Next.js Route Handlers read the secure
              HttpOnly session cookie and attach this header
              server-side.
            </p>

            <pre className="mt-5 overflow-x-auto rounded-2xl border border-white/[0.06] bg-black/30 p-4 text-xs leading-6 text-zinc-300">
              <code>
                {"Authorization: Bearer <access_token>"}
              </code>
            </pre>
          </article>

          <article className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              Transform request
            </p>

            <h2 className="mt-2 text-xl font-medium">
              Example payload
            </h2>

            <pre className="mt-5 overflow-x-auto rounded-2xl border border-white/[0.06] bg-black/30 p-4 text-xs leading-6 text-zinc-300">
              <code>{`{
  "prompt": "Explain machine learning"
}`}</code>
            </pre>
          </article>
        </section>

        <section className="mt-16 rounded-3xl border border-violet-400/15 bg-violet-500/[0.05] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-violet-300">
            Architecture
          </p>

          <pre className="mt-6 overflow-x-auto text-sm leading-8 text-zinc-400">
            <code>{`Browser
   ↓
Next.js
   ↓
FastAPI
   ├── Gemini API
   └── PostgreSQL`}</code>
          </pre>
        </section>
      </div>
    </main>
  );
}