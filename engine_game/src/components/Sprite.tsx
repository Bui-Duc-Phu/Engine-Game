import React, { useEffect, useRef } from 'react';
import { GameComponent } from '../core/GameComponent';

interface SpriteProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  position?: { x: number; y: number };
  velocity?: { x: number; y: number };
}

class SpriteComponent implements GameComponent {
  private position: { x: number; y: number };
  private velocity: { x: number; y: number };
  private element: HTMLImageElement | null = null;

  constructor(
    private props: SpriteProps,
    private onPositionChange: (position: { x: number; y: number }) => void
  ) {
    this.position = props.position || { x: 0, y: 0 };
    this.velocity = props.velocity || { x: 0, y: 0 };
  }

  onStart(): void {
    console.log('Sprite started at position:', this.position);
  }

  onUpdate(deltaTime: number): void {
    // Update position based on velocity
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    
    // Notify React component about position change
    this.onPositionChange(this.position);
  }

  setVelocity(velocity: { x: number; y: number }): void {
    this.velocity = velocity;
  }

  getPosition(): { x: number; y: number } {
    return this.position;
  }
}

const Sprite: React.FC<SpriteProps> = ({
  src,
  alt = '',
  width,
  height,
  className = '',
  position = { x: 0, y: 0 },
  velocity = { x: 0, y: 0 },
}) => {
  const [currentPosition, setCurrentPosition] = React.useState(position);
  const spriteRef = useRef<SpriteComponent | null>(null);

  // Update sprite position when props change
  useEffect(() => {
    if (spriteRef.current) {
      spriteRef.current.setVelocity(velocity);
    }
  }, [velocity]);

  // Update sprite position when props change
  useEffect(() => {
    if (spriteRef.current) {
      setCurrentPosition(position);
    }
  }, [position]);

  useEffect(() => {
    // Create sprite component instance
    spriteRef.current = new SpriteComponent(
      { src, alt, width, height, className, position, velocity },
      (newPosition) => {
        console.log('Position updated:', newPosition);
        setCurrentPosition(newPosition);
      }
    );

    // Cleanup
    return () => {
      spriteRef.current = null;
    };
  }, []);

  return (
    <div 
      className="sprite-wrapper"
      style={{
        position: 'absolute',
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        transition: 'all 0.016s linear'
      }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`sprite ${className}`}
        style={{
          display: 'block'
        }}
      />
    </div>
  );
};

export default Sprite; 