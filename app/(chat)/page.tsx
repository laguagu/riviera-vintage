import { auth } from "@/app/(auth)/auth";
import { Chat } from "@/components/chat";
import { generateId } from "ai";

export default async function Page() {
  const session = await auth();
  console.log("session", session);

  return <Chat id={generateId()} initialMessages={[]} session={session} />;
}
