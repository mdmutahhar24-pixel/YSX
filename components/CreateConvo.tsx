import React from 'react'
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogContent } from './ui/dialog'
import { Button } from './ui/button'
import { PlusIcon } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from './ui/combobox'
import { auth } from '@/lib/auth/server'
import UserSearch from './UserSearch'
import { redirectChat } from '@/app/(app)/actions/chatRedirection'
import RedirectConvo from './RedirectConvo'

const CreateConvo = async () => {
    const { data: session } = await auth.getSession();
    const allUsers = await prisma.user.findMany({ select: { id: true, name: true, image: true } });
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button className='max-w-50'><PlusIcon/>Start a conversation!</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Who do you want to talk to today?</DialogTitle>
                <DialogDescription>Search for someone by username.</DialogDescription>
            </DialogHeader>
            <UserSearch users={allUsers.filter(u => u.id !== session?.user.id)} />
        </DialogContent>
    </Dialog>
  )
}

export default CreateConvo
