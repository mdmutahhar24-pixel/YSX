import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
        return Response.json({ error: "Unauthorized User" }, { status: 401 });
    }

    console.log("session: ", session)
    try {
        const body = await req.json();

        const { postId } = body;

        if (!postId) {
            return Response.json({ error: "postId is required" }, { status: 400 });
        }

        const existingLike = await prisma.like.findUnique({
            where: {
                givenBy_postId: {
                    givenBy: session.user.id,
                    postId: postId,
                },
            },
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    likeId: existingLike.likeId,
                },
            });

            return Response.json({ liked: false });
        }

        const newLike = await prisma.like.create({
            data: {
                givenBy: session.user.id,
                postId: postId,
            },
        });

        return Response.json({ liked: true, data: newLike });

    } catch (error) {
        console.error("Error: ", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}