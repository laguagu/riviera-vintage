"use client";

import { Form } from "@/components/form";
import { SubmitButton } from "@/components/submit-button";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { login, LoginActionState } from "../actions";

export default function Page() {
  const router = useRouter();

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    }
  );

  useEffect(() => {
    if (state.status === "failed") {
      toast.error("Invalid credentials!");
    } else if (state.status === "success") {
      router.refresh();
    }
  }, [state.status, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-zinc-900">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">
            Kirjaudu sisään
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Kirjaudu sisään käyttämällä sähköpostiasi ja salasanaasi
          </p>
        </div>
        <Form action={formAction}>
          <SubmitButton>Kirjaudu</SubmitButton>
          {/* <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {"Don't have an account? "}
            <Link
              href="/register"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign up
            </Link>
            {" for free."}
          </p> */}
        </Form>
      </div>
    </div>
  );
}
