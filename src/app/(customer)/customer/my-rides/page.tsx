
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RideHistoryTable } from "@/components/ride-history-table";

export default function CustomerRidesPage() {
  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>My Rides</CardTitle>
          <CardDescription>Aap ki tamam pichli rides ki tafseelat.</CardDescription>
        </CardHeader>
        <CardContent>
          <RideHistoryTable />
        </CardContent>
      </Card>
    </div>
  );
}
