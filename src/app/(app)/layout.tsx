
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/sidebar-nav";
import { Header } from "@/components/header";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Sheet>
                 <Header />
                 <SheetContent side="left" className="flex flex-col p-0">
                    <SidebarNav />
                </SheetContent>
            </Sheet>
            <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                {children}
            </main>
        </div>
    )
}
