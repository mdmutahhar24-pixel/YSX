'use client';

import React, { useActionState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LogIn } from './action';
import { toast } from 'sonner';

const SignIn = () => {
  const [state, formAction, isPending] = useActionState(LogIn, null)

  useEffect(() => {
    if (state?.error) {
      toast.error("Oh No!", {description: state.error});
    }
  }, [state])

  return (
    <div className='flex min-h-screen'>
      <div className="w-1/2 flex items-center justify-center p-10 border-r-2">
        <div className="w-full max-w-md text-center">
          <h1 className='text-3xl mb-2'>Sign In</h1>
          <p className='mb-10'>Don't have an account? <Link href="/sign-up" className='underline'> Register!</Link></p>
          <form action={formAction}>
            <div className='text-left mb-5'>
              <p>Email:</p>
              <input name='email' className='w-full dark:text-white text-black border-2 dark:border-white border-black rounded-md' type="email" placeholder='example@gmail.com' required/>
            </div>
            <div className='text-left mb-5'>
              <p>Password:</p>
              <input name='password' className='w-full dark:text-white text-black border-2 dark:border-white border-black rounded-md' type="password" placeholder='Password' required/>
            </div>
            <div>
              <Button type='submit' className='w-full rounded-2xl'>{isPending? "Logging You Back In..." : "Sign In"}</Button>
            </div>
          </form>
        </div>
      </div>
      <div className='w-1/2 flex items-center justify-center'>
        <img src="/Logo-removebg.png" alt='logo' className='max-w-full h-auto' />
      </div>
    </div>
  )
}

export default SignIn
