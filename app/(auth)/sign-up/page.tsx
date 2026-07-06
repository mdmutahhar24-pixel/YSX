'use client';

import React, { useActionState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { SignUp as signup } from './action';
import { toast } from 'sonner';

const SignUp = () => {
  const [state, formAction, isPending] = useActionState(signup, null)

  useEffect(() => {
    if (state?.error) {
      toast.error("Oh No!", {description: state.error});
    }
  }, [state])

  return (
    <div className='flex min-h-screen'>
      <div className="w-1/2 flex items-center justify-center p-10 border-r-2">
        <div className="w-full max-w-md text-center">
          <h1 className='text-3xl mb-2'>Register</h1>
          <p className='mb-10'>Already have an account? <Link href="/sign-in" className='underline'> Sign In!</Link></p>
          <form action={formAction}>
            <div className='text-left mb-5'>
              <p>Username:</p>
              <input name='name' className='w-full dark:text-white text-black border-2 dark:border-white border-black rounded-md' type="text" placeholder='Username here' required/>
            </div>
            <div className='text-left mb-5'>
              <p>Email:</p>
              <input name='email' className='w-full dark:text-white text-black border-2 dark:border-white border-black rounded-md' type="email" placeholder='example@gmail.com' required/>
            </div>
            <div className='text-left mb-5'>
              <p>Make a Password:</p>
              <input name='password' className='w-full dark:text-white text-black border-2 dark:border-white border-black rounded-md' type="password" placeholder='Make a password' required/>
            </div>
            <div>
              <Button type='submit' className='w-full rounded-2xl'>{isPending? "Signing You Up..." : "Register"}</Button>
            </div>
          </form>
        </div>
      </div>
      <div className='w-1/2 flex items-center justify-center'>
      <img src="/Logo-removebg.png" alt='YSX Logo' className='max-w-full h-auto' />
      </div>
    </div>
  )
}

export default SignUp
