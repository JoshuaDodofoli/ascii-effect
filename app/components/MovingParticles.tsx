'use client'

import { useEffect, useRef } from "react";
import * as paper from "paper";

const StarfieldParticles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // 1. Initialize an isolated PaperScope for Next.js/Turbopack safety
        const scope = new paper.PaperScope();
        scope.setup(canvasRef.current);
        scope.activate();

        const count = 100;

        // 2. Create the base geometry using the local scope object constructors
        const path = new scope.Path.Circle({
            center: [0, 0],
            radius: 10,
            fillColor: 'white',
            strokeColor: 'black'
        });

        // Wrap the geometry inside a Paper.js SymbolDefinition
        const symbol = new scope.SymbolDefinition(path);

        // Place the instances of the symbol
        for (let i = 0; i < count; i++) {
            // FIX: In pure JS, we use .multiply() instead of the * operator
            const center = scope.Point.random().multiply(scope.view.size);
            
            const placedSymbol = symbol.place(center);
            placedSymbol.scale(i / count);
        }

        // 3. Bind the frame rendering tick directly to the active scope view
        scope.view.onFrame = (event: any) => {
            // Loop through the active layer's children list and shift their positions
            for (let i = 0; i < count; i++) {
                const item = scope.project.activeLayer.children[i];
                
                // Safety boundary check in case children aren't generated yet
                if (!item) continue;

                // Move the item 1/20th of its current width to the right
                item.position.x += item.bounds.width / 20;

                // If the item exits past the right frame boundaries, warp it back to the left
                if (item.bounds.left > scope.view.size.width) {
                    item.position.x = -item.bounds.width;
                }
            }
        };

        // 4. Clean up the instance memory on component unmount
        return () => {
            if (scope.project) {
                scope.project.clear();
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-screen bg-black block"
        />
    );
};

export default StarfieldParticles;