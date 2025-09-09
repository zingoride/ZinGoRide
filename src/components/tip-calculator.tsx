
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { suggestDynamicTips } from "@/app/actions";
import type { SuggestDynamicTipsOutput } from "@/ai/flows/suggest-dynamic-tips";
import { Loader2, Wand2, ThumbsUp, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

const translations = {
  ur: {
    title: "AI Tip Tajaveez",
    description: "Safar ki tafseelat darj karein aur behtareen tip ki tajaveez payen.",
    fareLabel: "Ride ka Kiraya (PKR)",
    farePlaceholder: "e.g. 450",
    ratingLabel: "Rider ki Rating",
    riderIdLabel: "Rider ID",
    riderIdPlaceholder: "Rider ki ID darj karein",
    conditionsLabel: "Safar ke Halaat",
    conditionsPlaceholder: "e.g. Heavy traffic...",
    buttonText: "Tip Ki Tajveez Dein",
    loadingText: "Tajveez di ja rahi hai...",
    errorTitle: "Oh oh! Kuch ghalat ho gaya.",
    errorDescription: "Tip ki tajaveez hasil karne mein masla hua.",
    suggestedTips: "Tajweez Shuda Tips",
    reasoning: "Wajah",
    approve: "Manzoor Karein",
    fareMinError: "Kiraya kam se kam 50 hona chahiye.",
    riderIdReqError: "Rider ID zaroori hai.",
    conditionsReqError: "Safar ki tafseelat likhein.",
  },
  en: {
    title: "AI Tip Suggestions",
    description: "Enter ride details to get smart tip suggestions.",
    fareLabel: "Ride Fare (PKR)",
    farePlaceholder: "e.g. 450",
    ratingLabel: "Rider Rating",
    riderIdLabel: "Rider ID",
    riderIdPlaceholder: "Enter Rider's ID",
    conditionsLabel: "Travel Conditions",
    conditionsPlaceholder: "e.g. Heavy traffic...",
    buttonText: "Suggest Tip",
    loadingText: "Suggesting Tip...",
    errorTitle: "Uh oh! Something went wrong.",
    errorDescription: "There was a problem getting tip suggestions.",
    suggestedTips: "Suggested Tips",
    reasoning: "Reasoning",
    approve: "Approve",
    fareMinError: "Fare must be at least 50.",
    riderIdReqError: "Rider ID is required.",
    conditionsReqError: "Please describe the travel conditions.",
  },
};


export function TipCalculator() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = translations[language];

  const formSchema = z.object({
    displayedFare: z.coerce
      .number()
      .min(50, { message: t.fareMinError }),
    riderRating: z.number().min(1).max(5),
    riderId: z.string().min(1, { message: t.riderIdReqError }),
    travelConditions: z
      .string()
      .min(10, { message: t.conditionsReqError }),
  });


  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestDynamicTipsOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayedFare: 0,
      riderRating: 5,
      riderId: "",
      travelConditions: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const res = await suggestDynamicTips(values);
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: t.errorTitle,
        description: t.errorDescription,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          <span>{t.title}</span>
        </CardTitle>
        <CardDescription>
          {t.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayedFare"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.fareLabel}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={t.farePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="riderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.riderIdLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.riderIdPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="riderRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.ratingLabel}: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={0.1}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
           
            <FormField
              control={form.control}
              name="travelConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.conditionsLabel}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t.conditionsPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {loading ? t.loadingText : t.buttonText}
            </Button>
          </form>
        </Form>
      </CardContent>
      {result && (
        <CardFooter className="flex flex-col items-start gap-4 pt-4 border-t">
          <div>
            <h3 className="font-semibold text-md">{t.suggestedTips}</h3>
            <div className="flex gap-2 mt-2">
              {result.suggestedTipAmounts.map((tip) => (
                <Button key={tip} variant="outline" className="flex gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{tip}</span>
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-md">{t.reasoning}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {result.reasoning}
            </p>
          </div>
          <Button variant="secondary" className="w-full">
            <ThumbsUp className="mr-2 h-4 w-4" />
            {t.approve}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
