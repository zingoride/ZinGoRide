import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RideHistoryTable } from "@/components/ride-history-table";

export default function HistoryPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Ride History</CardTitle>
          <CardDescription>Aap ki tamam pichli rides ki tafseelat.</CardDescription>
        </CardHeader>
        <CardContent>
          <RideHistoryTable />
        </CardContent>
      </Card>
    </div>
  );
}
