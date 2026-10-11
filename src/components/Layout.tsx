import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button, cn } from "./ui";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/analyze", label: "ANALYZE" },
  { to: "/history", label: "HISTORY" },
  { to: "/settings", label: "SETTINGS" },
];

const AUTH_LINK =
  "font-mono text-[0.7rem] uppercase tracking-[0.16em] transition-colors";

function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const email = user?.email ?? "";
  const handle = email.split("@")[0] || "account";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 border border-brand-ink/30 px-2.5 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-brand-ink transition-colors hover:border-brand-ink/70"
      >
        <span
          aria-hidden
          className="flex size-4 items-center justify-center bg-mark text-[0.6rem] font-bold leading-none text-mark-ink"
        >
          {handle.slice(0, 1).toUpperCase()}
        </span>
        <span className="max-w-[9rem] truncate">{handle}</span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-50 w-64 border border-rule bg-surface"
        >
          <div className="border-b border-rule bg-field px-3 py-2">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
              Signed in as
            </p>
            <p className="mt-1 truncate font-mono text-[0.72rem] text-ink">
              {email}
            </p>
          </div>
          <Link
            to="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-3 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-soft transition-colors hover:bg-field hover:text-ink"
          >
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              void signOut();
            }}
            className="block w-full border-t border-rule px-3 py-2.5 text-left font-mono text-[0.68rem] uppercase tracking-[0.12em] text-fail transition-colors hover:bg-fail-soft"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, loading, signOut } = useAuth();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="no-print sticky top-0 z-40 border-b border-brand bg-brand">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span aria-hidden className="size-2.5 bg-mark" />
            <span className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand-ink">
              Resume Analyzer
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "border-b-2 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] transition-colors duration-150",
                    isActive
                      ? "border-mark text-brand-ink"
                      : "border-transparent text-brand-ink/60 hover:text-brand-ink",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            <span aria-hidden className="mx-2 h-5 w-px bg-brand-ink/20" />

            {!loading && user ? (
              <UserMenu />
            ) : (
              <Link
                to="/login"
                className={cn(AUTH_LINK, "px-2 text-brand-ink/70 hover:text-brand-ink")}
              >
                Sign in
              </Link>
            )}

            <Link to="/analyze" className="ml-3">
              <Button size="sm">Run a review</Button>
            </Link>
          </nav>

          <button
            className="flex size-9 items-center justify-center border border-brand-ink/40 text-brand-ink sm:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>

        {open ? (
          <nav className="border-t border-brand-soft bg-brand px-5 pb-4 pt-1 sm:hidden">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "block border-b border-brand-soft py-3 font-mono text-[0.72rem] uppercase tracking-[0.16em]",
                    isActive ? "text-mark" : "text-brand-ink/70",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            {!loading && user ? (
              <div className="py-3">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-brand-ink/50">
                  Signed in as
                </p>
                <p className="mt-1 truncate font-mono text-[0.72rem] text-brand-ink">
                  {user.email}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    void signOut();
                  }}
                  className={cn(AUTH_LINK, "mt-2 block text-fail")}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 py-3">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={cn(AUTH_LINK, "text-brand-ink/70")}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className={cn(AUTH_LINK, "text-brand-ink/70")}
                >
                  Create account
                </Link>
              </div>
            )}
          </nav>
        ) : null}
      </header>

      <main className="flex-1">
        <div key={pathname} className="animate-rise">
          <Outlet />
        </div>
      </main>

      <footer className="no-print border-t border-rule bg-paper">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Resume Analyzer — an ATS parse view of your resume</span>
          <span>Files parsed locally · account handled by Supabase</span>
        </div>
      </footer>
    </div>
  );
}
