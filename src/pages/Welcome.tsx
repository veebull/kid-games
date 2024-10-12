import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

const Welcome: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center'>
      <Card className='w-[350px] bg-white shadow-xl'>
        <CardHeader>
          <CardTitle className='text-3xl font-bold text-center text-purple-600'>
            Kid Games
          </CardTitle>
          <CardDescription className='text-center text-lg text-gray-600'>
            Choose a fun game to play!
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <Link to='/kid-games/cat-and-dog'>
            <Button className='w-full h-16 text-xl bg-green-500 hover:bg-green-600 text-white'>
              Cat and Dog
            </Button>
          </Link>
          <Link to='/kid-games/foamball'>
            <Button className='w-full h-16 text-xl bg-blue-500 hover:bg-blue-600 text-white'>
              Foambubble
            </Button>
          </Link>
        </CardContent>
        <div className='mt-4 pt-4 border-t border-gray-200'>
          <div className='flex flex-col items-center'>
            <p className='text-xl font-bold text-purple-700 mb-2'>
              Thank you for playing!
            </p>
            <Link
              to='https://t.me/arveer'
              target='_blank'
              rel='noopener noreferrer'
              className='w-full'
            >
              <Button className='w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105'>
                <span>Say thanks! </span>
                <span className='text-yellow-300 text-2xl'>♥</span>
                {/* Using a generic icon as Telegram component is not available */}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-6 h-6'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M22 2L11 13'></path>
                  <path d='M22 2l-7 20-4-9-9-4 20-7z'></path>
                </svg>
              </Button>
            </Link>
          </div>
          <p className='text-sm text-gray-500 mt-2 text-center'>
            Connect with the creator on Telegram
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Welcome;
