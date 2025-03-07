import React from 'react';

const MainMenu = ({ onStartGame }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="flex items-center mb-8">
        <img 
          src="/1000042413-removebg-preview.png" 
          alt="Player Character" 
          className="h-20 mr-4"
        />
        <h1 className="text-5xl font-bold">Subway Runner</h1>
      </div>
      
      <p className="text-xl mb-8 max-w-md text-center text-gray-300">
        Dodge obstacles, collect coins, and see how far you can run!
      </p>
      <button
        onClick={onStartGame}
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-full text-xl font-bold cursor-pointer transition-colors"
      >
        PLAY
      </button>
      
      <div className="mt-8 text-gray-400 text-sm">
        <p className="mb-2"><strong>Desktop:</strong> Arrow keys to move, jump, and slide</p>
        <p className="mb-2"><strong>Mobile:</strong> Swipe to move, tap buttons to jump and slide</p>
        <p><strong>New:</strong> Use on-screen directional buttons for easier control</p>
      </div>
    </div>
  );
};

export default MainMenu;