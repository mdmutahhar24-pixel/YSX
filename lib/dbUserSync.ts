import { prisma } from "@/lib/prisma";

export async function syncUser(user: {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  banned?: boolean | null;
}) {
  await prisma.user.upsert({
    where: {
      id: user.id,
    },
    update: {
      name: user.name,
      email: user.email,
    },
    create: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      banned: user.banned
    },
  });
}