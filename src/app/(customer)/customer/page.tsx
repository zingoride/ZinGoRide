
import { RideBookingForm } from "@/components/ride-booking-form";
import { AvailableRides } from "@/components/available-rides";
import Image from "next/image";

export default function CustomerPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-4rem)]">
            <div className="md:col-span-2 relative bg-muted hidden md:block">
                 <Image
                    src="https://picsum.photos/seed/customermap/1600/1200"
                    alt="Map of city"
                    fill
                    style={{objectFit:"cover"}}
                    data-ai-hint="city map"
                />
                 <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <p className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-lg">Live Map Placeholder</p>
                </div>
            </div>
            <div className="col-span-1 bg-background p-4 flex flex-col gap-4 overflow-y-auto">
                <RideBookingForm />
                <AvailableRides />
            </div>
        </div>
    );
}
