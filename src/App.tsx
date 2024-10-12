import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import Welcome from './pages/Welcome';

import CatAndDogGame from './pages/KidGame.tsx';
import FoamCatchingGame from './pages/FoamCatchingGame.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';

// AppWrapper component with authentication check

// Placeholder component for undefined routes
const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <h1 className='text-2xl font-bold mb-4'>Page Not Found</h1>
      <p>The page "{location.pathname.split('/').pop()}" is not available.</p>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <div className='min-h-screen w-screen bg-gradient-to-b from-blue-900 to-black p-4'>
          <Routes>
            <Route path='/kid-games/' element={<Welcome />} />
            <Route path='/kid-games/foamball' element={<FoamCatchingGame />} />
            <Route path='/kid-games/cat-and-dog' element={<CatAndDogGame />} />
            {/* Placeholder route for undefined paths */}
            <Route path='/kid-games/*' element={<PlaceholderPage />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;
