import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
  return (
    <div className='w-full h-full mt-20'>
      <Skeleton className='w-full h-20 mb-5' />
      <Skeleton className='w-full h-20 mb-5' />
      <Skeleton className='w-full h-20 mb-5' />
      <Skeleton className='w-full h-20 mb-5' />
      <Skeleton className='w-full h-20' />
    </div>
  )
}

export default loading
