import React from 'react'
import { Card } from './ui/card'
import { prisma } from '@/lib/prisma'
import MessageList from './messageList'
import { auth } from '@/lib/auth/server'

const ChatContent = async ({conversationId}: {conversationId: string}) => {
  const messages = await prisma.message.findMany({ where: {conversationId}, include: {user: true}, orderBy: {startedAt: "asc"} })
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

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

  const otherUser = conversation?.participants.find((p) => p.userId !== session.user.id)?.user;
  const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

  return (
    <div className='h-full whitespace-pre-wrap'>
      <MessageList initialMessages={messages} currentUserId={currentUser} conversationId={conversationId} otherUserId={otherUser} />
    </div>
  )
}

export default ChatContent
