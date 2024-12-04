"use client";

import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Particles from "@/components/ui/particles";
import { Loader2 } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { register } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Luodaan tiliä...
        </>
      ) : (
        "Rekisteröidy"
      )}
    </Button>
  );
}

export default function Page() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      const result = await register({ status: "idle" }, formData);

      if (result.status === "user_exists") {
        toast.error("Tili on jo olemassa tällä sähköpostiosoitteella");
        (document.getElementById("registerForm") as HTMLFormElement)?.reset();
      } else if (result.status === "failed") {
        toast.error("Tilin luonti epäonnistui");
      } else if (result.status === "success") {
        toast.success("Tili luotu onnistuneesti!");
        router.refresh();
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Rekisteröityminen epäonnistui");
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-fade-diagonal dark:bg-zinc-900 ">
      <Particles
        className="absolute inset-0"
        color="#666666"
        quantity={150}
        staticity={110}
        size={0.42}
        vx={0.04}
        vy={0.06}
        refresh={false}
      />
      <Card className="w-full max-w-md relative ">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Rekisteröidy</CardTitle>
          <CardDescription className="text-center">
            Luo käyttäjätili sähköpostiosoitteellasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form id="registerForm" action={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Sähköposti
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nimi@esimerkki.fi"
                  autoComplete="email"
                  autoCapitalize="none"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Salasana
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>

              <SubmitButton />
            </div>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Onko sinulla jo tili?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Kirjaudu sisään
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
