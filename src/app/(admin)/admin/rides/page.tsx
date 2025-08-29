
'use client';

import { RideHistoryTable } from "@/components/ride-history-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminRidesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Rides</CardTitle>
        <CardDescription>View history of all rides in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <RideHistoryTable />
      </CardContent>
    </Card>
  )
}
