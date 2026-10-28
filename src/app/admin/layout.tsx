import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prince CFA Admin",
  description: "Panneau d'administration officiel Prince CFA Ouagadougou",
  manifest: "/admin-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Prince CFA Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-portal min-h-screen bg-[#fbfbfc] text-zinc-900 selection:bg-gold selection:text-white">
      {children}
    </div>
  );
}
