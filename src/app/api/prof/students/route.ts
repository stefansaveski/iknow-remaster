import { NextResponse } from "next/server";
import { getSubjects } from "@/lib/prof-demo-store";

export async function GET() {
  return NextResponse.json(getSubjects());
}
