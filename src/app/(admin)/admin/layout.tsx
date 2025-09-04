
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-sidebar md:block">
               <AdminSidebar />
            </div>
            <div className="flex flex-col">
                 <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
                     <Sheet>
                        <SheetTrigger asChild>
                            <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                            >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col p-0 sm:max-w-xs bg-sidebar">
                            <AdminSidebar />
                        </SheetContent>
                    </Sheet>
                    <div className="flex-1"></div>
                    <AdminHeader />
                </header>
                 <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
