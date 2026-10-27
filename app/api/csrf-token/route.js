import { generateCsrfToken } from "@/lib/csrf";

export const dynamic = "force-dynamic";

export async function GET() {
  const csrfToken = generateCsrfToken();

  return Response.json(
    { csrfToken },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
