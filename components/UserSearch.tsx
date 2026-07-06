'use client';

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { redirectChat } from "@/app/(app)/actions/chatRedirection";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = {
    id: string;
    name: string | null;
    image: string | null;
};

type Props = {
    users: User[];
};

export default function UserSearch({ users }: Props) {
    const [query, setQuery] = useState("");
    const [pending, startTransition] = useTransition();

    const router = useRouter();

    const filteredUsers = useMemo(() => {
        const q = query.toLowerCase().trim();

        if (!q) return users;

        return users.filter((user) =>
            user.name?.toLowerCase().includes(q)
        );
    }, [query, users]);

    async function openChat(userId: string) {
        startTransition(async () => {
            const conversationId = await redirectChat(userId);

            router.push(`/chat/${conversationId}`);
        });
    }

    return (
        <div className="space-y-4">
            <Input
                placeholder="Who would you like to talk to today?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <ScrollArea className="h-80 rounded-md border">
                {filteredUsers.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                        No users found.
                    </div>
                ) : (
                    <div className="p-2 space-y-1">
                        {filteredUsers.map((user) => (
                            <button
                                key={user.id}
                                disabled={pending}
                                onClick={() => openChat(user.id)}
                                className="flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                            >
                                <Avatar>
                                    <AvatarImage
                                        src={user.image ?? "/New-User.jpg"}
                                    />
                                    <AvatarFallback>
                                        {user.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col items-start">
                                    <span className="font-medium">
                                        {user.name}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        Click to start chatting
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}