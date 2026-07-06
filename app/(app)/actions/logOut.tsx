'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function logout() {
  await auth.signOut();

  redirect('/sign-in');
}