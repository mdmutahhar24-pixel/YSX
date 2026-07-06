'use server';

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function SetDescriptionAction(formData: FormData) {
  const { data: session } = await auth.getSession();

  if (!session?.user) throw new Error("Unauthorized User");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      description: formData.get("description") as string,
    },
  });

  revalidatePath("/account"); // adjust path
}