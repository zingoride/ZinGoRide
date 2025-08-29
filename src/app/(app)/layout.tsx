
import { SidebarNav } from "@/components/sidebar-nav";
import { Header } from "@/components/header";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";

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
                    <SheetTitle className="sr-only">Rider Menu</SheetTitle>
                    <SheetDescription className="sr-only">Main navigation menu for the rider portal.</SheetDescription>
                    <SidebarNav />
                </SheetContent>
            </Sheet>
            <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                {children}
            </main>
        </div>
    )
}
