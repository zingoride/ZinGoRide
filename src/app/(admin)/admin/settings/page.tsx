
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
import { useLogo } from "@/context/LogoContext";
import { Car, Rocket, Bike, Package2, Upload, Palette } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useThemeColor } from "@/context/ThemeColorContext";

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
    logoTitle: "Application Logo",
    logoDesc: "Poori application ke liye logo tabdeel karein.",
    saveButton: "Tabdeelian Mehfooz Karein",
    saveSuccessTitle: "Changes Saved",
    saveSuccessDesc: "Aapki tabdeelian mehfooz kar li gayi hain.",
    uploadLogo: "Logo Upload Karein",
    colorTheme: "Color Theme",
    colorThemeDesc: "Application ke liye apni pasandeeda color scheme chunein.",
    themeBlue: "Blue",
    themeGreen: "Green",
    themeOrange: "Orange",
    themeRose: "Rose",
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
    logoTitle: "Application Logo",
    logoDesc: "Change the logo for the entire application.",
    saveButton: "Save Changes",
    saveSuccessTitle: "Changes Saved",
    saveSuccessDesc: "Your changes have been saved successfully.",
    uploadLogo: "Upload Logo",
    colorTheme: "Color Theme",
    colorThemeDesc: "Choose your preferred color scheme for the application.",
    themeBlue: "Blue",
    themeGreen: "Green",
    themeOrange: "Orange",
    themeRose: "Rose",
  },
};

const logoOptions = [
    { name: 'Default', icon: Package2 },
    { name: 'Car', icon: Car },
    { name: 'Rocket', icon: Rocket },
    { name: 'Bike', icon: Bike },
];

const colorOptions = [
    { name: 'Blue', value: 'theme-blue', color: 'bg-sky-500' },
    { name: 'Green', value: 'theme-green', color: 'bg-green-500' },
    { name: 'Orange', value: 'theme-orange', color: 'bg-orange-500' },
    { name: 'Rose', value: 'theme-rose', color: 'bg-rose-500' },
]

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const { logo, setLogo, LogoComponent } = useLogo();
    const { themeColor, setThemeColor } = useThemeColor();
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
                                <RadioGroupItem value="light" id="light-admin" className="peer sr-only" />
                                <Label htmlFor="light-admin" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    {t.light}
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="dark" id="dark-admin" className="peer sr-only" />
                                <Label htmlFor="dark-admin" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    {t.dark}
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="system" id="system-admin" className="peer sr-only" />
                                <Label htmlFor="system-admin" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    {t.system}
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>{t.colorTheme}</CardTitle>
                    <CardDescription>{t.colorThemeDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup 
                        value={themeColor} 
                        onValueChange={(value) => setThemeColor(value as any)}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {colorOptions.map((option) => (
                            <div key={option.value}>
                                <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                                <Label htmlFor={option.value} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-6 w-6 rounded-full ${option.color}`} />
                                        <span>{option.name}</span>
                                    </div>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t.logoTitle}</CardTitle>
                    <CardDescription>{t.logoDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="/logo.png" alt="App Logo" />
                            <AvatarFallback>
                                <LogoComponent className="h-10 w-10" />
                            </AvatarFallback>
                        </Avatar>
                        <Button asChild variant="outline">
                            <label htmlFor="logo-upload" className="cursor-pointer">
                                <Upload className="mr-2 h-4 w-4" />
                                {t.uploadLogo}
                            </label>
                        </Button>
                        <input id="logo-upload" type="file" className="hidden" />
                    </div>

                    <RadioGroup 
                        value={logo} 
                        onValueChange={(value) => setLogo(value as any)}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {logoOptions.map(({ name, icon: Icon }) => (
                             <div key={name}>
                                <RadioGroupItem value={name} id={name.toLowerCase()} className="peer sr-only" />
                                <Label htmlFor={name.toLowerCase()} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    <Icon className="h-8 w-8 mb-2" />
                                    {name}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
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
