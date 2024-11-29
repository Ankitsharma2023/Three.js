import React from 'react';
import Scene from './Scene';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white">
    <div className="w-full h-full">
      <Scene />
    </div>
  </div>
  );
};

export default App;