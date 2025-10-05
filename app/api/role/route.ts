import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = await req.json();

  if (role !== "Learner" && role !== "Researcher") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  return NextResponse.json({ success: true, role });
}
