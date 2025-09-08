
import { SidebarNav } from "@/components/sidebar-nav";
import { Header } from "@/components/header";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { LocationPermissionProvider } from "@/context/LocationPermissionContext";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <LocationPermissionProvider>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-sidebar md:block">
                <SidebarNav />
                </div>
                <div className="flex flex-col">
                    <Sheet>
                        <Header />
                        <SheetContent side="left" className="flex flex-col p-0 sm:max-w-xs bg-sidebar">
                            <SheetTitle className="sr-only">Rider Menu</SheetTitle>
                            <SheetDescription className="sr-only">Main navigation menu for the rider portal.</SheetDescription>
                            <SidebarNav />
                        </SheetContent>
                    </Sheet>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </LocationPermissionProvider>
    )
}
