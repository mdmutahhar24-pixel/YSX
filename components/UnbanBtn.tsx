'use client';

import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ShieldBanIcon, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnbanUser } from '@/app/(app)/actions/unban';
import { useRouter } from 'next/navigation';

type user = {
    userId: string
    username: string,
}

const UnbanButton = ({username, userId}: user) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} className='bg-green-500 opacity-80 hover:bg-green-400'><ShieldBanIcon className='opacity-100' /></Button>
            </DialogTrigger>
            <DialogContent>
                <form action={async (formData) => {
                    UnbanUser(formData);
                    setOpen(false);
                    router.refresh();
                }}>
                    <DialogHeader>
                        <DialogTitle>Are you Sure?</DialogTitle>
                        <DialogDescription>Are you sure you want to unban {username}?</DialogDescription>
                    </DialogHeader>
                    <div className='mb-5'>
                        <input type='hidden' name='userId' value={userId} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        </DialogClose>
                        <Button type='submit' className='bg-green-500 opacity-80 hover:bg-green-400'>Unban User</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UnbanButton
