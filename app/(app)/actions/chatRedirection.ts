'use server';

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";


export async function redirectChat(otherUserId: string) {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
        throw new Error("Unauthorized user");
    }

    const currentUser = session.user.id

    const existingConversation = await prisma.conversation.findFirst({
        where: {
            AND: [
                {
                    participants: {
                        some: {
                            userId: currentUser,
                        },
                    },
                },
                {
                    participants: {
                        some: {
                            userId: otherUserId,
                        },
                    },
                },
            ],
        },
    });

    if (existingConversation) {
        return existingConversation.id;
    }

    const newConversation = await prisma.conversation.create({
        data: {
            participants: {
                create: [
                    {
                        userId: currentUser,
                    },
                    {
                        userId: otherUserId,
                    },
                ],
            },
        },
    });

    return newConversation.id;
    
}