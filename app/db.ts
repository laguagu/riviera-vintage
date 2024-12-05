import { chat, chunk, user } from "@/schema";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
const connectionString = `${process.env.POSTGRES_URL!}`;
const client = postgres(connectionString, { max: 10 }); // Määritä poolin koko
const db = drizzle(client);

type NewUser = typeof user.$inferInsert;

export async function getUser(email: string) {
  return await db.select().from(user).where(eq(user.email, email));
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  const newUser: NewUser = {
    email,
    password: hash,
  };

  return await db.insert(user).values(newUser);
}

export async function createMessage({
  id,
  messages,
  author,
}: {
  id: string;
  messages: any;
  author: string;
}) {
  const selectedChats = await db.select().from(chat).where(eq(chat.id, id));

  if (selectedChats.length > 0) {
    return await db
      .update(chat)
      .set({
        messages: JSON.stringify(messages),
      })
      .where(eq(chat.id, id));
  }

  return await db.insert(chat).values({
    id,
    createdAt: new Date(),
    messages: JSON.stringify(messages),
    author,
  });
}

export async function getChatsByUser({ email }: { email: string }) {
  return await db
    .select()
    .from(chat)
    .where(eq(chat.author, email))
    .orderBy(desc(chat.createdAt));
}

export async function deleteChatById({ id }: { id: string }) {
  return await db.delete(chat).where(eq(chat.id, id));
}

export async function getChatById({ id }: { id: string }) {
  const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
  return selectedChat;
}

export async function insertChunks({ chunks }: { chunks: any[] }) {
  return await db.insert(chunk).values(chunks);
}

export async function getChunksByFilePaths({
  filePaths,
}: {
  filePaths: Array<string>;
}) {
  return await db
    .select()
    .from(chunk)
    .where(inArray(chunk.filePath, filePaths));
}

export async function deleteChunksByFilePath({
  filePath,
}: {
  filePath: string;
}) {
  return await db.delete(chunk).where(eq(chunk.filePath, filePath));
}
