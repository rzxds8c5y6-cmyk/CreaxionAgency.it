// Vercel Function: rilascia ai clienti un "permesso di upload" verso Vercel Blob.
// Il file va direttamente dal browser allo storage (nessun limite di 4,5 MB delle Functions).
import { handleUpload } from "@vercel/blob/client";
import { ALLOWED_TYPES, MAX_FILE_MB } from "../shared/catalog.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const json = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // accetta solo percorsi dentro "ordini/"
        if (!pathname.startsWith("ordini/")) throw new Error("Percorso non valido");
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_FILE_MB * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return res.status(200).json(json);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
