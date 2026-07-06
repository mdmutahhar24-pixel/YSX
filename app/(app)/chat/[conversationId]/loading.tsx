import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
  return (
    <div className="flex flex-col h-dvh w-full">
      <div className="flex flex-col h-full">
        <Skeleton className='w-full h-20' />

        <div className="flex-1 overflow-y-auto">
          <Skeleton className='w-full h-auto' />
        </div>

        <Skeleton className='w-full h-20' />
      </div>
    </div>
  )
}

export default loading
