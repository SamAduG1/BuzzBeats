'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface JoinFormProps {
  initialCode?: string;
  onJoin: (roomCode: string, displayName: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function JoinForm({ initialCode = '', onJoin, isLoading, error }: JoinFormProps) {
  const [roomCode, setRoomCode] = useState(initialCode);
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim() && displayName.trim()) {
      onJoin(roomCode.trim().toUpperCase(), displayName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-sm">
      <Input
        label="Room Code"
        placeholder="ABCD"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 4))}
        maxLength={4}
        className="text-center text-2xl font-[family-name:var(--font-mono)] tracking-[0.5em] uppercase"
        autoComplete="off"
      />
      <Input
        label="Display Name"
        placeholder="Enter your name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value.slice(0, 20))}
        maxLength={20}
        autoComplete="off"
      />
      {error && (
        <p className="text-neon-red text-sm text-center">{error}</p>
      )}
      <Button
        type="submit"
        disabled={!roomCode.trim() || !displayName.trim() || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? 'Joining...' : 'Join Game'}
      </Button>
    </form>
  );
}
