
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function CustomerSettingsPage() {
    const { toast } = useToast();

    const handleSave = () => {
        toast({
            title: "Changes Saved",
            description: "Aapki tabdeelian mehfooz kar li gayi hain.",
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-6 overflow-auto p-4 md:p-6">
                <h1 className="text-2xl font-bold">Settings</h1>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Display</CardTitle>
                        <CardDescription>Apni pasand ke mutabiq application ki theme chunein.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <Label htmlFor="theme">Theme</Label>
                            <RadioGroup defaultValue="light" className="grid grid-cols-3 gap-4">
                                <div>
                                    <RadioGroupItem value="light" id="light" className="peer sr-only" />
                                    <Label htmlFor="light" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                        Light
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                                    <Label htmlFor="dark" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                        Dark
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="system" id="system" className="peer sr-only" />
                                    <Label htmlFor="system" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                        System
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Zubaan (Language)</CardTitle>
                        <CardDescription>Application ke liye apni pasandeeda zubaan chunein.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <Label htmlFor="language">Language</Label>
                            <Select defaultValue="ur">
                                <SelectTrigger>
                                    <SelectValue placeholder="Zubaan chunein" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ur">Urdu</SelectItem>
                                    <SelectItem value="en">English</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="border-t p-4">
                <Button onClick={handleSave} className="w-full">Tabdeelian Mehfooz Karein</Button>
            </div>
        </div>
    )
}
