"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Yrityksen nimen tulee olla vähintään 2 merkkiä pitkä.",
  }),
  contactName: z.string().min(2, {
    message: "Yhteyshenkilön nimen tulee olla vähintään 2 merkkiä pitkä.",
  }),
  email: z.string().email({
    message: "Anna kelvollinen sähköpostiosoite.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Anna kelvollinen puhelinnumero.",
  }),
  furnitureType: z.string({
    required_error: "Valitse huonekalutyyppi.",
  }),
  quantity: z.number().min(1, {
    message: "Määrän tulee olla vähintään 1.",
  }),
  specifications: z.string().min(10, {
    message: "Anna tarkempia tietoja määrittelyistä.",
  }),
  targetPrice: z.string().optional(),
  deliveryDate: z.string().optional(),
});

export default function HuonekalujenTarjouspyyntolomake() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phoneNumber: "",
      furnitureType: "",
      quantity: 1,
      specifications: "",
      targetPrice: "",
      deliveryDate: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/send-rfq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Tarjouspyyntö lähetetty", {
          description: "Tarjouspyyntösi on lähetetty onnistuneesti.",
        });
        form.reset();
      } else {
        throw new Error("Tarjouspyynnön lähetys epäonnistui");
      }
    } catch (error) {
      toast.error("Virhe", {
        description:
          "Tarjouspyynnön lähettämisessä tapahtui virhe. Yritä uudelleen.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-5">
          <div className="text-lg tec">Tarjouspyyntö</div>
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel>Yrityksen nimi</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Huonekalut Oy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel>Yhteyshenkilön nimi</FormLabel>
                <FormControl>
                  <Input placeholder="Matti Meikäläinen" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel>Sähköposti</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="matti@acmehuonekalut.fi"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel>Puhelinnumero</FormLabel>
                <FormControl>
                  <Input placeholder="+358 50 123 4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="furnitureType"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel>Huonekalutyyppi</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Valitse huonekalutyyppi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="chairs">Tuolit</SelectItem>
                    <SelectItem value="tables">Pöydät</SelectItem>
                    <SelectItem value="sofas">Sohvat</SelectItem>
                    <SelectItem value="beds">Sängyt</SelectItem>
                    <SelectItem value="cabinets">Kaapit</SelectItem>
                    <SelectItem value="other">Muu</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel>Määrä</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specifications"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel>Määrittelyt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Anna yksityiskohtaiset tiedot tarvitsemistasi huonekaluista..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="targetPrice"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel>Tavoitehinta (Valinnainen)</FormLabel>
                <FormControl>
                  <Input placeholder="1000€ per yksikkö" {...field} />
                </FormControl>
                <FormDescription>
                  Jos sinulla on mielessä tavoitehinta, ilmoita se tässä.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormLabel>Toivottu toimituspäivä (Valinnainen)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Jos sinulla on tietty toimituspäivä mielessä, valitse se
                  tässä.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Lähetetään..." : "Lähetä tarjouspyyntö"}
          </Button>
        </form>
      </Form>
      <Toaster />
    </div>
  );
}
