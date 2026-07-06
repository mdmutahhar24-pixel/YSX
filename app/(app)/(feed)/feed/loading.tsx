import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
  return (
    <Card className="w-full max-w-lg aspect-9/16">
      <CardHeader>
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full" />
      </CardContent>
    </Card>
  )
}

export default loading
