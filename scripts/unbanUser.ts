'use server'

import { prisma } from "@/lib/prisma";

export async function unbanExpiredUsers() {
  await prisma.user.updateMany({
    where: {
      banned: true,
      banExpiry: {
        lte: new Date(),
      },
    },
    data: {
      banned: false,
      banReason: null,
      banExpiry: null,
    },
  });
}