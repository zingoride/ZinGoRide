import Image from "next/image";
import { MapPin, DollarSign, Clock, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function RideRequest() {
  return (
    <Card className="overflow-hidden shadow-lg">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Nayi Ride Ki Darkhwast
          </CardTitle>
          <CardDescription>Ride ID: #ZR-86572</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            Mustarad Karein
          </Button>
          <Button size="sm" className="h-8 gap-1 bg-green-600 hover:bg-green-700">
            Qubool Karein
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-64 md:h-96">
          <Image
            src="https://picsum.photos/1200/800"
            alt="Ride map"
            fill
            className="object-cover"
            data-ai-hint="map route"
          />
        </div>
        <div className="p-6 text-sm">
          <div className="grid gap-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-primary mr-3" />
              <div className="flex-1">
                <p className="font-semibold text-muted-foreground">Uthanay ki Jagah</p>
                <p className="font-medium">Saddar, Karachi</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground mx-4" />
              <div className="flex-1 text-right">
                <p className="font-semibold text-muted-foreground">Manzil</p>
                <p className="font-medium">Clifton, Karachi</p>
              </div>
              <MapPin className="h-5 w-5 text-accent ml-3" />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-semibold text-muted-foreground">Andazan Kiraya</p>
                  <p className="font-medium">PKR 450.00</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-semibold text-muted-foreground">Pohanchne ka Waqt</p>
                  <p className="font-medium">8 Minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
