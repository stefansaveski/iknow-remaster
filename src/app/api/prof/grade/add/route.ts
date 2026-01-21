import { NextResponse } from "next/server";
import { setGrade, type AddGrade } from "@/lib/prof-demo-store";

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as AddGrade;
    const result = setGrade(payload, "add");
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
