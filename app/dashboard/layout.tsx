import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StoreProvider } from "@/lib/store";

export const metadata = {
  title: "SupplyTrack — Supplier Management",
  description:
    "Manage projects, suppliers and costs in one place. Track budgets, payments and supplier performance.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <SidebarProvider className="[--header-height:calc(--spacing(14))]">
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </StoreProvider>
  );
}
