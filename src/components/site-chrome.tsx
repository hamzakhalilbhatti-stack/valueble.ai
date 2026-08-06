"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Routes that must render bare — no preloader, no header, no footer, and no
 * production WebGL scene. The asset review route needs a clean stage, or the
 * site's own orbit scene renders behind the model under test.
 */
const BARE_ROUTES = ["/orbit-material-test"];

export function SiteChrome({
  chrome,
  children,
}: {
  chrome: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some((route) => pathname?.startsWith(route));

  if (bare) return <>{children}</>;

  return <>{chrome}</>;
}
