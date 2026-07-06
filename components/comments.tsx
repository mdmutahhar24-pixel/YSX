'use client';

import React, { useState, useEffect } from 'react'
import { Sheet, SheetTrigger, SheetFooter, SheetHeader, SheetContent, SheetTitle } from './ui/sheet'
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip'
import { Button } from './ui/button'
import { MessageCircleMoreIcon, SendIcon } from 'lucide-react'
import { createComment } from '@/app/(app)/actions/comment';
import { getPusherClient } from '@/lib/pusher/client';
import { Avatar, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';

type CommentProps = {
    postId: string;
    initialComments: any[];
    postCreator: any;
}

const Comments = ({postId, initialComments, postCreator}: CommentProps) => {
    const [comments, setComments] = useState(initialComments);
    const [text, setText] = useState("");
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
        }
    };

    useEffect(() => {
        let channel: any;

        const setup = async () => {
            const client = await getPusherClient();

            channel = client.subscribe(`post-${postId}`);

            channel.bind("new-comment", (comment: any) => {
                setComments(prev => [...prev, comment]);
            });
        };

        setup();

        return () => {
            if (channel) {
                channel.unbind_all();
                channel.unsubscribe();
            }
        };
    }, [postId]);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline"><MessageCircleMoreIcon /></Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Comments</SheetTitle>
                </SheetHeader>
                <div className="space-y-3">
                    {comments.map((comment: any) => (
                        <div key={comment.id} className="flex gap-3">
                            <Avatar>
                                <AvatarImage src={comment.user.image ?? "/New-User.jpg"} />
                            </Avatar>

                            <div>
                                <div className='flex flex-row justify-between'>
                                    <p className={comment.user.name === postCreator ? "font-medium rounded-xl bg-accent-foreground text-accent" : "font-medium text-muted-foreground"}>
                                        @{comment.user.name}
                                    </p>
                                    <p className='pl-5 text-muted-foreground'>{formatDistanceToNow(new Date(comment.Sent), { addSuffix: true })}</p>
                                </div>
                                <p>{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <SheetFooter className='flex flex-row'>
                    <form
                        action={async () => {
                            if (!text.trim()) return;

                            await createComment(postId, text);

                            setText("");
                        }}
                        className='w-full'
                    >
                        <div className='w-full flex flex-row'>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="resize-none rounded-full border pt-2 px-2 no-scrollbar w-full"
                                placeholder="Comment..."
                                onKeyDown={handleKeyDown}
                            />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button type="submit" variant="ghost" className="rounded-full">
                                    <SendIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Send</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </form>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default Comments
