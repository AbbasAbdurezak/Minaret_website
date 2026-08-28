import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  description: "Manage Minaret Engineering website content, projects, images, and gallery."
};

export default async function AdminPage() {
  if (!(await getAdminSession())) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
