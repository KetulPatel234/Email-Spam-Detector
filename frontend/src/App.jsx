import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SpamManager from './pages/SpamManager';

const App = () => {
  return (
    <BrowserRouter>
      <div className="bg-gray-50 min-h-screen">
        <Routes>
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/" element={<SpamManager />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
