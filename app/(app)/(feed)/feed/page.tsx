import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/server';
import { getFeed } from '../../actions/intrestRanker';
import { Card, CardDescription } from '@/components/ui/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import Image from 'next/image';
import { PlayIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreatePost from '@/components/CreatePost';
import InteractableButtons from '@/components/InteractableButtons';
import { ButtonGroup } from '@/components/ui/button-group';

async function getPosts() {
  return await prisma.post.findMany({
    include: {
      Media: true,
    },
  })
}

const Feed = async () => {
  const { data: session } = await auth.getSession();

  const user = await prisma.user.findUnique({ where: {id: session?.user.id} })

  const posts = await getFeed(user?.id ?? "");

  
   if (posts.length === 0) {
        return (
        <Empty>
            <EmptyHeader>
            <EmptyMedia variant="icon"><PlayIcon /></EmptyMedia>
            <EmptyTitle>No Reels Yet!</EmptyTitle>
            <EmptyDescription>There seems to be no reels yet. Be the first to upload one!</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <CreatePost />
            </EmptyContent>
        </Empty>
        )
    }

    return (

        <div className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar">
        {posts.map(async (post: any) => {
          const liked = post.Likes.some((like: any) => like.givenBy === session?.user.id);

          const comments = await prisma.comment.findMany({
            where: {
                PostId: post.id
            },
            include: {
                user: true
            },
            orderBy: {
                Sent: "asc"
            }
        });

          return (
            <div key={post.id} className="relative snap-center w-100 h-screen">
            <div className="inset-0 flex justify-end">
                <div className='absolute z-20 -right-15 my-50'>
                  <ButtonGroup>
                    <InteractableButtons initialComments={comments} Likes={liked} postId={post.id} PostCreator={post.createdBy} />
                  </ButtonGroup>
                </div>
            </div>
            <Card className='relative h-full w-full overflow-hidden z-0'>
                {post.Media.map((media: any) =>
                media.MediaType === "IMAGE" ? (
                    <Image
                    key={media.mediaId}
                    src={media.MediaUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    />
                ) : (
                    <video src={media.MediaUrl} key={media.mediaId} className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted playsInline />
                )
                )}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className='text-white/90'>@{post.createdBy}</p>
                <h1 className="font-bold text-lg">
                    {post.title}
                </h1>
                <p className="text-sm text-gray-500 line-clamp-2">
                    {post.description}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                    {post.Tags.map((tag: any) => (
                        <Button
                        variant="default"
                        disabled
                        key={tag.id}
                        className=""
                        >
                        #{tag.tag}
                        </Button>
                    ))}
                </div>
                </div>
            </Card>
            </div>
        )})}
        </div>
    )
}

export default Feed
