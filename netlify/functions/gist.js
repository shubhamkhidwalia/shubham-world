const https = require("https");

const request = (options, body) => new Promise((resolve) => {
  const req = https.request(options, (res) => {
    let data = "";
    res.on("data", chunk => { data += chunk; });
    res.on("end", () => resolve({ status: res.statusCode, body: data }));
  });
  req.on("error", err => resolve({ status: 500, body: JSON.stringify({ error: err.message }) }));
  if (body) req.write(body);
  req.end();
});

exports.handler = async (event) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GIST_ID      = process.env.GIST_ID;

  if (!GIST_ID) return { statusCode: 500, body: JSON.stringify({ error: "GIST_ID not set" }) };

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  /* ── GET — read vault (public, no token needed) ── */
  if (event.httpMethod === "GET") {
    const r = await request({
      hostname: "api.github.com",
      path: `/gists/${GIST_ID}`,
      method: "GET",
      headers: {
        "User-Agent": "shubham-world",
        "Accept": "application/vnd.github+json",
      }
    });
    if (r.status !== 200) return { statusCode: r.status, headers, body: r.body };
    try {
      const gist = JSON.parse(r.body);
      const content = gist.files["vault.json"]?.content || "{}";
      return { statusCode: 200, headers, body: content };
    } catch {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Parse error" }) };
    }
  }

  /* ── POST — write vault (needs token, owner only) ── */
  if (event.httpMethod === "POST") {
    if (!GITHUB_TOKEN) return { statusCode: 500, headers, body: JSON.stringify({ error: "GITHUB_TOKEN not set" }) };
    const bodyStr = JSON.stringify({
      files: { "vault.json": { content: event.body } }
    });
    const r = await request({
      hostname: "api.github.com",
      path: `/gists/${GIST_ID}`,
      method: "PATCH",
      headers: {
        "User-Agent": "shubham-world",
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(bodyStr),
      }
    }, bodyStr);
    return { statusCode: r.status, headers, body: r.status === 200 ? '{"ok":true}' : r.body };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};