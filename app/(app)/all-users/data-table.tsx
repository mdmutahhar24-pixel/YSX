import BanButton from '@/components/banButton';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UnbanButton from '@/components/UnbanBtn';
import { prisma } from '@/lib/prisma';
import React from 'react'

async function getUsers() {
    const users = await prisma.user.findMany();
    return users;
}

const DataTable = async () => {
    const users = await getUsers();
    

    return (
        <div className='rounded-md border w-300 items-center m-auto flex justify-center mt-5'>
            <Table>
                <TableCaption>A table containing all the users at YSX!</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-25">Username</TableHead>
                    <TableHead>User Id</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ban Status</TableHead>
                    <TableHead>Ban/Unban User</TableHead>
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
                            <TableCell>
                                {user.banned ? (<UnbanButton userId={user.id} username={user.name ?? ""} />) : (<BanButton username={user.name ?? ""} userId={user.id} />)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default DataTable
