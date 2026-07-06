'use server';

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function accountDelete() {
    const { data: session } = await auth.getSession();

    if (!session?.user) throw new Error('Unauthorized');

    await prisma.like.deleteMany({
        where: { givenBy: session.user.id }
    });

    await prisma.post.deleteMany({
        where: { createdBy: session.user.id }
    })

    await prisma.conversationParticipant.deleteMany({
      where: {userId: session.user.id}
    })

    await prisma.user.deleteMany({
      where: {id: session.user.id}
    })

    const response = await fetch(
    `https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches/${process.env.NEON_BRANCH_ID}/auth/users/${session.user.id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.NEON_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete Neon Auth account');
  }

  redirect('/sign-up');
}