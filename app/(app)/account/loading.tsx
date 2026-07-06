import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
  return (
    <Card className='flex w-full items-center justify-center flex-col h-80 top-0 z-50 p-10'>
      <Skeleton className='rounded-full size-50' />
    </Card>
  )
}

export default loading
