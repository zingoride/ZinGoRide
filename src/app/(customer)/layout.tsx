
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { CustomerHeader } from "@/components/customer-header";
import { CustomerSidebar } from "@/components/customer-sidebar";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <Sidebar>
                <CustomerSidebar />
            </Sidebar>
            <SidebarInset>
                <CustomerHeader />
                <main className="flex-1">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
