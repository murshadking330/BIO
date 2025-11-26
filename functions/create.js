export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url } = JSON.parse(req.body);

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Random ID (6 characters)
    const id = Math.random().toString(36).substring(2, 8);

    // Save Database in Vercel KV or JSON file (simple example using filesystem)
    const fs = require("fs");
    const dbPath = "short.sql";

    let db = {};

    if (fs.existsSync(dbPath)) {
      db = JSON.parse(fs.readFileSync(dbPath));
    }

    db[id] = url;

    fs.writeFileSync(dbPath, JSON.stringify(db));

    return res.status(200).json({
      status: "success",
      id: id,
      shortUrl: `https://${req.headers.host}/${id}`,
      target: url
    });

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.toString() });
  }
}
