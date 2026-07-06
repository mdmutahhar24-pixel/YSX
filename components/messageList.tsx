'use client';

import { getPusherClient } from '@/lib/pusher/client';
import React, { useEffect, useRef, useState } from 'react';
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase/messaging";
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup } from './ui/message';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Bubble, BubbleContent } from './ui/bubble';
import { MessageScroller, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from './ui/message-scroller';
import { Marker, MarkerContent } from './ui/marker';
import { Attachment, AttachmentMedia } from './ui/attachment';
type TypingUser = {
  id: string;
  name: string;
}

const MessageList = ({
  initialMessages,
  currentUserId,
  conversationId,
  otherUserId
}: {
  initialMessages: any;
  currentUserId: any;
  conversationId: string;
  otherUserId: any
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  
  

  const channelRef = useRef<any>(null);
  const handlerRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      const client = await getPusherClient();
      if (!client || !mounted) return;

      if (channelRef.current) return;

      const channel = client.subscribe(`presence-conversation-${conversationId}`);
      channelRef.current = channel;

      const handler = (message: any) => {
        setMessages((prev: any) => {
          if (prev.some((m: any) => m.id === message.id)) return prev;

          return [...prev, message];
        });
      };

      handlerRef.current = handler;

      channel.bind("new-message", handler);
      channel.bind("typing", (data: any) => {
          if (data.userId === currentUserId.id) {
            return;
          }

          setTypingUsers((prev) => {
            if (data.isTyping) {
              if (prev.some((u) => u.id === data.userId)) return prev;

              return [
                ...prev,
                {
                  id: data.userId,
                  name: data.userName,
                },
              ];
            }

            return prev.filter((u) => u.id !== data.userId);
          });
        });
    };

    setup();

    return () => {
      mounted = false;

      if (channelRef.current && handlerRef.current) {
        channelRef.current.unbind("new-message", handlerRef.current);
        channelRef.current.unsubscribe();
      }

      channelRef.current = null;
      handlerRef.current = null;
    };
  }, [conversationId]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
  

  return (
    <div className="flex flex-col min-h-full gap-3 p-2">
      <MessageScrollerProvider autoScroll>
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent>
                {messages.map((message: any) => (
                  <div key={message.id}>
                    <MessageScrollerItem key={message.id} messageId={message.id}>
                        <Message align={message.senderId === currentUserId.id ? "end" : "start"}>
                          <MessageAvatar>
                            <Avatar>
                              <AvatarImage src={message.senderId === currentUserId.id ? currentUserId.image ?? "/New-User.jpg" : otherUserId.image ?? "/New-User.jpg"} />
                              <AvatarFallback>{message.senderId === currentUserId.id ? currentUserId.name : otherUserId.name}</AvatarFallback>
                            </Avatar>
                          </MessageAvatar>
                          <MessageContent>
                            <Bubble variant={message.senderId === currentUserId.id ? "sent" : "received"} >
                              {message.attachmentType?.startsWith('image/') && (
                                <Attachment orientation="vertical">
                                  <AttachmentMedia><img src={message.attachmentUrl} /></AttachmentMedia>
                                </Attachment>
                              )}
                              {message.attachmentType?.startsWith('video/') && (
                                <div>
                                  <video src={message.attachmentUrl} controls className='rounded-2xl' />
                                </div>
                              )}
                              {message.text && (
                                <BubbleContent>{message.text}</BubbleContent>
                              )}
                            </Bubble>
                          </MessageContent>
                        </Message>
                    </MessageScrollerItem>

                  
                  </div>
                ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
      </MessageScrollerProvider>

      {typingUsers.length > 0 && (
        <Marker role="status">
          <MarkerContent>
            {typingUsers.map((u) => u.name).join(", ")}{" "}
            {typingUsers.length === 1
              ? "is typing..."
              : "are typing..."}
          </MarkerContent>
        </Marker>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;