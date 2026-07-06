'use client';

import React, { useRef, useState, useEffect } from 'react'
import { Button } from './ui/button'
import { sendMessage } from '@/app/(app)/actions/message'
import { PlusIcon, SendIcon, XCircleIcon, XIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/lib/supabase';
import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging } from '@/lib/firebase/messaging';
import imageCompression from "browser-image-compression";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from './ui/attachment';
import { Spinner } from './ui/spinner';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Marker, MarkerContent } from './ui/marker';


type ChatInputProperties = {
  conversationId: string;
  currentUserId: string;
  currentUserName: string;
}

let ffmpegInstance: any = null;
let ffmpegLoaded = false;

async function getFFmpeg() {
  if (typeof window === "undefined") return null;

  if (!ffmpegInstance) {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    ffmpegInstance = new FFmpeg();
  }

  if (!ffmpegLoaded) {
    await ffmpegInstance.load();
    ffmpegLoaded = true;
  }

  return ffmpegInstance;
}

async function compressVideo(file: File): Promise<File> {
  const ffmpeg = await getFFmpeg();
  if (!ffmpeg) throw new Error("FFmpeg not available");

  const inputName = "input.mp4";
  const outputName = "output.mp4";

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  await ffmpeg.exec([
    "-i",
    inputName,
    "-vcodec",
    "libx264",
    "-crf",
    "30",
    "-preset",
    "veryfast",
    "-movflags",
    "faststart",
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);

  const output = await ffmpeg.readFile(outputName);

  const blob = new Blob([output.buffer], { type: "video/mp4" });

  return new File([blob], file.name.replace(/\.\w+$/, ".mp4"), {
    type: "video/mp4",
  });
}

const ChatInput = ({ conversationId, currentUserId, currentUserName }: ChatInputProperties) => {
  const MessageSend = sendMessage.bind(null, conversationId)
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentType, setAttachmentType] = useState("");
  const [compressing, setCompressing] = useState(false);

  useEffect(() => {
    if (!attachment) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(attachment);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [attachment]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFile = e.target.files?.[0];
    if (!inputFile) return;

    let finalFile: File;

    if (inputFile.type.startsWith("image/")) {
      finalFile = await imageCompression(inputFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1280,
      });
    } 
    else if (inputFile.type.startsWith("video/")) {
      setCompressing(true);

      finalFile = await compressVideo(inputFile);

      setCompressing(false);
    } 
    else {
      finalFile = inputFile;
    }

    setAttachment(finalFile);

    const filePath = `messages/${Date.now()}-${finalFile.name}`;

    const { data, error } = await supabase.storage
      .from("ChatAttachments")
      .upload(filePath, finalFile);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("ChatAttachments")
      .getPublicUrl(filePath);

    setAttachmentUrl(urlData.publicUrl);
    setAttachmentType(finalFile.type);
  };

  const handleTyping = async () => {
    await fetch('/api/typing', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        userId: currentUserId,
        userName: currentUserName,
        isTyping: true
      }),
    });


    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(async () => {
      await fetch("/api/typing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          userId: currentUserId,
          userName: currentUserName,
          isTyping: false,
        }),
      });
    }, 1200);

  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
      async function registerFCM() {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;
  
        const messaging = await getFirebaseMessaging();
        if (!messaging) return;
  
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
        });
  
        await fetch("/api/saveToken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      }
  
      registerFCM();
    }, []);

  return (
    <footer className="sticky bottom-0 z-50 p-5 border-t bg-background">
      <form action={async (formData) => {MessageSend(formData)}} className="flex items-center gap-2">

        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant="ghost" className="rounded-full" onClick={() => fileInputRef.current?.click()}>
              <PlusIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Attachments</p>
          </TooltipContent>
        </Tooltip>

        <input ref={fileInputRef} hidden type='file' onChange={handleFileChange} />

        <input type="hidden" name="attachmentUrl" value={attachmentUrl} />

        <input type="hidden" name="attachmentType" value={attachmentType} />
        {compressing === true && (
          <div className='border rounded-lg p-3 mb-2 items-center text-center flex flex-col'>
            <Spinner />
            <Marker role='status' className='pt-2'>
              <MarkerContent>Compressing your file...</MarkerContent>
            </Marker>
          </div>
        )}
        {attachment && (
          <div className="border rounded-lg p-3 mb-2">
            {attachment.type.startsWith("image/") && (
              <Attachment className="w-full">
                <AttachmentMedia>
                  <img src={previewUrl ?? undefined} />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{attachment.name}</AttachmentTitle>
                  <AttachmentDescription>{(attachment.size/1000000).toFixed(2)} MB</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction onClick={() => {setAttachment(null); setAttachmentUrl(""); setAttachmentType(""); if (fileInputRef.current) {fileInputRef.current.value = "";}}} aria-label="Cancel upload">
                    <XCircleIcon />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            )} {(attachment.type.startsWith("video/")) && (
              <Attachment className='w-full'>
                <AttachmentMedia>
                  <video src={previewUrl ?? undefined} className='max-h-40 rounded-lg mb-2' />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{attachment.name}</AttachmentTitle>
                  <AttachmentDescription>{(attachment.size/1000000).toFixed(2)} MB</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction disabled={compressing} onClick={() => {setAttachment(null); setAttachmentUrl(""); setAttachmentType(""); if (fileInputRef.current) {fileInputRef.current.value = "";}}} aria-label="Cancel upload">
                    <XCircleIcon />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            )}
          </div>
        )}
        <textarea onChange={handleTyping} name="text" onKeyDown={handleKeyDown} className="flex-1 resize-none rounded-full border pt-5 px-5 no-scrollbar" placeholder="Type your message..." />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button disabled={compressing} type="submit" variant="ghost" className="rounded-full">
              <SendIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send</p>
          </TooltipContent>
        </Tooltip>

      </form>
    </footer>
  );

}

export default ChatInput
