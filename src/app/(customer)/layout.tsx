
import { CustomerHeader } from "@/components/customer-header";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <CustomerHeader />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
