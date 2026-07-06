'use client';

import React from 'react'
import { Button } from './ui/button'
import { TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import { DeleteChat } from '@/app/(app)/actions/deleteChat'
import { useRouter } from 'next/navigation';

type DeleteConvoProps = {
  conversationId: string;
};

const DeleteConvo = ({ conversationId }: DeleteConvoProps) => {
    const router = useRouter();
    return (
        <Button className='rounded-full' variant="destructive" onClick={async (e) => {
            e.stopPropagation();
            if (!window.confirm("Delete this conversation?")) {
                return;
            }
            try {
                await DeleteChat(conversationId);
                toast.success("Success!", {
                    description: "Successfully deleted conversation.",
                });
                router.refresh();
            } catch {
                toast.error("Oh No!", { description: "Failed to delete conversation. Please try again." });
            }
        }}><TrashIcon /></Button>
    )
}

export default DeleteConvo
