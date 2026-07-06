import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";



export async function POST(req: Request) {
    const { data: session } = await auth.getSession();

    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    try {

        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: body.image }
        })


        return Response.json({ success: true });
    } catch (err) {
        console.error(err);

        return Response.json(
            { error: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 }
        );
    }
}