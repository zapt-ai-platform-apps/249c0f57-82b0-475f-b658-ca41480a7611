import React, { useState } from 'react';
import MainMenu from './modules/ui/MainMenu';
import Game from './modules/ui/Game';
import GameOverScreen from './modules/ui/GameOverScreen';

export default function App() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver
  const [score, setScore] = useState(0);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
  };

  const endGame = (finalScore) => {
    setScore(finalScore);
    setGameState('gameOver');
  };

  const returnToMenu = () => {
    setGameState('menu');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {gameState === 'menu' && <MainMenu onStartGame={startGame} />}
      {gameState === 'playing' && <Game onGameOver={endGame} />}
      {gameState === 'gameOver' && (
        <GameOverScreen score={score} onRestartGame={startGame} onReturnToMenu={returnToMenu} />
      )}
      <div className="fixed bottom-2 right-2 text-xs text-gray-500">
        Made on <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="underline">ZAPT</a>
      </div>
    </div>
  );
}