import { auth } from "@/app/(auth)/auth";
import { deleteChatById, getChatsByUser } from "@/app/db";

export async function GET() {
  let session = await auth();

  if (!session || !session.user) {
    return Response.json("Unauthorized!", { status: 401 });
  }

  const chats = await getChatsByUser({ email: session.user.email! });
  return Response.json(chats);
}

export async function POST(request: Request) {
  let session = await auth();

  if (!session || !session.user) {
    return Response.json("Unauthorized!", { status: 401 });
  }

  const { id } = await request.json();

  if (!id) {
    return Response.json("Chat ID is required", { status: 400 });
  }
  console.log('kutsuttu deleteChatById idllä ', id);
  
  await deleteChatById({ id });
  return Response.json({ success: true });
}
