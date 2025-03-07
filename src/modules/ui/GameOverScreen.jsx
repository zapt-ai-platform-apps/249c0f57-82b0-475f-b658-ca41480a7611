import React from 'react';

const GameOverScreen = ({ score, onRestartGame, onReturnToMenu }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-5xl font-bold mb-2">Game Over</h1>
      <p className="text-3xl mb-8">Score: {score}</p>
      <div className="flex space-x-4">
        <button
          onClick={onRestartGame}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-full text-xl font-bold cursor-pointer transition-colors"
        >
          Play Again
        </button>
        <button
          onClick={onReturnToMenu}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-full text-xl font-bold cursor-pointer transition-colors"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;