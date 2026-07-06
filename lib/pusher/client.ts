'use client';

let pusherClient: any = null;

export const getPusherClient = async () => {
  if (typeof window === "undefined") return null;

  if (!pusherClient) {
    const Pusher = (await import("pusher-js")).default;

    pusherClient = new Pusher(
      process.env.NEXT_PUBLIC_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_CLUSTER!,
        channelAuthorization: {
          endpoint: "/api/pusherAuth",
          transport: "ajax"
        }
      }
    );
  }

  return pusherClient;
};