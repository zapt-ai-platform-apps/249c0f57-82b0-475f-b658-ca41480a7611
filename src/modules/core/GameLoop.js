let animationFrameId = null;
let lastTime = 0;
let game = null;

// Define colors
const COLORS = {
  player: '#FFD700', // Gold
  obstacle: '#FF4136', // Red
  coin: '#39CCCC', // Teal
  background: '#001F3F', // Navy
  lane: 'rgba(255, 255, 255, 0.2)',
};

export const initializeGame = (canvas, callbacks) => {
  const ctx = canvas.getContext('2d');
  
  const laneWidth = 80;
  const laneSpacing = 100;
  
  game = {
    ctx,
    canvas,
    player: {
      x: canvas.width / 2,
      y: canvas.height - 100,
      width: 30,
      height: 60,
      speed: 5,
      jumpForce: 15,
      velocityY: 0,
      gravity: 0.8,
      isJumping: false,
      isSliding: false,
      lane: 1, // 0: left, 1: center, 2: right
    },
    lanes: [
      canvas.width / 2 - laneSpacing,
      canvas.width / 2,
      canvas.width / 2 + laneSpacing,
    ],
    laneWidth,
    obstacles: [],
    coins: [],
    score: 0,
    distance: 0,
    speed: 5,
    baseSpeed: 5,
    maxSpeed: 15,
    acceleration: 0.0001,
    spawnRate: 0.02,
    coinSpawnRate: 0.03,
    backgroundElements: [],
    bgSpeed: 2,
    callbacks,
    
    // Game methods
    moveLeft() {
      if (this.player.lane > 0) {
        this.player.lane--;
      }
    },
    
    moveRight() {
      if (this.player.lane < 2) {
        this.player.lane++;
      }
    },
    
    jump() {
      if (!this.player.isJumping) {
        this.player.isJumping = true;
        this.player.velocityY = -this.player.jumpForce;
      }
    },
    
    slide() {
      if (!this.player.isSliding && !this.player.isJumping) {
        this.player.isSliding = true;
        this.player.height = 30;
        
        // Reset after slide animation
        setTimeout(() => {
          this.player.isSliding = false;
          this.player.height = 60;
        }, 1000);
      }
    },
    
    update(deltaTime) {
      // Increase distance and speed
      this.distance += this.speed;
      this.speed = Math.min(this.maxSpeed, this.baseSpeed + this.distance * this.acceleration);
      
      // Update player position
      this.player.x = this.lanes[this.player.lane];
      
      // Apply gravity
      if (this.player.isJumping) {
        this.player.y += this.player.velocityY;
        this.player.velocityY += this.player.gravity;
        
        // Check if player landed
        if (this.player.y >= this.canvas.height - 100) {
          this.player.y = this.canvas.height - 100;
          this.player.isJumping = false;
          this.player.velocityY = 0;
        }
      }
      
      // Spawn obstacles
      if (Math.random() < this.spawnRate) {
        const lane = Math.floor(Math.random() * 3);
        this.obstacles.push({
          x: this.lanes[lane],
          y: -50,
          width: 30,
          height: 30,
          lane,
        });
      }
      
      // Spawn coins
      if (Math.random() < this.coinSpawnRate) {
        const lane = Math.floor(Math.random() * 3);
        this.coins.push({
          x: this.lanes[lane],
          y: -50,
          radius: 10,
          lane,
          collected: false,
        });
      }
      
      // Update obstacles
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obstacle = this.obstacles[i];
        obstacle.y += this.speed;
        
        // Remove obstacles that are off-screen
        if (obstacle.y > this.canvas.height) {
          this.obstacles.splice(i, 1);
          this.score += 5;
          this.callbacks.onScoreUpdate(this.score);
        }
        
        // Check for collision
        if (
          !obstacle.passed &&
          this.player.x < obstacle.x + obstacle.width / 2 &&
          this.player.x + this.player.width / 2 > obstacle.x - obstacle.width / 2 &&
          this.player.y - this.player.height < obstacle.y &&
          this.player.y > obstacle.y - obstacle.height
        ) {
          console.log('Collision detected! Game over.');
          this.callbacks.onGameOver();
        }
      }
      
      // Update coins
      for (let i = this.coins.length - 1; i >= 0; i--) {
        const coin = this.coins[i];
        coin.y += this.speed;
        
        // Remove coins that are off-screen
        if (coin.y > this.canvas.height) {
          this.coins.splice(i, 1);
        }
        
        // Check if player collected coin
        if (
          !coin.collected &&
          Math.abs(this.player.x - coin.x) < this.player.width / 2 + coin.radius &&
          Math.abs(this.player.y - this.player.height / 2 - coin.y) < this.player.height / 2 + coin.radius
        ) {
          coin.collected = true;
          this.coins.splice(i, 1);
          this.score += 10;
          this.callbacks.onScoreUpdate(this.score);
        }
      }
      
      // Generate background elements
      if (Math.random() < 0.05) {
        this.backgroundElements.push({
          x: Math.random() * this.canvas.width,
          y: -20,
          width: Math.random() * 40 + 10,
          height: Math.random() * 40 + 10,
        });
      }
      
      // Update background elements
      for (let i = this.backgroundElements.length - 1; i >= 0; i--) {
        const elem = this.backgroundElements[i];
        elem.y += this.bgSpeed;
        
        if (elem.y > this.canvas.height) {
          this.backgroundElements.splice(i, 1);
        }
      }
    },
    
    render() {
      // Clear canvas with background color
      this.ctx.fillStyle = COLORS.background;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw background elements
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      this.backgroundElements.forEach(elem => {
        this.ctx.fillRect(elem.x, elem.y, elem.width, elem.height);
      });
      
      // Draw lanes
      this.ctx.fillStyle = COLORS.lane;
      for (let i = 0; i < this.lanes.length; i++) {
        this.ctx.fillRect(
          this.lanes[i] - this.laneWidth / 2,
          0,
          this.laneWidth,
          this.canvas.height
        );
      }
      
      // Draw coins
      this.ctx.fillStyle = COLORS.coin;
      this.coins.forEach(coin => {
        this.ctx.beginPath();
        this.ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        this.ctx.fill();
      });
      
      // Draw obstacles
      this.ctx.fillStyle = COLORS.obstacle;
      this.obstacles.forEach(obstacle => {
        this.ctx.fillRect(
          obstacle.x - obstacle.width / 2,
          obstacle.y - obstacle.height,
          obstacle.width,
          obstacle.height
        );
      });
      
      // Draw player
      this.ctx.fillStyle = COLORS.player;
      this.ctx.fillRect(
        this.player.x - this.player.width / 2,
        this.player.y - this.player.height,
        this.player.width,
        this.player.height
      );
    },
  };
  
  // Store game reference on canvas for external access
  canvas.game = game;
  
  return game;
};

export const startGameLoop = (gameInstance) => {
  console.log('Starting game loop');
  game = gameInstance;
  lastTime = 0;
  animationFrameId = requestAnimationFrame(gameLoop);
};

export const stopGameLoop = () => {
  console.log('Stopping game loop');
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

const gameLoop = (timestamp) => {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  
  if (game) {
    game.update(deltaTime);
    game.render();
  }
  
  animationFrameId = requestAnimationFrame(gameLoop);
};