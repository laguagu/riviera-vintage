import { auth } from "@/app/(auth)/auth";
import { list } from "@vercel/blob";

// Määritellään StorageMode tallennetaanko tiedostot yhteen vai useampaan sijaintiin, Shared käyttää yhtä sijaintia ja user-specific käyttää useampaa
// Tallennustilan määrittely ympäristömuuttujasta STORAGE_MODE
export type StorageMode = "shared" | "user-specific";

export async function GET() {
  let session = await auth();

  if (!session) {
    return Response.redirect("/login");
  }

  const { user } = session;

  if (!user) {
    return Response.redirect("/login");
  }
  const storageMode =
    (process.env.STORAGE_MODE as StorageMode) || "user-specific";

  // Määritellään prefix storage moden mukaan
  const prefix =
    storageMode === "shared" ? "haaga-helia-admin@alya.fi" : user.email!;

  const { blobs } = await list({ prefix: prefix });

  return Response.json(
    blobs.map((blob) => ({
      ...blob,
      pathname:
        storageMode === "shared"
          ? blob.pathname.replace(`haaga-helia-admin@alya.fi/`, "")
          : blob.pathname.replace(`${user.email}/`, ""),
    })),
  );
}
