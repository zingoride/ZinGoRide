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
import { Badge } from "./ui/badge";

const formSchema = z.object({
  displayedFare: z.coerce
    .number()
    .min(50, { message: "Kiraya kam se kam 50 hona chahiye." }),
  riderRating: z.number().min(1).max(5),
  riderProfile: z.string().min(1, { message: "Rider profile zaroori hai." }),
  travelConditions: z
    .string()
    .min(10, { message: "Safar ki tafseelat likhein." }),
});

export function TipCalculator() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestDynamicTipsOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayedFare: 350,
      riderRating: 4.5,
      riderProfile: "Frequent Rider",
      travelConditions: "Heavy traffic during peak hours.",
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
        title: "Oh oh! Kuch ghalat ho gaya.",
        description: "Tip ki tajaveez hasil karne mein masla hua.",
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
          <span>AI Tip Tajaveez</span>
        </CardTitle>
        <CardDescription>
          Safar ki tafseelat darj karein aur behtareen tip ki tajaveez payen.
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
                  <FormLabel>Ride ka Kiraya (PKR)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 450" {...field} />
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
                  <FormLabel>Rider ki Rating: {field.value}</FormLabel>
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
              name="riderProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rider Profile</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Rider ka profile chunein" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="New User">Naya User</SelectItem>
                      <SelectItem value="Frequent Rider">Aksar Safar Karne Wala</SelectItem>
                      <SelectItem value="Business Traveler">Karobari Musafir</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="travelConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Safar ke Halaat</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. Heavy traffic..." {...field} />
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
              Tip Ki Tajveez Dein
            </Button>
          </form>
        </Form>
      </CardContent>
      {result && (
        <CardFooter className="flex flex-col items-start gap-4 pt-4 border-t">
          <div>
            <h3 className="font-semibold text-md">Tajweez Shuda Tips</h3>
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
            <h3 className="font-semibold text-md">Wajah</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {result.reasoning}
            </p>
          </div>
          <Button variant="secondary" className="w-full">
            <ThumbsUp className="mr-2 h-4 w-4" />
            Manzoor Karein
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
