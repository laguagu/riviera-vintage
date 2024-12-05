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
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { register } from "../actions";

const fadeInUp = {
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
      </motion.div>
    </div>
  );
}
