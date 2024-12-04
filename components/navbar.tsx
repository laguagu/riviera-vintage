import { signOut } from "@/app/(auth)/auth";
import { Session } from "next-auth";
import Form from "next/form";
import Link from "next/link";
import { History } from "./history";

export const NavbarClient = ({ session }: { session: Session | null }) => {
  // Luodaan funktio uloskirjautumista varten
  async function handleSignOut() {
    "use server";
    await signOut({
      redirect: true,
      redirectTo: "/",
    });
  }

  return (
    <div className="bg-red absolute top-0 left-0 w-dvw border-b bg-claude dark:border-zinc-800 py-2 px-3 justify-between flex flex-row items-center dark:bg-zinc-900 z-30">
      <div className="flex flex-row gap-3 items-center">
        <History />
        <div className="text-sm dark:text-zinc-300">Antiikki avustaja</div>
      </div>

      {session ? (
        <div className="group py-1 px-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer relative">
          <div className="text-sm dark:text-zinc-400 z-10">
            {session.user?.email}
          </div>
          <div className="flex-col absolute top-6 right-0 w-full pt-5 group-hover:flex hidden">
            <Form action={handleSignOut}>
              <button
                type="submit"
                className="text-sm w-full p-1 rounded-md bg-red-500 text-red-50 hover:bg-red-600"
              >
                Kirjaudu ulos
              </button>
            </Form>
          </div>
        </div>
      ) : (
        <Link
          href="login"
          className="text-sm p-1 px-2 bg-zinc-900 rounded-md text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Kirjaudu
        </Link>
      )}
    </div>
  );
};
