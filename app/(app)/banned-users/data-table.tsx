import BanButton from '@/components/banButton';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { prisma } from '@/lib/prisma';
import React from 'react'
import UnbanButton from '@/components/UnbanBtn';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { ShieldBanIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getUsers() {
    const users = await prisma.user.findMany({
        where: { banned: true }
    });
    return users;
}

const DataTable = async () => {
    const users = await getUsers();
    

    if (users.length === 0) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <ShieldBanIcon />
                    </EmptyMedia>
                    <EmptyTitle>No Banned Users</EmptyTitle>
                    <EmptyDescription>Yippee! There are no banned users :{")"}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button><Link href="/all-users">Go to all Users</Link></Button>
                </EmptyContent>
            </Empty>
        )
    }

    return (
        <div className='rounded-md border w-300 items-center m-auto flex justify-center mt-5'>
            <Table>
                <TableCaption>A table containing all the BANNED users at YSX!</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-25">Username</TableHead>
                    <TableHead>User Id</TableHead>
                    <TableHead>Account Created At</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ban Status</TableHead>
                    <TableHead>Ban Expiry</TableHead>
                    <TableHead>Ban Reason</TableHead>
                    <TableHead>Lift Ban on User</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell><span className={user.banned ? "text-red-500" : "text-green-500"}>{user.banned ? "Banned" : "Active"}</span></TableCell>
                            <TableCell>{user.banExpiry?.toLocaleDateString()}</TableCell>
                            <TableCell>{user.banReason}</TableCell>
                            <TableCell>
                                <UnbanButton userId={user.id} username={user.name ?? ""} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default DataTable
