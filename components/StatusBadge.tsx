'use client'

import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { getPusherClient } from '@/lib/pusher/client'

const StatusBadge = ({
  conversationId,
  otherUserId,
}: {
  conversationId: string
  otherUserId: string
}) => {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    let channel: any

    const setup = async () => {
      const client = await getPusherClient()
      if (!client) return

      channel = client.subscribe(`presence-conversation-${conversationId}`)

      channel.bind('pusher:subscription_succeeded', (members: any) => {
        const found = members.get(otherUserId)
        setIsOnline(!!found)
      })

      channel.bind('pusher:member_added', (member: any) => {
        if (member.id === otherUserId) setIsOnline(true)
      })

      channel.bind('pusher:member_removed', (member: any) => {
        if (member.id === otherUserId) setIsOnline(false)
      })
    }

    setup()

    return () => {
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [conversationId, otherUserId])

  return (
    <Badge
      className={
        isOnline
          ? 'bg-green-700 text-white'
          : 'bg-gray-500 text-white'
      }
    >
      {isOnline ? 'Available' : 'Offline'}
    </Badge>
  )
}

export default StatusBadge