import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './core/GameEngine';
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

  // Update sprite velocity based on direction
  useEffect(() => {
    const newVelocity = direction === 'left' ? -200 : direction === 'right' ? 200 : 0;
    setSpriteVelocity({ x: newVelocity, y: 0 });
  }, [direction]);

  // Game loop
  useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId: number;

    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      setSpritePosition(prevPosition => {
        const newPosition = {
          x: prevPosition.x + spriteVelocity.x * deltaTime,
          y: prevPosition.y
        };

        // Keep sprite within bounds
        if (newPosition.x < 0) newPosition.x = 0;
        if (newPosition.x > 700) newPosition.x = 700;

        return newPosition;
      });

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

  // Handle keyboard events
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

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle button click
  const handleButtonClick = () => {
    const initialPosition = { x: 350, y: 250 };
    setSpritePosition(initialPosition);
    setSpriteVelocity({ x: 0, y: 0 });
    setDirection(null);
  };

  return (
    <div className="App">
      <div className="game-container" tabIndex={0}>
        <h1>Game Engine Demo</h1>
        <div className="controls">
          <p>Use Left/Right Arrow keys to move the sprite</p>
          <p>Click the button to reset position</p>
        </div>
        
        {/* Debug Info */}
        <div className="debug-info">
          <p>Moving: {debugInfo.isMoving ? 'Yes' : 'No'}</p>
          <p>Direction: {debugInfo.direction || 'None'}</p>
          <p>Position: X: {Math.round(debugInfo.position.x)}, Y: {Math.round(debugInfo.position.y)}</p>
          <p>Velocity: X: {Math.round(debugInfo.velocity.x)}, Y: {Math.round(debugInfo.velocity.y)}</p>
        </div>
        
        {/* Sprite Container */}
        <div className="sprite-container">
          {/* Moving Sprite */}
          <Sprite
            src="/rank_bac.png"
            alt="Moving Sprite"
            width={100}
            height={100}
            position={spritePosition}
            velocity={spriteVelocity}
          />
        </div>
        {/* Control Button */}


        <div className="button-container">
          <Button
            onClick={handleButtonClick}
            cooldown={0.5}
          >
            Reset Position
          </Button>
        </div>


      </div>
    </div>
  );
}

export default App;
