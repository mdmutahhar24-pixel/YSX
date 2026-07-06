'use server';

import { prisma } from "@/lib/prisma";

export async function getMyPosts(userId: string) {
    const intrests = await prisma.userInterest.findMany({
        where: { userId },
        orderBy: { score: 'desc' },
        take: 10
    });

    const topTags = intrests.map(i => i.tag);

    const posts = await prisma.post.findMany({
        where: { createdBy: userId },
        include: {
            Tags: true,
            Likes: true,
            Views: true,
            Media: true
        },
        take: 50
    });

    const scored = posts.map(post => {
        const tagScore = post.Tags.reduce((acc, t) => {
            if ( topTags.includes(t.tag)) return acc + 10
            return acc
        }, 0)

        const engagementScore = post.Likes.length * 2 + post.Views.length * 0.5

        const recencyScore = 1 / ((Date.now() - new Date(post.createdAt).getTime()) / 10000000);

        return { post, score: tagScore + engagementScore + recencyScore }
    });

    return scored.sort((a, b) => b.score - a.score).map(item => item.post);
}