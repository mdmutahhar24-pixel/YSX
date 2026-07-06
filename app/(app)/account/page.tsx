import PfpChange from '@/components/PfpChange';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/auth/server'
import { supabase } from '@/lib/supabase';
import { CameraIcon } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import SetDescription from '@/components/setDescription';
import ChangeBannerBtn from '@/components/changeBannerBtn';

export const dynamic = "force-dynamic";

const Account = async () => {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
        throw new Error("Unauthorized User");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });
    return (
        <div>
            <nav className='relative flex w-full items-center justify-center flex-col h-80 dark:bg-gray-900/50 bg-gray-300/50 top-0 z-50 p-10'>
                {user?.banner && (
                    <img src={user.banner} alt="banner" className='absolute inset-0 w-full h-full object-cover' />
                )}
                <div className='relative z-10 w-full flex flex-col items-center'>
                    <div className='relative group w-fit'>
                        <img src={user?.image ?? "/New-User.jpg"} alt='user logo' className='border-5 border-primary rounded-full size-40 mb-5 object-cover' />
                        
                        <PfpChange />
                    </div>
                    <h1 className='text-2xl mb-2 bg-primary p-2 rounded-3xl'>{session.user.name}</h1>
                    <Badge className='mb-5'>{session.user.role}</Badge>
                    <div className='flex w-full justify-end'>
                        <ChangeBannerBtn />
                    </div>
                </div>
            </nav>
            <div className='flex w-full h-full items-center justify-center flex-col'>
                
                <Separator />
                <h2 className='mt-5 text-xl font-bold underline'>Information</h2>
                <h2 className='mt-5'>Created At: {new Date(session.user.createdAt).toLocaleDateString()}</h2>

                <Separator className='mt-5' />
                <h2 className='mt-5 text-xl font-bold underline'>Customization</h2>
                <div className='border-2 p-10 mt-5 items-center flex flex-col justify-center'>
                    <h2 className='mt-5 items-center flex justify-center mb-5'>Description: "{user?.description ?? 'I am a YSX User!'}"</h2>
                    <SetDescription />
                </div>
            </div>
        </div>
    )
}

export default Account
