import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { Media: true },
  });

  return Response.json(posts);
}

export async function POST(req: Request) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    title,
    description,
    tags = [],
    media = [],
  } = await req.json();

  try {
   const post = await prisma.post.create({
    data: {
      title,
      description,
      createdBy: session.user.name,

      Tags: {
        create: tags.map((tag: string) => ({
          tag,
        })),
      },

      Media: {
        create: media.map((m: any) => ({
          MediaUrl: m.url,
          MediaType: m.type,
        })),
      },
    },
  });
    
    return Response.json(post);
  } catch (error) {
    console.error("Prisma error: ", error);
    return Response.json({ error: error }, { status: 500 })
  }
}