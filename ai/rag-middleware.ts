import { auth } from "@/app/(auth)/auth";
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
    console.log("RAG middleware started");
    console.log("Initial params:", JSON.stringify(params, null, 2));
    // Tarkistetaan käyttäjän istunto
    const session = await auth();
    if (!session) return params; // Jos istuntoa ei ole, palautetaan parametrit muuttumattomina
    console.log("User session:", session.user?.email);
    const { prompt: messages, providerMetadata } = params;
    console.log("Messages:", JSON.stringify(messages, null, 2));
    console.log(
      "Provider metadata:",
      JSON.stringify(providerMetadata, null, 2)
    );

    // Validoidaan metatieto Zod-skeeman avulla
    const { success, data } = selectionSchema.safeParse(providerMetadata);
    if (!success) {
      console.log("Provider metadata validation failed");
      return params;
    } // Jos validointi epäonnistuu, palautetaan parametrit muuttumattomina

    const selection = data.files.selection;
    console.log("Selected files:", selection);

    // Käsitellään viimeisin viesti
    const recentMessage = messages.pop();
    if (!recentMessage || recentMessage.role !== "user") {
      console.log("No recent user message, returning original params");
      if (recentMessage) {
        messages.push(recentMessage);
      }
      return params;
    }
    console.log("Recent message:", JSON.stringify(recentMessage, null, 2));
    // Poimitaan viestin tekstisisältö
    const lastUserMessageContent = recentMessage.content
      .filter((content) => content.type === "text")
      .map((content) => content.text)
      .join("\n");
    console.log("Last user message content:", lastUserMessageContent);
    // Luokitellaan käyttäjän viesti kysymykseksi, väitteeksi tai muuksi
    const { object: classification } = await generateObject({
      model: openai("gpt-4o-mini", { structuredOutputs: true }),
      output: "enum",
      enum: ["question", "statement", "other"],
      system: "classify the user message as a question, statement, or other",
      prompt: lastUserMessageContent,
    });
    console.log("Message classification:", classification);
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
    console.log("Hypothetical answer:", hypotheticalAnswer);

    // Luodaan upotus (embedding) hypoteettiselle vastaukselle
    const { embedding: hypotheticalAnswerEmbedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: hypotheticalAnswer,
    });
    console.log("Hypothetical answer embedding created");
    // Haetaan relevantit tekstikappaleet valituista tiedostoista
    const chunksBySelection = await getChunksByFilePaths({
      filePaths: selection.map((path) => `${session.user?.email}/${path}`),
    });
    console.log("Number of chunks retrieved:", chunksBySelection.length);
    // Lasketaan samankaltaisuus hypoteettisen vastauksen ja tekstikappaleiden välillä
    const chunksWithSimilarity = chunksBySelection.map((chunk) => ({
      ...chunk,
      similarity: cosineSimilarity(
        hypotheticalAnswerEmbedding,
        chunk.embedding
      ),
    }));
    console.log("Chunks with similarity calculated");
    // Järjestetään kappaleet samankaltaisuuden mukaan ja valitaan top K
    chunksWithSimilarity.sort((a, b) => b.similarity - a.similarity);
    const k = 10;
    const topKChunks = chunksWithSimilarity.slice(0, k);
    console.log("Top K chunks selected:", k);
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
    console.log("Updated messages with relevant chunks");
    const updatedParams = { ...params, prompt: messages };
    console.log("Final params:", JSON.stringify(updatedParams, null, 2));
    // Palautetaan päivitetyt parametrit
    return { ...params, prompt: messages }; // voita palauttaa updatedParams sama asia
  },
};
