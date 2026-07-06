'use server';

import { prisma } from "@/lib/prisma";

export async function likeTracker(givenBy: string, postId: string) {
    await prisma.like.upsert({
        where: {
            givenBy_postId: {
                givenBy,
                postId
            },
        },
        update: {},
        create: { givenBy, postId }
    });

    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { Tags: true }
    })

    if (!post) return;

    for (const tag of post.Tags) {
        await prisma.userInterest.upsert({
            where: { userId_tag: { userId: givenBy, tag: tag.tag } },
            update: { score: { increment: 2 } },
            create: {
                userId: givenBy,
                tag: tag.tag,
                score: 2
            }
        })
    }
}