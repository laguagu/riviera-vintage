import { customModel } from "@/ai";
import { searchSerperLocations } from "@/ai/tools";
import { auth } from "@/app/(auth)/auth";
import { createMessage } from "@/app/db";
import { convertToCoreMessages, streamText } from "ai";

export async function POST(request: Request) {
  const { id, messages, selectedFilePathnames } = await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await streamText({
    model: customModel,
    system:
      "Olet ystävällinen avustaja! Pidä vastauksesi ytimekkäinä ja avuliaana.",
    messages: convertToCoreMessages(messages),
    experimental_providerMetadata: {
      files: {
        selection: selectedFilePathnames,
      },
    },
    tools: {
      searchAntiqueStores: searchSerperLocations,
    },
    maxSteps: 5,
    onFinish: async ({ text }) => {
      if (text.trim() !== "") {
        // Lisää tämä tarkistus
        await createMessage({
          id,
          messages: [...messages, { role: "assistant", content: text }],
          author: session.user?.email!,
        });
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}
