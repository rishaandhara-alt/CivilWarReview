import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = normalize(join(__filename, ".."));
const publicDir = join(__dirname, "public");
const envPath = join(__dirname, ".env");
const port = process.env.PORT || 3000;
const env = loadEnv(envPath);
const cerebrasApiKey = process.env.CEREBRAS_API_KEY || env.CEREBRAS_API_KEY || "";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "POST" && url.pathname === "/api/cerebras") {
      await handleCerebras(req, res);
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }

    await serveStatic(url.pathname, res, req.method === "HEAD");
  } catch (error) {
    sendJson(res, 500, { error: "Server error", detail: error.message });
  }
}).listen(port, () => {
  console.log(`Smart Todo running at http://localhost:${port}`);
});

function loadEnv(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  const text = readFileSync(filePath, "utf8");
  const pairs = {};

  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) {
      continue;
    }

    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    pairs[key] = value;
  }

  return pairs;
}

async function handleCerebras(req, res) {
  if (!cerebrasApiKey) {
    sendJson(res, 500, { error: "Missing CEREBRAS_API_KEY in .env" });
    return;
  }

  const body = await readJsonBody(req);
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const temperature = typeof body.temperature === "number" ? body.temperature : 0.5;

  const upstream = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cerebrasApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.1-8b",
      temperature,
      messages,
    }),
  });

  const raw = await upstream.text();
  const data = raw ? safeJsonParse(raw) : null;

  if (!upstream.ok) {
    sendJson(res, upstream.status, {
      error: "Cerebras request failed",
      detail: data || raw || "Unknown upstream error",
    });
    return;
  }

  if (!data) {
    sendJson(res, 502, {
      error: "Cerebras returned an empty response",
    });
    return;
  }

  sendJson(res, 200, data);
}

async function serveStatic(pathname, res, headOnly) {
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = join(publicDir, cleanPath);

  if (!filePath.startsWith(publicDir)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      throw new Error("Not a file");
    }

    const extension = extname(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });

    if (headOnly) {
      res.end();
      return;
    }

    createReadStream(filePath).pipe(res);
  } catch {
    sendJson(res, 404, { error: "Not found" });
  }
}

async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(data));
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
