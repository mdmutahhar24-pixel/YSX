import { auth } from '@/lib/auth/server'
import { prisma } from '@/lib/prisma';
import { logout } from '@/app/(app)/actions/logOut';
import { Button } from './ui/button';
import React from 'react'

const BannedScreen = async () => {
    const { data: session } = await auth.getSession();

    if (!session?.user) return;

    const bannedUsers = await prisma.user.findUnique({
    where: {
      id: session.user.id,
      banned: true
    }
  });

  if (bannedUsers) {
    return (
      <div className="h-dvh w-full flex items-center justify-center">
          <div className="max-w-md text-center space-y-4 border p-6 rounded-xl">
            <h1 className="text-2xl font-bold text-red-500">
              You have been banned from YSX.
            </h1>

            <p className="text-muted-foreground">
              <strong>Reason: </strong>{bannedUsers.banReason}
            </p>

            <p><strong>Ban Expiry Date: </strong>{bannedUsers.banExpiry?.toLocaleDateString()}</p>

              <form action={logout}>
                <Button variant="destructive" className='mr-5'>Log Out</Button>  
              </form>
        </div>
      </div>
    )
  }
}

export default BannedScreen
