import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prince CFA Admin",
  description: "Panneau d'administration officiel Prince CFA Ouagadougou",
  manifest: "/admin-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Prince CFA Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark bg-[#09090b] text-white min-h-screen">
      {children}
    </div>
  );
}
