'use client'

import { useEffect, useRef } from "react";
import * as paper from "paper";

const SpaceWarpTunnel = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // 1. Initialize isolated PaperScope context
        const scope = new paper.PaperScope();
        scope.setup(canvasRef.current);
        scope.activate();

        const STAR_COUNT = 400;
        const CONSTANT_SPEED = 25; // Set to a fast, stable cruising speed

        interface Star {
            x: number;       // 3D X (-view.width to view.width)
            y: number;       // 3D Y (-view.height to view.height)
            z: number;       // 3D Z depth (0 to max depth)
            path: paper.Path; // The rendered Paper.js vector shape
        }

        const stars: Star[] = [];
        const MAX_DEPTH = 1000;

        // Permanently locked center coordinates
        let centerX = scope.view.size.width / 2;
        let centerY = scope.view.size.height / 2;

        // Initialize stars with random positions in 3D space
        for (let i = 0; i < STAR_COUNT; i++) {
            const starPath = new scope.Path({
                strokeColor: 'white',
                strokeCap: 'round',
                strokeWidth: 2
            });

            stars.push({
                x: (Math.random() - 0.5) * scope.view.size.width * 2,
                y: (Math.random() - 0.5) * scope.view.size.height * 2,
                z: Math.random() * MAX_DEPTH,
                path: starPath
            });
        }

        // Handle window resizing to keep the warp centered
        scope.view.onResize = () => {
            centerX = scope.view.size.width / 2;
            centerY = scope.view.size.height / 2;
        };

        // 2. The Perspective Matrix Animation Loop
        scope.view.onFrame = (event: any) => {
            stars.forEach((star) => {
                const fov = 400; // Field of view focal constant

                // Track current 2D layout projections before editing depth
                const prevX = (star.x * fov) / star.z + centerX;
                const prevY = (star.y * fov) / star.z + centerY;

                // Move star closer to the screen down the Z-axis at a constant rate
                star.z -= CONSTANT_SPEED;

                // If the star passes the viewport camera plane, recycle it to the back
                if (star.z <= 0) {
                    star.z = MAX_DEPTH;
                    star.x = (Math.random() - 0.5) * scope.view.size.width * 2;
                    star.y = (Math.random() - 0.5) * scope.view.size.height * 2;
                    star.path.segments = [];
                    return;
                }

                // Calculate the updated 2D coordinates after structural shifts
                const nextX = (star.x * fov) / star.z + centerX;
                const nextY = (star.y * fov) / star.z + centerY;

                // If coordinates fly off the boundaries, clear them out to prevent vector render bloat
                if (nextX < 0 || nextX > scope.view.size.width || nextY < 0 || nextY > scope.view.size.height) {
                    star.path.segments = [];
                    return;
                }

                // Make lines dynamically thicker as they approach the camera viewport
                const sizeFactor = (1 - star.z / MAX_DEPTH);
                star.path.strokeWidth = sizeFactor * 5;

                // Connect the coordinates together to draw the vector light trail
                star.path.segments = [
                    new scope.Segment(new scope.Point(prevX, prevY)),
                    new scope.Segment(new scope.Point(nextX, nextY))
                ];
            });
        };

        return () => {
            if (scope.project) {
                scope.project.clear();
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-screen bg-[#05050a] block"
        />
    );
};

export default SpaceWarpTunnel;