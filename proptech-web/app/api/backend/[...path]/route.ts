export const dynamic = "force-dynamic";

function getBackendBase(): string {
  const raw =
    (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://proptech-mvp-1.onrender.com").trim();

  // Permitir que el usuario ponga "proptech-mvp-1.onrender.com" sin esquema
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  // Normalizar: si alguien pone ".../api", dejamos solo el origin/base
  return withScheme.replace(/\/api\/?$/i, "").replace(/\/+$/g, "");
}

function isSafePathSegment(seg: string): boolean {
  if (!seg) return false;
  if (seg === "." || seg === "..") return false;
  if (seg.includes("..")) return false;
  // block attempts to smuggle a protocol/host into the path
  if (seg.includes("://")) return false;
  return true;
}

function isAllowedUpstreamPath(joined: string): boolean {
  // Only allow backend API routes (and /version) through this proxy.
  // This prevents using the proxy to fetch arbitrary upstream content.
  return (
    joined === "api" ||
    joined.startsWith("api/") ||
    joined === "version" ||
    joined.startsWith("version/")
  );
}

async function forward(request: Request, pathParts: string[]) {
  const backendBase = getBackendBase();
  const incomingUrl = new URL(request.url);

  if (!pathParts.every(isSafePathSegment)) {
    return new Response(JSON.stringify({ error: "invalid_path" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const joined = pathParts.join("/");
  if (!isAllowedUpstreamPath(joined)) {
    return new Response(JSON.stringify({ error: "blocked_path" }), {
      status: 403,
      headers: { "content-type": "application/json" },
    });
  }

  const target = new URL(backendBase);
  target.pathname = `/${joined}`;
  target.search = incomingUrl.search;

  const headers = new Headers();
  // Forward only a minimal, safe header set
  const allowList = new Set(["authorization", "content-type", "accept"]);
  for (const [k, v] of request.headers.entries()) {
    if (allowList.has(k.toLowerCase())) headers.set(k, v);
  }

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);

  const upstream = await fetch(target.toString(), {
    method,
    headers,
    body: hasBody ? request.body : undefined,
    cache: "no-store",
    redirect: "manual",
  });

  // Pass-through response body + content-type
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json",
    },
  });
}

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(request, path);
}
export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(request, path);
}
export async function PUT(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(request, path);
}
export async function PATCH(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(request, path);
}
export async function DELETE(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(request, path);
}

