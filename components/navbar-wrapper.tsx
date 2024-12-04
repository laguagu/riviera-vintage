import { auth } from "@/app/(auth)/auth";
import { NavbarClient } from "./navbar";

export const NavbarWrapper = async () => {
  const session = await auth();
  if (!session) return null;
  return <NavbarClient session={session} />;
};
