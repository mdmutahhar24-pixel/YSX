'use client';

import { useRouter } from 'next/navigation';
import { ComboboxItem } from './ui/combobox';

export default function RedirectConvo({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  const router = useRouter();

  return (
    <ComboboxItem
  value="test"
  onClick={() => console.log("CLICKED")}
>
  Test User
</ComboboxItem>
  );
}