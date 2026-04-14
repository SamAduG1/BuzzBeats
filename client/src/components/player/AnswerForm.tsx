'use client';

import { useState } from 'react';
import { useRoom } from '@/context/RoomContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface Props {
  timeRemaining: number;
}

export default function AnswerForm({ timeRemaining }: Props) {
  const { submitAnswer } = useRoom();
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitted) return;
    if (!artist.trim() && !title.trim()) return;

    setSubmitted(true);
    await submitAnswer(artist.trim(), title.trim());
  };

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Card className="text-center py-8 px-6">
          <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse-dot mx-auto mb-4" />
          <p className="text-text-primary text-lg">Answer submitted!</p>
          <p className="text-text-secondary text-sm mt-1">Waiting for result...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh] w-full">
      <Card className="w-full py-6 px-4">
        <div className="text-center mb-4">
          <p className="text-neon-magenta font-bold text-lg mb-1">You buzzed in!</p>
          <p className="font-[family-name:var(--font-mono)] text-neon-yellow text-3xl font-bold">
            {timeRemaining}s
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-text-secondary text-xs uppercase tracking-wider mb-1 block">
              Song Title (2 pts)
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter song title..."
              autoFocus
            />
          </div>
          <div>
            <label className="text-text-secondary text-xs uppercase tracking-wider mb-1 block">
              Artist (1 pt)
            </label>
            <Input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Enter artist name..."
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Submit Answer
          </Button>
          <p className="text-text-secondary text-xs text-center">
            Fill in one or both fields. Both correct = 3 pts!
          </p>
        </form>
      </Card>
    </div>
  );
}
