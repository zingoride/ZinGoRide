
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
               <AdminSidebar />
            </div>
            <div className="flex flex-col">
                <Sheet>
                    <AdminHeader />
                    <SheetContent side="left" className="p-0 flex flex-col sm:max-w-xs">
                        <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                        <SheetDescription className="sr-only">Main navigation menu for the admin portal.</SheetDescription>
                        <AdminSidebar />
                    </SheetContent>
                </Sheet>
                 <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
