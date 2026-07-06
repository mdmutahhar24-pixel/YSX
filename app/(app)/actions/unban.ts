'use server';

import { prisma } from "@/lib/prisma";

export async function UnbanUser(formData: FormData) {
  const userId = formData.get("userId") as string;

  await prisma.user.update({
    where: {id: userId},
    data: {
        banReason: null,
        banExpiry: null,
        banned: false
    }
  })
}