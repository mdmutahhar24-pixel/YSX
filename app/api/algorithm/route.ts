import { getFeed } from "@/app/(app)/actions/intrestRanker"
import { NextResponse } from "next/server"


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")!

    const Posts = getFeed(userId)

    return NextResponse.json(Posts);
}