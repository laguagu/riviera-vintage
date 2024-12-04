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
import { Loader2 } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom"; // Lisätään tämä
import { toast } from "sonner";
import { login } from "../actions";

export default function Page() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      const result = await login({ status: "idle" }, formData);

      if (result.status === "failed") {
        toast.error("Virheelliset kirjautumistiedot!");
        (document.getElementById("loginForm") as HTMLFormElement)?.reset();
      } else if (result.status === "success") {
        toast.success("Kirjautuminen onnistui!");
        router.refresh();
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Kirjautuminen epäonnistui!");
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-fade-diagonal dark:bg-zinc-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Kirjaudu sisään
          </CardTitle>
          <CardDescription className="text-center">
            Kirjaudu sisään käyttämällä sähköpostiasi ja salasanaasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form id="loginForm" action={handleSubmit} className="space-y-6">
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
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium">
                    Salasana
                  </label>
                  {/* <Link
                    href="/reset-password"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Unohditko salasanan?
                  </Link> */}
                </div>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              <SubmitButton />
            </div>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Ei käyttäjätiliä?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Rekisteröidy
            </Link>
            {" ilmaiseksi"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Kirjaudutaan...
        </>
      ) : (
        "Kirjaudu sisään"
      )}
    </Button>
  );
}
