import { auth } from "@/lib/auth/server";
import { pusherServer } from "@/lib/pusher/server";

export async function POST(req: Request) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.formData();

  const socketId = body.get("socket_id") as string;
  const channel = body.get("channel_name") as string;

  const authResponse = pusherServer.authorizeChannel(
    socketId,
    channel,
    {
      user_id: session.user.id,
      user_info: {
        name: session.user.name,
        image: session.user.image,
      },
    }
  );

  return Response.json(authResponse);
}