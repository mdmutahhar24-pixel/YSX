'use client';

import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { SetDescriptionAction } from '@/app/(app)/actions/setDescription';

const SetDescription = () => {
    const router = useRouter();
    const description = SetDescriptionAction.bind(null)

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" size="xs" className='ml-5'>Change Description</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <h1>Change your description!</h1>
            </DialogHeader>
            <form action={description} className='w-full'>
                <textarea name='description' className='rounded-2xl w-full mb-5' />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                    <Button type='submit'>Set Description</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default SetDescription
