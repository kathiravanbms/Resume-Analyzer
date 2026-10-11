// Netlify Function (v2, web-standard Request/Response): same-origin proxy for
// OpenCode Go, which sends no CORS headers and cannot be called from a browser
// directly. Forwards /api/opencode/* to https://opencode.ai/zen/go/v1/*.
const TARGET = "https://opencode.ai/zen/go/v1";

export default async function handler(request) {
  const url = new URL(request.url);
  // Works whether the path arrives as /api/opencode/... or the rewritten
  // /.netlify/functions/opencode/... form.
  const rest = url.pathname.replace(
    /^\/(?:api\/opencode|\.netlify\/functions\/opencode)/,
    "",
  );
  const target = `${TARGET}${rest}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.set("user-agent", "ResumeAnalyzer/0.1");

  const init = { method: request.method, headers };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(target, init);

  const outHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) outHeaders.set("content-type", contentType);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: outHeaders,
  });
}
