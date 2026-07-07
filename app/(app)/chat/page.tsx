import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CreateConvo from '@/components/CreateConvo'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/server'
import { MessageCircleIcon } from 'lucide-react'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { CreateChat } from '../actions/chatRedirection'
import DeleteConvo from '@/components/deleteConvo'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'

const ChatList = async () => {
  const { data: session } = await auth.getSession();
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: session!.user.id,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
  });


  const user = await prisma.user.findUnique({
          where: {
              id: session?.user.id,
          },
      });

  if (conversations.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon"><MessageCircleIcon /></EmptyMedia>
          <EmptyTitle>No conversations yet!</EmptyTitle>
          <EmptyDescription>There seems to be no conversations yet. Click "Start a conversation" to begin!</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateConvo />
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className='w-full h-full no-scrollbar mt-5'>
      <div className='flex justify-end mb-5'>
        <CreateConvo />
      </div>
      {conversations.map((conversation) => {
        const otherUser = conversation.participants.find((p) => p.user.id !== session?.user.id)?.user;
        if (!otherUser) return;
        return (
          <div key={conversation.id} className='w-full hover:-translate-y-5 transition-all'>
            <div className='w-full flex justify-end'>
              <DeleteConvo conversationId={conversation.id} />
            </div>
              <Link href={`/chat/${conversation.id}`} className='w-full'>
                <Card key={conversation.id} className='flex flex-row mb-5'>
                  <img src={otherUser.image || "/New-User.jpg"} alt='User Icon' className='max-h-30 max-w-30 rounded-full' />
                  <div className='flex flex-col justify-between'>
                    <CardTitle className='font-bold mb-5'>{otherUser.name}</CardTitle>
                    <CardDescription className="mb-5">"{otherUser.description || 'I am a YSX User!'}"</CardDescription>
                    <StatusBadge conversationId={conversation.id} otherUserId={otherUser.id} />
                  </div>
                </Card>
              </Link>
          </div>
        )
      })}
    </div>
  )
}

export default ChatList
