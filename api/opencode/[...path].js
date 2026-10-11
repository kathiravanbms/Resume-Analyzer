// Vercel Edge Function: same-origin proxy for OpenCode Go.
//
// OpenCode Go (opencode.ai) sends no CORS headers, so a browser cannot call it
// directly. This forwards /api/opencode/* to https://opencode.ai/zen/go/v1/*
// server-side, where CORS does not apply. The app's provider points at
// /api/opencode, so this works on the deployed site with no client change.
export const config = { runtime: "edge" };

const TARGET = "https://opencode.ai/zen/go/v1";

export default async function handler(request) {
  const url = new URL(request.url);
  const rest = url.pathname.replace(/^\/api\/opencode/, "");
  const target = `${TARGET}${rest}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  // OpenCode Go asks clients to identify with their own user agent.
  headers.set("user-agent", "ResumeAnalyzer/0.1");

  const init = { method: request.method, headers };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(target, init);

  // Forward only the content type; the body is already decoded, so copying
  // content-encoding/length from the upstream response would corrupt it.
  const outHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) outHeaders.set("content-type", contentType);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: outHeaders,
  });
}
