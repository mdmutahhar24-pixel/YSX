'use server';

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher/server";

export async function createComment(
    PostId: string,
    text: string
) {
    const { data: session } = await auth.getSession();

    if (!session?.user)
        throw new Error("Unauthorized");

    const comment = await prisma.comment.create({
        data: {
            text,
            PostId,
            userId: session.user.id
        },
        include: {
            user: true
        }
    });

    await pusherServer.trigger(
        `post-${PostId}`,
        "new-comment",
        comment
    );

    return comment;
}