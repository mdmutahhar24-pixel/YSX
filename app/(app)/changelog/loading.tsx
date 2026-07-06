import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
  return (
    <div className='w-full'>
      <Skeleton className='h-20 w-full' />
    </div>
  )
}

export default loading
