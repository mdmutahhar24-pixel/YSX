'use server';

import { prisma } from "@/lib/prisma";


export async function trackView({userId, postId, watchTime}: {userId: string, postId: string, watchTime: number}) {
    await prisma.views.create({data: { userId, postId, watchTime }});

    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { Tags: true }
    })

    if (!post) return;

    const score = Math.min(watchTime / 10, 5);

    for (const tag of post.Tags) {
        await prisma.userInterest.upsert({
            where: {
                userId_tag: {
                    userId,
                    tag: tag.tag
                },
            },
            update: { score: { increment: score } },
            create: {
                userId,
                tag: tag.tag,
                score
            }
        })
    }
}