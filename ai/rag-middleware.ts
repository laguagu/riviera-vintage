import { auth } from "@/app/(auth)/auth";
import { StorageMode } from "@/app/(chat)/api/files/list/route";
import { getChunksByFilePaths } from "@/app/db";
import { openai } from "@ai-sdk/openai";
import {
  cosineSimilarity,
  embed,
  Experimental_LanguageModelV1Middleware,
  generateObject,
  generateText,
} from "ai";
import { z } from "zod";

// Schema validointiin käytetään Zod-kirjastoa
const selectionSchema = z.object({
  files: z.object({
    selection: z.array(z.string()),
  }),
});

// RAG-väliohjelmisto määritellään tässä
export const ragMiddleware: Experimental_LanguageModelV1Middleware = {
  // transformParams-funktio suoritetaan ennen jokaista kielimallipyyntöä
  transformParams: async ({ params }) => {
    // Tarkistetaan käyttäjän istunto
    const session = await auth();
    if (!session) return params; // Jos istuntoa ei ole, palautetaan parametrit muuttumattomina

    const { prompt: messages, providerMetadata } = params;
    if (
      messages.length === 0 ||
      messages[messages.length - 1].role !== "user"
    ) {
      return params;
    }

    // Validoidaan metatieto Zod-skeeman avulla
    const { success, data } = selectionSchema.safeParse(providerMetadata);
    if (!success) {
      return params;
    } // Jos validointi epäonnistuu, palautetaan parametrit muuttumattomina

    const selection = data.files.selection;
    // Tarkistetaan, onko viimeinen viesti käyttäjältä

    // Käsitellään viimeisin viesti
    const recentMessage = messages.pop();
    if (!recentMessage || recentMessage.role !== "user") {
      if (recentMessage) {
        messages.push(recentMessage);
      }
      return params;
    }

    // Poimitaan viestin tekstisisältö
    const lastUserMessageContent = recentMessage.content
      .filter((content) => content.type === "text")
      .map((content) => content.text)
      .join("\n");

    // Luokitellaan käyttäjän viesti kysymykseksi, väitteeksi tai muuksi
    const { object: classification } = await generateObject({
      model: openai("gpt-4o-mini", { structuredOutputs: true }),
      output: "enum",
      enum: ["question", "statement", "other"],
      system: "classify the user message as a question, statement, or other",
      prompt: lastUserMessageContent,
    });

    // RAG-toiminnallisuutta käytetään vain kysymyksiin
    if (classification !== "question") {
      console.log("Not a question, returning original params", params);
      messages.push(recentMessage);
      return params;
    }

    // Luodaan hypoteettinen vastaus kysymykseen
    const { text: hypotheticalAnswer } = await generateText({
      model: openai("gpt-4o-mini", { structuredOutputs: true }),
      system: "Answer the users question:",
      prompt: lastUserMessageContent,
    });

    // Luodaan upotus (embedding) hypoteettiselle vastaukselle
    const { embedding: hypotheticalAnswerEmbedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: hypotheticalAnswer,
    });
    // Haetaan relevantit tekstikappaleet valituista tiedostoista
    const storageMode =
      (process.env.STORAGE_MODE as StorageMode) || "user-specific";

    const chunksBySelection = await getChunksByFilePaths({
      filePaths: selection.map((path) =>
        storageMode === "shared"
          ? `haaga-helia-admin@alya.fi/${path}`
          : `${session.user?.email}/${path}`
      ),
    });

    // Lasketaan samankaltaisuus hypoteettisen vastauksen ja tekstikappaleiden välillä
    const chunksWithSimilarity = chunksBySelection.map((chunk) => ({
      ...chunk,
      similarity: cosineSimilarity(
        hypotheticalAnswerEmbedding,
        chunk.embedding
      ),
    }));
    // Järjestetään kappaleet samankaltaisuuden mukaan ja valitaan top K
    chunksWithSimilarity.sort((a, b) => b.similarity - a.similarity);
    const k = 10;
    const topKChunks = chunksWithSimilarity.slice(0, k);
    // Lisätään valitut kappaleet käyttäjän viestiin lisäkontekstina
    messages.push({
      role: "user",
      content: [
        ...recentMessage.content,
        {
          type: "text",
          text: "Here is some relevant information that you can use to answer the question:",
        },
        ...topKChunks.map((chunk) => ({
          type: "text" as const,
          text: chunk.content,
        })),
      ],
    });
    // const updatedParams = { ...params, prompt: messages };
    // Palautetaan päivitetyt parametrit
    return { ...params, prompt: messages }; // voita palauttaa updatedParams sama asia
  },
};
