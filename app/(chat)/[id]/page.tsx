import { auth } from "@/app/(auth)/auth";
import { getChatById } from "@/app/db";
import { Chat as PreviewChat } from "@/components/chat";
import { Chat } from "@/schema";
import { Message } from "ai";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: any }) {
  const { id } = await params;
  const chatFromDb = await getChatById({ id });

  if (!chatFromDb) {
    notFound();
  }

  // type casting
  const chat: Chat = {
    ...chatFromDb,
    messages: chatFromDb.messages as Message[],
  };

  const session = await auth();

  if (chat.author !== session?.user?.email) {
    notFound();
  }

  return (
    <PreviewChat
      id={chat.id}
      initialMessages={chat.messages}
      session={session}
    />
  );
}
