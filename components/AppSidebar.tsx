import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarFooter, SidebarMenuItem, SidebarMenu, SidebarGroupLabel, SidebarTrigger, SidebarGroupContent, SidebarMenuButton, SidebarSeparator } from './ui/sidebar'
import ThemeToggler from './modeChangeBtn'
import { Button } from './ui/button'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { auth } from '@/lib/auth/server'
import { LogOutIcon, HomeIcon, CirclePlayIcon, MessageCircle, SettingsIcon, User, NewspaperIcon, ShieldBanIcon, UserCog2Icon, VideoIcon } from 'lucide-react'
import CreatePost from './CreatePost'
import { logout } from '@/app/(app)/actions/logOut'

const AppSidebar = async () => {
    const { data: session } = await auth.getSession();

  return (
    <Sidebar>
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <ThemeToggler />
                </SidebarMenuItem>
            </SidebarMenu>
            <SidebarSeparator />
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent className='flex justify-center items-center text-center'>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild><Link href="/"><HomeIcon />Home</Link></SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild><Link href="/feed"><CirclePlayIcon />Feed</Link></SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild><Link href="/changelog"><NewspaperIcon />Changelog</Link></SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel>Interactivity</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <CreatePost />
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild><Link href="/chat"><MessageCircle />Chat</Link></SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel>Your Activity</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild><Link href="/settings"><SettingsIcon />Settings</Link></SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild><Link href="/account"><User />Account Details</Link></SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            {session?.user.role === 'admin' && (
                <SidebarGroup>
                    <SidebarGroupLabel>Admin</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild><Link href="/banned-users"><ShieldBanIcon />Banned Users</Link></SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild><Link href="/all-users"><UserCog2Icon />All Users</Link></SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            )}
        </SidebarContent>
        <SidebarFooter>
            <SidebarSeparator />
            <SidebarMenu>
                <SidebarMenuItem className='flex flex-row w-full'>
                    <Avatar className='dark:border-white border-black border-2'>
                        <AvatarImage src="/New-User.jpg" alt='pfp' />
                        <AvatarFallback>User</AvatarFallback>
                    </Avatar>
                    <h1 className='text-xs pl-5'>{session?.user.name}</h1>
                    <div className='flex justify-end w-full h-full'>
                        <form action={logout}>
                            <Button type='submit' variant="destructive"><LogOutIcon /></Button>
                        </form>
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
