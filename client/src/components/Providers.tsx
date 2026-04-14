'use client';

import { RoomProvider } from '@/context/RoomContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <RoomProvider>{children}</RoomProvider>;
}
