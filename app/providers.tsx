"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/hooks/use-auth";

export default function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
