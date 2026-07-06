'use client';

import { useTheme } from 'next-themes'
import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const ThemeButton = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

  return (
    <Button className='w-full dark:bg-black hover:dark:bg-black dark:border-white border border-black dark:text-white bg-white text-black hover:bg-white cursor-pointer' onClick={() => setTheme(resolvedTheme == 'dark' ? "light" : "dark")}><span>{resolvedTheme === 'dark' ? "Dark" : "Light"} </span> {resolvedTheme == 'dark' ? <Moon /> : <Sun />}</Button>
  )
}

export default ThemeButton
