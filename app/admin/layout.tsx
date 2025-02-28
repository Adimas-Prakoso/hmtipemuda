import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin HMTI Pemuda",
  description: "Panel administrasi HMTI Pemuda",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
