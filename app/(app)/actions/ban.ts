'use server';

import { prisma } from "@/lib/prisma";

export async function BanUser(formData: FormData) {
  const userId = formData.get("userId") as string;
  const reason = formData.get("reason") as string;

  const expiryValue = formData.get("expiry") as string;

  const expiry = expiryValue && expiryValue.length > 0 ? new Date(expiryValue) : null;

  console.log("expiry raw:", formData.get("expiry"));

  await prisma.user.update({
    where: {id: userId},
    data: {
        banReason: reason,
        banExpiry: expiry,
        banned: true
    }
  })
}