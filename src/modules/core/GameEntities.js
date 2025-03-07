// Player entity factory
export const createPlayer = (width, height, initialLane = 1) => {
  return {
    x: 0, // Will be set based on lane
    y: 0, // Will be set during initialization
    width,
    height,
    speed: 5,
    jumpForce: 15,
    velocityY: 0,
    gravity: 0.8,
    isJumping: false,
    isSliding: false,
    lane: initialLane, // 0: left, 1: center, 2: right
  };
};

// Obstacle factory
export const createObstacle = (x, y, width, height, lane) => {
  return {
    x,
    y,
    width,
    height,
    lane,
    passed: false
  };
};

// Coin factory
export const createCoin = (x, y, radius, lane) => {
  return {
    x,
    y,
    radius,
    lane,
    collected: false
  };
};

// Background element factory
export const createBackgroundElement = (x, y, width, height) => {
  return {
    x,
    y,
    width,
    height
  };
};