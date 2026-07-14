import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter,
  HeadContent, Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#F8FAFC", padding: "0 16px" }}>
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <h1 style={{ fontSize: 72, fontWeight: 800, color: "#0F172A", margin: 0 }}>404</h1>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 8 }}>Page not found</h2>
        <p style={{ fontSize: 14, color: "#64748B", marginTop: 8 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ marginTop: 20 }}>
          <Link to="/" className="erp-btn erp-btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "root" }); }, [error]);
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Something went wrong</h1>
        <p style={{ fontSize: 14, color: "#64748B" }}>An unexpected error occurred loading this page.</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
          <button className="erp-btn erp-btn-primary" onClick={() => { router.invalidate(); reset(); }}>Try again</button>
          <a className="erp-btn erp-btn-outline" href="/">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "KDM SHM ERP — Structural Health Monitoring PMS" },
      { name: "description", content: "Enterprise ERP for managing Structural Health Monitoring projects on Indian Railway bridges." },
      { property: "og:title", content: "KDM SHM ERP" },
      { property: "og:description", content: "Structural Health Monitoring Project Management System" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
