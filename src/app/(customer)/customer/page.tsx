
import { RideBookingForm } from "@/components/ride-booking-form";
import { AvailableRides } from "@/components/available-rides";
import Image from "next/image";

export default function CustomerPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-4rem)]">
            <div className="md:col-span-1 bg-muted hidden md:flex items-center justify-center p-8">
                 <div className="w-full h-full relative shadow-lg rounded-lg overflow-hidden">
                    <Image
                        src="https://picsum.photos/seed/customermap/1600/1200"
                        alt="Map of city"
                        fill
                        style={{objectFit:"cover"}}
                        data-ai-hint="city map"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <p className="text-white text-sm font-semibold bg-black/50 px-3 py-1.5 rounded-md">Live Map Placeholder</p>
                    </div>
                </div>
            </div>
            <div className="col-span-1 bg-background p-4 flex flex-col gap-4 overflow-y-auto">
                <RideBookingForm />
                <AvailableRides />
            </div>
        </div>
    );
}
