'use client';

import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BanIcon, CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { BanUser } from '@/app/(app)/actions/ban';
import { useRouter } from 'next/navigation';

type user = {
    userId: string
    username: string,
}

const BanButton = ({username, userId}: user) => {
    const [date, setDate] = React.useState<Date>()
    const [open, setOpen] = useState(false);
    const router = useRouter();
    

    return (
        <Dialog open={open}>
            <DialogTrigger asChild>
                <Button variant="destructive" onClick={() => setOpen(true)}><BanIcon /></Button>
            </DialogTrigger>
            <DialogContent>
                <form action={async (formData) => {
                    BanUser(formData);
                    setOpen(false);
                    router.refresh();
                }}>
                    <DialogHeader>
                        <DialogTitle>Please provide ban information.</DialogTitle>
                        <DialogDescription>Fill out the fields to ban user: {username}.</DialogDescription>
                    </DialogHeader>
                    <div className='mb-5'>
                        <input type='hidden' name='userId' value={userId} />
                    </div>
                    <input type="hidden" name="expiry" value={date ? date.toISOString() : ""} />
                    <div className='mb-5'>
                        <h1 className='mb-2'>Ban Reason</h1>
                        <textarea name='reason' className='w-full border-2 rounded-md' required/>
                    </div>
                    <div className='w-full mb-5'>
                        <h1 className='mb-2'>Ban Expiry</h1>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" data-empty={!date} className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground">
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                
                                <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} buttonVariant="outline" required />
                            </PopoverContent>
                            </Popover>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        </DialogClose>
                        <Button type='submit' variant="destructive">Ban User</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default BanButton
