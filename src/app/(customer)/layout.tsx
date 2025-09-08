
import { CustomerHeader } from "@/components/customer-header";
import { CustomerSidebar } from "@/components/customer-sidebar";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-sidebar md:block">
               <CustomerSidebar />
            </div>
            <div className="flex flex-col">
                <Sheet>
                    <CustomerHeader />
                    <SheetContent side="left" className="p-0 flex flex-col sm:max-w-xs bg-sidebar">
                        <SheetTitle className="sr-only">Customer Menu</SheetTitle>
                        <SheetDescription className="sr-only">Main navigation menu for the customer portal.</SheetDescription>
                        <CustomerSidebar />
                    </SheetContent>
                </Sheet>
                 <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 relative">
                    {children}
                </main>
            </div>
        </div>
    )
}
