'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  roomCode: string;
}

export default function QRCodeDisplay({ roomCode }: QRCodeDisplayProps) {
  const clientUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000';
  const joinUrl = `${clientUrl}/play?code=${roomCode}`;

  return (
    <div className="text-center">
      <div className="inline-block p-2 bg-white rounded-lg">
        <QRCodeSVG
          value={joinUrl}
          size={200}
          bgColor="#ffffff"
          fgColor="#0a0a0f"
          level="M"
        />
      </div>
      <p className="text-text-secondary text-sm mt-3">
        Scan to join!
      </p>
    </div>
  );
}
