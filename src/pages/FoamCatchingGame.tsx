import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle, Cat, Volume2, VolumeX } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const GAME_DURATION = 60; // 1 minute in seconds
const BUBBLE_COUNT = 30; // Number of bubbles
import popAudioFile from '@/assets/pop.mp3';
import backgroundMusicFile from '@/assets/fun-game-music.mp3';

interface FoamBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
}

const COLORS = [
  { name: 'Red', value: '#FF6B6B' },

  { name: 'Green', value: '#00FF00' },

  { name: 'Light Blue', value: '#1E90FF' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Gold', value: '#FFD700' },
  { name: 'Lemon', value: '#FFFACD' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Purple', value: '#8A2BE2' },
  { name: 'Pink', value: '#FF69B4' },
  { name: 'Lime', value: '#32CD32' },
  { name: 'Cyan', value: '#00FFFF' },
  { name: 'Magenta', value: '#FF00FF' },
  { name: 'Coral', value: '#FF7F50' },
];

const FoamCatchingGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState<number[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  console.log(showLeaderboard);
  const [fillPercentage, setFillPercentage] = useState(0);
  const [showWinMessage, setShowWinMessage] = useState(false);
  console.log(showWinMessage);
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [isMusicOn, setIsMusicOn] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const bubblesRef = useRef<FoamBubble[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const storedLeaderboard = localStorage.getItem('foamGameLeaderboard');
    if (storedLeaderboard) {
      setLeaderboard(JSON.parse(storedLeaderboard));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Check if the device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMusicOn(!isMobile);

    if (bgMusicRef.current) {
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.2;
    }

    return () => {
      clearInterval(timer);
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) {
      if (isMusicOn) {
        bgMusicRef.current
          .play()
          .catch((e) => console.error('Error playing background music:', e));
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [isMusicOn]);

  useEffect(() => {
    const colorChangeInterval = setInterval(() => {
      setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }, 10000); // Change color every 10 seconds

    return () => clearInterval(colorChangeInterval);
  }, []);

  const createBubble = useCallback((canvas: HTMLCanvasElement): FoamBubble => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      id: Math.random(),
      x: Math.random() * canvas.width,
      y: -Math.random() * 50,
      size: Math.random() * 40 + 30,
      speed: Math.random() * 1 + 1,
      color: color.value,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (bubblesRef.current.length === 0) {
      bubblesRef.current = Array.from({ length: BUBBLE_COUNT }, () =>
        createBubble(canvas)
      );
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubblesRef.current.forEach((bubble) => {
        bubble.y += bubble.speed;
        if (bubble.y - bubble.size > canvas.height) {
          Object.assign(bubble, createBubble(canvas));
        }

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        if (bubble.color === targetColor.value) {
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createBubble, targetColor]);

  const handleCatch = useCallback(
    (
      event:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x =
        (event as React.MouseEvent).clientX ||
        (event as React.TouchEvent).touches[0].clientX - rect.left;
      const y =
        (event as React.MouseEvent).clientY ||
        (event as React.TouchEvent).touches[0].clientY - rect.top;

      const clickedBubble = bubblesRef.current.find(
        (bubble) =>
          Math.sqrt((bubble.x - x) ** 2 + (bubble.y - y) ** 2) < bubble.size / 2
      );

      if (clickedBubble) {
        if (clickedBubble.color === targetColor.value) {
          setScore((prevScore) => prevScore + 1);
          setFillPercentage((prevFill) => {
            const newFill = Math.min(prevFill + 2, 100);
            if (newFill === 100) {
              setShowWinMessage(true);
            }
            return newFill;
          });
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current
              .play()
              .catch((e) => console.error('Error playing audio:', e));
          }
        } else {
          setFillPercentage((prevFill) => Math.max(prevFill - 1, 0));
        }
        Object.assign(clickedBubble, createBubble(canvas));
      }
    },
    [createBubble, targetColor]
  );

  const updateLeaderboard = useCallback(() => {
    const newLeaderboard = [...leaderboard, score]
      .sort((a, b) => b - a)
      .slice(0, 5);
    setLeaderboard(newLeaderboard);
    localStorage.setItem('foamGameLeaderboard', JSON.stringify(newLeaderboard));
  }, [leaderboard, score]);

  const restartGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setShowLeaderboard(false);
    setFillPercentage(0);
    setShowWinMessage(false);
    if (canvasRef.current) {
      bubblesRef.current = Array.from({ length: BUBBLE_COUNT }, () =>
        createBubble(canvasRef.current!)
      );
    }
  }, [createBubble]);

  const toggleMusic = useCallback(() => {
    setIsMusicOn((prev) => !prev);
  }, []);

  return (
    <div className='w-full h-screen bg-gradient-to-b from-blue-400 to-purple-600 overflow-hidden relative'>
      <audio ref={audioRef} src={popAudioFile} />
      <audio ref={bgMusicRef} src={backgroundMusicFile} />
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none z-0'>
        <div className='relative w-3/4 h-3/4'>
          <Cat className='w-full h-full text-white' style={{ opacity: 0.1 }} />
          <div className='absolute inset-0 overflow-hidden'>
            <Cat
              className='w-full h-full text-yellow-300 animate-water-fill'
              style={{
                clipPath: `inset(${Math.max(
                  100 - fillPercentage,
                  0.01
                )}% 0 0 0)`,
                transition: 'clip-path 0.3s ease-out',
              }}
            />
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className='absolute inset-0 z-10'
        onClick={handleCatch}
        onTouchStart={handleCatch}
      />
      <div className='absolute top-4 left-4 text-2xl font-bold text-white z-20 pointer-events-none'>
        Score: {score}
      </div>
      <div className='absolute top-4 right-4 text-2xl font-bold text-white z-20 pointer-events-none'>
        Time: {timeLeft}s
      </div>
      <div
        className='absolute inset-x-0 top-1/2 transform -translate-y-1/2 text-4xl font-bold text-center z-20 pointer-events-none'
        style={{
          color: targetColor.value,
          textShadow: `-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff`,
        }}
      >
        Catch: {targetColor.name}
      </div>
      <div className='absolute bottom-4 left-4 text-2xl font-bold text-white z-20 pointer-events-none'>
        Fill: {fillPercentage}%
      </div>
      {gameOver && (
        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30'>
          <Alert variant='default' className='w-96'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Game Over!</AlertTitle>
            <AlertDescription>
              Your final score: {score}
              <button
                className='mt-4 bg-blue-500 text-white px-4 py-2 rounded mr-2'
                onClick={() => {
                  updateLeaderboard();
                  setShowLeaderboard(true);
                }}
              >
                View Leaderboard
              </button>
              <button
                className='mt-4 bg-green-500 text-white px-4 py-2 rounded'
                onClick={restartGame}
              >
                Play Again
              </button>
            </AlertDescription>
          </Alert>
        </div>
      )}
      {/* Leaderboard and win message components remain unchanged */}
      {/* Volume control button */}
      <button
        className='absolute top-12 right-12 z-20 xbg-black bg-opacity-50 p-2 rounded-full'
        onClick={toggleMusic}
      >
        {isMusicOn ? (
          <Volume2 className='w-6 h-6 text-white' />
        ) : (
          <VolumeX className='w-6 h-6 text-white' />
        )}
      </button>
    </div>
  );
};

export default FoamCatchingGame;
