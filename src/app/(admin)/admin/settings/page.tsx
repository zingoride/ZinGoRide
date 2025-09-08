
'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "next-themes";
import { useLogo } from "@/context/LogoContext";
import { Car, Rocket, Bike, Package2, Upload, Palette, Shield, Ship, Bus, Train, Plane, Bot, DollarSign, Timer, Milestone, Percent, ReceiptText, Lock, Building, Settings2, CreditCard, LifeBuoy, Phone, Mail, Link as LinkIcon, FileText, Gift, Users, Zap, PlusCircle, Trash2, Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useThemeColor } from "@/context/ThemeColorContext";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { PasswordManagementForm } from "@/components/password-management-form";
import { ProfileForm } from "@/components/profile-form";
import { Slider } from "@/components/ui/slider";

const translations = {
  ur: {
    settings: "Settings",
    adminProfile: "Admin Profile",
    adminProfileDesc: "Apni admin profile ki maloomat yahan update karein.",
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
    themeViolet: "Violet",
    themeYellow: "Yellow",
    themeLime: "Lime",
    themeCyan: "Cyan",
    themePink: "Pink",
    themeSlate: "Slate",
    templates: "Application Templates",
    templatesDesc: "Select a pre-defined template to quickly set the look and feel.",
    fareManagement: "Kiraya Ka Intezam",
    fareManagementDesc: "Mukhtalif gariyon ke liye kiraye ki settings adjust karein.",
    baseFare: "Bunyadi Kiraya (PKR)",
    perKmRate: "Fi Kilo Meter Rate (PKR)",
    perMinRate: "Fi Minute Rate (PKR)",
    fareSavedSuccess: "Kiraye ki settings mehfooz kar li gayi hain.",
    commissionManagement: "Commission & Fees",
    commissionManagementDesc: "Set commission percentage and service fees.",
    commissionRate: "Commission Rate (%)",
    serviceFee: "Service Fee (PKR)",
    passwordManagement: "Password Ka Intezam",
    passwordManagementDesc: "Apna admin password tabdeel karein.",
    appSettings: "Application Settings",
    appSettingsDesc: "Poori application ke liye aam settings.",
    appName: "Application ka Naam",
    appNamePlaceholder: "e.g., ZinGo Ride",
    appCurrency: "Application ki Currency",
    appCurrencyPlaceholder: "e.g., PKR",
    rideSettings: "Ride Settings",
    rideSettingsDesc: "Riders aur customers ke liye ride ke makhsoos options.",
    rideRequestTimeout: "Ride Request Timeout (seconds)",
    rideRequestTimeoutDesc: "Driver ko request accept karne ke liye kitna waqt milna chahiye.",
    enableAiTips: "AI Tip Suggestions ko Enable Karein",
    enableAiTipsDesc: "Drivers ko AI-powered tip suggestions dikhayein.",
    paymentSettings: "Payment Settings",
    paymentSettingsDesc: "Customers ke liye dastyab payment methods manage karein.",
    enableCash: "Enable Cash Payments",
    enableWallet: "Enable Wallet Payments",
    supportSettings: "Support Settings",
    supportSettingsDesc: "Users ke liye support contact information set karein.",
    supportPhone: "Support Phone Number",
    supportEmail: "Support Email Address",
    securityCompliance: "Security & Compliance",
    securityComplianceDesc: "Manage privacy, terms, and data policies.",
    privacyPolicyUrl: "Privacy Policy URL",
    termsOfServiceUrl: "Terms of Service URL",
    dataRetentionDays: "Data Retention (Days)",
    dataRetentionDesc: "How many days to keep user data before anonymization.",
    referralProgram: "Referral Program",
    referralProgramDesc: "Manage referral bonuses and settings.",
    enableReferrals: "Enable Referral Program",
    referrerBonus: "Referrer Bonus (PKR)",
    inviteeBonus: "Invitee Bonus (PKR)",
    surgePricing: "Surge Pricing",
    surgePricingDesc: "Manage surge multiplier and conditions.",
    enableSurge: "Enable Surge Pricing",
    surgeMultiplier: "Surge Multiplier",
    surgeThreshold: "Surge Threshold (%)",
    surgeThresholdDesc: "Percentage of busy drivers to trigger surge.",
    vehicleManagement: "Vehicle Type Management",
    vehicleManagementDesc: "Add, edit, or disable vehicle types.",
    vehicleTypeName: "Vehicle Type Name",
    addNewVehicle: "Add New Vehicle",
    vehicleIcon: "Vehicle Icon",
  },
  en: {
    settings: "Settings",
    adminProfile: "Admin Profile",
    adminProfileDesc: "Update your admin profile information here.",
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
    themeViolet: "Violet",
    themeYellow: "Yellow",
    themeLime: "Lime",
    themeCyan: "Cyan",
    themePink: "Pink",
    themeSlate: "Slate",
    templates: "Application Templates",
    templatesDesc: "Select a pre-defined template to quickly set the look and feel.",
    fareManagement: "Fare Management",
    fareManagementDesc: "Adjust fare settings for different vehicle types.",
    baseFare: "Base Fare (PKR)",
    perKmRate: "Per Kilometer Rate (PKR)",
    perMinRate: "Per Minute Rate (PKR)",
    fareSavedSuccess: "Fare settings have been saved successfully.",
    commissionManagement: "Commission & Fees",
    commissionManagementDesc: "Set commission percentage and service fees.",
    commissionRate: "Commission Rate (%)",
    serviceFee: "Service Fee (PKR)",
    passwordManagement: "Password Management",
    passwordManagementDesc: "Change your admin password.",
    appSettings: "Application Settings",
    appSettingsDesc: "General settings for the entire application.",
    appName: "Application Name",
    appNamePlaceholder: "e.g., ZinGo Ride",
    appCurrency: "Application Currency",
    appCurrencyPlaceholder: "e.g., PKR",
    rideSettings: "Ride Settings",
    rideSettingsDesc: "Ride-specific options for riders and customers.",
    rideRequestTimeout: "Ride Request Timeout (seconds)",
    rideRequestTimeoutDesc: "How long a driver has to accept a ride request.",
    enableAiTips: "Enable AI Tip Suggestions",
    enableAiTipsDesc: "Show drivers AI-powered tip suggestions.",
    paymentSettings: "Payment Settings",
    paymentSettingsDesc: "Manage available payment methods for customers.",
    enableCash: "Enable Cash Payments",
    enableWallet: "Enable Wallet Payments",
    supportSettings: "Support Settings",
    supportSettingsDesc: "Set up support contact information for users.",
    supportPhone: "Support Phone Number",
    supportEmail: "Support Email Address",
    securityCompliance: "Security & Compliance",
    securityComplianceDesc: "Manage privacy, terms, and data policies.",
    privacyPolicyUrl: "Privacy Policy URL",
    termsOfServiceUrl: "Terms of Service URL",
    dataRetentionDays: "Data Retention (Days)",
    dataRetentionDesc: "How many days to keep user data before anonymization.",
    referralProgram: "Referral Program",
    referralProgramDesc: "Manage referral bonuses and settings.",
    enableReferrals: "Enable Referral Program",
    referrerBonus: "Referrer Bonus (PKR)",
    inviteeBonus: "Invitee Bonus (PKR)",
    surgePricing: "Surge Pricing",
    surgePricingDesc: "Manage surge multiplier and conditions.",
    enableSurge: "Enable Surge Pricing",
    surgeMultiplier: "Surge Multiplier",
    surgeThreshold: "Surge Threshold (%)",
    surgeThresholdDesc: "Percentage of busy drivers to trigger surge.",
    vehicleManagement: "Vehicle Type Management",
    vehicleManagementDesc: "Add, edit, or disable vehicle types.",
    vehicleTypeName: "Vehicle Type Name",
    addNewVehicle: "Add New Vehicle",
    vehicleIcon: "Vehicle Icon",
  },
};

const ZRLogoComponent = ({ className }: { className?: string }) => (
  <span className={cn("font-bold text-xl tracking-tighter", className)}>ZR</span>
);


const logoOptions = [
    { name: 'ZR', icon: ZRLogoComponent },
    { name: 'Default', icon: Package2 },
    { name: 'Car', icon: Car },
    { name: 'Rocket', icon: Rocket },
    { name: 'Bike', icon: Bike },
    { name: 'Shield', icon: Shield },
    { name: 'Ship', icon: Ship },
    { name: 'Bus', icon: Bus },
    { name: 'Train', icon: Train },
    { name: 'Plane', icon: Plane },
    { name: 'Bot', icon: Bot },
];

const allIcons = { Car, Bike, Rocket, Bus, Train, Plane, Ship, Shield };

const colorOptions = [
    { name: 'Blue', value: 'theme-blue', color: 'bg-sky-500' },
    { name: 'Green', value: 'theme-green', color: 'bg-green-500' },
    { name: 'Orange', value: 'theme-orange', color: 'bg-orange-500' },
    { name: 'Rose', value: 'theme-rose', color: 'bg-rose-500' },
    { name: 'Violet', value: 'theme-violet', color: 'bg-violet-500' },
    { name: 'Yellow', value: 'theme-yellow', color: 'bg-yellow-500' },
    { name: 'Lime', value: 'theme-lime', color: 'bg-lime-500' },
    { name: 'Cyan', value: 'theme-cyan', color: 'bg-cyan-500' },
    { name: 'Pink', value: 'theme-pink', color: 'bg-pink-500' },
    { name: 'Slate', value: 'theme-slate', color: 'bg-slate-500' },
];

const templateOptions = [
    { name: 'Corporate Blue', color: 'theme-blue', logo: 'Shield', icon: Shield, colorClass: 'bg-sky-500' },
    { name: 'Eco Green', color: 'theme-green', logo: 'Bike', icon: Bike, colorClass: 'bg-green-500' },
    { name: 'Vibrant Orange', color: 'theme-orange', logo: 'Rocket', icon: Rocket, colorClass: 'bg-orange-500' },
    { name: 'Royal Violet', color: 'theme-violet', logo: 'Bot', icon: Bot, colorClass: 'bg-violet-500' },
    { name: 'Sunny Yellow', color: 'theme-yellow', logo: 'Bus', icon: Bus, colorClass: 'bg-yellow-500' },
    { name: 'Electric Lime', color: 'theme-lime', logo: 'Car', icon: Car, colorClass: 'bg-lime-500' },
    { name: 'Aqua Cyan', color: 'theme-cyan', logo: 'Ship', icon: Ship, colorClass: 'bg-cyan-500' },
    { name: 'Hot Pink', color: 'theme-pink', logo: 'Plane', icon: Plane, colorClass: 'bg-pink-500' },
    { name: 'Elegant Rose', color: 'theme-rose', logo: 'Default', icon: Package2, colorClass: 'bg-rose-500' },
    { name: 'Modern Slate', color: 'theme-slate', logo: 'Train', icon: Train, colorClass: 'bg-slate-500' },
];

type VehicleType = { name: string; icon: keyof typeof allIcons; active: boolean; baseFare: number; perKmRate: number; perMinRate: number; };

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const { logo, setLogo, LogoComponent } = useLogo();
    const { themeColor, setThemeColor } = useThemeColor();
    const [mounted, setMounted] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
    const [newVehicleName, setNewVehicleName] = useState('');
    const [newVehicleIcon, setNewVehicleIcon] = useState<keyof typeof allIcons>('Car');
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
    
    const handleTemplateChange = (templateName: string) => {
        const selected = templateOptions.find(t => t.name === templateName);
        if (selected) {
            setThemeColor(selected.color as any);
            setLogo(selected.logo as any);
            setActiveTemplate(templateName);
        }
    };

    const handleAddNewVehicle = () => {
        if (newVehicleName.trim() === '') return;
        setVehicleTypes(prev => [...prev, { name: newVehicleName, icon: newVehicleIcon, active: true, baseFare: 0, perKmRate: 0, perMinRate: 0 }]);
        setNewVehicleName('');
        setNewVehicleIcon('Car');
    }
    
    const handleRemoveVehicle = (index: number) => {
        setVehicleTypes(prev => prev.filter((_, i) => i !== index));
    }

    useEffect(() => {
        const currentTemplate = templateOptions.find(t => t.color === themeColor && t.logo === logo);
        if (currentTemplate) {
            setActiveTemplate(currentTemplate.name);
        } else {
            setActiveTemplate(null);
        }
    }, [themeColor, logo]);


    if (!mounted) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-2xl font-bold">{t.settings}</h1>
            
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="mt-4 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.adminProfile}</CardTitle>
                            <CardDescription>{t.adminProfileDesc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <ProfileForm />
                        </CardContent>
                    </Card>
                    <PasswordManagementForm />
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.appSettings}</CardTitle>
                            <CardDescription>{t.appSettingsDesc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="app-name">{t.appName}</Label>
                                <div className="relative">
                                   <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                   <Input id="app-name" placeholder={t.appNamePlaceholder} defaultValue="ZinGo Ride" className="pl-8" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="app-currency">{t.appCurrency}</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="app-currency" placeholder={t.appCurrencyPlaceholder} defaultValue="PKR" className="pl-8" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>{t.supportSettings}</CardTitle>
                            <CardDescription>{t.supportSettingsDesc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="support-phone">{t.supportPhone}</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="support-phone" type="tel" placeholder="+92 300 1234567" className="pl-8" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="support-email">{t.supportEmail}</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="support-email" type="email" placeholder="support@zingo.com" className="pl-8" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="appearance" className="mt-4 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.templates}</CardTitle>
                            <CardDescription>{t.templatesDesc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <RadioGroup 
                                value={activeTemplate || ''} 
                                onValueChange={handleTemplateChange}
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                            >
                                {templateOptions.map((template) => {
                                    const Icon = template.icon;
                                    return (
                                        <div key={template.name}>
                                            <RadioGroupItem value={template.name} id={template.name} className="peer sr-only" />
                                            <Label htmlFor={template.name} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary aspect-square">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className={`h-8 w-8 rounded-full ${template.colorClass} flex items-center justify-center`}>
                                                         <Icon className="h-5 w-5 text-white" />
                                                    </div>
                                                    <span className="text-center text-sm">{template.name}</span>
                                                </div>
                                            </Label>
                                        </div>
                                    )
                                })}
                            </RadioGroup>
                        </CardContent>
                    </Card>
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
                                className="grid grid-cols-2 md:grid-cols-5 gap-4"
                            >
                                {colorOptions.map((option) => (
                                    <div key={option.value}>
                                        <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                                        <Label htmlFor={option.value} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-6 w-6 rounded-full ${option.color}`} />
                                                <span>{t[option.name.toLowerCase() as keyof typeof t] || option.name}</span>
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
                            <RadioGroup 
                                value={logo} 
                                onValueChange={(value) => setLogo(value as any)}
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                            >
                                {logoOptions.map(({ name, icon: Icon }) => (
                                     <div key={name}>
                                        <RadioGroupItem value={name} id={name.toLowerCase()} className="peer sr-only" />
                                        <Label htmlFor={name.toLowerCase()} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary aspect-square">
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
                </TabsContent>
                <TabsContent value="financial" className="mt-4 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>{t.fareManagement}</CardTitle>
                            <CardDescription>{t.fareManagementDesc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {vehicleTypes.length > 0 ? (
                                <Tabs defaultValue={vehicleTypes[0]?.name || 'car'} className="w-full">
                                    <TabsList className={`grid w-full grid-cols-${vehicleTypes.length}`}>
                                        {vehicleTypes.map(v => {
                                            const Icon = allIcons[v.icon];
                                            return <TabsTrigger key={v.name} value={v.name}><Icon className="mr-2 h-4 w-4" /> {v.name}</TabsTrigger>
                                        })}
                                    </TabsList>
                                    {vehicleTypes.map(v => (
                                    <TabsContent key={v.name} value={v.name} className="mt-4">
                                        <div className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor={`${v.name}-base-fare`}>{t.baseFare}</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input id={`${v.name}-base-fare`} type="number" placeholder="e.g., 100" defaultValue={v.baseFare} className="pl-8" />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={`${v.name}-km-rate`}>{t.perKmRate}</Label>
                                                <div className="relative">
                                                    <Milestone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input id={`${v.name}-km-rate`} type="number" placeholder="e.g., 25" defaultValue={v.perKmRate} className="pl-8" />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={`${v.name}-min-rate`}>{t.perMinRate}</Label>
                                                <div className="relative">
                                                    <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input id={`${v.name}-min-rate`} type="number" placeholder="e.g., 5" defaultValue={v.perMinRate} className="pl-8" />
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    ))}
                                </Tabs>
                            ) : (
                                <div className="text-center text-muted-foreground py-4">No vehicle types added.</div>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.commissionManagement}</CardTitle>
                            <CardDescription>{t.commissionManagementDesc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="commission-rate">{t.commissionRate}</Label>
                                <div className="relative">
                                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="commission-rate" type="number" placeholder="e.g., 15" defaultValue="15" className="pl-8" />
                                </div>
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="service-fee">{t.serviceFee}</Label>
                                 <div className="relative">
                                    <ReceiptText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="service-fee" type="number" placeholder="e.g., 50" defaultValue="50" className="pl-8" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>{t.paymentSettings}</CardTitle>
                            <CardDescription>{t.paymentSettingsDesc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch id="cash-payment-switch" defaultChecked />
                                <Label htmlFor="cash-payment-switch">{t.enableCash}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="wallet-payment-switch" defaultChecked />
                                <Label htmlFor="wallet-payment-switch">{t.enableWallet}</Label>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="advanced" className="mt-4 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>{t.rideSettings}</CardTitle>
                            <CardDescription>{t.rideSettingsDesc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="ride-request-timeout">{t.rideRequestTimeout}</Label>
                                 <div className="relative">
                                    <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="ride-request-timeout" type="number" placeholder="e.g., 30" defaultValue="10" className="pl-8" />
                                </div>
                                <p className="text-sm text-muted-foreground">{t.rideRequestTimeoutDesc}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="ai-tips-switch" defaultChecked />
                                <Label htmlFor="ai-tips-switch" className="flex flex-col space-y-1">
                                    <span>{t.enableAiTips}</span>
                                    <span className="font-normal leading-snug text-muted-foreground">{t.enableAiTipsDesc}</span>
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.referralProgram}</CardTitle>
                            <CardDescription>{t.referralProgramDesc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch id="referral-switch" />
                                <Label htmlFor="referral-switch">{t.enableReferrals}</Label>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="referrer-bonus">{t.referrerBonus}</Label>
                                    <div className="relative">
                                        <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="referrer-bonus" type="number" placeholder="e.g., 100" className="pl-8" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="invitee-bonus">{t.inviteeBonus}</Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="invitee-bonus" type="number" placeholder="e.g., 100" className="pl-8" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>{t.surgePricing}</CardTitle>
                            <CardDescription>{t.surgePricingDesc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center space-x-2">
                                <Switch id="surge-switch" />
                                <Label htmlFor="surge-switch">{t.enableSurge}</Label>
                            </div>
                            <div className="grid gap-2">
                                <Label>{t.surgeMultiplier}: 1.5x</Label>
                                <Slider defaultValue={[1.5]} min={1} max={3} step={0.1} />
                            </div>
                            <div className="grid gap-2">
                                <Label>{t.surgeThreshold}</Label>
                                <div className="relative">
                                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="surge-threshold" type="number" placeholder="e.g. 80" defaultValue="80" className="pl-8" />
                                </div>
                                <p className="text-sm text-muted-foreground">{t.surgeThresholdDesc}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.securityCompliance}</CardTitle>
                            <CardDescription>{t.securityComplianceDesc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="privacy-policy-url">{t.privacyPolicyUrl}</Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="privacy-policy-url" type="url" placeholder="https://zingo.com/privacy" className="pl-8" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="terms-url">{t.termsOfServiceUrl}</Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="terms-url" type="url" placeholder="https://zingo.com/terms" className="pl-8" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="data-retention">{t.dataRetentionDays}</Label>
                                <div className="relative">
                                    <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="data-retention" type="number" placeholder="e.g., 365" className="pl-8" />
                                </div>
                                <p className="text-sm text-muted-foreground">{t.dataRetentionDesc}</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>{t.vehicleManagement}</CardTitle>
                            <CardDescription>{t.vehicleManagementDesc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {vehicleTypes.map((v, index) => {
                                const Icon = allIcons[v.icon];
                                return (
                                    <div key={index} className="flex items-center justify-between p-2 rounded-lg border bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{v.name}</span>
                                            <Switch checked={v.active} onCheckedChange={(checked) => setVehicleTypes(p => p.map((item, i) => i === index ? {...item, active: checked} : item))} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveVehicle(index)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="pt-4 border-t">
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="new-vehicle-name">{t.vehicleTypeName}</Label>
                                        <Input id="new-vehicle-name" value={newVehicleName} onChange={(e) => setNewVehicleName(e.target.value)} placeholder="e.g., Van" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="new-vehicle-icon">{t.vehicleIcon}</Label>
                                        <Select value={newVehicleIcon} onValueChange={(val) => setNewVehicleIcon(val as keyof typeof allIcons)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.keys(allIcons).map(iconName => {
                                                    const Icon = allIcons[iconName as keyof typeof allIcons];
                                                    return <SelectItem key={iconName} value={iconName}><div className="flex items-center gap-2"><Icon className="h-4 w-4" /> {iconName}</div></SelectItem>
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button onClick={handleAddNewVehicle} className="mt-4 w-full">
                                    <PlusCircle className="mr-2 h-4 w-4" /> {t.addNewVehicle}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            
            <div className="border-t pt-4">
                <Button onClick={handleSave} className="w-full md:w-auto">{t.saveButton}</Button>
            </div>
        </div>
    )
}
