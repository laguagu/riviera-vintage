import { auth } from "@/app/(auth)/auth";
import { insertChunks } from "@/app/db";
import { getPdfContentFromUrl } from "@/utils/pdf";
import { openai } from "@ai-sdk/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { put } from "@vercel/blob";
import { embedMany } from "ai";
import { StorageMode } from "../list/route";
import { CustomSession } from "@/app/(auth)/auth.config";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  let session = (await auth()) as CustomSession | null;

  if (!session || !session.user) {
    return Response.redirect("/login");
  }

  if (session.user.role !== "admin") {
    return new Response("Unauthorized: Admin access required", { status: 403 });
  }

  const { user } = session;

  if (!user) {
    return Response.redirect("/login");
  }

  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

  const storageMode =
    (process.env.STORAGE_MODE as StorageMode) || "user-specific";

  const filepath =
    storageMode === "shared"
      ? `haaga-helia-admin@alya.fi/${filename}`
      : `${user.email}/${filename}`;

  const { downloadUrl } = await put(`${filepath}`, request.body, {
    access: "public",
  });

  const content = await getPdfContentFromUrl(downloadUrl);
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
  });
  const chunkedContent = await textSplitter.createDocuments([content]);

  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: chunkedContent.map((chunk) => chunk.pageContent),
  });

  await insertChunks({
    chunks: chunkedContent.map((chunk, i) => ({
      id: `${filepath}/${i}`,
      filePath: `${filepath}`,
      content: chunk.pageContent,
      embedding: embeddings[i],
    })),
  });

  return Response.json({});
}
