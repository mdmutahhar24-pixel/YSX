import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/server'
import Link from 'next/link'
import  StatusBadge  from './StatusBadge'

const ChatHeader = async ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const { data: session } = await auth.getSession();

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
  });

  const otherUser = conversation?.participants.find(
    (p) => p.userId !== session?.user.id
  )?.user;

  if (!otherUser) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 bg-background">
      <div className="flex items-center gap-4 p-5">
        <Link href="/chat">
          <Button variant="ghost" className="rounded-full">
            <ArrowLeft />
          </Button>
        </Link>

        <img
          src={otherUser.image || "/New-User.jpg"}
          alt="profile"
          className="h-10 w-10 rounded-full"
        />

        <div>
          <h1>{otherUser.name}</h1>
          <StatusBadge conversationId={conversationId} otherUserId={otherUser.id} />
        </div>
      </div>
    </nav>
  );
};

export default ChatHeader;