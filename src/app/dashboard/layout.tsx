import DashboardLayout from "~/components/dashboard/DashboardLayout";
import AuthGuard from "~/components/auth/AuthGuard";

// Suppress root Navbar/Footer — same pattern as /learn
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
