import React, { useEffect, useRef, useState } from 'react';
import { GameComponent } from '../core/GameComponent';

interface ButtonProps {
  onClick?: () => void;
  onKeyUp?: (event: React.KeyboardEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  cooldown?: number; // Cooldown time in seconds
}

class ButtonComponent implements GameComponent {
  private cooldownTime: number;
  private currentCooldown: number = 0;
  private isOnCooldown: boolean = false;
  private isKeyPressed: boolean = false;
  private isMousePressed: boolean = false;

  constructor(
    private props: ButtonProps,
    private onCooldownChange: (isOnCooldown: boolean) => void,
    private onMouseStateChange: (isPressed: boolean) => void
  ) {
    this.cooldownTime = props.cooldown || 0;
  }

  onStart(): void {
    // Initialize button if needed
  }

  onUpdate(deltaTime: number): void {
    if (this.isOnCooldown) {
      this.currentCooldown -= deltaTime;
      if (this.currentCooldown <= 0) {
        this.isOnCooldown = false;
        this.onCooldownChange(false);
      }
    }
  }

  trigger(): boolean {
    if (!this.isOnCooldown && !this.props.disabled) {
      if (this.props.onClick) {
        this.props.onClick();
      }
      if (this.cooldownTime > 0) {
        this.isOnCooldown = true;
        this.currentCooldown = this.cooldownTime;
        this.onCooldownChange(true);
      }
      return true;
    }
    return false;
  }

  handleKeyDown(event: React.KeyboardEvent): void {
    if (!this.isKeyPressed && !this.props.disabled) {
      this.isKeyPressed = true;
      if (this.props.onKeyDown) {
        this.props.onKeyDown(event);
      }
    }
  }

  handleKeyUp(event: React.KeyboardEvent): void {
    if (this.isKeyPressed) {
      this.isKeyPressed = false;
      if (this.props.onKeyUp) {
        this.props.onKeyUp(event);
      }
    }
  }

  handleMouseDown(): void {
    if (!this.props.disabled) {
      this.isMousePressed = true;
      this.onMouseStateChange(true);
      if (this.props.onMouseDown) {
        this.props.onMouseDown();
      }
    }
  }

  handleMouseUp(): void {
    if (this.isMousePressed) {
      this.isMousePressed = false;
      this.onMouseStateChange(false);
      if (this.props.onMouseUp) {
        this.props.onMouseUp();
      }
    }
  }
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  onKeyUp,
  onKeyDown,
  onMouseDown,
  onMouseUp,
  children,
  className = '',
  disabled = false,
  cooldown = 0,
}) => {
  const [isOnCooldown, setIsOnCooldown] = React.useState(false);
  const [isMousePressed, setIsMousePressed] = React.useState(false);
  const buttonRef = useRef<ButtonComponent | null>(null);

  useEffect(() => {
    // Create button component instance
    buttonRef.current = new ButtonComponent(
      { onClick, onKeyUp, onKeyDown, onMouseDown, onMouseUp, children, className, disabled, cooldown },
      setIsOnCooldown,
      setIsMousePressed
    );

    // Cleanup
    return () => {
      buttonRef.current = null;
    };
  }, []);

  const handleClick = () => {
    if (buttonRef.current) {
      buttonRef.current.trigger();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (buttonRef.current) {
      buttonRef.current.handleKeyDown(event);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (buttonRef.current) {
      buttonRef.current.handleKeyUp(event);
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    if (buttonRef.current) {
      buttonRef.current.handleMouseDown();
    }
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    if (buttonRef.current) {
      buttonRef.current.handleMouseUp();
    }
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    event.preventDefault();
    if (isMousePressed && buttonRef.current) {
      buttonRef.current.handleMouseUp();
    }
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${isMousePressed ? 'bg-blue-700' : ''} ${className}`}
      disabled={disabled}
    >
      {children}
      {isOnCooldown && <span className="ml-2">(Cooldown)</span>}
    </button>
  );
};

export default Button; 