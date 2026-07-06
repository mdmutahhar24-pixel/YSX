import { Separator } from '@/components/ui/separator'
import React from 'react'

const Changelog = () => {
  return (
    <div className='text-center w-full h-full mt-10'>
      <h1 className='text-3xl font-bold mb-5'>Changelog</h1>
      <Separator />
      <h2 className='mt-5 text-lg font-bold'><span className='text-amber-600'>Version 1.0.0:</span> Release</h2>
      <p className='pt-2'>Welcome to YSX! This is the changelog, where the owner {'('}Mohammed Mutahhar Sultan{")"} posts any updates or releases to YSX! This release includes adding: </p>
      <ul className='list-disc'>
        <li>Posts</li>
        <li>Moderation</li>
        <li>User Customization</li>
        <li>And Many More!</li>
      </ul>
      <p>I could list on and on about this release, but that would be a waste of time. Well, what are you waiting for? Go Explore YSX now!</p>
    </div>
  )
}

export default Changelog
