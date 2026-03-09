import { type NextRequest, NextResponse } from "next/server";

// Server-side only — not exposed to the browser bundle.
const BACKEND_URL = (
  process.env.BACKEND_URL ?? "http://localhost:3333"
).replace(/\/$/, "");

type RouteContext = { params: Promise<{ path: string[] }> };

async function handleRequest(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { path } = await context.params;
  const pathname = path.join("/");

  const searchParams = new URL(request.url).search;
  const targetUrl = `${BACKEND_URL}/${pathname}${searchParams}`;

  const headers: Record<string, string> = {};

  // Forward the Content-Type so the backend parses the body correctly.
  const contentType = request.headers.get("content-type");
  if (contentType) headers["content-type"] = contentType;

  // Forward the browser's cookies to the backend so authenticated requests
  // (e.g. GET /me) include the session token.
  const cookie = request.headers.get("cookie");
  if (cookie) headers["cookie"] = cookie;

  const hasBody = !["GET", "HEAD", "OPTIONS"].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const backendResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
  });

  const responseBody = await backendResponse.arrayBuffer();

  const response = new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      "content-type":
        backendResponse.headers.get("content-type") ?? "application/json",
    },
  });

  // Re-set backend cookies as first-party cookies for the Vercel domain.
  // Without this the browser rejects the Railway cookie cross-origin.
  const setCookies: string[] = [];
  backendResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") setCookies.push(value);
  });

  for (const raw of setCookies) {
    // Strip Domain and SameSite so the browser binds the cookie to the
    // Vercel origin instead of the Railway origin.
    const sanitized = raw
      .replace(/;\s*Domain=[^;]+/gi, "")
      .replace(/;\s*SameSite=[^;]+/gi, "");

    response.headers.append("set-cookie", sanitized + "; SameSite=Lax");
  }

  return response;
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
