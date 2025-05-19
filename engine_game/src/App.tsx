import React, { useEffect, useRef, useState } from 'react';
import Sprite from './components/Sprite';
import Button from './components/Button';
import './App.css';

interface DebugInfo {
  isMoving: boolean;
  direction: 'left' | 'right' | null;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
}

function App() {
  const [spritePosition, setSpritePosition] = useState({ x: 350, y: 250 });
  const [spriteVelocity, setSpriteVelocity] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    isMoving: false,
    direction: null,
    position: { x: 350, y: 250 },
    velocity: { x: 0, y: 0 }
  });

  // Constants for game settings
  const FPS = 60;
  const FRAME_TIME = 1000 / FPS; // Time per frame in milliseconds
  const PIXELS_PER_SECOND = 300; // Base movement speed

  // Update sprite velocity based on direction
  useEffect(() => {
    const newVelocity = direction === 'left' ? -PIXELS_PER_SECOND : direction === 'right' ? PIXELS_PER_SECOND : 0;
    setSpriteVelocity({ x: newVelocity, y: 0 });
  }, [direction]);  

  // Game loop
  useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId: number;
    let accumulatedTime = 0;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      accumulatedTime += deltaTime;

      // Update only when we've accumulated enough time for a frame
      while (accumulatedTime >= FRAME_TIME) {
        setSpritePosition(prevPosition => {
          const newPosition = {
            x: prevPosition.x + (spriteVelocity.x / FPS), 
            y: prevPosition.y
          };

          // Keep sprite within bounds
          if (newPosition.x < 0) newPosition.x = 0;
          if (newPosition.x > 700) newPosition.x = 700;

          return newPosition;
        });

        accumulatedTime -= FRAME_TIME;
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [spriteVelocity]); // Only depend on velocity

  // Update debug info
  useEffect(() => {
    setDebugInfo({
      isMoving: direction !== null,
      direction: direction,
      position: spritePosition,
      velocity: spriteVelocity
    });
  }, [direction, spritePosition, spriteVelocity]);

  // Handle keyboard and mouse events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setDirection('left');
      } else if (e.key === 'ArrowRight') {
        setDirection('right');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setDirection(null);
      }
    };

    const handleMouseUp = () => {
      setDirection(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Handle move left button click
  const handleMoveLeftClick = () => {
    setDirection('left');
  };

  // Handle move right button click
  const handleMoveRightClick = () => {
    setDirection('right');
  };

  // Handle stop movement
  const handleStopMovement = () => {
    setDirection(null);
  };

  return (
    <div className="App">
      <div className="game-container" tabIndex={0}>
        <h1>Game Engine Demo</h1>
        <div className="controls">
          <p>Use Left/Right Arrow keys or buttons to move the sprite</p>
        </div>
        
        {/* Debug Info */}
        <div className="debug-info">
          <p>Moving: {debugInfo.isMoving ? 'Yes' : 'No'}</p>
          <p>Direction: {debugInfo.direction || 'None'}</p>
          <p>Position: X: {Math.round(debugInfo.position.x)}, Y: {Math.round(debugInfo.position.y)}</p>
          <p>Velocity: X: {Math.round(debugInfo.velocity.x)}, Y: {Math.round(debugInfo.velocity.y)}</p>
          <p>FPS: {FPS}</p>
        </div>

        {/* Movement Buttons */}
        <div className="movement-buttons">
          <Button
            onMouseDown={handleMoveLeftClick}
            onMouseUp={handleStopMovement}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                handleMoveLeftClick();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === 'ArrowLeft') {
                handleStopMovement();
              }
            }}
            cooldown={0.1}
            className="move-button"
          >
            ← Move Left
          </Button>



          <Button
            onMouseDown={handleMoveRightClick}
            onMouseUp={handleStopMovement}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                handleMoveRightClick();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === 'ArrowRight') {
                handleStopMovement();
              }
            }}
            cooldown={0.1}
            className="move-button"
          >
            Move Right →
          </Button>
        </div>
        
        {/* Sprite Container */}
        <div className="sprite-container">
          {/* Moving Sprite */}
          <Sprite
            src="/rank_bac.png"
            alt="Moving Sprite"
            width={50}
            height={50}
            position={spritePosition}
            velocity={spriteVelocity}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
