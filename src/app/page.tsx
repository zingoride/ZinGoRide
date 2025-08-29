import { RideRequest } from "@/components/ride-request";
import { TipCalculator } from "@/components/tip-calculator";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <RideRequest />
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
        <TipCalculator />
      </div>
    </div>
  );
}
