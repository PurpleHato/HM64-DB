import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './queryClient';
import LandingPage from './pages/LandingPage';
import GamePage from './pages/GamePage';
import DatabaseView from './pages/DatabaseView';

const App: React.FC = () => {
  // Get base path from environment or use default
  const basename = import.meta.env.BASE_URL || '/';

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/:gameId" element={<GamePage />}>
            <Route path=":databaseId" element={<DatabaseView />} />
            <Route path=":databaseId/:subcategory" element={<DatabaseView />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
