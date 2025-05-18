export interface GameComponent {
    onStart(): void;
    onUpdate(deltaTime: number): void;
} 