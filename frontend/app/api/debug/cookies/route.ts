import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await cookies();
  const agro = store.get("agro-token")?.value ?? null;

  return Response.json({
    hasAgro: !!agro,
    agroLen: agro?.length ?? 0,
    keys: store.getAll().map(c => c.name),
  });
}
