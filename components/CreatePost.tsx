'use client';

import React, { useRef, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { SidebarMenuButton } from './ui/sidebar'
import { PlusIcon } from 'lucide-react'
import { Button } from './ui/button'
import Image from 'next/image';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const router = useRouter();

    function addTag() {
        const tag = tagInput.trim().toLowerCase();

        if (!tag) return;

        if (tags.includes(tag)) {
            setTagInput("");
            return;
        }
        setTags(prev => [...prev, tag]);
        setTagInput("");
    }

    function removeTag(tag: string) {
        setTags(prev => prev.filter(t => t !== tag));
    }

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0];

        if (!selected) {
            return;
        }

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setError('');

        if (selected.size > 50 * 1024 * 1024) {
            setError("File Size must be less than 50MB");
            toast.error("Oh No!", {description: "File Size must be less than 50MB"});
            return
        }

        setFile(selected)

        const objectUrl = URL.createObjectURL(selected);

        setPreview(objectUrl);
    }

    async function handleSubmit() {
        try{
            if (!file) return;

        
            setUploading(true);
        

            const fileName = `${Date.now()}-${file.name}`;

            const { error } = await supabase.storage
                .from("PostsStorage")
                .upload(fileName, file);

            if (error) return;

            const { data: publicUrlData } = supabase.storage
                .from("PostsStorage")
                .getPublicUrl(fileName);

            await fetch("/api/posts", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                title,
                description,
                tags,
                media: [
                    {
                    url: publicUrlData.publicUrl,
                    type: file.type.startsWith("image/") ? "IMAGE" : "VIDEO",
                    },
                ],
                }),
            });

            toast.success("Success!", {description: "Successfully created a post."});
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false)
        }
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <form>
            <DialogTrigger asChild>
                    <SidebarMenuButton><PlusIcon />Create</SidebarMenuButton>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a Post</DialogTitle>
                        <DialogDescription>Fill out the fields to create your Post!</DialogDescription>
                    </DialogHeader>
                    <div className='mb-2'>
                        <p className='mb-1'>Title:</p>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} className='w-full border-2 rounded-md' placeholder='Title of your post' required />
                    </div>
                    <div className='mb-2'>
                        <p className='mb-1'>Description:</p>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} name='description' className='w-full border-2 rounded-md' placeholder='Description of your post' required />
                    </div>
                    <div className="mb-2">
                        <p className="mb-1">Tags</p>

                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map(tag => (
                            <span
                                key={tag}
                                className="rounded-full bg-muted px-3 py-1 text-sm cursor-pointer"
                                onClick={() => removeTag(tag)}
                            >
                                #{tag} ✕
                            </span>
                            ))}
                        </div>

                        <input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addTag();
                            }
                            }}
                            placeholder="Press Enter to add a tag"
                            className="w-full border rounded-md px-2 py-1"
                        />
                    </div>
                    <div className='mb-2'>
                        <p className='mb-1'>Image or Video:</p>
                        <div className="space-y-2">
                            <label htmlFor="media-upload" className="flex h-50 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-center hover:bg-accent">
                                {!preview && (
                                <div>
                                    <p className="font-medium">Upload Image or Video</p>
                                    <p className="text-sm text-muted-foreground">Click to browse</p>
                                </div>
                                )}

                                {preview && file?.type.startsWith('image/') && (
                                <Image src={preview} alt="Preview" width={500} height={500} className="h-full w-full rounded-lg object-cover" />
                                )}

                                {preview && file?.type.startsWith('video/') && (
                                <video src={preview} controls className="h-full w-full rounded-lg object-cover" />
                                )}
                            </label>

                            <input ref={inputRef} id="media-upload" type="file" accept="image/*,video/*" className="hidden" onChange={handleFiles} />
                            {file && (
                                <Button type='button' onClick={() => document.getElementById("media-upload")?.click()}>Change Media</Button>
                            )}
                            </div>
                        </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                        <Button type='button' disabled={uploading} onClick={handleSubmit}>{uploading? "Uploading..." : "Post"}</Button>
                    </DialogFooter>
                </DialogContent>
        </form>
    </Dialog>
  )
}

export default CreatePost
