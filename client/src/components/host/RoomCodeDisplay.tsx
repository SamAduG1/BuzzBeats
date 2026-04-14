interface RoomCodeDisplayProps {
  code: string;
}

export default function RoomCodeDisplay({ code }: RoomCodeDisplayProps) {
  const characters = code.split('');

  return (
    <div className="text-center">
      <p className="text-text-secondary text-sm uppercase tracking-widest mb-3">
        Room Code
      </p>
      <div className="flex gap-3 justify-center">
        {characters.map((char, i) => (
          <div
            key={i}
            className="
              w-16 h-20 md:w-20 md:h-24
              flex items-center justify-center
              border-2 border-neon-cyan rounded-lg
              glow-cyan
              font-[family-name:var(--font-mono)]
              text-4xl md:text-5xl font-bold text-neon-cyan
            "
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  );
}
