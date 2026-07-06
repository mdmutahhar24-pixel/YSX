import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import  CreatePost  from '@/components/CreatePost'
import { PlayIcon } from 'lucide-react';
import { auth } from '@/lib/auth/server'
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import React from 'react'
import { Dialog, DialogDescription, DialogTrigger, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { logout } from './actions/logOut';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { getFeed } from './actions/intrestRanker';
import Link from 'next/link';

async function getPosts() {
  return await prisma.post.findMany();
}

const Home = async () => {
  const { data: session } = await auth.getSession();

  if(!session?.user) {
    redirect('/sign-up')
  }


  const user = await prisma.user.findUnique({ where: {id: session?.user.id} })

  const posts = await getFeed(user?.id ?? "");

 return (
  <div className='w-full h-full m-auto items-center text-center flex flex-col justify-center'>
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <img src="/Logo-removebg.png" />
        </EmptyMedia>
        <EmptyTitle>Welcome to YSX, {user?.name}!</EmptyTitle>
        <EmptyDescription>Start by creating a post or watching reels!</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='flex flex-row items-center text-center justify-center'>
        <div className='border rounded-lg'>
          <CreatePost />
        </div>
        <Button className='ml-5'><PlayIcon /><Link href="/feed"> Watch Reels</Link></Button>
      </EmptyContent>
    </Empty>
  </div>
 );
}

export default Home
