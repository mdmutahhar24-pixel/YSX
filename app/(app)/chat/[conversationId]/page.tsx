import React from 'react'
import ChatHeader from '@/components/chatHeader'
import ChatInput from '@/components/chatInput'
import ChatContent from '@/components/chatContent'
import { auth } from "@/lib/auth/server";

const Chat = async ({ params }: { params: Promise<{ conversationId: string }> }) => {
  const { conversationId } = await params;

  const { data: session } = await auth.getSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="flex flex-col h-dvh w-full">
      <ChatHeader conversationId={conversationId} />

      <div className="flex-1 overflow-y-auto">
        <ChatContent conversationId={conversationId} />
      </div>

      <ChatInput
        conversationId={conversationId}
        currentUserId={session.user.id}
        currentUserName={session.user.name ?? "Unknown"}
      />
    </div>
  );
};

export default Chat;
