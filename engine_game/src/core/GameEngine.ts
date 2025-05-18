import { GameComponent } from './GameComponent';

export class GameEngine {
    private components: GameComponent[] = [];
    private lastTime: number = 0;
    private fps: number = 60;
    private frameTime: number = 1000 / 60; // Time per frame in milliseconds
    private isRunning: boolean = false;
    private animationFrameId: number | null = null;
    private spritePosition: { x: number; y: number } = { x: 0, y: 0 };
    private spriteVelocity: { x: number; y: number } = { x: 0, y: 0 };

    constructor(fps: number = 60) {
        this.setFPS(fps);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.update = this.update.bind(this);
    }

    public setFPS(fps: number): void {
        this.fps = fps;
        this.frameTime = 1000 / fps;
    }

    public getFPS(): number {
        return this.fps;
    }

    public addComponent(component: GameComponent): void {
        this.components.push(component);
        component.onStart();
    }

    public removeComponent(component: GameComponent): void {
        const index = this.components.indexOf(component);
        if (index !== -1) {
            this.components.splice(index, 1);
        }
    }

    public start(): void {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame(this.update);
        }
    }

    public stop(): void {
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    private update(currentTime: number): void {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;

        // Update all components
        this.components.forEach(component => {
            component.onUpdate(deltaTime);
        });

        requestAnimationFrame(this.update);
    }

    // New methods for sprite control
    updateSpritePosition(position: { x: number; y: number }): void {
        this.spritePosition = position;
    }

    updateSpriteVelocity(velocity: { x: number; y: number }): void {
        this.spriteVelocity = velocity;
    }

    getSpritePosition(): { x: number; y: number } {
        return this.spritePosition;
    }

    getSpriteVelocity(): { x: number; y: number } {
        return this.spriteVelocity;
    }
} 