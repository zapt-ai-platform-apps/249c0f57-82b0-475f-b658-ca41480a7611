import React from 'react';

const GameHUD = ({ score }) => {
  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-50 p-3 rounded-lg">
      <p className="text-xl font-bold">Score: {score}</p>
    </div>
  );
};

export default GameHUD;