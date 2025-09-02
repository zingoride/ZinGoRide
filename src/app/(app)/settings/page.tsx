
'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "next-themes";

const translations = {
  ur: {
    settings: "Settings",
    display: "Display",
    displayDesc: "Apni pasand ke mutabiq application ki theme chunein.",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    languageTitle: "Zubaan (Language)",
    languageDesc: "Application ke liye apni pasandeeda zubaan chunein.",
    languageLabel: "Language",
    selectLanguage: "Zubaan chunein",
    saveButton: "Tabdeelian Mehfooz Karein",
    saveSuccessTitle: "Changes Saved",
    saveSuccessDesc: "Aapki tabdeelian mehfooz kar li gayi hain.",
  },
  en: {
    settings: "Settings",
    display: "Display",
    displayDesc: "Choose the application's theme according to your preference.",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    languageTitle: "Language",
    languageDesc: "Choose your preferred language for the application.",
    languageLabel: "Language",
    selectLanguage: "Select Language",
    saveButton: "Save Changes",
    saveSuccessTitle: "Changes Saved",
    saveSuccessDesc: "Your changes have been saved successfully.",
  },
};

export default function SettingsPage() {
    const { toast } = useToast();
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const t = translations[language];

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSave = () => {
        toast({
            title: t.saveSuccessTitle,
            description: t.saveSuccessDesc,
        });
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-2xl font-bold">{t.settings}</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>{t.display}</CardTitle>
                    <CardDescription>{t.displayDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <Label htmlFor="theme">{t.theme}</Label>
                        <RadioGroup 
                            value={theme} 
                            onValueChange={setTheme}
                            className="grid grid-cols-3 gap-4"
                        >
                            <div>
                                <RadioGroupItem value="light" id="light" className="peer sr-only" />
                                <Label htmlFor="light" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    {t.light}
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                                <Label htmlFor="dark" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    {t.dark}
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="system" id="system" className="peer sr-only" />
                                <Label htmlFor="system" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    {t.system}
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t.languageTitle}</CardTitle>
                    <CardDescription>{t.languageDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2">
                        <Label htmlFor="language">{t.languageLabel}</Label>
                        <Select value={language} onValueChange={(value) => setLanguage(value as 'ur' | 'en')}>
                            <SelectTrigger>
                                <SelectValue placeholder={t.selectLanguage} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ur">Urdu</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
            
            <div className="border-t pt-4">
                <Button onClick={handleSave} className="w-full md:w-auto">{t.saveButton}</Button>
            </div>
        </div>
    )
}
