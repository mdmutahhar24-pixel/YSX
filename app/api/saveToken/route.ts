import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { token } = await req.json();

    if (!token || typeof token !== "string") {
      return new Response("Invalid token", { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { pushToken: token },
    });

    return Response.json({ ok: true });

  } catch (err) {
    console.error("saveToken error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}