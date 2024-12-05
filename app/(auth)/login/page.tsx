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
import Shapes from "@/public/shapes.svg";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom"; // Lisätään tämä
import { toast } from "sonner";
import { login } from "../actions";
export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

export default function Page() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      const result = await login({ status: "idle" }, formData);

      if (result.status === "failed") {
        toast.error("Virheelliset kirjautumistiedot!");
        (document.getElementById("loginForm") as HTMLFormElement)?.reset();
      } else if (result.status === "success") {
        toast.success("Kirjautuminen onnistui! Siirrytään Chattiin.");
        router.refresh();
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Kirjautuminen epäonnistui!");
    }
  }

  return (
    <div className="relative overflow-hidden h-screen w-screen bg-fade-diagonal dark:bg-zinc-900">
      <Image
        src={Shapes}
        alt="shapes"
        className="absolute -top-8 -left-8 z-0 opacity-30"
        width={160}
        height={160}
        priority
        unoptimized
      />
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="flex flex-col h-full w-full items-center justify-center"
      >
        <Particles
          className="absolute inset-0"
          color="#666666"
          quantity={190}
          staticity={110}
          ease={30}
          size={0.42}
          refresh={false}
          vy={0.1}
        />
        <h1 className="text-4xl font-light mb-8 relative z-10 tracking-wide text-gray-800 dark:text-gray-100">
          Antiikki Avustaja
        </h1>
        <Card className="w-full max-w-md relative ">
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
      </motion.div>
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
