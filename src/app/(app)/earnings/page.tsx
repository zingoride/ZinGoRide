import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EarningsChart } from "@/components/earnings-chart";
import { DollarSign, Goal, Wallet } from "lucide-react";

export default function EarningsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aaj Ki Kamai</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 4,250</div>
            <p className="text-xs text-muted-foreground">
              +15% pichle din se
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Is Haftay Ki Kamai</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 21,800</div>
            <p className="text-xs text-muted-foreground">
              +8% pichle haftay se
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Haftawar Had</CardTitle>
            <Goal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 30,000</div>
            <p className="text-xs text-muted-foreground mb-2">
              72% hadaf mukammal
            </p>
            <Progress value={72} aria-label="72% complete" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Kamai Ka Jaiza</CardTitle>
            <CardDescription>Pichle 7 dinon ki kamai.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <EarningsChart />
          </CardContent>
        </Card>
        <div className="hidden xl:block"></div>
      </div>
    </div>
  );
}
