import { auth } from "@/app/(auth)/auth";
import { Chat } from "@/components/chat";
import { generateId } from "ai";

export default async function Page() {
  const session = await auth();
  const chatId = generateId();

  return (
    <Chat key={chatId} id={chatId} initialMessages={[]} session={session} />
  );
}
