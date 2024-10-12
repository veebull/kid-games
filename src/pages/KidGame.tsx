import React, { useState, useEffect, useRef } from 'react';
import { Cat, Dog, PawPrint, Sparkles, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import audio files
import catSoundFile from '@/assets/cute-cat.mp3';
import dogSoundFile from '@/assets/cute-bear.mp3';

const CatAndDogGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [catPosition, setCatPosition] = useState({ x: 50, y: 50 });
  const [dogPosition, setDogPosition] = useState({ x: 20, y: 20 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [catAnimation, setCatAnimation] = useState('');
  const [dogAnimation, setDogAnimation] = useState('');
  const [scoreChange, setScoreChange] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<number[]>([]);
  const catRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);
  const catAudio = useRef<HTMLAudioElement | null>(null);
  const dogAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    catAudio.current = new Audio(catSoundFile);
    dogAudio.current = new Audio(dogSoundFile);

    return () => {
      if (catAudio.current) {
        catAudio.current.pause();
        catAudio.current = null;
      }
      if (dogAudio.current) {
        dogAudio.current.pause();
        dogAudio.current = null;
      }
    };
  }, []);

  const handleStart = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    moveCharacterToNewPosition(setCatPosition);
    moveCharacterToNewPosition(setDogPosition);
  };

  const handleRestart = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(false);
    moveCharacterToNewPosition(setCatPosition);
    moveCharacterToNewPosition(setDogPosition);
  };

  const moveCharacterToNewPosition = (
    setPosition: (position: { x: number; y: number }) => void
  ) => {
    setPosition({
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
    });
  };

  const playSound = (audio: HTMLAudioElement | null) => {
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.5;
      audio.play().catch((error) => {
        console.error('Error playing sound:', error);
      });
    }
  };

  const updateScore = (change: number) => {
    setScore((prevScore) => {
      const newScore = Math.max(0, prevScore + change);
      console.log('Score updated:', newScore);
      return newScore;
    });
    setScoreChange(change);
    setTimeout(() => setScoreChange(null), 1000);
  };

  const handlePlayAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying) {
      handleStart();
      return;
    }

    const catElement = catRef.current;
    const dogElement = dogRef.current;

    if (catElement && catElement.contains(e.target as Node)) {
      updateScore(1);
      moveCharacterToNewPosition(setCatPosition);
      playSound(catAudio.current);
      setCatAnimation('scale');
      setTimeout(() => setCatAnimation(''), 300);
    } else if (dogElement && dogElement.contains(e.target as Node)) {
      updateScore(-2);
      moveCharacterToNewPosition(setDogPosition);
      playSound(dogAudio.current);
      setDogAnimation('shake');
      setTimeout(() => setDogAnimation(''), 300);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setLeaderboard((prevLeaderboard) => {
        const newLeaderboard = [...prevLeaderboard, score]
          .sort((a, b) => b - a)
          .slice(0, 5);
        return newLeaderboard;
      });
    }

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score]);

  useEffect(() => {
    let dogMoveInterval: NodeJS.Timeout;
    if (isPlaying) {
      dogMoveInterval = setInterval(() => {
        moveCharacterToNewPosition(setDogPosition);
      }, 2000);
    }
    return () => clearInterval(dogMoveInterval);
  }, [isPlaying]);

  return (
    <div className='w-full h-screen bg-gradient-to-b from-blue-300 to-purple-300 flex flex-col items-center justify-center p-4 overflow-hidden'>
      <h1 className='text-4xl font-bold mb-4 text-yellow-400 shadow-text'>
        Cat and Dog Game
      </h1>
      <div className='relative w-full h-full max-w-4xl max-h-[80vh] bg-gradient-to-br from-green-200 to-yellow-200 rounded-3xl shadow-2xl overflow-hidden'>
        <div className='absolute top-4 left-4 right-4 flex justify-between items-center'>
          <div className='text-2xl font-bold text-pink-600 shadow-text'>
            Score: {score}
            {scoreChange !== null && (
              <span
                className={`ml-2 ${
                  scoreChange > 0 ? 'text-green-500' : 'text-red-500'
                } shadow-text`}
              >
                {scoreChange > 0 ? `+${scoreChange}` : scoreChange}
              </span>
            )}
          </div>
          <div className='text-2xl font-bold text-blue-600 shadow-text'>
            Time: {timeLeft}s
          </div>
        </div>
        <div
          className='w-full h-full cursor-pointer'
          onClick={handlePlayAreaClick}
        >
          {isPlaying && (
            <>
              <div
                ref={catRef}
                className={`absolute transition-all duration-300 ease-in-out ${
                  catAnimation === 'scale' ? 'animate-bounce' : ''
                }`}
                style={{
                  left: `${catPosition.x}%`,
                  top: `${catPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Cat size={64} color='#FF69B4' />
              </div>
              <div
                ref={dogRef}
                className={`absolute transition-all duration-300 ease-in-out ${
                  dogAnimation === 'shake' ? 'animate-shake' : ''
                }`}
                style={{
                  left: `${dogPosition.x}%`,
                  top: `${dogPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Dog size={64} color='red' />
              </div>
            </>
          )}
          {!isPlaying && (
            <div className='flex items-center justify-center h-full'>
              <p className='text-3xl font-bold text-indigo-600 shadow-text'>
                {timeLeft === 30 ? 'Click anywhere to start!' : 'Game Over!'}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className='mt-4 bg-white bg-opacity-80 rounded-xl p-4 shadow-lg'>
        <h2 className='text-2xl font-bold mb-2 text-purple-600 shadow-text flex items-center'>
          <Trophy className='mr-2' /> Leaderboard
        </h2>
        <ol className='list-decimal list-inside'>
          {leaderboard.map((score, index) => (
            <li key={index} className='text-lg font-semibold text-indigo-700'>
              {score} points
            </li>
          ))}
        </ol>
      </div>
      <div className='mt-4 flex items-center justify-center space-x-4'>
        <PawPrint size={32} color='#FF69B4' />
        <Sparkles size={32} color='#FFD700' />
        <PawPrint size={32} color='#FF69B4' />
      </div>
    </div>
  );
};

export default CatAndDogGame;
