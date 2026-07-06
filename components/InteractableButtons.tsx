'use client';

import React, { useState, useEffect } from 'react'
import { ButtonGroup } from './ui/button-group'
import { Button } from './ui/button'
import { ThumbsUpIcon, ThumbsDownIcon, MessageCircleMoreIcon, Share2Icon, SendIcon } from 'lucide-react'
import { Toggle } from './ui/toggle'
import Comments from './comments';

type properties = {
    postId: string
    Likes: boolean
    initialComments: any
    PostCreator: any
}

const InteractableButtons = ({ postId, Likes, initialComments, PostCreator }: properties) => {
    const [reaction, setReaction] = useState<"Like" | "Dislike" | null>(Likes ? "Like" : null);

    useEffect(() => {
        setReaction(Likes ? "Like" : null);
    }, [Likes]);

    const likeHandler = async (type: "Like" | "Dislike") => {
        const newReaction = reaction === type ? null : type;

        setReaction(newReaction);

        const res = await fetch("/api/likes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postId,
            }),
        });

        const data = await res.json();

        console.log("API RESPONSE:", data);

        setReaction(data.liked ? type : null);
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/feed/${postId}`;

        if (navigator.share) {
            await navigator.share({
            title: "YSX",
            text: "Check out this post!",
            url,
            });
        } else {
            await navigator.clipboard.writeText(url);
            alert("Link copied!");
        }
    };


  return (
    <ButtonGroup orientation="vertical" className='rounded-full'>
        <Toggle variant="outline" pressed={reaction === 'Like'} onPressedChange={(pressed) => {
            if (pressed) {
                likeHandler("Like");
            } else {
                setReaction(null);
            }
        }}><ThumbsUpIcon className={reaction === "Like" ? "fill-foreground" : ""} /></Toggle>
        <Comments postId={postId} initialComments={initialComments} postCreator={PostCreator} />
        <Button variant="outline" onClick={handleShare}><Share2Icon /></Button>
    </ButtonGroup>
  )
}

export default InteractableButtons
