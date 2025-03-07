import React, { useEffect, useRef, useState } from 'react';
import GameHUD from './GameHUD';
import { initializeGame, startGameLoop, stopGameLoop } from '../core/GameLoop';

const Game = ({ onGameOver }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const game = initializeGame(canvas, {
      onScoreUpdate: setScore,
      onGameOver: () => onGameOver(score),
    });
    
    startGameLoop(game);
    
    // Handle keyboard inputs
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          game.moveLeft();
          break;
        case 'ArrowRight':
          game.moveRight();
          break;
        case 'ArrowUp':
          game.jump();
          break;
        case 'ArrowDown':
          game.slide();
          break;
      }
    };
    
    // Handle touch inputs with improved detection
    const handleTouchStart = (e) => {
      e.preventDefault();
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e) => {
      e.preventDefault();
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX.current;
      const diffY = touchEndY - touchStartY.current;
      
      // Improved swipe detection with reduced threshold
      const swipeThreshold = 30; // Reduced threshold for easier detection
      
      // Detect horizontal swipe for lane change
      if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          game.moveRight();
        } else {
          game.moveLeft();
        }
      }
      
      // Detect vertical swipe for jump/slide
      if (Math.abs(diffY) > swipeThreshold && Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY < 0) {
          game.jump();
        } else {
          game.slide();
        }
      }
    };
    
    const handleTouchMove = (e) => {
      // Prevent default to stop scrolling
      e.preventDefault();
    };
    
    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Update lane positions
      const laneSpacing = 100;
      game.lanes = [
        canvas.width / 2 - laneSpacing,
        canvas.width / 2,
        canvas.width / 2 + laneSpacing,
      ];
    };
    
    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('resize', handleResize);
    
    return () => {
      console.log('Cleaning up game resources');
      stopGameLoop();
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [onGameOver, score]);
  
  // Handle directional controls for mobile
  const handleMoveLeft = () => {
    if (canvasRef.current && canvasRef.current.game) {
      canvasRef.current.game.moveLeft();
    }
  };
  
  const handleMoveRight = () => {
    if (canvasRef.current && canvasRef.current.game) {
      canvasRef.current.game.moveRight();
    }
  };
  
  const handleTapJump = () => {
    if (canvasRef.current && canvasRef.current.game) {
      canvasRef.current.game.jump();
    }
  };
  
  const handleTapSlide = () => {
    if (canvasRef.current && canvasRef.current.game) {
      canvasRef.current.game.slide();
    }
  };
  
  return (
    <div className="w-full h-screen relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      <GameHUD score={score} />
      
      {/* Enhanced mobile controls with all directions */}
      <div className="md:hidden absolute bottom-20 left-0 right-0 flex flex-col items-center">
        {/* Up button (jump) */}
        <button
          className="bg-white bg-opacity-30 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 cursor-pointer active:bg-opacity-50"
          onClick={handleTapJump}
          aria-label="Jump"
        >
          ↑
        </button>
        
        {/* Left/Right buttons */}
        <div className="flex justify-between w-48 mb-2">
          <button
            className="bg-white bg-opacity-30 w-16 h-16 rounded-full flex items-center justify-center text-3xl cursor-pointer active:bg-opacity-50"
            onClick={handleMoveLeft}
            aria-label="Move Left"
          >
            ←
          </button>
          
          <button
            className="bg-white bg-opacity-30 w-16 h-16 rounded-full flex items-center justify-center text-3xl cursor-pointer active:bg-opacity-50"
            onClick={handleMoveRight}
            aria-label="Move Right"
          >
            →
          </button>
        </div>
        
        {/* Down button (slide) */}
        <button
          className="bg-white bg-opacity-30 w-16 h-16 rounded-full flex items-center justify-center text-3xl cursor-pointer active:bg-opacity-50"
          onClick={handleTapSlide}
          aria-label="Slide"
        >
          ↓
        </button>
      </div>
    </div>
  );
};

export default Game;