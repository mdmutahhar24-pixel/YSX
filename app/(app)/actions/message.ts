'use server';

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher/server";
import { messaging } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";


export async function sendMessage(
  conversationId: string,
  formData: FormData
) {
  const { data: session } = await auth.getSession();
  
  const currentUserId = session?.user.id;

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
    if (!session?.user) throw new Error("Unauthorized");
  

  const text = formData.get("text") as string;
  const attachmentUrl = formData.get("attachmentUrl") as string | null;

  const attachmentType = formData.get("attachmentType") as string | null;


  const message = await prisma.message.create({
    data: {
      text,
      conversationId,
      senderId: session.user.id,
      attachmentUrl,
      attachmentType
    },
    include: {
      user: true,
    },
  });

  await pusherServer.trigger(
    `presence-conversation-${conversationId}`,
    "new-message",
    message
  );
  
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: { include: { user: true } },
      },
    });
  
    const recipients = conversation?.participants.map(p => p.user).filter(u => u.id !== session.user.id);

    if (!recipients) return;
      
    for (const user of recipients) {
      try {
        if (!user.pushToken) continue;
        const res = await messaging.send({
          token: user.pushToken,
          notification: {
            title: message.user?.name ?? "New message",
            body: message.text ?? "",
          },
        });
      } catch (err) {
        console.error("FCM failed:", err);
      }
    }

    revalidatePath(`/chat/${conversationId}`);

  

  return message;
}