import { getFeed } from '@/app/(app)/actions/intrestRanker'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json([], { status: 400 })
  }

  const posts = await getFeed(userId)

  return NextResponse.json(posts)
}