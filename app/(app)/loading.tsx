import { Spinner } from '@/components/ui/spinner'
import React from 'react'

const loading = () => {
  return (
    <div className="w-full h-full items-center flex justify-center">
      <Spinner />
    </div>
  )
}

export default loading
