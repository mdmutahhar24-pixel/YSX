'use client';

import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ChangeBannerBtn = () => {
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
                .from("BannerStorage")
                .upload(fileName, file);

            if (error) return;

            const { data: publicUrlData } = supabase.storage
                .from("BannerStorage")
                .getPublicUrl(fileName);

            await fetch('/api/banner', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    banner: publicUrlData.publicUrl
                })
            })

            toast.success("Success!", {description: "Successfully changed banner."});
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false)
        }
    }



    return (
        <div className='w-full flex justify-end'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Change Banner</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <h1>Change Banner</h1>
                    </DialogHeader>
                    <form className='w-full h-full' action={handleSubmit}>
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
                                <Button variant="outline">Close</Button>
                            </DialogClose>
                            <Button type='submit'>Change Banner</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ChangeBannerBtn
