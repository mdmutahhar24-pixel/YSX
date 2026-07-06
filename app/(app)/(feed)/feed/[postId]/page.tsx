import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/server";
import { notFound } from "next/navigation";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import InteractableButtons from "@/components/InteractableButtons";

type Props = {
  params: Promise<{
    postId: string;
  }>;
};

export default async function PostPage({ params }: Props) {
  const { postId } = await params;

  const { data: session } = await auth.getSession();

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      Media: true,
      Likes: true,
      Tags: true,
    },
  });

  if (!post) {
    notFound();
  }

  const liked = post.Likes.some(
    (like) => like.givenBy === session?.user.id
  );

  const comments = await prisma.comment.findMany({
    where: {
      PostId: post.id,
    },
    include: {
      user: true,
    },
    orderBy: {
      Sent: "asc",
    },
  });

  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 flex justify-end">
        <div className="absolute z-20 -right-15 my-50">
          <ButtonGroup>
            <InteractableButtons
              initialComments={comments}
              Likes={liked}
              postId={post.id}
              PostCreator={post.createdBy}
            />
          </ButtonGroup>
        </div>
      </div>

      <Card className="relative h-full w-full overflow-hidden z-0">
        {post.Media.map((media) =>
          media.MediaType === "IMAGE" ? (
            <Image
              key={media.mediaId}
              src={media.MediaUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          ) : (
            <video
              key={media.mediaId}
              src={media.MediaUrl}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          )
        )}

        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-white/90">@{post.createdBy}</p>

          <h1 className="font-bold text-lg">
            {post.title}
          </h1>

          <p className="text-sm text-gray-500 line-clamp-2">
            {post.description}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {post.Tags.map((tag) => (
              <Button
                key={tag.id}
                variant="default"
                disabled
              >
                #{tag.tag}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}