'use client';

import React, { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogFooter, DialogClose } from './ui/dialog';
import { CameraIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from './ui/button';

const PfpChange = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

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
                .from("AccountProfileStorage")
                .upload(fileName, file);

            if (error) return;

            const { data: publicUrlData } = supabase.storage
                .from("AccountProfileStorage")
                .getPublicUrl(fileName);

            const response = await fetch('/api/profile', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    image: publicUrlData.publicUrl
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            toast.success("Success!", {description: "Successfully changed profile picture."});
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false)
        }
    }
  return (
    <Dialog>
        <DialogTrigger asChild>
            <label className='absolute inset-0 flex size-40 items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full'><CameraIcon className='text-white' /></label>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Change Profile Picture</DialogTitle>
            </DialogHeader>
            <form
                className="w-full h-full"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div className='mb-5'>
                    <div className='space-y-4'>
                        <label htmlFor="media-upload" className="flex h-64 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-center hover:bg-accent">
                            {!preview && (
                                <div>
                                    <p className="font-medium">Upload Image</p>
                                    <p className="text-sm text-muted-foreground">Click to browse</p>
                                </div>
                            )}
                
                            {preview && (
                                <Image src={preview} alt='preview' width={500} height={50} className="h-full w-full rounded-lg object-cover" />
                            )}
                        </label>
                        <input ref={inputRef} id="media-upload" type="file" accept="image/*" className="hidden" onChange={handleFiles} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Close</Button>
                    </DialogClose>
                    <Button type='submit'>Change Profile Picture</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default PfpChange
